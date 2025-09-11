import cloudinary from "@/lib/cloudnary.js";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const folder = formData.get("folder");

        if (!file) {
            return Response.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadOptions = {};
        if (folder) uploadOptions.folder = folder;

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            stream.end(buffer);
        });

        return Response.json({ success: true, url: result.secure_url });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return Response.json(
            { success: false, message: "Failed to upload image" },
            { status: 500 }
        );
    }
}
