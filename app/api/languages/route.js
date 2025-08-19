import { NextResponse } from "next/server";

const languages = [
        { code: "en", name: "English" },
        { code: "es", name: "Spanish" },
        { code: "fr", name: "French" },
        { code: "de", name: "German" },
];

export async function GET() {
        return NextResponse.json({ languages });
}
