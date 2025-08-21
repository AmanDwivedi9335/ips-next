import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema(
        {
                name: { type: String, required: true, unique: true, trim: true },
        },
        { timestamps: true }
);

export default mongoose.models.Material ||
        mongoose.model("Material", MaterialSchema);
