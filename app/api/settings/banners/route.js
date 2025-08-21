import { dbConnect } from "@/lib/dbConnect.js";
import Settings from "@/model/Settings.js";
import cloudinary from "@/lib/cloudnary.js";

export async function GET() {
        await dbConnect();
        const settings = await Settings.findOne().lean();
        return Response.json({ success: true, banners: settings?.banners || [] });
}

export async function POST(request) {
        await dbConnect();
        try {
                const { image, link } = await request.json();
                let imageUrl = image;
                if (image && image.startsWith("data:")) {
                        const upload = await cloudinary.uploader.upload(image, { folder: "banners" });
                        imageUrl = upload.secure_url;
                }
                const settings = await Settings.findOneAndUpdate(
                        {},
                        { $push: { banners: { image: imageUrl, link } } },
                        { new: true, upsert: true }
                );
                const banner = settings.banners[settings.banners.length - 1];
                return Response.json({ success: true, banner });
        } catch (error) {
                console.error("Banner create error:", error);
                return Response.json(
                        { success: false, message: "Failed to add banner" },
                        { status: 500 }
                );
        }
}

export async function PUT(request) {
        await dbConnect();
        try {
                const { id, image, link } = await request.json();
                const update = {};
                if (image) {
                        let imageUrl = image;
                        if (image.startsWith("data:")) {
                                const upload = await cloudinary.uploader.upload(image, { folder: "banners" });
                                imageUrl = upload.secure_url;
                        }
                        update["banners.$.image"] = imageUrl;
                }
                if (link !== undefined) {
                        update["banners.$.link"] = link;
                }
                await Settings.updateOne({ "banners._id": id }, { $set: update });
                const settings = await Settings.findOne({ "banners._id": id }, { "banners.$": 1 }).lean();
                return Response.json({ success: true, banner: settings?.banners?.[0] });
        } catch (error) {
                console.error("Banner update error:", error);
                return Response.json(
                        { success: false, message: "Failed to update banner" },
                        { status: 500 }
                );
        }
}

export async function DELETE(request) {
        await dbConnect();
        try {
                const { id } = await request.json();
                await Settings.updateOne({}, { $pull: { banners: { _id: id } } });
                return Response.json({ success: true });
        } catch (error) {
                console.error("Banner delete error:", error);
                return Response.json(
                        { success: false, message: "Failed to delete banner" },
                        { status: 500 }
                );
        }
}
