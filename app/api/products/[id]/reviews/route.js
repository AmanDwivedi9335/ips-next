import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Review from "@/model/Review.js";
import Order from "@/model/Order.js";
import { verifyToken } from "@/lib/auth.js";
import { cookies } from "next/headers";

export async function POST(req, { params }) {
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
                const { rating, comment } = await req.json();

                // Validate input
                if (!rating || !comment) {
                        return Response.json(
                                { message: "Rating and comment are required" },
                                { status: 400 }
                        );
                }

                if (rating < 1 || rating > 5) {
                        return Response.json(
                                { message: "Rating must be between 1 and 5" },
                                { status: 400 }
                        );
                }

                // Check if product exists
                const product = await Product.findById(params.id);
                if (!product) {
                        return Response.json({ message: "Product not found" }, { status: 404 });
                }

                // Ensure user has purchased the product
                const hasPurchased = await Order.exists({
                        userId: decoded.id,
                        "products.productId": params.id,
                        status: "delivered",
                });
                if (!hasPurchased) {
                        return Response.json(
                                { message: "You must purchase this product before reviewing" },
                                { status: 403 }
                        );
                }

                // Prevent duplicate reviews
                const existingReview = await Review.findOne({
                        product: params.id,
                        user: decoded.id,
                });
                if (existingReview) {
                        return Response.json(
                                { message: "You have already reviewed this product" },
                                { status: 400 }
                        );
                }

                // Create review
                const review = new Review({
                        user: decoded.id,
                        product: params.id,
                        rating,
                        comment,
                });

                await review.save();

                // Add review to product
                product.reviews.push(review._id);
                await product.save();

                // Populate the review with user data
                await review.populate("user", "firstName lastName");

                return Response.json({ message: "Review added successfully", review });
        } catch (error) {
                console.error("Add review error:", error);
                return Response.json({ message: "Failed to add review" }, { status: 500 });
        }
}

export async function GET(req, { params }) {
        await dbConnect();

        try {
                const product = await Product.findById(params.id).populate({
                        path: "reviews",
                        select: "rating comment user",
                        strictPopulate: false,
                        populate: { path: "user", select: "firstName lastName" },
                });

                if (!product) {
                        return Response.json({ message: "Product not found" }, { status: 404 });
                }

                return Response.json({ reviews: product.reviews || [] });
        } catch (error) {
                console.error("Get reviews error:", error);
                return Response.json({ message: "Failed to fetch reviews" }, { status: 500 });
        }
}
