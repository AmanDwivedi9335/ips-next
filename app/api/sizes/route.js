import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Size from "@/model/Size.js";

export async function GET() {
        await dbConnect();
        const sizes = await Size.find().lean();
        return NextResponse.json({ sizes });
}

export async function POST(request) {
        await dbConnect();
        const { name } = await request.json();
        const size = await Size.create({ name });
        return NextResponse.json({ success: true, size });
}

export async function PUT(request) {
        await dbConnect();
        const { id, ...data } = await request.json();
        const size = await Size.findByIdAndUpdate(id, data, { new: true });
        return size
                ? NextResponse.json({ success: true, size })
                : NextResponse.json(
                          { success: false, message: "Size not found" },
                          { status: 404 }
                  );
}

export async function DELETE(request) {
        await dbConnect();
        const { id } = await request.json();
        await Size.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
}
