import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
        {

                product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                },

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
