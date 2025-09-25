import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF.js";

export async function GET(request, { params }) {
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

		const pdfBuffer = await generateInvoicePDF(order);

                return new NextResponse(pdfBuffer, {
                        headers: {
                                "Content-Type": "application/pdf",
                                "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
                        },
                });
        } catch (error) {
                console.error("Error generating invoice:", error);
                return NextResponse.json(
                        { success: false, message: "Failed to generate invoice" },
                        { status: 500 }
                );
        }
}

export async function POST(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, message: "Order identifier is required" },
                                { status: 400 }
                        );
                }

                const body = await request.json();
                const { pdfBase64, fileName } = body || {};

                if (!pdfBase64 || typeof pdfBase64 !== "string") {
                        return NextResponse.json(
                                { success: false, message: "Invoice PDF is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const order = await Order.findByIdAndUpdate(
                        id,
                        {
                                invoice: {
                                        pdfBase64,
                                        fileName: fileName || `invoice-${id}.pdf`,
                                        generatedAt: new Date(),
                                },
                        },
                        { new: true }
                );

                if (!order) {
                        return NextResponse.json(
                                { success: false, message: "Order not found" },
                                { status: 404 }
                        );
                }

                return NextResponse.json({ success: true, message: "Invoice saved successfully" });
        } catch (error) {
                console.error("Error saving invoice:", error);
                return NextResponse.json(
                        { success: false, message: "Failed to save invoice" },
                        { status: 500 }
                );
        }
}
