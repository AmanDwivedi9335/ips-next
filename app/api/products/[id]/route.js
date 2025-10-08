import Product from "@/model/Product.js";
import Price from "@/model/Price.js";
import "@/model/Review.js";
import { dbConnect } from "@/lib/dbConnect.js";
import { deriveProductPriceRange, deriveProductPricing } from "@/lib/pricing.js";
import { attachSubcategoryDiscount } from "@/lib/categoryDiscount.js";

export async function GET(req, { params }) {
	await dbConnect();

	// Await params to ensure it's resolved
	const { id } = await params;

	console.log("Product ID:", id);

        try {
                const product = await Product.findById(id)
                        .populate({
                                path: "reviews",
                                select: "rating comment user",
                                strictPopulate: false,
                                populate: { path: "user", select: "firstName lastName" },
                        })
                        .lean();

                if (!product) {
                        return Response.json({ message: "Product not found" }, { status: 404 });
                }

                // Get related products from same category
                const relatedProducts = await Product.find({
                        category: product.category,
                        _id: { $ne: product._id },
                        published: true,
                })
                        .limit(4)
                        .lean();

                const [enrichedProduct, ...enrichedRelatedProducts] =
                        await attachSubcategoryDiscount([product, ...relatedProducts]);

                const productIds = [
                        enrichedProduct?._id?.toString(),
                        ...enrichedRelatedProducts.map((related) => related._id?.toString()),
                ].filter(Boolean);

                let pricingMap = {};

                if (productIds.length > 0) {
                        const pricingDocs = await Price.find({
                                product: { $in: productIds },
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

		// Transform product data to match frontend expectations
                const reviewCount = enrichedProduct.reviews?.length || 0;
                const averageRating =
                        reviewCount > 0
                                ? enrichedProduct.reviews.reduce((sum, r) => sum + r.rating, 0) /
                                  reviewCount
                                : 0;

                // Safeguard against products with no reviews to prevent runtime errors
                // when attempting to map over an undefined value.
                const transformedReviews = (enrichedProduct.reviews || []).map((r) => ({
                        id: r._id.toString(),
                        rating: r.rating,
                        comment: r.comment,
                        user: r.user
                                ? {
                                        id: r.user._id.toString(),
                                        firstName: r.user.firstName,
                                        lastName: r.user.lastName,
                                }
                                : null,
                        createdAt: r.createdAt,
                }));

                const pricing = deriveProductPricing(enrichedProduct);
                const productIdString = enrichedProduct._id?.toString();
                const priceRange = deriveProductPriceRange(
                        enrichedProduct,
                        pricingMap[productIdString] || []
                );

                const transformedProduct = {
                        id: enrichedProduct._id.toString(),
                        // expose both title and name
                        title: enrichedProduct.title,
                        name: enrichedProduct.title,
                        description: enrichedProduct.description,
                        longDescription:
                                enrichedProduct.longDescription || enrichedProduct.description,
                        // provide pricing with applied discounts
                        price: pricing.finalPrice,
                        salePrice: pricing.finalPrice,
                        mrp: pricing.mrp,
                        originalPrice: pricing.mrp,
                        productCode:
                                enrichedProduct.productCode || enrichedProduct.code,
                        code: enrichedProduct.productCode || enrichedProduct.code,
                        discountPercentage: pricing.discountPercentage,
                        discountAmount: pricing.discountAmount,
                        subcategoryDiscount:
                                enrichedProduct.subcategoryDiscount || 0,
                        categoryDiscount: enrichedProduct.categoryDiscount || 0,
                        productFamily: enrichedProduct.productFamily,
                        category: enrichedProduct.category,
                        subcategory: enrichedProduct.subcategory,
                        images: enrichedProduct.images || [],
                        gallery: enrichedProduct.images || [],
                        languageImages: enrichedProduct.languageImages || [],
                        languages: enrichedProduct.languages || [],
                        sizes: enrichedProduct.sizes || [],
                        materials: enrichedProduct.materials || [],
                        layouts: enrichedProduct.layouts || [],
                        materialSpecification: enrichedProduct.materialSpecification || "",
                        image:
                                enrichedProduct.images?.[0] ||
                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
                        type: enrichedProduct.type,
                        published: enrichedProduct.published,
                        features: enrichedProduct.features || [],
                        rating: averageRating,
                        reviewCount,
                        reviews: transformedReviews,
                        createdAt: enrichedProduct.createdAt,
                        updatedAt: enrichedProduct.updatedAt,
                        priceRange,
                        pricingRange: priceRange,
                };

                // Transform related products
                const transformedRelatedProducts = enrichedRelatedProducts.map((p) => {
                        const relatedPricing = deriveProductPricing(p);
                        const relatedId = p._id?.toString();
                        const relatedRange = deriveProductPriceRange(
                                p,
                                pricingMap[relatedId] || []
                        );

                        return {
                                id: p._id.toString(),
                                title: p.title,
                                name: p.title,
                                description: p.description,
                                price: relatedPricing.finalPrice,
                                salePrice: relatedPricing.finalPrice,
                                originalPrice: relatedPricing.mrp,
                                mrp: relatedPricing.mrp,
                                discountPercentage: relatedPricing.discountPercentage,
                                discountAmount: relatedPricing.discountAmount,
                                subcategoryDiscount: p.subcategoryDiscount || 0,
                                categoryDiscount: p.categoryDiscount || 0,
                                image:
                                        p.images?.[0] ||
                                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
                                category: p.category,
                                type: p.type,
                                productCode: p.productCode || p.code,
                                code: p.productCode || p.code,
                                priceRange: relatedRange,
                                pricingRange: relatedRange,
                        };
                });

		return Response.json({
			success: true,
			product: transformedProduct,
			relatedProducts: transformedRelatedProducts,
		});
	} catch (error) {
		console.error("Product fetch error:", error);
		return Response.json(
			{ success: false, message: "Failed to fetch product" },
			{ status: 500 }
		);
	}
}
