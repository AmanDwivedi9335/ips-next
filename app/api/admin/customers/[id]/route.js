import { NextResponse } from "next/server";
import User from "@/model/User.js";
import { dbConnect } from "@/lib/dbConnect.js";

// GET - Fetch single customer
export async function GET(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, error: "Customer identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const customer = await User.findOne({
                        _id: id,
                        userType: "customer",
                }).select("-password");

		if (!customer) {
			return NextResponse.json(
				{ success: false, error: "Customer not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: customer,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// PUT - Update customer
export async function PUT(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, error: "Customer identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const body = await request.json();
                const { firstName, lastName, email, mobile, address, status } = body;

                const customer = await User.findOneAndUpdate(
                        { _id: id, userType: "customer" },
			{
				firstName,
				lastName,
				email,
				mobile,
				address,
				status,
			},
			{ new: true, runValidators: true }
		).select("-password");

		if (!customer) {
			return NextResponse.json(
				{ success: false, error: "Customer not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: customer,
			message: "Customer updated successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// DELETE - Delete customer
export async function DELETE(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, error: "Customer identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const customer = await User.findOneAndDelete({
                        _id: id,
                        userType: "customer",
                });

		if (!customer) {
			return NextResponse.json(
				{ success: false, error: "Customer not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Customer deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
