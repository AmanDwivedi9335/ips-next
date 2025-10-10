import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Price from "@/model/Price.js";
import Category from "@/model/Category.js";
import { deriveProductPriceRange, deriveProductPricing } from "@/lib/pricing.js";
import { attachCategoryDiscount } from "@/lib/categoryDiscount.js";

export async function GET(request) {
	await dbConnect();

	try {
                const discountedCategoryDocs = await Category.find({
                        parent: null,
                        discount: { $gt: 0 },
                })
                        .select("_id slug")
                        .lean();

                const discountedCategorySlugs = discountedCategoryDocs
                        .map((category) => category.slug)
                        .filter(Boolean);

                let discountedSubcategorySlugs = [];

                if (discountedCategoryDocs.length > 0) {
                        const parentIds = discountedCategoryDocs
                                .map((category) => category._id?.toString())
                                .filter(Boolean);

                        if (parentIds.length > 0) {
                                const subcategories = await Category.find({
                                        parent: { $in: parentIds },
                                })
                                        .select("slug")
                                        .lean();

                                discountedSubcategorySlugs = subcategories
                                        .map((subcategory) => subcategory.slug)
                                        .filter(Boolean);
                        }
                }

                const discountedProductConditions = [{ discount: { $gt: 0 } }];

                if (discountedCategorySlugs.length > 0) {
                        discountedProductConditions.push({
                                category: { $in: discountedCategorySlugs },
                        });
                }

                if (discountedSubcategorySlugs.length > 0) {
                        discountedProductConditions.push({
                                subcategory: { $in: discountedSubcategorySlugs },
                        });
                }

                // Get discounted products for showcase section
                const discountedProducts = await Product.find({
                        published: true,
                        parentProduct: null,
                        $or: discountedProductConditions,
                })
                        .limit(6)
                        .lean();

		// Get top selling products
                const topSellingProducts = await Product.find({
                        published: true,
                        parentProduct: null,
                        type: "top-selling",
                })
			.limit(6)
			.lean();

		// Get best selling product (single product)
                const bestSellingProduct = await Product.findOne({
                        published: true,
                        parentProduct: null,
                        type: "best-selling",
                }).lean();

		// Get featured products
                const featuredProducts = await Product.find({
                        published: true,
                        parentProduct: null,
                        type: "featured",
                })
			.limit(3)
			.lean();

		// Get all products for category section (with pagination)
		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category") || "all";
		const search = searchParams.get("search") || "";
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "12");

		// Build query for category section
                const categoryQuery = { published: true, parentProduct: null };

		if (category !== "all" && category !== "All") {
			categoryQuery.category = category;
		}

		if (search) {
			categoryQuery.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
				{ category: { $regex: search, $options: "i" } },
			];
		}

		const skip = (page - 1) * limit;
                const categoryProducts = await Product.find(categoryQuery)
                        .skip(skip)
                        .limit(limit)
                        .lean();

		const totalCategoryProducts = await Product.countDocuments(categoryQuery);

		// Get available categories
                const categories = await Product.distinct("category", {
                        published: true,
                        parentProduct: null,
                });

                const productGroups = [
                        discountedProducts,
                        topSellingProducts,
                        bestSellingProduct ? [bestSellingProduct] : [],
                        featuredProducts,
                        categoryProducts,
                ];

                const groupOffsets = [];
                const combinedProducts = [];

                productGroups.forEach((group) => {
                        groupOffsets.push({ start: combinedProducts.length, length: group.length });
                        combinedProducts.push(...group);
                });

                const enrichedCombinedProducts = await attachCategoryDiscount(combinedProducts);

                const getGroupSlice = (groupIndex) => {
                        const { start, length } = groupOffsets[groupIndex];
                        return enrichedCombinedProducts.slice(start, start + length);
                };

                const enrichedDiscountedProducts = getGroupSlice(0);
                const enrichedTopSellingProducts = getGroupSlice(1);
                const enrichedBestSellingProducts = getGroupSlice(2);
                const enrichedFeaturedProducts = getGroupSlice(3);
                const enrichedCategoryProducts = getGroupSlice(4);

                const enrichedBestSellingProduct =
                        bestSellingProduct && enrichedBestSellingProducts.length > 0
                                ? enrichedBestSellingProducts[0]
                                : null;

                const allProducts = enrichedCombinedProducts;

                const priceQueryIds = Array.from(
                        new Set(
                                allProducts
                                        .map((product) => product?._id?.toString())
                                        .filter(Boolean)
                        )
                );

                let pricingMap = {};

                if (priceQueryIds.length > 0) {
                        const pricingDocs = await Price.find({
                                product: { $in: priceQueryIds },
                        })
                                .lean()
                                .exec();

                        pricingMap = pricingDocs.reduce((acc, price) => {
                                const productId = price.product?.toString();
                                if (!productId) {
                                        return acc;
                                }

                                if (!acc[productId]) {
                                        acc[productId] = [];
                                }

                                acc[productId].push(price);
                                return acc;
                        }, {});
                }

		// Transform function
                const transformProduct = (product) => {
                        const englishImage = product.languageImages?.find(
                                (l) => l.language?.toLowerCase() === "english"
                        )?.image;

                        const pricing = deriveProductPricing(product);
                        const productId = product._id?.toString();
                        const priceRange = deriveProductPriceRange(
                                product,
                                pricingMap[productId] || []
                        );

                        return {
                                id: product._id.toString(),
                                _id: product._id.toString(),
                                title: product.title,
                                description: product.description,
                                longDescription: product.longDescription,
                                price: pricing.finalPrice,
                                originalPrice: pricing.mrp,
                                salePrice: pricing.finalPrice,
                                discount: product.discount,
                                categoryDiscount: product.categoryDiscount || 0,
                                discountPercentage: pricing.discountPercentage,
                                discountAmount: pricing.discountAmount,
                                image:
                                        englishImage ||
                                        product.images?.[0] ||
                                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
                                images: product.images || [],
                                gallery: product.images || [],
                                languageImages: product.languageImages || [],
                                languages: product.languages || [],
                                productCode: product.productCode || product.code,
                                code: product.productCode || product.code,
                                subcategory: product.subcategory,
                                category: product.category,
                                type: product.type,
                                features: product.features || [],
                                colors: ["blue", "black", "red", "orange"],
                                createdAt: product.createdAt,
                                updatedAt: product.updatedAt,
                                priceRange,
                                pricingRange: priceRange,
                        };
                };

		return Response.json({
			success: true,
			data: {
                                discountedProducts: enrichedDiscountedProducts.map(transformProduct),
                                topSellingProducts: enrichedTopSellingProducts.map(transformProduct),
                                bestSellingProduct: enrichedBestSellingProduct
                                        ? transformProduct(enrichedBestSellingProduct)
                                        : null,
                                featuredProducts: enrichedFeaturedProducts.map(transformProduct),
                                categoryProducts: enrichedCategoryProducts.map(transformProduct),
				categories: ["All", ...categories],
				pagination: {
					currentPage: page,
					totalPages: Math.ceil(totalCategoryProducts / limit),
					totalProducts: totalCategoryProducts,
					hasNextPage: page < Math.ceil(totalCategoryProducts / limit),
					hasPrevPage: page > 1,
					limit,
				},
			},
		});
	} catch (error) {
		console.error("Home data fetch error:", error);
		return Response.json(
			{ success: false, message: "Failed to fetch home data" },
			{ status: 500 }
		);
	}
}
