import crypto from "crypto";
import { NextResponse } from "next/server";
import Order from "@/model/Order";
import Cart from "@/model/Cart";
import { dbConnect } from "@/lib/dbConnect.js";

export async function POST(req) {
        try {
                await dbConnect();

                const body = await req.json();
                const {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        orderData,
                        userId,
                        clearCart = false,
                } = body;

                if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                        return NextResponse.json(
                                { success: false, error: "Missing payment verification data" },
                                { status: 400 }
                        );
                }

                if (!orderData) {
                        return NextResponse.json(
                                { success: false, error: "Order details are required" },
                                { status: 400 }
                        );
                }

                const secret = process.env.RAZORPAY_KEY_SECRET;

                if (!secret) {
                        throw new Error("RAZORPAY_KEY_SECRET is not configured");
                }

                const hmac = crypto.createHmac("sha256", secret);
                hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
                const generatedSignature = hmac.digest("hex");

                if (generatedSignature !== razorpay_signature) {
                        return NextResponse.json(
                                { success: false, error: "Invalid payment signature" },
                                { status: 400 }
                        );
                }

                const order = new Order({
                        ...orderData,
                        transactionId: razorpay_payment_id,
                        paymentStatus: "paid",
                        status: "confirmed",
                        paymentDetails: {
                                ...(orderData.paymentDetails || {}),
                                gateway: "razorpay",
                                razorpayOrderId: razorpay_order_id,
                                razorpayPaymentId: razorpay_payment_id,
                                razorpaySignature: razorpay_signature,
                                amountPaid: orderData?.totalAmount,
                        },
                });

                await order.save();

                if (clearCart && userId) {
                        await Cart.findOneAndUpdate(
                                { user: userId },
                                { products: [], totalPrice: 0, appliedPromo: null }
                        );
                }

                return NextResponse.json({
                        success: true,
                        orderId: order._id,
                        orderNumber: order.orderNumber,
                        order: order,
                });
        } catch (error) {
                console.error("Payment verification error:", error);
                return NextResponse.json(
                        { success: false, error: error.message },
                        { status: 500 }
                );
        }
}
