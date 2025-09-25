import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import { deriveProductPricing } from "@/lib/pricing.js";

export async function POST(request, { params }) {
        const { productId } = await params;

        if (!productId) {
                return Response.json(
                        { success: false, message: "Product identifier is required" },
                        { status: 400 }
                );
        }

        await dbConnect();

        try {
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

                const pricing = deriveProductPricing(product);

                // Create order data for buy now
                const orderData = {
                        productId: product._id.toString(),
                        productName: product.title,
                        quantity: quantity,
                        unitPrice: pricing.finalPrice,
                        mrp: pricing.mrp,
                        discountPercentage: pricing.discountPercentage,
                        discountAmount: pricing.discountAmount,
                        totalPrice: pricing.finalPrice * quantity,
                        productImage:
                                product.images?.[0] ||
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
