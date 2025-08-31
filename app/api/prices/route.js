import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Price from "@/model/Price.js";

export async function GET(request) {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const product = searchParams.get("product");

        const productType = searchParams.get("productType");
        const layout = searchParams.get("layout");
        const size = searchParams.get("size");
        const material = searchParams.get("material");
        const qr = searchParams.get("qr");

        const query = {};

        if (product) query.product = product;

        if (productType) query.productType = productType;
        if (layout) query.layout = layout;
        if (size) query.size = size;
        if (material) query.material = material;
        if (qr !== null && qr !== "null") query.qr = qr === "true";

        const prices = await Price.find(query).lean();
        return NextResponse.json({ prices });
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
