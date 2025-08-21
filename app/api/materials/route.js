import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Material from "@/model/Material.js";

export async function GET() {
        await dbConnect();
        const materials = await Material.find().lean();
        return NextResponse.json({ materials });
}

export async function POST(request) {
        await dbConnect();
        const { name } = await request.json();
        const material = await Material.create({ name });
        return NextResponse.json({ success: true, material });
}

export async function PUT(request) {
        await dbConnect();
        const { id, ...data } = await request.json();
        const material = await Material.findByIdAndUpdate(id, data, { new: true });
        return material
                ? NextResponse.json({ success: true, material })
                : NextResponse.json(
                          { success: false, message: "Material not found" },
                          { status: 404 }
                  );
}

export async function DELETE(request) {
        await dbConnect();
        const { id } = await request.json();
        await Material.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
}
