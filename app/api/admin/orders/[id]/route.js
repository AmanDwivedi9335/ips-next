import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";
import "@/model/Promocode.js";

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
                        .populate({
                                path: "couponApplied.couponId",
                                model: "Promocode",
                                select: "code discountType discountValue discount",
                        });

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
		console.error("Error fetching order:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch order" },
			{ status: 500 }
		);
	}
}

export async function PUT(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, message: "Order identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const updateData = await request.json();

                const order = await Order.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		})
			.populate("userId", "firstName lastName email")
			.populate("products.productId", "name images");

		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Order updated successfully",
			order,
		});
	} catch (error) {
		console.error("Error updating order:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to update order" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, message: "Order identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const order = await Order.findByIdAndDelete(id);

		if (!order) {
			return NextResponse.json(
				{ success: false, message: "Order not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Order deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting order:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to delete order" },
			{ status: 500 }
		);
	}
}
