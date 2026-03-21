import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";
import ContactMessage from "@/model/ContactMessage";

export const dynamic = "force-dynamic";

function formatCurrency(amount) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(Number(amount) || 0);
}

function buildOrderNotification(order) {
	return {
		id: `order-${order._id}`,
		type: "order",
		title: `New order ${order.orderNumber || ""}`.trim(),
		description: `${order.customerName || "Customer"} placed an order for ${formatCurrency(
			order.totalAmount
		)}`,
		href: "/admin/orders",
		createdAt: order.createdAt,
		meta: order.customerEmail || order.paymentMethod || "Pending review",
	};
}

function buildLogoNotification(order) {
	return {
		id: `logo-${order._id}`,
		type: "logo",
		title: `Logo submitted for ${order.orderNumber || "order"}`,
		description: `${order.customerName || "Customer"} uploaded artwork for review.`,
		href: "/admin/orders",
		createdAt: order.logoSubmittedAt || order.updatedAt || order.createdAt,
		meta: order.customerEmail || "Artwork ready",
	};
}

function buildContactNotification(message) {
	return {
		id: `contact-${message._id}`,
		type: "contact",
		title: message.subject || "New contact request",
		description: `${message.fullName || "Customer"} sent a new contact request.`,
		href: "/admin/contact",
		createdAt: message.createdAt,
		meta: message.email || message.category || "Needs response",
	};
}

export async function GET() {
	try {
		await dbConnect();

		const [pendingOrders, submittedLogos, newMessages] = await Promise.all([
			Order.find({ status: "pending" })
				.sort({ createdAt: -1 })
				.limit(5)
				.select("orderNumber customerName customerEmail totalAmount paymentMethod createdAt")
				.lean(),
			Order.find({ logoStatus: "submitted" })
				.sort({ logoSubmittedAt: -1, updatedAt: -1 })
				.limit(5)
				.select("orderNumber customerName customerEmail logoSubmittedAt updatedAt createdAt")
				.lean(),
			ContactMessage.find({ status: "new" })
				.sort({ createdAt: -1 })
				.limit(5)
				.select("fullName email subject category createdAt")
				.lean(),
		]);

		const notifications = [
			...pendingOrders.map(buildOrderNotification),
			...submittedLogos.map(buildLogoNotification),
			...newMessages.map(buildContactNotification),
		]
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 8);

		return NextResponse.json({
			success: true,
			data: {
				notifications,
				summary: {
					pendingOrders: pendingOrders.length,
					submittedLogos: submittedLogos.length,
					newMessages: newMessages.length,
					total: notifications.length,
				},
			},
		});
	} catch (error) {
		console.error("Error fetching admin notifications:", error);
		return NextResponse.json(
			{ success: false, message: "Failed to fetch notifications" },
			{ status: 500 }
		);
	}
}
