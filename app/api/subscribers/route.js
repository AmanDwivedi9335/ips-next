import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";
import Subscriber from "@/model/Subscriber";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parsePagination(searchParams) {
        const rawPage = Number.parseInt(searchParams.get("page") || "1", 10);
        const rawLimit = Number.parseInt(searchParams.get("limit") || "10", 10);

        const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
        const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 10 : Math.min(rawLimit, 50);

        return { page, limit };
}

function normalizeEmail(email) {
        return String(email || "").trim().toLowerCase();
}

export async function POST(request) {
        try {
                await dbConnect();

                const body = await request.json();
                const email = normalizeEmail(body?.email);
                const source = typeof body?.source === "string" ? body.source.trim().slice(0, 120) : "";
                const metadata = body?.metadata && typeof body.metadata === "object" ? body.metadata : undefined;

                if (!email || !EMAIL_REGEX.test(email)) {
                        return NextResponse.json(
                                {
                                        success: false,
                                        error: "Please provide a valid email address.",
                                },
                                { status: 400 }
                        );
                }

                const existingSubscriber = await Subscriber.findOne({ email });

                if (existingSubscriber) {
                        if (existingSubscriber.status === "unsubscribed") {
                                existingSubscriber.status = "subscribed";
                                if (source) {
                                        existingSubscriber.source = source;
                                }
                                if (metadata) {
                                        for (const [key, value] of Object.entries(metadata)) {
                                                if (typeof value === "string") {
                                                        existingSubscriber.metadata.set(key, value);
                                                }
                                        }
                                }
                                await existingSubscriber.save();

                                return NextResponse.json(
                                        {
                                                success: true,
                                                message: "Welcome back! You're now resubscribed.",
                                        },
                                        { status: 200 }
                                );
                        }

                        return NextResponse.json(
                                {
                                        success: true,
                                        message: "You're already subscribed to our updates.",
                                },
                                { status: 200 }
                        );
                }

                const subscriber = new Subscriber({
                        email,
                        status: "subscribed",
                        ...(source && { source }),
                });

                if (metadata) {
                        for (const [key, value] of Object.entries(metadata)) {
                                if (typeof value === "string") {
                                        subscriber.metadata.set(key, value);
                                }
                        }
                }

                await subscriber.save();

                return NextResponse.json(
                        {
                                success: true,
                                message: "Thanks for subscribing!",
                                data: {
                                        id: subscriber._id,
                                        email: subscriber.email,
                                },
                        },
                        { status: 201 }
                );
        } catch (error) {
                console.error("Failed to subscribe:", error);
                return NextResponse.json(
                        {
                                success: false,
                                error:
                                        error?.code === 11000
                                                ? "This email is already subscribed."
                                                : "We couldn't process your subscription. Please try again later.",
                        },
                        { status: 500 }
                );
        }
}

export async function GET(request) {
        try {
                await dbConnect();

                const { searchParams } = request.nextUrl;
                const { page, limit } = parsePagination(searchParams);
                const status = searchParams.get("status");
                const search = searchParams.get("search");

                const filters = {};

                if (status && ["subscribed", "unsubscribed"].includes(status)) {
                        filters.status = status;
                }

                if (search) {
                        filters.email = { $regex: search.trim(), $options: "i" };
                }

                const query = Subscriber.find(filters)
                        .sort({ createdAt: -1 })
                        .skip((page - 1) * limit)
                        .limit(limit)
                        .lean();

                const [subscribers, total] = await Promise.all([
                        query,
                        Subscriber.countDocuments(filters),
                ]);

                const pages = total === 0 ? 1 : Math.ceil(total / limit);

                return NextResponse.json({
                        success: true,
                        data: subscribers,
                        pagination: {
                                page,
                                limit,
                                total,
                                pages,
                        },
                });
        } catch (error) {
                console.error("Failed to fetch subscribers:", error);
                return NextResponse.json(
                        {
                                success: false,
                                error: "Unable to load subscribers. Please try again later.",
                        },
                        { status: 500 }
                );
        }
}
