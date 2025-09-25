import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { dbConnect } from "@/lib/dbConnect";
import ContactMessage from "@/model/ContactMessage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = ["new", "in_progress", "resolved"];
const allowedEmailStatuses = ["pending", "sent", "failed"];

let cachedTransporter = null;

function getTransporter() {
        if (cachedTransporter) {
                return cachedTransporter;
        }

        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
        const smtpSecure = process.env.SMTP_SECURE
                ? process.env.SMTP_SECURE === "true"
                : undefined;
        const smtpUser = process.env.SMTP_USER || process.env.MAIL_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.MAIL_PASS;

        if (!smtpUser || !smtpPass) {
                throw new Error(
                        "Email credentials are not configured. Set SMTP_USER/SMTP_PASS or MAIL_USER/MAIL_PASS."
                );
        }

        if (smtpHost) {
                cachedTransporter = nodemailer.createTransport({
                        host: smtpHost,
                        port: smtpPort || 587,
                        secure: smtpSecure ?? false,
                        auth: {
                                user: smtpUser,
                                pass: smtpPass,
                        },
                });
        } else {
                cachedTransporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                                user: smtpUser,
                                pass: smtpPass,
                        },
                });
        }

        return cachedTransporter;
}

function buildEmailBody({ fullName, email, phone, subject, message, category, source }) {
        const lines = [
                `You have received a new contact request on Industrial Print Solutions.`,
                "",
                `Name: ${fullName}`,
                `Email: ${email}`,
        ];

        if (phone) {
                lines.push(`Phone: ${phone}`);
        }

        if (category) {
                lines.push(`Category: ${category}`);
        }

        if (source) {
                lines.push(`Source: ${source}`);
        }

        lines.push("", `Subject: ${subject}`, "", "Message:", message);

        return lines.join("\n");
}

function parsePagination(searchParams) {
        const rawPage = Number.parseInt(searchParams.get("page") || "1", 10);
        const rawLimit = Number.parseInt(searchParams.get("limit") || "10", 10);

        const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
        const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 10 : Math.min(rawLimit, 50);

        return { page, limit };
}

export async function POST(request) {
        try {
                await dbConnect();

                const body = await request.json();
                const {
                        fullName,
                        email,
                        phone = "",
                        subject,
                        message,
                        category = "",
                        source = "",
                } = body;

                if (!fullName || !email || !subject || !message) {
                        return NextResponse.json(
                                {
                                        success: false,
                                        error: "Please provide your name, email, subject and message.",
                                },
                                { status: 400 }
                        );
                }

                const trimmedMessage = String(message).trim();
                if (trimmedMessage.length < 10) {
                        return NextResponse.json(
                                {
                                        success: false,
                                        error: "Message is too short. Please provide more details.",
                                },
                                { status: 400 }
                        );
                }

                const sanitizedCategory = typeof category === "string" ? category.trim() : "";
                const sanitizedSource =
                        typeof source === "string" && source.trim()
                                ? source.trim().slice(0, 120)
                                : "contact-form";

                const contactMessage = new ContactMessage({
                        fullName: String(fullName).trim(),
                        email: String(email).trim(),
                        phone: String(phone).trim(),
                        subject: String(subject).trim(),
                        message: trimmedMessage,
                        category: sanitizedCategory,
                        source: sanitizedSource,
                });

                await contactMessage.save();

                try {
                        const transporter = getTransporter();
                        const recipient =
                                process.env.CONTACT_US_RECIPIENT ||
                                process.env.CONTACT_US_EMAIL ||
                                process.env.MAIL_USER ||
                                process.env.SMTP_USER;

                        if (!recipient) {
                                throw new Error("No recipient configured for contact emails.");
                        }

                        await transporter.sendMail({
                                from:
                                        process.env.CONTACT_US_FROM ||
                                        process.env.MAIL_FROM ||
                                        process.env.MAIL_USER ||
                                        process.env.SMTP_USER,
                                to: recipient,
                                replyTo: `${contactMessage.fullName} <${contactMessage.email}>`,
                                subject: `[Contact] ${contactMessage.subject}`,
                                text: buildEmailBody(contactMessage),
                        });

                        contactMessage.emailStatus = "sent";
                        await contactMessage.save();
                } catch (emailError) {
                        contactMessage.emailStatus = "failed";
                        await contactMessage.save();
                        throw emailError;
                }

                return NextResponse.json(
                        {
                                success: true,
                                message: "Thank you for contacting us. Our team will get back to you shortly.",
                        },
                        { status: 201 }
                );
        } catch (error) {
                console.error("Contact form submission failed:", error);
                return NextResponse.json(
                        {
                                success: false,
                                error:
                                        error.message ||
                                        "We couldn't submit your request right now. Please try again later.",
                        },
                        { status: 500 }
                );
        }
}

export async function GET(request) {
        try {
                await dbConnect();

                const { searchParams } = new URL(request.url);
                const { page, limit } = parsePagination(searchParams);
                const search = (searchParams.get("search") || "").trim();
                const status = searchParams.get("status") || "all";
                const emailStatus = searchParams.get("emailStatus") || "all";

                const query = {};

                if (search) {
                        query.$or = [
                                { fullName: { $regex: search, $options: "i" } },
                                { email: { $regex: search, $options: "i" } },
                                { phone: { $regex: search, $options: "i" } },
                                { subject: { $regex: search, $options: "i" } },
                        ];
                }

                if (status !== "all" && allowedStatuses.includes(status)) {
                        query.status = status;
                }

                if (emailStatus !== "all" && allowedEmailStatuses.includes(emailStatus)) {
                        query.emailStatus = emailStatus;
                }

                const skip = (page - 1) * limit;

                const [messages, totalFiltered, totalMessages, statusCounts, emailCounts] =
                        await Promise.all([
                                ContactMessage.find(query)
                                        .sort({ createdAt: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .lean(),
                                ContactMessage.countDocuments(query),
                                ContactMessage.countDocuments(),
                                ContactMessage.aggregate([
                                        { $group: { _id: "$status", count: { $sum: 1 } } },
                                ]),
                                ContactMessage.aggregate([
                                        { $group: { _id: "$emailStatus", count: { $sum: 1 } } },
                                ]),
                        ]);

                const totalPages = Math.max(1, Math.ceil(totalFiltered / limit));

                const stats = {
                        totalMessages,
                        status: {
                                new: 0,
                                in_progress: 0,
                                resolved: 0,
                        },
                        emailStatus: {
                                pending: 0,
                                sent: 0,
                                failed: 0,
                        },
                };

                statusCounts.forEach(({ _id, count }) => {
                        if (_id in stats.status) {
                                stats.status[_id] = count;
                        }
                });

                emailCounts.forEach(({ _id, count }) => {
                        if (_id in stats.emailStatus) {
                                stats.emailStatus[_id] = count;
                        }
                });

                return NextResponse.json({
                        success: true,
                        data: messages,
                        pagination: {
                                currentPage: page,
                                totalPages,
                                totalItems: totalFiltered,
                                pageSize: limit,
                                hasNext: page < totalPages,
                                hasPrev: page > 1,
                        },
                        stats,
                });
        } catch (error) {
                console.error("Failed to fetch contact messages:", error);
                return NextResponse.json(
                        {
                                success: false,
                                error: error.message || "Unable to fetch contact messages.",
                        },
                        { status: 500 }
                );
        }
}
