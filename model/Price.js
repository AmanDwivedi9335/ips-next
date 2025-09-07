import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema(
        {

                product: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                },


                productType: { type: String, required: false },
                layout: { type: String, required: false },

                size: { type: String, required: true },
                material: { type: String, required: true },
                qr: { type: Boolean, default: false },
                price: { type: Number, required: true },
        },
        { timestamps: true }
);

if (mongoose.models.Price) {
        delete mongoose.models.Price;
}

export default mongoose.model("Price", PriceSchema);
