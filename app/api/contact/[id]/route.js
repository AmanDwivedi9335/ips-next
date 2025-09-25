import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";
import ContactMessage from "@/model/ContactMessage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = ["new", "in_progress", "resolved"];

export async function PATCH(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, error: "Contact message identifier is required." },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const body = await request.json();

                const updates = {};

                if (body.status && allowedStatuses.includes(body.status)) {
                        updates.status = body.status;
                        updates.resolvedAt = body.status === "resolved" ? new Date() : null;
                }

                if (typeof body.adminNotes === "string") {
                        updates.adminNotes = body.adminNotes.trim();
                }

                if (Object.keys(updates).length === 0) {
                        return NextResponse.json(
                                {
                                        success: false,
                                        error: "No valid fields provided for update.",
                                },
                                { status: 400 }
                        );
                }

                const message = await ContactMessage.findByIdAndUpdate(id, updates, {
                        new: true,
                });

                if (!message) {
                        return NextResponse.json(
                                { success: false, error: "Contact message not found." },
                                { status: 404 }
                        );
                }

                return NextResponse.json({ success: true, data: message });
        } catch (error) {
                console.error(`Failed to update contact message:`, error);
                return NextResponse.json(
                        {
                                success: false,
                                error:
                                        error.message ||
                                        "Unable to update contact message right now. Please try again later.",
                        },
                        { status: 500 }
                );
        }
}
