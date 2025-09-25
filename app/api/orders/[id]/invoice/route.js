import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";
import "@/model/Promocode.js";
import { generateInvoicePdfData } from "@/lib/generateInvoicePDF.js";

const decodeStoredInvoice = (pdfBase64) => {
        if (!pdfBase64 || typeof pdfBase64 !== "string") {
                return null;
        }

        const base64String = (pdfBase64.includes(",") ? pdfBase64.split(",")[1] : pdfBase64)
                .replace(/\s/g, "")
                .trim();

        try {
                if (!base64String) {
                        return null;
                }

                const buffer = Buffer.from(base64String, "base64");

                return buffer?.length ? buffer : null;
        } catch (error) {
                console.error("Failed to decode stored invoice", error);
                return null;
        }
};

const applyOrderPopulates = (query) =>
        query
                .populate("userId", "firstName lastName email mobile")
                .populate("products.productId", "name images price")
                .populate({
                        path: "couponApplied.couponId",
                        model: "Promocode",
                        select: "code discountType discountValue discount",
                });

const buildAlternativeConditions = (identifier, searchParams) => {
        const seenConditions = new Set();
        const conditions = [];

        const addCondition = (field, value) => {
                if (!value || typeof value !== "string") {
                        return;
                }

                const trimmed = value.trim();

                if (!trimmed) {
                        return;
                }

                const key = `${field}:${trimmed}`;

                if (seenConditions.has(key)) {
                        return;
                }

                seenConditions.add(key);
                conditions.push({ [field]: trimmed });
        };

        if (identifier && typeof identifier === "string") {
                const trimmedIdentifier = identifier.trim();

                if (trimmedIdentifier) {
                        if (!mongoose.Types.ObjectId.isValid(trimmedIdentifier)) {
                                addCondition("orderNumber", trimmedIdentifier);
                        }

                        addCondition("transactionId", trimmedIdentifier);
                        addCondition("paymentDetails.razorpayOrderId", trimmedIdentifier);
                        addCondition("paymentDetails.razorpayPaymentId", trimmedIdentifier);
                }
        }

        if (searchParams) {
                addCondition("orderNumber", searchParams.get("orderNumber"));
                addCondition("orderNumber", searchParams.get("fallbackOrderNumber"));
                addCondition("transactionId", searchParams.get("transactionId"));
                addCondition("paymentDetails.razorpayOrderId", searchParams.get("gatewayOrderId"));
                addCondition("paymentDetails.razorpayPaymentId", searchParams.get("gatewayPaymentId"));
        }

        return conditions;
};

const findOrderForInvoice = async (identifier, searchParams) => {
        let order = null;

        if (identifier && mongoose.Types.ObjectId.isValid(identifier)) {
                order = await applyOrderPopulates(Order.findById(identifier));

                if (order) {
                        return order;
                }
        }

        const alternativeConditions = buildAlternativeConditions(identifier, searchParams);

        if (!alternativeConditions.length) {
                return null;
        }

        const query =
                alternativeConditions.length === 1
                        ? Order.findOne(alternativeConditions[0])
                        : Order.findOne({ $or: alternativeConditions });

        return applyOrderPopulates(query);
};

const ensurePdfFileName = (order, identifier) => {
        const fallbackName = `invoice-${order?.orderNumber || identifier || "order"}`;
        const rawFileName = order?.invoice?.fileName || fallbackName;
        const trimmedFileName = typeof rawFileName === "string" ? rawFileName.trim() : fallbackName;

        if (!trimmedFileName) {
                return `${fallbackName}.pdf`;
        }

        return trimmedFileName.toLowerCase().endsWith(".pdf") ? trimmedFileName : `${trimmedFileName}.pdf`;
};

export async function GET(request, context) {
        try {
                const params = await context?.params;
                const id = params?.id;

                if (!id) {
                        return NextResponse.json(
                                { success: false, message: "Order identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const order = await findOrderForInvoice(id, request?.nextUrl?.searchParams);

                if (!order) {
                        return NextResponse.json(
                                { success: false, message: "Order not found" },
                                { status: 404 }
                        );
                }

                let pdfBuffer = decodeStoredInvoice(order.invoice?.pdfBase64);

                if (!pdfBuffer) {
                        try {
                                const invoiceSource =
                                        typeof order.toObject === "function"
                                                ? order.toObject({ virtuals: true })
                                                : order;
                                const { buffer } = await generateInvoicePdfData(invoiceSource);
                                pdfBuffer = buffer;
                        } catch (generationError) {
                                console.error("Failed to generate invoice from order", generationError);
                                return NextResponse.json(
                                        { success: false, message: "Unable to generate invoice" },
                                        { status: 500 }
                                );
                        }
                }

                if (!pdfBuffer) {
                        return NextResponse.json(
                                { success: false, message: "Unable to generate invoice" },
                                { status: 500 }
                        );
                }

                const fileName = ensurePdfFileName(order, id);

                return new NextResponse(pdfBuffer, {
                        headers: {
                                "Content-Type": "application/pdf",
                                "Content-Disposition": `attachment; filename="${fileName}"`,
                                "Content-Length": Buffer.byteLength(pdfBuffer).toString(),
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
