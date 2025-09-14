// app/api/products/route.js

import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";

export async function GET(request) {
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);

		// Extract query parameters
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		const discount = searchParams.get("discount");
		const category = searchParams.get("category");
		const search = searchParams.get("search");
                const type = searchParams.get("type");
                // Support both `subcategories` and legacy `subcategory` params
                const subcategoriesParam =
                        searchParams.get("subcategories") ||
                        searchParams.get("subcategory");
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "12");
		const sort = searchParams.get("sort") || "createdAt";
		const order = searchParams.get("order") || "desc";

		// Build query
		const query = { published: true };

                // Category filter
                if (category && category !== "all") {
                        query.category = category;
                }

                // Subcategory filter
                if (subcategoriesParam) {
                        const subcategoryList = subcategoriesParam
                                .split(",")
                                .map((s) => decodeURIComponent(s).trim())
                                .filter(Boolean);
                        if (subcategoryList.length > 0) {
                                query.subcategory = { $in: subcategoryList };
                        }
                }

		// Search filter
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
				{ longDescription: { $regex: search, $options: "i" } },
			];
		}

                // Price range filter
                if (minPrice || maxPrice) {
                        query.$and = query.$and || [];
                        const priceQuery = {};
                        const salePriceQuery = {};

                        if (minPrice) {

                                const min = Number(minPrice);
                                if (!Number.isNaN(min)) {
                                        priceQuery.$gte = min;
                                        salePriceQuery.$gte = min;
                                }
                        }
                        if (maxPrice) {
                                const max = Number(maxPrice);
                                if (!Number.isNaN(max)) {
                                        priceQuery.$lte = max;
                                        salePriceQuery.$lte = max;
                                }

                        }

                        // Only enforce salePrice to be positive when no minimum is provided
                        if (!minPrice) {
                                salePriceQuery.$gt = 0;
                        }


                        const orConditions = [];
                        if (Object.keys(priceQuery).length > 0) {
                                orConditions.push({ price: priceQuery });
                        }
                        if (Object.keys(salePriceQuery).length > 0) {
                                orConditions.push({ salePrice: salePriceQuery });
                        }

                        if (orConditions.length > 0) {
                                query.$and.push({ $or: orConditions });
                        }

                }


		// Discount filter
		if (discount) {
			const discountValue = Number.parseInt(discount);
			query.$or = [
				{ discount: { $gte: discountValue } },
				{
					$expr: {
						$gte: [
							{
								$multiply: [
									{
										$divide: [
											{ $subtract: ["$price", "$salePrice"] },
											"$price",
										],
									},
									100,
								],
							},
							discountValue,
						],
					},
				},
			];
		}

		// Type filter
		if (type) {
			query.type = type;
		}

		// Build sort object
		const sortObj = {};
		sortObj[sort] = order === "desc" ? -1 : 1;

		// Execute query with pagination
		const skip = (page - 1) * limit;
                const products = await Product.find(query)
                        .sort(sortObj)
                        .skip(skip)
                        .limit(limit)
                        .populate({
                                path: "reviews",
                                select: "rating",
                                strictPopulate: false,
                        })
                        .lean();

		const total = await Product.countDocuments(query);
		const totalPages = Math.ceil(total / limit);

		// Transform products for frontend
                const transformedProducts = products.map((product) => {
                        const reviewCount = product.reviews?.length || 0;
                        const averageRating =
                                reviewCount > 0
                                        ? product.reviews.reduce(
                                                  (sum, r) => sum + r.rating,
                                                  0
                                          ) / reviewCount
                                        : 0;

                        const discountPercentage =
                                product.salePrice > 0
                                        ? Math.round(
                                                  ((product.price - product.salePrice) /
                                                          product.price) *
                                                          100
                                          )
                                        : product.discount;

                        return {
                                id: product._id.toString(),
                                // Provide both title and name for backward compatibility
                                title: product.title,
                                name: product.title,
                                description: product.description,
                                longDescription: product.longDescription,
                                // Keep original price separate from sale price
                                price: product.price,
                                salePrice: product.salePrice,
                                mrp: product.mrp || product.price,
                                productCode: product.productCode || product.code,
                                code: product.productCode || product.code,
                                discount: product.discount,
                                subcategory: product.subcategory,
                                languageImages: product.languageImages || [],
                                languages: product.languages || [],
                                sizes: product.sizes || [],
                                materials: product.materials || [],
                                materialSpecification: product.materialSpecification || "",
                                discountPercentage,
                                image:
                                        product.images?.[0] ||
                                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
                                images: product.images || [],
                                category: product.category,
                                type: product.type,
                                features: product.features || [],
                                rating: averageRating,
                                reviewCount,
                                createdAt: product.createdAt,
                                updatedAt: product.updatedAt,
                        };
                });

		return Response.json({
			success: true,
			products: transformedProducts,
			pagination: {
				currentPage: page,
				totalPages,
				totalProducts: total,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
				limit,
			},
		});
	} catch (error) {
		console.error("Products fetch error:", error);
		return Response.json(
			{ success: false, message: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
