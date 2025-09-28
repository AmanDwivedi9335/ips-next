import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Price from "@/model/Price.js";

const sanitizeCopySuffix = (value) => value?.trim() || "Untitled Product";

const generateCopyTitle = async (baseTitle) => {
        const titleBase = sanitizeCopySuffix(baseTitle);
        let candidate = `${titleBase} (Copy)`;
        let copyIndex = 2;

        while (await Product.exists({ title: candidate })) {
                candidate = `${titleBase} (Copy ${copyIndex})`;
                copyIndex += 1;
        }

        return candidate;
};

const generateCopyCode = async (codeValue) => {
        if (!codeValue) {
                return undefined;
        }

        const baseCode = codeValue.replace(/-copy(?:-\d+)?$/i, "").trim();
        const ensureUnique = async (candidate) =>
                Product.exists({
                        $or: [{ productCode: candidate }, { code: candidate }],
                });

        let candidate = `${baseCode}-copy`;
        let suffix = 2;

        while (await ensureUnique(candidate)) {
                candidate = `${baseCode}-copy-${suffix}`;
                suffix += 1;
        }

        return candidate;
};

export async function POST(request) {
        await dbConnect();

        try {
                const { productId } = await request.json();

                if (!productId) {
                        return Response.json(
                                { success: false, message: "Product ID is required" },
                                { status: 400 }
                        );
                }

                const existingProduct = await Product.findById(productId).lean();

                if (!existingProduct) {
                        return Response.json(
                                { success: false, message: "Product not found" },
                                { status: 404 }
                        );
                }

                const pricingDocs = await Price.find({ product: productId }).lean();

                const { _id, __v, createdAt, updatedAt, productType, ...productData } = existingProduct;

                const clonedTitle = await generateCopyTitle(productData.title);
                const clonedCode = await generateCopyCode(productData.productCode || productData.code);

                const newProduct = await Product.create({
                        ...productData,
                        title: clonedTitle,
                        productCode: clonedCode,
                        code: clonedCode,
                        published: false,
                });

                if (Array.isArray(pricingDocs) && pricingDocs.length > 0) {
                        const pricingPayload = pricingDocs.map((priceDoc) => {
                                const { _id: priceId, createdAt, updatedAt, __v, product, ...rest } = priceDoc;
                                return { ...rest, product: newProduct._id };
                        });

                        if (pricingPayload.length > 0) {
                                await Price.insertMany(pricingPayload);
                        }
                }

                const clonedProduct = await Product.findById(newProduct._id).lean();
                const clonedPricing = await Price.find({ product: newProduct._id })
                        .sort({ createdAt: -1 })
                        .lean();

                return Response.json({
                        success: true,
                        message: "Product cloned successfully",
                        product: {
                                ...clonedProduct,
                                pricing: clonedPricing.map((price) => ({
                                        _id: price._id,
                                        layout: price.layout || "",
                                        material: price.material || "",
                                        size: price.size || "",
                                        qr: !!price.qr,
                                        price: price.price,
                                })),
                        },
                });
        } catch (error) {
                console.error("Clone product error:", error);
                return Response.json(
                        { success: false, message: "Failed to clone product" },
                        { status: 500 }
                );
        }
}
