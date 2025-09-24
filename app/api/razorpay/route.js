import { getRazorpayInstance } from "@/lib/razorpay.js";
import { NextResponse } from "next/server";

export async function POST(req) {
        try {
                const body = await req.json();
                const { amount, currency = "INR", receipt, notes } = body;

                const parsedAmount = Number(amount);
                const amountInPaise = Math.round(parsedAmount * 100);

                if (!Number.isFinite(parsedAmount) || amountInPaise <= 0) {
                        return NextResponse.json(
                                { success: false, error: "Invalid amount" },
                                { status: 400 }
                        );
                }

                const options = {
                        amount: amountInPaise, // Razorpay expects amount in paise
                        currency: currency?.toUpperCase?.() || "INR",
                        receipt: receipt || `order_rcptid_${Date.now()}`,
                        payment_capture: 1,
                };

                if (notes && typeof notes === "object") {
                        options.notes = notes;
                }

                const order = await getRazorpayInstance().orders.create(options);

                const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

                return NextResponse.json({
                        success: true,
                        key: keyId,
                        order: {
                                id: order.id,
                                amount: order.amount,
                                currency: order.currency,
                                receipt: order.receipt,
                        },
                });
        } catch (error) {
                console.error("Razorpay order creation error:", error);
                return NextResponse.json(
                        { success: false, error: error.message },
                        { status: 500 }
                );
        }
}
