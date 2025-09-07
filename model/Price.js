import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
        {

                product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                },

                // Allow any product type slug instead of limiting to a fixed enum
                // The previous enum (["poster", "sign"]) was too restrictive and
                // caused validation errors when new product families were added.
                // By removing the enum we can support all current and future
                // product types without server errors during product creation.
                productType: { type: String, required: true },
                layout: { type: String, required: true },
                size: { type: String, required: true },
                material: { type: String, required: true },
                qr: { type: Boolean, default: false },
                price: { type: Number, required: true },
        },
        { timestamps: true }
);

export default mongoose.models.Price ||
        mongoose.model("Price", PriceSchema);
