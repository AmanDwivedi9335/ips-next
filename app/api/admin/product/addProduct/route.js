import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import cloudinary from "@/lib/cloudnary.js";

export async function POST(request) {
	await dbConnect();

	try {
		const formData = await request.formData();

		// Extract product data from formData
		const title = formData.get("title");
		const description = formData.get("description");
		const price = parseFloat(formData.get("price"));
		const stocks = parseInt(formData.get("stocks"));
		const category = formData.get("category");
                const imageFiles = formData.getAll("images");
                const productType = formData.get("productType") || "poster";

		console.log("Received data:", {
			title,
			description,
			price,
			stocks,
			category,
			imageCount: imageFiles.length,
		});

		// Validate required fields
		if (
			!title ||
			!description ||
			!price ||
			!stocks ||
			!category ||
			!imageFiles.length
		) {
			return Response.json(
				{
					success: false,
					message: "Missing required fields",
					received: {
						title: !!title,
						description: !!description,
						price: !!price,
						stocks: !!stocks,
						category: !!category,
						images: imageFiles.length,
					},
				},
				{ status: 400 }
			);
		}

		// Upload images to Cloudinary
		const uploadPromises = imageFiles.map(async (file) => {
			try {
				// Check if file is a Blob/File object
				if (!(file instanceof Blob)) {
					throw new Error("Invalid file format");
				}

				const buffer = Buffer.from(await file.arrayBuffer());

				return new Promise((resolve, reject) => {
					cloudinary.uploader
						.upload_stream(
							{
								resource_type: "image",
								folder: "safety_products_images",
								quality: "auto",
								format: "webp",
							},
							(error, result) => {
								if (error) {
									console.error("Cloudinary upload error:", error);
									reject(error);
								} else {
									resolve(result.secure_url);
								}
							}
						)
						.end(buffer);
				});
			} catch (error) {
				console.error("File processing error:", error);
				throw error;
			}
		});

		const imageUrls = await Promise.all(uploadPromises);

		console.log("Images uploaded successfully:", imageUrls.length);

		// Parse features safely
                let features = [];
                try {
                        const featuresString = formData.get("features");
                        if (featuresString) {
                                features = JSON.parse(featuresString);
                        }
                } catch (error) {
                        console.error("Error parsing features:", error);
                        features = [];
                }

                // Parse array fields
                let languages = [];
                let materials = [];
                let sizes = [];
                let layouts = [];
                let languageImages = [];
                try {
                        const langStr = formData.get("languages");
                        const matStr = formData.get("materials");
                        const sizeStr = formData.get("sizes");
                        const layoutStr = formData.get("layouts");
                        const langImgStr = formData.get("languageImages");
                        if (langStr) languages = JSON.parse(langStr);
                        if (matStr) materials = JSON.parse(matStr);
                        if (sizeStr) sizes = JSON.parse(sizeStr);
                        if (layoutStr) layouts = JSON.parse(layoutStr);
                        if (langImgStr) languageImages = JSON.parse(langImgStr);
                } catch (error) {
                        console.error("Error parsing arrays:", error);
                }

                // Upload language-specific images
                const languageImageUrls = await Promise.all(
                        languageImages.map(async ({ language, image }) => {
                                if (!image) return null;
                                try {
                                        const base64Data = image.split(",")[1];
                                        const buffer = Buffer.from(base64Data, "base64");

                                        const url = await new Promise((resolve, reject) => {
                                                cloudinary.uploader
                                                        .upload_stream(
                                                                {
                                                                        resource_type: "image",
                                                                        folder: "safety_products_images",
                                                                        quality: "auto",
                                                                        format: "webp",
                                                                },
                                                                (error, result) => {
                                                                        if (error) {
                                                                                reject(error);
                                                                        } else {
                                                                                resolve(result.secure_url);
                                                                        }
                                                                }
                                                        )
                                                        .end(buffer);
                                        });

                                        return { language, image: url };
                                } catch (error) {
                                        console.error("Language image upload error:", error);
                                        return null;
                                }
                        })
                );

                const filteredLanguageImages = languageImageUrls.filter(Boolean);
                const allLanguages = Array.from(
                        new Set([
                                ...languages,
                                ...filteredLanguageImages.map((li) => li.language),
                        ])
                );

                // Create new product
                const product = new Product({
                        title,
                        description,
                        longDescription: formData.get("longDescription") || description,
                        images: imageUrls,
                        languageImages: filteredLanguageImages,
                        category,
                        productType,
                        published: formData.get("published") === "true",
                        stocks: stocks,
                        price: price,
                        salePrice: formData.get("salePrice")
                                ? parseFloat(formData.get("salePrice"))
                                : 0,
                        discount: formData.get("discount")
                                ? parseFloat(formData.get("discount"))
                                : 0,
                        type: formData.get("type") || "featured",
                        features: features,
                        languages: allLanguages,
                        materials,
                        sizes,
                        layouts,
                });

		await product.save();

		console.log("Product saved successfully:", product._id);

		return Response.json({
			success: true,
			message: "Product added successfully",
			product,
		});
	} catch (error) {
		console.error("Add product error:", error);
		return Response.json(
			{
				success: false,
				message: "Failed to add product",
				error: error.message || "Unknown error",
			},
			{ status: 500 }
		);
	}
}
