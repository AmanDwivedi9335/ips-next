import { dbConnect } from "@/lib/dbConnect";
import Product from "@/model/Product";

export async function PUT(request) {
	await dbConnect();

	try {
		const formData = await request.formData();

		// Get productId from formData
		const productId = formData.get("productId");

		if (!productId) {
			return Response.json(
				{ success: false, message: "Product ID is required" },
				{ status: 400 }
			);
		}

		// Find product
		const product = await Product.findById(productId);

		if (!product) {
			return Response.json(
				{ success: false, message: "Product not found" },
				{ status: 404 }
			);
		}

		// Extract product data from formData
		const title = formData.get("title");
		const description = formData.get("description");
		const longDescription = formData.get("longDescription");
                const category = formData.get("category");
                const productFamily = formData.get("productFamily");
                const discount = formData.get("discount")
                        ? parseFloat(formData.get("discount"))
                        : 0;
                const type = formData.get("type");
                const published = formData.get("published") === "true";

		// Parse features
                let features = [];
                let layouts = [];
                try {
                        const featuresString = formData.get("features");
                        if (featuresString) {
                                features = JSON.parse(featuresString);
                        }
                        const layoutsStr = formData.get("layouts");
                        if (layoutsStr) layouts = JSON.parse(layoutsStr);
                } catch (error) {
                        console.error("Error parsing features/layouts:", error);
                        features = [];
                        layouts = [];
                }

                // Parse images
                let imageUrls = [];
                try {
                        const imagesStr = formData.get("images");
                        if (imagesStr) imageUrls = JSON.parse(imagesStr);
                } catch (error) {
                        console.error("Error parsing images:", error);
                }

		// Update product fields
		product.title = title;
		product.description = description;
		product.longDescription = longDescription || description;
                product.category = category;
                product.productFamily = productFamily;
                product.discount = discount;
                product.type = type;
                product.productType = type;
                product.published = published;
                product.features = features;
                product.layouts = layouts;
                product.images = imageUrls;

		await product.save();

		console.log("Product updated successfully:", product._id);

		return Response.json({
			success: true,
			message: "Product updated successfully",
			product,
		});
	} catch (error) {
		console.error("Update product error:", error);
		return Response.json(
			{ success: false, message: "Failed to update product" },
			{ status: 500 }
		);
	}
}
