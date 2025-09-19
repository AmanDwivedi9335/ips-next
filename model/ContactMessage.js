import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
        {
                fullName: {
                        type: String,
                        required: true,
                        trim: true,
                },
                email: {
                        type: String,
                        required: true,
                        trim: true,
                        lowercase: true,
                },
                phone: {
                        type: String,
                        trim: true,
                },
                subject: {
                        type: String,
                        required: true,
                        trim: true,
                },
                message: {
                        type: String,
                        required: true,
                        trim: true,
                },
                status: {
                        type: String,
                        enum: ["new", "in_progress", "resolved"],
                        default: "new",
                },
                emailStatus: {
                        type: String,
                        enum: ["pending", "sent", "failed"],
                        default: "pending",
                },
                adminNotes: {
                        type: String,
                        trim: true,
                        default: "",
                },
                resolvedAt: {
                        type: Date,
                        default: null,
                },
                source: {
                        type: String,
                        default: "contact-form",
                },
        },
        {
                timestamps: true,
        }
);

ContactMessageSchema.index({ email: 1, createdAt: -1 });
ContactMessageSchema.index({ status: 1, createdAt: -1 });
ContactMessageSchema.index({ emailStatus: 1 });

export default mongoose.models.ContactMessage ||
        mongoose.model("ContactMessage", ContactMessageSchema);
