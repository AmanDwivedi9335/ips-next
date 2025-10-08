import Product from "@/model/Product.js";
import Price from "@/model/Price.js";
import { dbConnect } from "@/lib/dbConnect.js";
import { deriveProductPriceRange, deriveProductPricing } from "@/lib/pricing.js";
import { attachCategoryDiscount } from "@/lib/categoryDiscount.js";

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

                const [enrichedProduct, ...enrichedRelatedProducts] =
                        await attachCategoryDiscount([product, ...relatedProducts]);

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
