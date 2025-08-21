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
