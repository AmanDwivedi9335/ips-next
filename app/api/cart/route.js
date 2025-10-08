// app/api/cart/route.js

import { dbConnect } from "@/lib/dbConnect.js";
import Cart from "@/model/Cart.js";
import Product from "@/model/Product.js";
import { verifyToken } from "@/lib/auth.js";
import { cookies } from "next/headers";
import { CART_PRODUCT_SELECTION, buildCartResponse } from "@/lib/cartResponse.js";

export async function GET() {
	await dbConnect();

	try {
		const cookieStore = cookies();
		const token = cookieStore.get("auth_token")?.value;

		if (!token) {
			return Response.json(
				{ message: "Authentication required" },
				{ status: 401 }
			);
		}

		const decoded = verifyToken(token);

                let cart = await Cart.findOne({ user: decoded.id }).populate({
                        path: "products.product",
                        select: CART_PRODUCT_SELECTION,
                });

                if (!cart) {
                        cart = new Cart({ user: decoded.id, products: [], totalPrice: 0 });
                        await cart.save();
                }

                const responseCart = await buildCartResponse(cart);

                return Response.json({ cart: responseCart });
	} catch (error) {
		console.error("Cart fetch error:", error);
		return Response.json({ message: "Failed to fetch cart" }, { status: 500 });
	}
}

export async function POST(req) {
	await dbConnect();

	try {
		const cookieStore = cookies();
		const token = cookieStore.get("auth_token")?.value;

		if (!token) {
			return Response.json(
				{ message: "Authentication required" },
				{ status: 401 }
			);
		}

		const decoded = verifyToken(token);
		const { productId, quantity = 1 } = await req.json();

                // Verify product exists
		const product = await Product.findById(productId);
		if (!product) {
			return Response.json({ message: "Product not found" }, { status: 404 });
		}


		// Find or create cart
		let cart = await Cart.findOne({ user: decoded.id });
		if (!cart) {
			cart = new Cart({ user: decoded.id, products: [], totalPrice: 0 });
		}

		// Check if product already in cart
		const existingProductIndex = cart.products.findIndex(
			(item) => item.product.toString() === productId
		);

		if (existingProductIndex > -1) {
			// Update quantity
			cart.products[existingProductIndex].quantity += quantity;
		} else {
			// Add new product
			cart.products.push({ product: productId, quantity });
		}

		// Recalculate total price
                await cart.populate({
                        path: "products.product",
                        select: CART_PRODUCT_SELECTION,
                });

                const responseCart = await buildCartResponse(cart);

                cart.totalPrice = responseCart.totalPrice;
                await cart.save();

                return Response.json({
                        message: "Product added to cart",
                        cart: responseCart,
                });
	} catch (error) {
		console.error("Add to cart error:", error);
		return Response.json({ message: "Failed to add to cart" }, { status: 500 });
	}
}
