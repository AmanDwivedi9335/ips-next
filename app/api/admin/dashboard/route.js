import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect.js";
import Order from "@/model/Order.js";
import User from "@/model/User.js";
import Product from "@/model/Product.js";

function startOfDay(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
}

function calculateChange(currentValue, previousValue) {
        const current = Number(currentValue) || 0;
        const previous = Number(previousValue) || 0;

        if (previous === 0) {
                if (current === 0) {
                        return { trend: "neutral", value: 0 };
                }
                return { trend: "up", value: 100 };
        }

        const diff = ((current - previous) / Math.abs(previous)) * 100;

        if (!Number.isFinite(diff)) {
                return { trend: "neutral", value: 0 };
        }

        return { trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral", value: diff };
}

function buildWeeklySeries(startDate, aggregated) {
        const dailyMap = new Map();
        aggregated.forEach((item) => {
                dailyMap.set(item._id, {
                        revenue: item.revenue,
                        orders: item.orders,
                });
        });

        const series = [];
        for (let index = 0; index < 7; index += 1) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + index);
                const key = date.toISOString().slice(0, 10);
                const entry = dailyMap.get(key) || { revenue: 0, orders: 0 };

                series.push({
                        label: date.toLocaleDateString("en-US", { weekday: "short" }),
                        date: key,
                        revenue: entry.revenue,
                        orders: entry.orders,
                });
        }

        return series;
}

function buildMonthlySeries(now, aggregated) {
        const monthlyMap = new Map();
        aggregated.forEach((item) => {
                const month = String(item._id.month).padStart(2, "0");
                const key = `${item._id.year}-${month}`;
                monthlyMap.set(key, {
                        revenue: item.revenue,
                        orders: item.orders,
                });
        });

        const series = [];
        for (let offset = 11; offset >= 0; offset -= 1) {
                const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
                const entry = monthlyMap.get(key) || { revenue: 0, orders: 0 };

                series.push({
                        label: date.toLocaleDateString("en-US", { month: "short" }),
                        year: date.getFullYear(),
                        revenue: entry.revenue,
                        orders: entry.orders,
                });
        }

        return series;
}

function buildYearlySeries(now, aggregated) {
        const yearlyMap = new Map();
        aggregated.forEach((item) => {
                yearlyMap.set(item._id.year, {
                        revenue: item.revenue,
                        orders: item.orders,
                });
        });

        const series = [];
        for (let offset = 4; offset >= 0; offset -= 1) {
                const year = now.getFullYear() - offset;
                const entry = yearlyMap.get(year) || { revenue: 0, orders: 0 };
                series.push({
                        label: String(year),
                        year,
                        revenue: entry.revenue,
                        orders: entry.orders,
                });
        }

        return series;
}

export async function GET() {
        try {
                await dbConnect();

                const now = new Date();
                const startToday = startOfDay(now);
                const startYesterday = startOfDay(new Date(now.getTime() - 24 * 60 * 60 * 1000));
                const endYesterday = new Date(startToday.getTime() - 1);

                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const endOfLastMonth = new Date(startOfMonth.getTime() - 1);

                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - 6);
                startOfWeek.setHours(0, 0, 0, 0);

                const startOfTwelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
                startOfTwelveMonthsAgo.setHours(0, 0, 0, 0);

                const startOfFiveYearsAgo = new Date(now.getFullYear() - 4, 0, 1);
                startOfFiveYearsAgo.setHours(0, 0, 0, 0);

                const [
                        totalSummary,
                        thisMonthSummary,
                        lastMonthSummary,
                        ordersToday,
                        ordersYesterday,
                        totalCustomers,
                        activeCustomers,
                        newCustomersThisMonth,
                        newCustomersLastMonth,
                        activeSellers,
                        totalProducts,
                        statusBreakdown,
                        paymentBreakdown,
                        topCustomersAggregation,
                        recentOrdersRaw,
                        weeklyRevenueAggregation,
                        monthlyRevenueAggregation,
                        yearlyRevenueAggregation,
                ] = await Promise.all([
                        Order.aggregate([
                                {
                                        $group: {
                                                _id: null,
                                                totalRevenue: { $sum: "$totalAmount" },
                                                totalOrders: { $sum: 1 },
                                        },
                                },
                        ]),
                        Order.aggregate([
                                {
                                        $match: { createdAt: { $gte: startOfMonth } },
                                },
                                {
                                        $group: {
                                                _id: null,
                                                revenue: { $sum: "$totalAmount" },
                                                orders: { $sum: 1 },
                                        },
                                },
                        ]),
                        Order.aggregate([
                                {
                                        $match: {
                                                createdAt: {
                                                        $gte: startOfLastMonth,
                                                        $lte: endOfLastMonth,
                                                },
                                        },
                                },
                                {
                                        $group: {
                                                _id: null,
                                                revenue: { $sum: "$totalAmount" },
                                                orders: { $sum: 1 },
                                        },
                                },
                        ]),
                        Order.countDocuments({ createdAt: { $gte: startToday } }),
                        Order.countDocuments({ createdAt: { $gte: startYesterday, $lte: endYesterday } }),
                        User.countDocuments({ userType: "customer" }),
                        User.countDocuments({ userType: "customer", status: "active" }),
                        User.countDocuments({ userType: "customer", createdAt: { $gte: startOfMonth } }),
                        User.countDocuments({
                                userType: "customer",
                                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                        }),
                        User.countDocuments({ userType: "seller", status: "active" }),
                        Product.countDocuments(),
                        Order.aggregate([
                                {
                                        $group: {
                                                _id: "$status",
                                                count: { $sum: 1 },
                                                revenue: { $sum: "$totalAmount" },
                                        },
                                },
                        ]),
                        Order.aggregate([
                                {
                                        $group: {
                                                _id: "$paymentMethod",
                                                count: { $sum: 1 },
                                                revenue: { $sum: "$totalAmount" },
                                        },
                                },
                        ]),
                        Order.aggregate([
                                {
                                        $group: {
                                                _id: "$userId",
                                                totalSpend: { $sum: "$totalAmount" },
                                                orderCount: { $sum: 1 },
                                                lastOrder: { $max: "$createdAt" },
                                        },
                                },
                                { $sort: { totalSpend: -1 } },
                                { $limit: 5 },
                                {
                                        $lookup: {
                                                from: "users",
                                                localField: "_id",
                                                foreignField: "_id",
                                                as: "user",
                                        },
                                },
                                { $unwind: "$user" },
                                {
                                        $project: {
                                                _id: 0,
                                                userId: "$user._id",
                                                firstName: "$user.firstName",
                                                lastName: "$user.lastName",
                                                email: "$user.email",
                                                profilePic: "$user.profilePic",
                                                totalSpend: 1,
                                                orderCount: 1,
                                                lastOrder: 1,
                                        },
                                },
                        ]),
                        Order.find({})
                                .sort({ createdAt: -1 })
                                .limit(12)
                                .select(
                                        "orderNumber createdAt customerName customerEmail paymentMethod paymentStatus totalAmount status"
                                )
                                .lean(),
                        Order.aggregate([
                                {
                                        $match: { createdAt: { $gte: startOfWeek } },
                                },
                                {
                                        $group: {
                                                _id: {
                                                        $dateToString: {
                                                                format: "%Y-%m-%d",
                                                                date: "$createdAt",
                                                        },
                                                },
                                                revenue: { $sum: "$totalAmount" },
                                                orders: { $sum: 1 },
                                        },
                                },
                        ]),
                        Order.aggregate([
                                {
                                        $match: { createdAt: { $gte: startOfTwelveMonthsAgo } },
                                },
                                {
                                        $group: {
                                                _id: {
                                                        year: { $year: "$createdAt" },
                                                        month: { $month: "$createdAt" },
                                                },
                                                revenue: { $sum: "$totalAmount" },
                                                orders: { $sum: 1 },
                                        },
                                },
                        ]),
                        Order.aggregate([
                                {
                                        $match: { createdAt: { $gte: startOfFiveYearsAgo } },
                                },
                                {
                                        $group: {
                                                _id: {
                                                        year: { $year: "$createdAt" },
                                                },
                                                revenue: { $sum: "$totalAmount" },
                                                orders: { $sum: 1 },
                                        },
                                },
                        ]),
                ]);

                const summaryRow = totalSummary[0] || { totalRevenue: 0, totalOrders: 0 };
                const thisMonthRow = thisMonthSummary[0] || { revenue: 0, orders: 0 };
                const lastMonthRow = lastMonthSummary[0] || { revenue: 0, orders: 0 };

                const summary = {
                        totalRevenue: summaryRow.totalRevenue || 0,
                        totalOrders: summaryRow.totalOrders || 0,
                        ordersToday,
                        ordersYesterday,
                        ordersThisMonth: thisMonthRow.orders || 0,
                        ordersLastMonth: lastMonthRow.orders || 0,
                        revenueThisMonth: thisMonthRow.revenue || 0,
                        revenueLastMonth: lastMonthRow.revenue || 0,
                        averageOrderValue:
                                summaryRow.totalOrders > 0
                                        ? summaryRow.totalRevenue / summaryRow.totalOrders
                                        : 0,
                        averageOrderValueThisMonth:
                                thisMonthRow.orders > 0 ? thisMonthRow.revenue / thisMonthRow.orders : 0,
                        averageOrderValueLastMonth:
                                lastMonthRow.orders > 0 ? lastMonthRow.revenue / lastMonthRow.orders : 0,
                        customers: {
                                total: totalCustomers,
                                active: activeCustomers,
                                newThisMonth: newCustomersThisMonth,
                                newLastMonth: newCustomersLastMonth,
                        },
                        sellers: {
                                active: activeSellers,
                        },
                        products: {
                                total: totalProducts,
                        },
                };

                const orderStatus = statusBreakdown
                        .map((item) => ({
                                status: item._id || "unknown",
                                count: item.count || 0,
                                revenue: item.revenue || 0,
                        }))
                        .sort((a, b) => b.count - a.count);

                const paymentMethods = paymentBreakdown
                        .map((item) => ({
                                method: item._id || "unknown",
                                count: item.count || 0,
                                revenue: item.revenue || 0,
                        }))
                        .sort((a, b) => b.count - a.count);

                const topCustomers = topCustomersAggregation.map((customer) => {
                        const nameParts = [customer.firstName, customer.lastName].filter(Boolean);
                        const name = nameParts.join(" ") || customer.email || "Customer";

                        return {
                                id: customer.userId?.toString() || customer.email,
                                name,
                                email: customer.email,
                                profilePic: customer.profilePic,
                                totalSpend: customer.totalSpend,
                                orderCount: customer.orderCount,
                                lastOrder: customer.lastOrder,
                        };
                });

                const recentOrders = recentOrdersRaw.map((order) => ({
                        id: order._id?.toString(),
                        orderNumber: order.orderNumber,
                        createdAt: order.createdAt,
                        customerName: order.customerName,
                        customerEmail: order.customerEmail,
                        paymentMethod: order.paymentMethod,
                        paymentStatus: order.paymentStatus,
                        totalAmount: order.totalAmount,
                        status: order.status,
                }));

                const revenueTrends = {
                        weekly: buildWeeklySeries(startOfWeek, weeklyRevenueAggregation),
                        monthly: buildMonthlySeries(now, monthlyRevenueAggregation),
                        yearly: buildYearlySeries(now, yearlyRevenueAggregation),
                };

                const changes = {
                        revenueMonth: calculateChange(
                                summary.revenueThisMonth,
                                summary.revenueLastMonth,
                        ),
                        ordersToday: calculateChange(summary.ordersToday, summary.ordersYesterday),
                        ordersMonth: calculateChange(
                                summary.ordersThisMonth,
                                summary.ordersLastMonth,
                        ),
                        avgOrderValue: calculateChange(
                                summary.averageOrderValueThisMonth,
                                summary.averageOrderValueLastMonth,
                        ),
                        newCustomers: calculateChange(
                                summary.customers.newThisMonth,
                                summary.customers.newLastMonth,
                        ),
                };

                return NextResponse.json({
                        success: true,
                        data: {
                                summary,
                                orderStatus,
                                paymentMethods,
                                revenueTrends,
                                topCustomers,
                                recentOrders,
                                changes,
                        },
                });
        } catch (error) {
                console.error("Failed to load dashboard metrics", error);
                return NextResponse.json(
                        { success: false, message: "Failed to load dashboard metrics" },
                        { status: 500 },
                );
        }
}
