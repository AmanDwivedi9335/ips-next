import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import User from "@/model/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth.js";

const parseJsonBody = async (request) => {
        const contentType = request.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Content-Type must be application/json");
        }

        const rawBody = await request.text();
        if (!rawBody.trim()) {
                throw new Error("Request body is empty");
        }

        try {
                return JSON.parse(rawBody);
        } catch (error) {
                throw new Error("Invalid JSON in request body");
        }
};

const requireAuthUser = async () => {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
                throw new Error("AUTH_REQUIRED");
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.id);

        if (!user) {
                throw new Error("USER_NOT_FOUND");
        }

        return user;
};

const formatAddresses = (addresses = []) =>
        addresses
                .sort((a, b) => {
                        if (a.tag === b.tag) return 0;
                        return a.tag === "billing" ? -1 : 1;
                })
                .map((address) => address.toObject?.() || address);

export async function GET(request) {
        try {
                const user = await requireAuthUser();

                return NextResponse.json({
                        success: true,
                        addresses: formatAddresses(user.addresses || []),
                });
        } catch (error) {
                console.error("Get addresses error:", error);
                if (error.message === "AUTH_REQUIRED") {
                        return NextResponse.json(
                                { message: "Authentication required" },
                                { status: 401 }
                        );
                }
                if (error.message === "USER_NOT_FOUND") {
                        return NextResponse.json(
                                { success: false, message: "User not found" },
                                { status: 404 }
                        );
                }
                return NextResponse.json(
                        { success: false, message: "Internal server error" },
                        { status: 500 }
                );
        }
}

export async function POST(request) {
        try {
                const user = await requireAuthUser();
                const addressData = await parseJsonBody(request);

                const {
                        tag,
                        name,
                        street,
			city,
			state,
			zipCode,
                        country = "India",
                        isDefault = false,
                } = addressData;

                if (!tag || !name || !street || !city || !state || !zipCode) {
                        return NextResponse.json(
                                { success: false, message: "All address fields are required" },
                                { status: 400 }
                        );
                }

                if (!["billing", "shipping"].includes(tag)) {
                        return NextResponse.json(
                                { success: false, message: "Invalid address tag" },
                                { status: 400 }
                        );
                }

                if (tag === "billing") {
                        const hasBilling = user.addresses.some((addr) => addr.tag === "billing");
                        if (hasBilling) {
                                return NextResponse.json(
                                        {
                                                success: false,
                                                message:
                                                        "Billing address already exists. Please update the existing billing address.",
                                        },
                                        { status: 400 }
                                );
                        }
                }

                if (tag === "shipping" && isDefault) {
                        user.addresses.forEach((addr) => {
                                if (addr.tag === "shipping") {
                                        addr.isDefault = false;
                                }
                        });
                }

                const newAddress = {
                        tag,
                        name,
                        street,
			city,
			state,
			zipCode,
			country,
			isDefault,
		};

                if (tag === "billing") {
                        newAddress.isDefault = true;
                }

                user.addresses.push(newAddress);
                await user.save();

                return NextResponse.json({
                        success: true,
                        message: "Address added successfully",
                        address: newAddress,
                        addresses: formatAddresses(user.addresses),
                });
        } catch (error) {
                console.error("Add address error:", error);
                if (error.message === "AUTH_REQUIRED") {
                        return NextResponse.json(
                                { message: "Authentication required" },
                                { status: 401 }
                        );
                }
                if (error.message === "USER_NOT_FOUND") {
                        return NextResponse.json(
                                { success: false, message: "User not found" },
                                { status: 404 }
                        );
                }
                if (
                        error.message === "Content-Type must be application/json" ||
                        error.message === "Request body is empty" ||
                        error.message === "Invalid JSON in request body"
                ) {
                        return NextResponse.json(
                                { success: false, message: error.message },
                                { status: 400 }
                        );
                }
                return NextResponse.json(
                        { success: false, message: error.message || "Internal server error" },
                        { status: 500 }
                );
        }
}

export async function PUT(request) {
        try {
                const user = await requireAuthUser();
                const addressData = await parseJsonBody(request);

                const {
                        addressId,
                        tag,
                        name,
                        street,
                        city,
                        state,
                        zipCode,
                        country = "India",
                        isDefault = false,
                } = addressData;

                if (!addressId) {
                        return NextResponse.json(
                                { success: false, message: "Address ID is required" },
                                { status: 400 }
                        );
                }

                if (!tag || !name || !street || !city || !state || !zipCode) {
                        return NextResponse.json(
                                { success: false, message: "All address fields are required" },
                                { status: 400 }
                        );
                }

                if (!["billing", "shipping"].includes(tag)) {
                        return NextResponse.json(
                                { success: false, message: "Invalid address tag" },
                                { status: 400 }
                        );
                }

                const address = user.addresses.id(addressId);

                if (!address) {
                        return NextResponse.json(
                                { success: false, message: "Address not found" },
                                { status: 404 }
                        );
                }

                if (tag === "billing") {
                        user.addresses.forEach((addr) => {
                                if (addr.tag === "billing" && String(addr._id) !== addressId) {
                                        throw new Error("Another billing address already exists");
                                }
                        });
                }

                if (tag === "shipping" && isDefault) {
                        user.addresses.forEach((addr) => {
                                if (addr.tag === "shipping") {
                                        addr.isDefault = String(addr._id) === addressId;
                                }
                        });
                } else {
                        address.isDefault = tag === "billing" ? true : isDefault;
                }

                address.tag = tag;
                address.name = name;
                address.street = street;
                address.city = city;
                address.state = state;
                address.zipCode = zipCode;
                address.country = country;

                if (tag === "billing") {
                        address.isDefault = true;
                }

                await user.save();

                return NextResponse.json({
                        success: true,
                        message: "Address updated successfully",
                        address: address.toObject(),
                        addresses: formatAddresses(user.addresses),
                });
        } catch (error) {
                console.error("Update address error:", error);
                if (error.message === "AUTH_REQUIRED") {
                        return NextResponse.json(
                                { message: "Authentication required" },
                                { status: 401 }
                        );
                }
                if (error.message === "USER_NOT_FOUND") {
                        return NextResponse.json(
                                { success: false, message: "User not found" },
                                { status: 404 }
                        );
                }
                if (
                        error.message === "Content-Type must be application/json" ||
                        error.message === "Request body is empty" ||
                        error.message === "Invalid JSON in request body" ||
                        error.message === "Another billing address already exists"
                ) {
                        return NextResponse.json(
                                { success: false, message: error.message },
                                { status: 400 }
                        );
                }
                return NextResponse.json(
                        { success: false, message: error.message || "Internal server error" },
                        { status: 500 }
                );
        }
}

export async function DELETE(request) {
        try {
                const user = await requireAuthUser();
                const { addressId } = await parseJsonBody(request);

                if (!addressId) {
                        return NextResponse.json(
                                { success: false, message: "Address ID is required" },
                                { status: 400 }
                        );
                }

                const address = user.addresses.id(addressId);

                if (!address) {
                        return NextResponse.json(
                                { success: false, message: "Address not found" },
                                { status: 404 }
                        );
                }

                address.deleteOne();

                // Ensure at least one shipping address remains default if available
                const shippingAddresses = user.addresses.filter((addr) => addr.tag === "shipping");
                if (shippingAddresses.length > 0 && !shippingAddresses.some((addr) => addr.isDefault)) {
                        shippingAddresses[0].isDefault = true;
                }

                await user.save();

                return NextResponse.json({
                        success: true,
                        message: "Address deleted successfully",
                        addresses: formatAddresses(user.addresses),
                });
        } catch (error) {
                console.error("Delete address error:", error);
                if (error.message === "AUTH_REQUIRED") {
                        return NextResponse.json(
                                { message: "Authentication required" },
                                { status: 401 }
                        );
                }
                if (error.message === "USER_NOT_FOUND") {
                        return NextResponse.json(
                                { success: false, message: "User not found" },
                                { status: 404 }
                        );
                }
                if (
                        error.message === "Content-Type must be application/json" ||
                        error.message === "Request body is empty" ||
                        error.message === "Invalid JSON in request body"
                ) {
                        return NextResponse.json(
                                { success: false, message: error.message },
                                { status: 400 }
                        );
                }
                return NextResponse.json(
                        { success: false, message: error.message || "Internal server error" },
                        { status: 500 }
                );
        }
}
