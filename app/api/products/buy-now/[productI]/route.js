import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import { deriveProductPricing } from "@/lib/pricing.js";
import { attachSubcategoryDiscount } from "@/lib/categoryDiscount.js";

export async function POST(request, { params }) {
	await dbConnect();

	try {
		const { productId } = params;
		const { quantity = 1 } = await request.json();

                // Validate product exists and is available
                const product = await Product.findById(productId);

                if (!product) {
                        return Response.json(
                                { success: false, message: "Product not found" },
                                { status: 404 }
                        );
                }

                if (!product.published) {
                        return Response.json(
                                { success: false, message: "Product is not available" },
                                { status: 400 }
                        );
                }

                const enrichedProduct = await attachSubcategoryDiscount(product);
                const pricing = deriveProductPricing(enrichedProduct);

                // Create order data for buy now
                const orderData = {
                        productId: product._id.toString(),
                        productName: enrichedProduct.title,
                        quantity: quantity,
                        unitPrice: pricing.finalPrice,
                        mrp: pricing.mrp,
                        discountPercentage: pricing.discountPercentage,
                        discountAmount: pricing.discountAmount,
                        subcategoryDiscount:
                                enrichedProduct.subcategoryDiscount || 0,
                        categoryDiscount: enrichedProduct.categoryDiscount || 0,
                        totalPrice: pricing.finalPrice * quantity,
                        productImage:
                                enrichedProduct.images?.[0] ||
                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
		};

		return Response.json({
			success: true,
			message: "Proceeding to checkout",
			order: orderData,
			redirectUrl: `/checkout?product=${productId}&quantity=${quantity}`,
		});
	} catch (error) {
		console.error("Buy now error:", error);
		return Response.json(
			{ success: false, message: "Failed to process buy now request" },
			{ status: 500 }
		);
	}
}
