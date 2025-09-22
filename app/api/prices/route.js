import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Price from "@/model/Price.js";

export async function GET(request) {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const product = searchParams.get("product");

        const layout = searchParams.get("layout");
        const size = searchParams.get("size");
        const material = searchParams.get("material");
        const qr = searchParams.get("qr");

        const query = {};

        if (product) query.product = product;

        if (layout) query.layout = layout;
        if (size) query.size = size;
        if (material) query.material = material;
        if (qr !== null && qr !== "null") query.qr = qr === "true";

        let discountPercentage = 0;
        let shouldApplyDiscount = false;

        if (product) {
                const productDoc = await Product.findById(product)
                        .select("discount type")
                        .lean();

                if (productDoc?.type === "discounted") {
                        const parsedDiscount = Number.isFinite(productDoc.discount)
                                ? productDoc.discount
                                : Number.parseFloat(productDoc.discount);
                        const normalizedDiscount = Number.isFinite(parsedDiscount)
                                ? Math.min(Math.max(parsedDiscount, 0), 100)
                                : 0;

                        if (normalizedDiscount > 0) {
                                discountPercentage = normalizedDiscount;
                                shouldApplyDiscount = true;
                        }
                }
        }

        const applyDiscount = (value) => {
                if (!shouldApplyDiscount) {
                        return value;
                }

                if (typeof value !== "number" || Number.isNaN(value)) {
                        return value;
                }

                const discountedValue = value - (value * discountPercentage) / 100;
                const roundedValue = Number.parseFloat(discountedValue.toFixed(2));

                return Number.isFinite(roundedValue) && roundedValue > 0 ? roundedValue : 0;
        };

        const prices = await Price.find(query)
                .populate("product", "title")
                .lean();

        const processedPrices = prices.map((price) => {
                const originalPrice = price.price;
                const discountedPrice = applyDiscount(originalPrice);

                return {
                        ...price,
                        price: discountedPrice,
                        mrp: originalPrice,
                };
        });

        return NextResponse.json({ prices: processedPrices });
}

export async function POST(request) {
        await dbConnect();
        const data = await request.json();
        const price = await Price.create(data);
        return NextResponse.json({ success: true, price });
}

export async function PUT(request) {
        await dbConnect();
        const { id, ...data } = await request.json();
        const price = await Price.findByIdAndUpdate(id, data, { new: true });
        return price
                ? NextResponse.json({ success: true, price })
                : NextResponse.json(
                          { success: false, message: "Price not found" },
                          { status: 404 }
                  );
}

export async function DELETE(request) {
        await dbConnect();
        const { id } = await request.json();
        await Price.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
}
