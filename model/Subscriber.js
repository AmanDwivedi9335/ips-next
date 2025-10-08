import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
        {
                email: {
                        type: String,
                        required: true,
                        trim: true,
                        lowercase: true,
                        unique: true,
                },
                status: {
                        type: String,
                        enum: ["subscribed", "unsubscribed"],
                        default: "subscribed",
                },
                source: {
                        type: String,
                        trim: true,
                        default: "",
                },
                metadata: {
                        type: Map,
                        of: String,
                        default: {},
                },
        },
        {
                timestamps: true,
        }
);

SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ status: 1, createdAt: -1 });
SubscriberSchema.index({ createdAt: -1 });

export default mongoose.models.Subscriber ||
        mongoose.model("Subscriber", SubscriberSchema);
