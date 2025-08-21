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
