import { dbConnect } from "@/lib/dbConnect";
import Product from "@/model/Product";
import Price from "@/model/Price.js";
import mongoose from "mongoose";

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
                const parentProductInput = formData.get("parentProduct");
                const productCode = formData.get("productCode");
                const specialNoteInput = formData.get("specialNote");
                const isB2B = formData.get("isB2B") === "true";
                const youtubeVideoUrl = formData.get("youtubeVideoUrl") || "";
                const specialNote =
                        typeof specialNoteInput === "string"
                                ? specialNoteInput.trim()
                                : "";
                const rawDiscount = formData.get("discount");
                const parsedDiscount = rawDiscount ? Number.parseFloat(rawDiscount) : 0;
                const discount = Number.isFinite(parsedDiscount)
                        ? Math.min(Math.max(parsedDiscount, 0), 100)
                        : 0;
                const type = formData.get("type") || "featured";
                const published = formData.get("published") === "true";

                let parentProduct = null;

                if (typeof parentProductInput === "string" && parentProductInput.trim() !== "") {
                        const trimmedParent = parentProductInput.trim();

                        if (!mongoose.Types.ObjectId.isValid(trimmedParent)) {
                                return Response.json(
                                        {
                                                success: false,
                                                message: "Invalid parent product selected",
                                        },
                                        { status: 400 }
                                );
                        }

                        if (trimmedParent === productId) {
                                return Response.json(
                                        {
                                                success: false,
                                                message: "Product cannot be its own parent",
                                        },
                                        { status: 400 }
                                );
                        }

                        parentProduct = trimmedParent;
                }

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
                product.productCode = productCode || "";
                // Maintain legacy `code` field alongside `productCode`
                product.code = productCode || "";
                product.category = category;
                product.subcategory = subcategory || "";
                product.productFamily = productFamily;
                product.parentProduct = parentProduct;
                product.specialNote = specialNote;
                product.isB2B = isB2B;
                product.youtubeVideoUrl = youtubeVideoUrl;
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

                const shouldApplyDiscount = type === "discounted" && discount > 0;

                const applyDiscount = (value) => {
                        if (!shouldApplyDiscount) {
                                return value;
                        }

                        if (typeof value !== "number" || Number.isNaN(value)) {
                                return value;
                        }

                        const discountedValue = value - (value * discount) / 100;
                        const roundedValue = Number.parseFloat(discountedValue.toFixed(2));

                        return Number.isFinite(roundedValue) && roundedValue > 0
                                ? roundedValue
                                : 0;
                };

                const basePrice =
                        pricing.find(
                                (p) => typeof p?.price === "number" && !Number.isNaN(p.price)
                        )?.price || 0;
                const discountedBasePrice = applyDiscount(basePrice);
                product.price = basePrice;
                product.mrp = basePrice;
                product.salePrice = discountedBasePrice;

                await product.save();

                // Update pricing documents
                await Price.deleteMany({ product: product._id });
                if (pricing.length > 0) {
                        const validPricing = pricing.filter(
                                (p) =>
                                        p.size &&
                                        p.material &&
                                        typeof p.price === "number" &&
                                        !Number.isNaN(p.price)
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
