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

const ensureAddressArray = (user) => {
        if (!Array.isArray(user.addresses)) {
                user.addresses = [];
                if (typeof user.markModified === "function") {
                        user.markModified("addresses");
                }
        }
        return user.addresses;
};

const findAddressById = (addresses, addressId) => {
        if (!addressId) return null;
        if (typeof addresses?.id === "function") {
                return addresses.id(addressId);
        }
        return addresses?.find?.((addr) => String(addr?._id) === addressId) || null;
};

const formatAddresses = (addresses = []) =>
        [...addresses]
                .sort((a, b) => {
                        if (a.tag === b.tag) return 0;
                        return a.tag === "billing" ? -1 : 1;
                })
                .map((address) => address?.toObject?.() || address);

export async function GET(request) {
        try {
                const user = await requireAuthUser();
                const addresses = ensureAddressArray(user);

                return NextResponse.json({
                        success: true,
                        addresses: formatAddresses(addresses),
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
                const addresses = ensureAddressArray(user);
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
                        const hasBilling = addresses.some((addr) => addr.tag === "billing");
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
                        addresses.forEach((addr) => {
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

                addresses.push(newAddress);
                await user.save();

                const savedAddresses = ensureAddressArray(user);
                const createdAddress =
                        findAddressById(savedAddresses, String(newAddress?._id || "")) ||
                        savedAddresses[savedAddresses.length - 1];

                return NextResponse.json({
                        success: true,
                        message: "Address added successfully",
                        address: createdAddress?.toObject?.() || createdAddress,
                        addresses: formatAddresses(savedAddresses),
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
                const addresses = ensureAddressArray(user);
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

                const address = findAddressById(addresses, addressId);

                if (!address) {
                        return NextResponse.json(
                                { success: false, message: "Address not found" },
                                { status: 404 }
                        );
                }

                if (tag === "billing") {
                        addresses.forEach((addr) => {
                                if (addr.tag === "billing" && String(addr._id) !== addressId) {
                                        throw new Error("Another billing address already exists");
                                }
                        });
                }

                if (tag === "shipping" && isDefault) {
                        addresses.forEach((addr) => {
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
                        address: address?.toObject?.() || address,
                        addresses: formatAddresses(addresses),
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
                const addresses = ensureAddressArray(user);
                const { addressId } = await parseJsonBody(request);

                if (!addressId) {
                        return NextResponse.json(
                                { success: false, message: "Address ID is required" },
                                { status: 400 }
                        );
                }

                const address = findAddressById(addresses, addressId);

                if (!address) {
                        return NextResponse.json(
                                { success: false, message: "Address not found" },
                                { status: 404 }
                        );
                }

                if (typeof address?.deleteOne === "function") {
                        address.deleteOne();
                } else {
                        user.addresses = addresses.filter(
                                (addr) => String(addr?._id) !== addressId
                        );
                        if (typeof user.markModified === "function") {
                                user.markModified("addresses");
                        }
                }

                // Ensure at least one shipping address remains default if available
                const updatedAddresses = ensureAddressArray(user);
                const shippingAddresses = updatedAddresses.filter((addr) => addr.tag === "shipping");
                if (shippingAddresses.length > 0 && !shippingAddresses.some((addr) => addr.isDefault)) {
                        shippingAddresses[0].isDefault = true;
                }

                await user.save();

                return NextResponse.json({
                        success: true,
                        message: "Address deleted successfully",
                        addresses: formatAddresses(updatedAddresses),
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
