import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Price from "@/model/Price.js";



export async function POST(request) {
	await dbConnect();

	try {
		const formData = await request.formData();

		// Extract product data from formData
		const title = formData.get("title");
                const description = formData.get("description");
                const category = formData.get("category");
                const subcategory = formData.get("subcategory");
                const productFamily = formData.get("productFamily");
                const code = formData.get("code");

                console.log("Received data:", {
                        title,
                        description,
                        category,
                        subcategory,
                });

		// Validate required fields
                if (
                        !title ||
                        !description ||
                        !category ||
                        !productFamily
                ) {
                        return Response.json(
                                {
                                        success: false,
                                        message: "Missing required fields",
                                        received: {
                                                title: !!title,
                                                description: !!description,
                                                category: !!category,
                                                productFamily: !!productFamily,
                                        },
                                },
                                { status: 400 }
                        );
                }

		// Parse features safely
                let features = [];
                try {
                        const featuresString = formData.get("features");
                        if (featuresString) {
                                const parsedFeatures = JSON.parse(featuresString);
                                features = Array.isArray(parsedFeatures)
                                        ? parsedFeatures.filter(
                                                  (f) => f.title && f.description
                                          )
                                        : [];
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
                let pricing = [];
                try {
                        const langStr = formData.get("languages");
                        const matStr = formData.get("materials");
                        const sizeStr = formData.get("sizes");
                        const layoutStr = formData.get("layouts");
                        const priceStr = formData.get("pricing");
                        if (langStr) languages = JSON.parse(langStr);
                        if (matStr) materials = JSON.parse(matStr);
                        if (sizeStr) sizes = JSON.parse(sizeStr);
                        if (layoutStr) layouts = JSON.parse(layoutStr);

                        if (priceStr)
                                pricing = JSON.parse(priceStr).map((p) => ({
                                        ...p,
                                        price: p.price ? parseFloat(p.price) : undefined,
                                }));
                } catch (error) {
                        console.error("Error parsing arrays:", error);
                }


               // Parse images and languageImages
               let images = [];
               let languageImages = [];
               try {
                       const imagesStr = formData.get("images");
                       if (imagesStr) images = JSON.parse(imagesStr);
                       const langImgStr = formData.get("languageImages");
                       if (langImgStr) languageImages = JSON.parse(langImgStr);
               } catch (err) {
                       console.error("Error parsing images:", err);
               }

               const imageUrls = images;
               const allLanguages = Array.from(
                       new Set([
                               ...languages,
                               ...languageImages.map((li) => li.language),
                       ])
               );

                 // Create new product
                 const basePrice =
                         pricing.find((p) => typeof p?.price === "number" && !isNaN(p.price))
                                 ?.price || 0;

                const product = new Product({
                        title,
                        description,
                        longDescription: formData.get("longDescription") || description,
                        code,
                        images: imageUrls,
                        languageImages,
                        category,
                        subcategory,
                        productFamily,
                        published: formData.get("published") === "true",
                        price: basePrice,
                        salePrice: basePrice,
                        discount: formData.get("discount")
                                ? parseFloat(formData.get("discount"))
                                : 0,
                        type: formData.get("type") || "featured",
                        productType: formData.get("type") || "featured",
                        features: features,
                        languages: allLanguages,
                        materials,
                        sizes,
                        layouts,
                });

                await product.save();

                console.log("Product saved successfully:", product._id);

                if (pricing.length > 0) {
                        const validPricing = pricing.filter(

                                (p) =>
                                        p.size &&
                                        p.material &&
                                        typeof p.price === "number" &&
                                        !isNaN(p.price)

                        );

                        if (validPricing.length > 0) {
                                const priceDocs = validPricing.map((p) => ({
                                        ...p,
                                        product: product._id,
                                }));
                                await Price.insertMany(priceDocs);
                        }
                }

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
