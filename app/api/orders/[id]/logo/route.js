import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/dbConnect.js";
import cloudinary from "@/lib/cloudnary.js";
import { verifyToken } from "@/lib/auth.js";
import Order from "@/model/Order.js";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request, { params }) {
        try {
                await dbConnect();

                const { id } = params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, message: "Order id is required" },
                                { status: 400 }
                        );
                }

                const cookieStore = cookies();
                const token = cookieStore.get("auth_token")?.value;

                if (!token) {
                        return NextResponse.json(
                                { success: false, message: "Authentication required" },
                                { status: 401 }
                        );
                }

                let decodedToken;
                try {
                        decodedToken = verifyToken(token);
                } catch (error) {
                        return NextResponse.json(
                                { success: false, message: "Invalid authentication token" },
                                { status: 401 }
                        );
                }

                const order = await Order.findById(id);

                if (!order) {
                        return NextResponse.json(
                                { success: false, message: "Order not found" },
                                { status: 404 }
                        );
                }

                if (order.userId?.toString() !== decodedToken.id) {
                        return NextResponse.json(
                                { success: false, message: "You do not have permission to update this order" },
                                { status: 403 }
                        );
                }

                const formData = await request.formData();
                const logoUrlInput = formData.get("logoUrl");
                const file = formData.get("file");

                let uploadedLogoUrl = typeof logoUrlInput === "string" ? logoUrlInput.trim() : "";

                if (!uploadedLogoUrl && file) {
                        if (typeof file.name !== "string" || !file.name.trim()) {
                                return NextResponse.json(
                                        { success: false, message: "Invalid file provided" },
                                        { status: 400 }
                                );
                        }

                        if (file.size > MAX_FILE_SIZE) {
                                return NextResponse.json(
                                        { success: false, message: "Logo must be 5MB or smaller" },
                                        { status: 413 }
                                );
                        }

                        if (file.type && !file.type.startsWith("image/")) {
                                return NextResponse.json(
                                        { success: false, message: "Only image files are allowed" },
                                        { status: 415 }
                                );
                        }

                        const arrayBuffer = await file.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const uploadResult = await new Promise((resolve, reject) => {
                                const uploadStream = cloudinary.uploader.upload_stream(
                                        {
                                                folder: "order-logos",
                                                resource_type: "image",
                                        },
                                        (error, result) => {
                                                if (error) {
                                                        reject(error);
                                                        return;
                                                }
                                                resolve(result);
                                        }
                                );

                                uploadStream.end(buffer);
                        });

                        uploadedLogoUrl = uploadResult?.secure_url || "";
                }

                if (!uploadedLogoUrl) {
                        return NextResponse.json(
                                { success: false, message: "Please provide a logo to upload" },
                                { status: 400 }
                        );
                }

                order.logoUrl = uploadedLogoUrl;
                order.logoStatus = "submitted";
                order.logoSubmittedAt = new Date();

                await order.save();

                return NextResponse.json({
                        success: true,
                        message: "Logo uploaded successfully",
                        order,
                });
        } catch (error) {
                console.error("Logo upload error:", error);
                return NextResponse.json(
                        { success: false, message: "Failed to upload logo" },
                        { status: 500 }
                );
        }
}
