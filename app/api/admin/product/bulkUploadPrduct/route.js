// api/admin/product/bulkUploadPrduct/route.js

import { dbConnect } from "@/lib/dbConnect";
import Product from "@/model/Product";
import { uploadMultipleImagesToCloudinary } from "@/lib/cloudnary.js";

export async function POST(request) {
	await dbConnect();

	try {
		const { products } = await request.json();

		if (!Array.isArray(products) || products.length === 0) {
			return Response.json(
				{ success: false, message: "Invalid products data" },
				{ status: 400 }
			);
		}

		const results = {
			success: [],
			failed: [],
		};

		for (const productData of products) {
			try {
				// Validate required fields
                                const { title, description, price, category } = productData;

                                if (!title || !description || !price || !category) {
					results.failed.push({
						data: productData,
						error: "Missing required fields",
					});
					continue;
				}

                                let imageUrls = [];

                                // Handle image uploads if provided
                                if (productData.images && productData.images.length > 0) {
                                        try {
                                                const base64Images = [];
                                                const urlImages = [];

                                                productData.images.forEach((img) => {
                                                        if (
                                                                typeof img === "string" &&
                                                                img.startsWith("data:")
                                                        ) {
                                                                base64Images.push(img);
                                                        } else if (
                                                                typeof img === "string" &&
                                                                img.startsWith("http")
                                                        ) {
                                                                urlImages.push(img);
                                                        } else if (img?.base64) {
                                                                base64Images.push(img.base64);
                                                        }
                                                });

                                                if (base64Images.length > 0) {
                                                        const uploaded =
                                                                await uploadMultipleImagesToCloudinary(
                                                                        base64Images,
                                                                        "products"
                                                                );
                                                        imageUrls = [...urlImages, ...uploaded];
                                                } else {
                                                        imageUrls = urlImages;
                                                }
                                        } catch (error) {
                                                console.error(
                                                        "Image upload error for product:",
                                                        title,
                                                        error
                                                );
                                                // Continue without images rather than failing the entire product
                                        }
                                }

				// Create new product
				const product = new Product({
					title,
					description,
					longDescription: productData.longDescription || description,
					images: imageUrls,
					category,
					published:
						productData.published !== undefined ? productData.published : true,
					price: Number.parseFloat(price),
                                        salePrice: productData.salePrice
                                                ? Number.parseFloat(productData.salePrice)
                                                : 0,
                                        discount: 0,
                                        type: productData.type || "featured",
                                        productType: productData.type || "featured",
                                        features: productData.features || [],
                                });

				await product.save();
				results.success.push(product);
			} catch (error) {
				results.failed.push({
					data: productData,
					error: error.message,
				});
			}
		}

		return Response.json({
			success: true,
			message: `Bulk upload completed. ${results.success.length} products added, ${results.failed.length} failed.`,
			results,
		});
	} catch (error) {
		console.error("Bulk upload error:", error);
		return Response.json(
			{ success: false, message: "Failed to bulk upload products" },
			{ status: 500 }
		);
	}
}
