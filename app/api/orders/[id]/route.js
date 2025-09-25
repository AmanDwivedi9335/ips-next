import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";

export async function GET(_request, { params }) {
        try {
                await dbConnect();

                const order = await Order.findById(params.id);

                if (!order) {
                        return NextResponse.json(
                                { success: false, message: "Order not found" },
                                { status: 404 }
                        );
                }

                return NextResponse.json({
                        success: true,
                        order,
                });
        } catch (error) {
                console.error("Fetch order error:", error);
                return NextResponse.json(
                        { success: false, message: "Internal server error" },
                        { status: 500 }
                );
        }
}
