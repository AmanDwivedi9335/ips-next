import Product from "@/model/Product.js";
import Price from "@/model/Price.js";
import { dbConnect } from "@/lib/dbConnect.js";
import { deriveProductPriceRange, deriveProductPricing } from "@/lib/pricing.js";

export async function GET(req, { params }) {
	await dbConnect();

	// Await params to ensure it's resolved
	const { id } = await params;

	console.log("Product ID:", id);

        try {
                const product = await Product.findById(id).lean();

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

                const productIds = [
                        product._id?.toString(),
                        ...relatedProducts.map((related) => related._id?.toString()),
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
                const pricing = deriveProductPricing(product);
                const productIdString = product._id?.toString();
                const priceRange = deriveProductPriceRange(
                        product,
                        pricingMap[productIdString] || []
                );

                const transformedProduct = {
                        id: product._id.toString(),
                        // expose both title and name
                        title: product.title,
                        name: product.title,
                        description: product.description,
                        longDescription: product.longDescription || product.description,
                        // provide pricing with applied discounts
                        price: pricing.finalPrice,
                        salePrice: pricing.finalPrice,
                        mrp: pricing.mrp,
                        originalPrice: pricing.mrp,
                        productCode: product.productCode || product.code,
                        code: product.productCode || product.code,
                        discountPercentage: pricing.discountPercentage,
                        discountAmount: pricing.discountAmount,
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
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                        priceRange,
                        pricingRange: priceRange,
                };

                // Transform related products
                const transformedRelatedProducts = relatedProducts.map((p) => {
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
