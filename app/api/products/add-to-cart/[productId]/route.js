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

                // For now, we'll return success with product details
                // In a real app, you'd add this to user's cart in database
                const pricing = deriveProductPricing(product);

                const productData = {
                        id: product._id.toString(),
                        name: product.title,
                        description: product.description,
                        price: pricing.finalPrice,
                        originalPrice: pricing.mrp,
                        mrp: pricing.mrp,
                        discountPercentage: pricing.discountPercentage,
                        discountAmount: pricing.discountAmount,
                        image:
                                product.images?.[0] ||
                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
                        quantity: quantity,
                };

                return Response.json({
                        success: true,
                        message: "Product added to cart successfully",
                        product: productData,
                });
	} catch (error) {
		console.error("Add to cart error:", error);
		return Response.json(
			{ success: false, message: "Failed to add product to cart" },
			{ status: 500 }
		);
	}
}
