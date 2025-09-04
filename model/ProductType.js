import mongoose from "mongoose";

const ProductTypeSchema = new mongoose.Schema(
        {
                name: {
                        type: String,
                        required: true,
                        trim: true,
                        unique: true,
                },
                description: {
                        type: String,
                        default: "",
                        trim: true,
                },
                slug: {
                        type: String,
                        unique: true,
                        lowercase: true,
                },
        },
        { timestamps: true }
);

// Generate slug from name before saving
ProductTypeSchema.pre("save", function (next) {
        if (this.isModified("name")) {
                this.slug = this.name
                        .toLowerCase()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "");
        }
        next();
});

export default mongoose.models.ProductType ||
        mongoose.model("ProductType", ProductTypeSchema);
