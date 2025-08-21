import mongoose from "mongoose";

const SizeSchema = new mongoose.Schema(
        {
                name: { type: String, required: true, unique: true, trim: true },
        },
        { timestamps: true }
);

export default mongoose.models.Size ||
        mongoose.model("Size", SizeSchema);
