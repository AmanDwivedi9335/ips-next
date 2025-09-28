import mongoose from "mongoose";

const LayoutSchema = new mongoose.Schema(
        {
                name: { type: String, required: true, unique: true, trim: true },
                aspectRatio: { type: String, required: true, trim: true },
                sizes: [{ type: String, trim: true }],
        },
        { timestamps: true }
);

export default mongoose.models.Layout ||
        mongoose.model("Layout", LayoutSchema);
