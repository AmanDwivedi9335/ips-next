import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Language from "@/model/Language.js";

export async function GET() {
        await dbConnect();
        const languages = await Language.find().lean();
        return NextResponse.json({ languages });
}

export async function POST(request) {
        await dbConnect();
        const { code, name } = await request.json();
        const language = await Language.create({ code, name });
        return NextResponse.json({ success: true, language });
}
