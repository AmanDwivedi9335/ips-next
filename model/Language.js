import mongoose from "mongoose";

const LanguageSchema = new mongoose.Schema(
        {
                code: { type: String, required: true, unique: true, trim: true },
                name: { type: String, required: true, trim: true },
        },
        { timestamps: true }
);

export default mongoose.models.Language ||
        mongoose.model("Language", LanguageSchema);
