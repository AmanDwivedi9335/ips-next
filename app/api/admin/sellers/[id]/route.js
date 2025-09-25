import { NextResponse } from "next/server";
import User from "@/model/User.js";
import { dbConnect } from "@/lib/dbConnect.js";

// GET - Fetch single seller
export async function GET(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, error: "Seller identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const seller = await User.findOne({
                        _id: id,
                        userType: "seller",
                }).select("-password");

		if (!seller) {
			return NextResponse.json(
				{ success: false, error: "Seller not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: seller,
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// PUT - Update seller
export async function PUT(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, error: "Seller identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const body = await request.json();
                const { firstName, lastName, email, mobile, address, status } = body;

                const seller = await User.findOneAndUpdate(
                        { _id: id, userType: "seller" },
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

		if (!seller) {
			return NextResponse.json(
				{ success: false, error: "Seller not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: seller,
			message: "Seller updated successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}

// DELETE - Delete seller
export async function DELETE(request, { params }) {
        try {
                const { id } = await params;

                if (!id) {
                        return NextResponse.json(
                                { success: false, error: "Seller identifier is required" },
                                { status: 400 }
                        );
                }

                await dbConnect();

                const seller = await User.findOneAndDelete({
                        _id: id,
                        userType: "seller",
                });

		if (!seller) {
			return NextResponse.json(
				{ success: false, error: "Seller not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Seller deleted successfully",
		});
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: error.message },
			{ status: 500 }
		);
	}
}
