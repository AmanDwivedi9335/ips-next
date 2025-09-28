import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Layout from "@/model/Layout.js";

export async function GET() {
        await dbConnect();
        const layouts = await Layout.find().lean();
        return NextResponse.json({ layouts });
}

export async function POST(request) {
        await dbConnect();
        const { name, aspectRatio, sizes } = await request.json();
        const sanitizedSizes = Array.isArray(sizes)
                ? sizes.map((size) => String(size).trim()).filter(Boolean)
                : [];
        const layout = await Layout.create({
                name,
                aspectRatio,
                sizes: sanitizedSizes,
        });
        return NextResponse.json({ success: true, layout });
}

export async function PUT(request) {
        await dbConnect();
        const { id, ...data } = await request.json();
        if (Object.prototype.hasOwnProperty.call(data, "sizes")) {
                data.sizes = Array.isArray(data.sizes)
                        ? data.sizes.map((size) => String(size).trim()).filter(Boolean)
                        : [];
        }
        const layout = await Layout.findByIdAndUpdate(id, data, { new: true });
        return layout
                ? NextResponse.json({ success: true, layout })
                : NextResponse.json(
                          { success: false, message: "Layout not found" },
                          { status: 404 }
                  );
}

export async function DELETE(request) {
        await dbConnect();
        const { id } = await request.json();
        await Layout.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
}
