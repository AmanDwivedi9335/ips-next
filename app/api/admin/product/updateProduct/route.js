import { dbConnect } from "@/lib/dbConnect";
import Product from "@/model/Product";
import Price from "@/model/Price.js";

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
                const subcategory = formData.get("subcategory");
                const productFamily = formData.get("productFamily");
                const code = formData.get("code");
                const discount = formData.get("discount")
                        ? parseFloat(formData.get("discount"))
                        : 0;
                const type = formData.get("type");
                const published = formData.get("published") === "true";

                // Parse array fields
                let features = [];
                let layouts = [];
                let languages = [];
                let materials = [];
                let sizes = [];
                let pricing = [];
                let languageImages = [];
                let imageUrls = [];
                try {
                        const featuresString = formData.get("features");
                        if (featuresString) features = JSON.parse(featuresString);
                        const layoutsStr = formData.get("layouts");
                        if (layoutsStr) layouts = JSON.parse(layoutsStr);
                        const langStr = formData.get("languages");
                        if (langStr) languages = JSON.parse(langStr);
                        const matStr = formData.get("materials");
                        if (matStr) materials = JSON.parse(matStr);
                        const sizeStr = formData.get("sizes");
                        if (sizeStr) sizes = JSON.parse(sizeStr);
                        const priceStr = formData.get("pricing");
                        if (priceStr) pricing = JSON.parse(priceStr).map((p) => ({
                                ...p,
                                price: p.price ? parseFloat(p.price) : undefined,
                        }));
                        const imagesStr = formData.get("images");
                        if (imagesStr) imageUrls = JSON.parse(imagesStr);
                        const langImgStr = formData.get("languageImages");
                        if (langImgStr) languageImages = JSON.parse(langImgStr);
                } catch (error) {
                        console.error("Error parsing form data:", error);
                }

                // Update product fields
                product.title = title;
                product.description = description;
                product.longDescription = longDescription || description;
                product.code = code || "";
                product.category = category;
                product.subcategory = subcategory || "";
                product.productFamily = productFamily;
                product.discount = discount;
                product.type = type;
                product.productType = type;
                product.published = published;
                product.features = features;
                product.layouts = layouts;
                product.languages = languages;
                product.materials = materials;
                product.sizes = sizes;
                product.images = imageUrls;
                product.languageImages = languageImages;

                const basePrice =
                        pricing.find(
                                (p) => typeof p?.price === "number" && !isNaN(p.price)
                        )?.price || 0;
                product.price = basePrice;
                product.salePrice = basePrice;

                await product.save();

                // Update pricing documents
                await Price.deleteMany({ product: product._id });
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
