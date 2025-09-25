import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";
import { generateInvoicePdfData } from "@/lib/generateInvoicePDF.js";

const decodeStoredInvoice = (pdfBase64) => {
        if (!pdfBase64 || typeof pdfBase64 !== "string") {
                return null;
        }

        const base64String = pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64;

        try {
                return Buffer.from(base64String, "base64");
        } catch (error) {
                console.error("Failed to decode stored invoice", error);
                return null;
        }
};

export async function GET(_request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, message: "Order identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const order = await Order.findById(id)
                        .populate("userId", "firstName lastName email mobile")
                        .populate("products.productId", "name images price")
                        .populate("couponApplied.couponId", "code discountType discountValue");

                if (!order) {
                        return NextResponse.json(
                                { success: false, message: "Order not found" },
                                { status: 404 }
                        );
                }

                let pdfBuffer = decodeStoredInvoice(order.invoice?.pdfBase64);

                if (!pdfBuffer) {
                        const { buffer } = await generateInvoicePdfData(order);
                        pdfBuffer = buffer;
                }

                if (!pdfBuffer) {
                        return NextResponse.json(
                                { success: false, message: "Unable to generate invoice" },
                                { status: 500 }
                        );
                }

                const fileName = order.invoice?.fileName || `invoice-${order.orderNumber || id}.pdf`;

                return new NextResponse(pdfBuffer, {
                        headers: {
                                "Content-Type": "application/pdf",
                                "Content-Disposition": `attachment; filename="${fileName}"`,
                        },
                });
        } catch (error) {
                console.error("Error downloading invoice:", error);
                return NextResponse.json(
                        { success: false, message: "Failed to download invoice" },
                        { status: 500 }
                );
        }
}
