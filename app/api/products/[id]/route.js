import Product from "@/model/Product.js";
import { dbConnect } from "@/lib/dbConnect.js";

export async function GET(req, { params }) {
	await dbConnect();

	// Await params to ensure it's resolved
	const { id } = await params;

	console.log("Product ID:", id);

        try {
                const product = await Product.findById(id).populate({
                        path: "reviews",
                        populate: { path: "user", select: "firstName lastName" },
                });

		if (!product) {
			return Response.json({ message: "Product not found" }, { status: 404 });
		}

		// Get related products from same category
		const relatedProducts = await Product.find({
			category: product.category,
			_id: { $ne: product._id },
			published: true,
		}).limit(4);

		// Transform product data to match frontend expectations
                const reviewCount = product.reviews?.length || 0;
                const averageRating =
                        reviewCount > 0
                                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                                  reviewCount
                                : 0;

                const transformedReviews = product.reviews.map((r) => ({
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

                const discountPercentage =
                        product.salePrice > 0
                                ? Math.round(
                                          ((product.price - product.salePrice) / product.price) *
                                                  100
                                  )
                                : product.discount || 0;

                const transformedProduct = {
                        id: product._id.toString(),
                        // expose both title and name
                        title: product.title,
                        name: product.title,
                        description: product.description,
                        longDescription: product.longDescription || product.description,
                        // provide original price and sale price separately
                        price: product.price,
                        salePrice: product.salePrice,
                        mrp: product.mrp || product.price,
                        code: product.code,
                        discountPercentage,
                        category: product.category,
                        subcategory: product.subcategory,
                        images: product.images || [],
                        gallery: product.images || [],
                        languageImages: product.languageImages || [],
                        languages: product.languages || [],
                        sizes: product.sizes || [],
                        materials: product.materials || [],
                        layouts: product.layouts || [],
                        materialSpecification: product.materialSpecification || "",
                        image:
                                product.images?.[0] ||
                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
                        type: product.type,
                        published: product.published,
                        features: product.features || [],
                        rating: averageRating,
                        reviewCount,
                        reviews: transformedReviews,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                };

		// Transform related products
                const transformedRelatedProducts = relatedProducts.map((p) => {
                        const relatedDiscount =
                                p.salePrice > 0
                                        ? Math.round(((p.price - p.salePrice) / p.price) * 100)
                                        : p.discount || 0;

                        return {
                                id: p._id.toString(),
                                title: p.title,
                                name: p.title,
                                description: p.description,
                                price: p.price,
                                salePrice: p.salePrice,
                                originalPrice: p.price,
                                discountPercentage: relatedDiscount,
                                image:
                                        p.images?.[0] ||
                                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
                                category: p.category,
                                type: p.type,
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
