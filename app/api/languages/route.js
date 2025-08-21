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

export async function PUT(request) {
        await dbConnect();
        const { id, ...data } = await request.json();
        const language = await Language.findByIdAndUpdate(id, data, { new: true });
        return language
                ? NextResponse.json({ success: true, language })
                : NextResponse.json(
                          { success: false, message: "Language not found" },
                          { status: 404 }
                  );
}

export async function DELETE(request) {
        await dbConnect();
        const { id } = await request.json();
        await Language.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
}

