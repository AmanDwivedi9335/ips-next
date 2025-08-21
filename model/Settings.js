import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
        image: { type: String, required: true },
        link: { type: String, default: "" },
});

const SettingsSchema = new mongoose.Schema(
        {
                banners: [BannerSchema],
        },
        { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
