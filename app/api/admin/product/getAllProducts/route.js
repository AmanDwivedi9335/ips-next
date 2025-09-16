import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Price from "@/model/Price.js";

export async function GET(request) {
	await dbConnect();

	try {
		const { searchParams } = new URL(request.url);

		// Extract query parameters
		const search = searchParams.get("search");
		const category = searchParams.get("category");
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		const discount = searchParams.get("discount");
		const published = searchParams.get("published");
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "10");
		const sort = searchParams.get("sort") || "createdAt";
		const order = searchParams.get("order") || "desc";

		// Build query
		const query = {};

		// Search filter
		if (search) {
			query.$or = [
				{ title: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
				{ longDescription: { $regex: search, $options: "i" } },
			];
		}

		// Category filter
		if (category && category !== "all") {
			query.category = category;
		}

		// Price range filter
		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number.parseInt(minPrice);
			if (maxPrice) query.price.$lte = Number.parseInt(maxPrice);
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

		// Published filter
		if (published !== null && published !== undefined) {
			query.published = published === "true";
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
                        .lean();

                const productIds = products.map((product) => product._id);

                let pricingMap = {};

                if (productIds.length > 0) {
                        const pricingDocs = await Price.find({
                                product: { $in: productIds },
                        })
                                .sort({ createdAt: -1 })
                                .lean();

                        pricingMap = pricingDocs.reduce((acc, price) => {
                                const productId = price.product.toString();
                                if (!acc[productId]) {
                                        acc[productId] = [];
                                }

                                acc[productId].push({
                                        _id: price._id,
                                        layout: price.layout || "",
                                        material: price.material || "",
                                        size: price.size || "",
                                        qr: !!price.qr,
                                        price: price.price,
                                });

                                return acc;
                        }, {});
                }

                const productsWithPricing = products.map((product) => ({
                        ...product,
                        pricing: pricingMap[product._id.toString()] || [],
                }));

		const total = await Product.countDocuments(query);
		const totalPages = Math.ceil(total / limit);

		// Get category counts for filters
		const categoryStats = await Product.aggregate([
			{ $group: { _id: "$category", count: { $sum: 1 } } },
		]);

		// Get price range
		const priceStats = await Product.aggregate([
			{
				$group: {
					_id: null,
					minPrice: { $min: "$price" },
					maxPrice: { $max: "$price" },
				},
			},
		]);

		return Response.json({
			success: true,
                        products: productsWithPricing,
			pagination: {
				currentPage: page,
				totalPages,
				totalProducts: total,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
				limit,
			},
			filters: {
				categories: categoryStats,
				priceRange: priceStats[0] || { minPrice: 0, maxPrice: 10000 },
			},
		});
	} catch (error) {
		console.error("Admin products fetch error:", error);
		return Response.json(
			{ success: false, message: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
