"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
        ShoppingCart,
        Package,
        TrendingUp,
        Users,
        IndianRupee,
        RefreshCw,
        ArrowUpRight,
        ArrowDownRight,
        Clock,
        CheckCircle,
        Truck,
        BadgeCheck,
        Cog,
        XCircle,
        RotateCcw,
        PieChart,
        BarChart3,
} from "lucide-react";

const currencyFormatter0 = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
});

const currencyFormatter2 = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-IN");

const STATUS_META = {
        pending: {
                label: "Pending",
                icon: Clock,
                iconColor: "text-amber-600",
                bg: "bg-amber-50",
                barColor: "rgba(251, 191, 36, 0.55)",
        },
        confirmed: {
                label: "Confirmed",
                icon: BadgeCheck,
                iconColor: "text-blue-600",
                bg: "bg-blue-50",
                barColor: "rgba(37, 99, 235, 0.50)",
        },
        processing: {
                label: "Processing",
                icon: Cog,
                iconColor: "text-purple-600",
                bg: "bg-purple-50",
                barColor: "rgba(168, 85, 247, 0.50)",
        },
        shipped: {
                label: "Shipped",
                icon: Truck,
                iconColor: "text-indigo-600",
                bg: "bg-indigo-50",
                barColor: "rgba(99, 102, 241, 0.50)",
        },
        delivered: {
                label: "Delivered",
                icon: CheckCircle,
                iconColor: "text-emerald-600",
                bg: "bg-emerald-50",
                barColor: "rgba(16, 185, 129, 0.60)",
        },
        cancelled: {
                label: "Cancelled",
                icon: XCircle,
                iconColor: "text-rose-600",
                bg: "bg-rose-50",
                barColor: "rgba(244, 63, 94, 0.45)",
        },
        returned: {
                label: "Returned",
                icon: RotateCcw,
                iconColor: "text-slate-600",
                bg: "bg-slate-100",
                barColor: "rgba(100, 116, 139, 0.45)",
        },
};

const DEFAULT_STATUS_META = {
        label: "Unknown",
        icon: Clock,
        iconColor: "text-slate-600",
        bg: "bg-slate-100",
        barColor: "rgba(148, 163, 184, 0.4)",
};

const STATUS_ORDER = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "unknown",
];

const ORDER_STATUS_OPTIONS = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
];

const PAYMENT_METHOD_LABELS = {
        cod: "Cash on Delivery",
        razorpay: "Razorpay",
        credit_card: "Credit Card",
        debit_card: "Debit Card",
        net_banking: "Net Banking",
        upi: "UPI",
        wallet: "Wallet",
        cash: "Cash",
};

const PAYMENT_COLORS = [
        "linear-gradient(90deg, #2563eb, #3b82f6)",
        "linear-gradient(90deg, #059669, #34d399)",
        "linear-gradient(90deg, #7c3aed, #a855f7)",
        "linear-gradient(90deg, #ea580c, #f97316)",
        "linear-gradient(90deg, #dc2626, #f87171)",
];

const PAYMENT_STATUS_META = {
        paid: "bg-emerald-100 text-emerald-700",
        pending: "bg-amber-100 text-amber-700",
        failed: "bg-rose-100 text-rose-700",
        refunded: "bg-slate-100 text-slate-700",
};

const CHART_DESCRIPTION = {
        weekly: "Revenue and order trend for the last 7 days",
        monthly: "Revenue and order trend for the last 12 months",
        yearly: "Revenue and order trend for the last 5 years",
};

function formatCurrency(value, precision = 0) {
        const numeric = Number(value) || 0;
        return precision === 0
                ? currencyFormatter0.format(numeric)
                : currencyFormatter2.format(numeric);
}

function formatNumber(value) {
        return numberFormatter.format(Number(value) || 0);
}

function getInitials(name = "") {
        if (!name) return "?";
        const parts = name.trim().split(/\s+/);
        const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || "");
        return initials.join("") || "?";
}

function buildChange(currentValue, previousValue, label) {
        const current = Number(currentValue) || 0;
        const previous = Number(previousValue) || 0;

        if (previous === 0) {
                if (current === 0) {
                        return { trend: "neutral", value: "0%", label: label || "vs previous period" };
                }
                return { trend: "up", value: "New", label: label || "vs previous period" };
        }

        const diff = ((current - previous) / Math.abs(previous)) * 100;

        if (!Number.isFinite(diff)) {
                return { trend: "neutral", value: "0%", label: label || "vs previous period" };
        }

        const trend = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";
        const display = `${Math.abs(diff).toFixed(1)}%`;

        return {
                trend,
                value: display,
                label: label || "vs previous period",
        };
}

function formatDateTime(value) {
        if (!value) return "--";
        try {
                return new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                }).format(new Date(value));
        } catch (error) {
                return "--";
        }
}

function formatDate(value) {
        if (!value) return "--";
        try {
                return new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                }).format(new Date(value));
        } catch (error) {
                return "--";
        }
}

function DashboardSkeleton() {
        return (
                <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                                <Skeleton className="h-7 w-40" />
                                <Skeleton className="h-4 w-64" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                        <Card key={index}>
                                                <CardContent className="p-6 space-y-4">
                                                        <Skeleton className="h-4 w-24" />
                                                        <Skeleton className="h-7 w-32" />
                                                        <Skeleton className="h-4 w-20" />
                                                </CardContent>
                                        </Card>
                                ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 4 }).map((_, index) => (
                                        <Card key={index}>
                                                <CardContent className="p-6 space-y-4">
                                                        <Skeleton className="h-4 w-24" />
                                                        <Skeleton className="h-8 w-16" />
                                                        <Skeleton className="h-2 w-full" />
                                                </CardContent>
                                        </Card>
                                ))}
                        </div>
                        <Card>
                                <CardHeader>
                                        <Skeleton className="h-5 w-40" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <Skeleton className="h-64 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                </CardContent>
                        </Card>
                        <Card>
                                <CardHeader>
                                        <Skeleton className="h-5 w-32" />
                                </CardHeader>
                                <CardContent>
                                        <Skeleton className="h-48 w-full" />
                                </CardContent>
                        </Card>
                </div>
        );
}

export default function AdminDashboard() {
        const [dashboardData, setDashboardData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [salesPeriod, setSalesPeriod] = useState("weekly");
        const [isRefreshing, setIsRefreshing] = useState(false);
        const [updatingOrderId, setUpdatingOrderId] = useState(null);
        const [lastUpdated, setLastUpdated] = useState(null);

        const fetchDashboard = useCallback(async ({ silent = false } = {}) => {
                if (silent) {
                        setIsRefreshing(true);
                } else {
                        setLoading(true);
                        setError(null);
                }

                try {
                        const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
                        const result = await response.json();

                        if (!response.ok || !result.success) {
                                throw new Error(result.message || "Failed to load dashboard data");
                        }

                        setDashboardData(result.data);
                        setLastUpdated(new Date());
                } catch (fetchError) {
                        console.error(fetchError);
                        if (silent) {
                                toast.error(fetchError.message || "Failed to refresh dashboard");
                        } else {
                                setError(fetchError.message || "Failed to load dashboard data");
                        }
                } finally {
                        if (silent) {
                                setIsRefreshing(false);
                        } else {
                                setLoading(false);
                        }
                }
        }, []);

        useEffect(() => {
                fetchDashboard();
        }, [fetchDashboard]);

        const summaryCards = useMemo(() => {
                if (!dashboardData?.summary) return [];
                const { summary } = dashboardData;

                return [
                        {
                                key: "revenue",
                                title: "Revenue (This Month)",
                                value: summary.revenueThisMonth,
                                previous: summary.revenueLastMonth,
                                format: "currency",
                                precision: 0,
                                icon: IndianRupee,
                                iconColor: "text-blue-600",
                                iconBg: "bg-blue-100",
                                changeLabel: "vs last month",
                        },
                        {
                                key: "orders-today",
                                title: "Orders Today",
                                value: summary.ordersToday,
                                previous: summary.ordersYesterday,
                                format: "number",
                                icon: ShoppingCart,
                                iconColor: "text-emerald-600",
                                iconBg: "bg-emerald-100",
                                changeLabel: "vs yesterday",
                        },
                        {
                                key: "orders-month",
                                title: "Orders (This Month)",
                                value: summary.ordersThisMonth,
                                previous: summary.ordersLastMonth,
                                format: "number",
                                icon: Package,
                                iconColor: "text-purple-600",
                                iconBg: "bg-purple-100",
                                changeLabel: "vs last month",
                        },
                        {
                                key: "aov",
                                title: "Average Order Value",
                                value: summary.averageOrderValueThisMonth,
                                previous: summary.averageOrderValueLastMonth,
                                format: "currency",
                                precision: 2,
                                icon: TrendingUp,
                                iconColor: "text-orange-600",
                                iconBg: "bg-orange-100",
                                changeLabel: "vs last month",
                        },
                        {
                                key: "customers",
                                title: "New Customers",
                                value: summary.customers.newThisMonth,
                                previous: summary.customers.newLastMonth,
                                format: "number",
                                icon: Users,
                                iconColor: "text-sky-600",
                                iconBg: "bg-sky-100",
                                changeLabel: "vs last month",
                        },
                ].map((card) => ({
                        ...card,
                        displayValue:
                                card.format === "currency"
                                        ? formatCurrency(card.value, card.precision)
                                        : formatNumber(card.value),
                        change: buildChange(card.value, card.previous, card.changeLabel),
                }));
        }, [dashboardData]);

        const orderStatusCards = useMemo(() => {
                if (!dashboardData?.orderStatus) return [];
                const total = dashboardData.orderStatus.reduce(
                        (accumulator, item) => accumulator + (item.count || 0),
                        0,
                );

                return dashboardData.orderStatus
                        .slice()
                        .sort((a, b) =>
                                STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
                        )
                        .map((item) => {
                                const meta = STATUS_META[item.status] || DEFAULT_STATUS_META;
                                const percentage = total > 0 ? (item.count / total) * 100 : 0;

                                return {
                                        status: item.status,
                                        label: meta.label,
                                        count: item.count,
                                        revenue: item.revenue,
                                        percentage,
                                        icon: meta.icon,
                                        iconColor: meta.iconColor,
                                        bg: meta.bg,
                                        barColor: meta.barColor,
                                };
                        });
        }, [dashboardData]);

        const chartData = useMemo(
                () => dashboardData?.revenueTrends?.[salesPeriod] || [],
                [dashboardData, salesPeriod],
        );

        const chartStats = useMemo(() => {
                const totalRevenue = chartData.reduce(
                        (accumulator, point) => accumulator + (point.revenue || 0),
                        0,
                );
                const totalOrders = chartData.reduce(
                        (accumulator, point) => accumulator + (point.orders || 0),
                        0,
                );
                const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

                return {
                        totalRevenue,
                        totalOrders,
                        averageOrderValue,
                };
        }, [chartData]);

        const paymentBreakdown = useMemo(() => {
                if (!dashboardData?.paymentMethods) return [];
                const totalPayments = dashboardData.paymentMethods.reduce(
                        (accumulator, item) => accumulator + (item.count || 0),
                        0,
                );

                return dashboardData.paymentMethods.map((item, index) => ({
                        method: item.method,
                        label: PAYMENT_METHOD_LABELS[item.method] || item.method,
                        count: item.count,
                        revenue: item.revenue,
                        percentage: totalPayments > 0 ? (item.count / totalPayments) * 100 : 0,
                        color: PAYMENT_COLORS[index % PAYMENT_COLORS.length],
                }));
        }, [dashboardData]);

        const maxRevenue = useMemo(
                () => Math.max(...chartData.map((point) => point.revenue || 0), 1),
                [chartData],
        );
        const maxOrders = useMemo(
                () => Math.max(...chartData.map((point) => point.orders || 0), 1),
                [chartData],
        );

        const ordersLinePath = useMemo(() => {
                if (!chartData.length || maxOrders === 0) return "";

                return chartData
                        .map((point, index) => {
                                const x =
                                        chartData.length > 1
                                                ? (index / (chartData.length - 1)) * 100
                                                : 50;
                                const y = 100 - (point.orders / maxOrders) * 100;
                                const command = index === 0 ? "M" : "L";
                                return `${command}${x},${y}`;
                        })
                        .join(" ");
        }, [chartData, maxOrders]);

        const handleRefresh = useCallback(() => {
                fetchDashboard({ silent: true });
        }, [fetchDashboard]);

        const handleOrderStatusChange = useCallback(
                async (orderId, newStatus) => {
                        if (!orderId) return;

                        try {
                                setUpdatingOrderId(orderId);
                                const response = await fetch(`/api/admin/orders/${orderId}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ status: newStatus }),
                                });

                                const result = await response.json();

                                if (!response.ok || !result.success) {
                                        throw new Error(result.message || "Failed to update order status");
                                }

                                toast.success("Order status updated");
                                fetchDashboard({ silent: true });
                        } catch (updateError) {
                                console.error(updateError);
                                toast.error(updateError.message || "Failed to update order status");
                        } finally {
                                setUpdatingOrderId(null);
                        }
                },
                [fetchDashboard],
        );

        if (loading && !dashboardData) {
                return <DashboardSkeleton />;
        }

        if (error && !dashboardData) {
                return (
                        <div className="space-y-6">
                                <Card>
                                        <CardContent className="p-8 text-center space-y-4">
                                                <p className="text-lg font-semibold text-rose-600">
                                                        {error}
                                                </p>
                                                <Button onClick={() => fetchDashboard()}>Try again</Button>
                                        </CardContent>
                                </Card>
                        </div>
                );
        }

        return (
                <div className="space-y-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-1"
                                >
                                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                                        <p className="text-sm text-muted-foreground">
                                                Stay on top of orders, revenue, and customer behaviour in real-time.
                                        </p>
                                        {lastUpdated && (
                                                <p className="text-xs text-muted-foreground">
                                                        Last updated {lastUpdated.toLocaleTimeString()}
                                                </p>
                                        )}
                                </motion.div>
                                <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="flex items-center gap-3"
                                >
                                        {dashboardData?.summary && (
                                                <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
                                                        <div>
                                                                <span className="font-semibold text-gray-900">
                                                                        {formatNumber(dashboardData.summary.totalOrders)}
                                                                </span>{" "}
                                                                total orders
                                                        </div>
                                                        <div className="h-4 w-px bg-gray-200" />
                                                        <div>
                                                                <span className="font-semibold text-gray-900">
                                                                        {formatCurrency(
                                                                                dashboardData.summary.totalRevenue,
                                                                                0,
                                                                        )}
                                                                </span>{" "}
                                                                lifetime revenue
                                                        </div>
                                                </div>
                                        )}
                                        <Button
                                                variant="outline"
                                                onClick={handleRefresh}
                                                disabled={isRefreshing}
                                                className="flex items-center gap-2"
                                        >
                                                <RefreshCw
                                                        className={`h-4 w-4 ${
                                                                isRefreshing ? "animate-spin text-blue-600" : ""
                                                        }`}
                                                />
                                                Refresh
                                        </Button>
                                </motion.div>
                        </div>

                        {error && (
                                <Card className="border-rose-200 bg-rose-50/40">
                                        <CardContent className="p-4 text-sm text-rose-600">
                                                {error}
                                        </CardContent>
                                </Card>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                                {summaryCards.map((card, index) => {
                                        const Icon = card.icon;
                                        const trendIcon =
                                                card.change.trend === "up"
                                                        ? ArrowUpRight
                                                        : card.change.trend === "down"
                                                                ? ArrowDownRight
                                                                : Clock;

                                        return (
                                                <motion.div
                                                        key={card.key}
                                                        initial={{ opacity: 0, y: 12 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                        <Card className="h-full">
                                                                <CardContent className="p-6 space-y-4">
                                                                        <div className="flex items-start justify-between">
                                                                                <div className="space-y-1">
                                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                                                {card.title}
                                                                                        </p>
                                                                                        <p className="text-2xl font-bold tracking-tight">
                                                                                                {card.displayValue}
                                                                                        </p>
                                                                                </div>
                                                                                <div
                                                                                        className={`p-3 rounded-lg ${card.iconBg} flex items-center justify-center`}
                                                                                >
                                                                                        <Icon className={`h-6 w-6 ${card.iconColor}`} />
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex items-center text-xs font-medium">
                                                                                <trendIcon
                                                                                        className={`mr-2 h-4 w-4 ${
                                                                                                card.change.trend === "up"
                                                                                                        ? "text-emerald-600"
                                                                                                        : card.change.trend === "down"
                                                                                                                ? "text-rose-500"
                                                                                                                : "text-slate-400"
                                                                                        }`}
                                                                                />
                                                                                <span
                                                                                        className={`${
                                                                                                card.change.trend === "up"
                                                                                                        ? "text-emerald-600"
                                                                                                        : card.change.trend === "down"
                                                                                                                ? "text-rose-500"
                                                                                                                : "text-slate-500"
                                                                                        }`}
                                                                                >
                                                                                        {card.change.value}
                                                                                </span>
                                                                                <span className="ml-2 text-muted-foreground">
                                                                                        {card.change.label}
                                                                                </span>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                </motion.div>
                                        );
                                })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                {orderStatusCards.map((statusCard, index) => {
                                        const Icon = statusCard.icon || Clock;

                                        return (
                                                <motion.div
                                                        key={statusCard.status}
                                                        initial={{ opacity: 0, y: 12 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                                                >
                                                        <Card>
                                                                <CardContent className="p-6 space-y-4">
                                                                        <div className="flex items-center justify-between">
                                                                                <div>
                                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                                                {statusCard.label}
                                                                                        </p>
                                                                                        <p className="text-3xl font-bold">
                                                                                                {formatNumber(statusCard.count)}
                                                                                        </p>
                                                                                </div>
                                                                                <div
                                                                                        className={`p-3 rounded-lg ${statusCard.bg} flex items-center justify-center`}
                                                                                >
                                                                                        <Icon className={`h-6 w-6 ${statusCard.iconColor}`} />
                                                                                </div>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                                        <span>{statusCard.percentage.toFixed(1)}%</span>
                                                                                        <span>{formatCurrency(statusCard.revenue)}</span>
                                                                                </div>
                                                                                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                                                        <div
                                                                                                className="h-full rounded-full"
                                                                                                style={{
                                                                                                        width: `${statusCard.percentage}%`,
                                                                                                        background: statusCard.barColor,
                                                                                                }}
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                </CardContent>
                                                        </Card>
                                                </motion.div>
                                        );
                                })}
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                <motion.div
                                        className="xl:col-span-2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.25 }}
                                >
                                        <Card>
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                        <div>
                                                                <CardTitle>Revenue & Orders</CardTitle>
                                                                <p className="text-sm text-muted-foreground">
                                                                        {CHART_DESCRIPTION[salesPeriod]}
                                                                </p>
                                                        </div>
                                                        <Select
                                                                value={salesPeriod}
                                                                onValueChange={setSalesPeriod}
                                                        >
                                                                <SelectTrigger className="w-32">
                                                                        <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        <SelectItem value="weekly">Weekly</SelectItem>
                                                                        <SelectItem value="monthly">Monthly</SelectItem>
                                                                        <SelectItem value="yearly">Yearly</SelectItem>
                                                                </SelectContent>
                                                        </Select>
                                                </CardHeader>
                                                <CardContent className="space-y-6">
                                                        <div className="relative h-64">
                                                                <div className="absolute inset-0 flex items-end space-x-2">
                                                                        {chartData.map((point, index) => (
                                                                                <div
                                                                                        key={`${point.label}-${index}`}
                                                                                        className="flex-1 flex flex-col justify-end"
                                                                                >
                                                                                        <div
                                                                                                className="w-full rounded-t-md bg-gradient-to-t from-blue-500/80 to-blue-300/60"
                                                                                                style={{
                                                                                                        height: `${
                                                                                                                maxRevenue === 0
                                                                                                                        ? 0
                                                                                                                        : (point.revenue /
                                                                                                                                  maxRevenue) *
                                                                                                                          100
                                                                                                        }%`,
                                                                                                }}
                                                                                        />
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                                <svg
                                                                        viewBox="0 0 100 100"
                                                                        className="absolute inset-0 h-full w-full"
                                                                        preserveAspectRatio="none"
                                                                >
                                                                        {ordersLinePath && (
                                                                                <path
                                                                                        d={ordersLinePath}
                                                                                        fill="none"
                                                                                        stroke="rgba(34,197,94,0.9)"
                                                                                        strokeWidth={1.5}
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                />
                                                                        )}
                                                                        {chartData.map((point, index) => {
                                                                                if (!maxOrders) return null;
                                                                                const x =
                                                                                        chartData.length > 1
                                                                                                ? (index / (chartData.length - 1)) * 100
                                                                                                : 50;
                                                                                const y = 100 - (point.orders / maxOrders) * 100;
                                                                                return (
                                                                                        <circle
                                                                                                key={`${point.label}-dot-${index}`}
                                                                                                cx={x}
                                                                                                cy={y}
                                                                                                r={1.5}
                                                                                                fill="rgb(34,197,94)"
                                                                                                stroke="white"
                                                                                                strokeWidth={0.6}
                                                                                        />
                                                                                );
                                                                        })}
                                                                </svg>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-muted-foreground">
                                                                {chartData.map((point) => (
                                                                        <span key={point.label} className="flex-1 text-center">
                                                                                {point.label}
                                                                        </span>
                                                                ))}
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                                <div className="rounded-lg border border-dashed border-slate-200 p-4">
                                                                        <p className="text-muted-foreground">Total Revenue</p>
                                                                        <p className="text-lg font-semibold">
                                                                                {formatCurrency(chartStats.totalRevenue)}
                                                                        </p>
                                                                </div>
                                                                <div className="rounded-lg border border-dashed border-slate-200 p-4">
                                                                        <p className="text-muted-foreground">Orders</p>
                                                                        <p className="text-lg font-semibold">
                                                                                {formatNumber(chartStats.totalOrders)}
                                                                        </p>
                                                                </div>
                                                                <div className="rounded-lg border border-dashed border-slate-200 p-4">
                                                                        <p className="text-muted-foreground">Average Order Value</p>
                                                                        <p className="text-lg font-semibold">
                                                                                {formatCurrency(chartStats.averageOrderValue, 2)}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <div className="flex items-center gap-2">
                                                                        <div className="h-2 w-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-300" />
                                                                        <span>Revenue</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                        <div className="h-2 w-6 rounded-full bg-emerald-500" />
                                                                        <span>Orders</span>
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                </motion.div>
                                <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                        <Card className="h-full">
                                                <CardHeader>
                                                        <div className="flex items-center justify-between">
                                                                <CardTitle>Top Customers</CardTitle>
                                                                <Badge variant="outline">
                                                                        Top {dashboardData?.topCustomers?.length || 0}
                                                                </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                                Highest lifetime spenders and their latest activity.
                                                        </p>
                                                </CardHeader>
                                                <CardContent>
                                                        {dashboardData?.topCustomers?.length ? (
                                                                <div className="space-y-4">
                                                                        {dashboardData.topCustomers.map((customer) => (
                                                                                <div
                                                                                        key={customer.id || customer.email}
                                                                                        className="flex items-center justify-between gap-4"
                                                                                >
                                                                                        <div className="flex items-center gap-3">
                                                                                                <Avatar className="h-10 w-10">
                                                                                                        <AvatarImage
                                                                                                                src={customer.profilePic || undefined}
                                                                                                                alt={customer.name}
                                                                                                        />
                                                                                                        <AvatarFallback>
                                                                                                                {getInitials(customer.name)}
                                                                                                        </AvatarFallback>
                                                                                                </Avatar>
                                                                                                <div>
                                                                                                        <p className="text-sm font-medium">
                                                                                                                {customer.name}
                                                                                                        </p>
                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                {customer.email}
                                                                                                        </p>
                                                                                                        <p className="text-xs text-muted-foreground">
                                                                                                                Last order {formatDate(customer.lastOrder)}
                                                                                                        </p>
                                                                                                </div>
                                                                                        </div>
                                                                                        <div className="text-right">
                                                                                                <p className="text-sm font-semibold">
                                                                                                        {formatCurrency(customer.totalSpend)}
                                                                                                </p>
                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                        {formatNumber(customer.orderCount)} orders
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        ) : (
                                                                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-muted-foreground">
                                                                        Not enough customer activity yet.
                                                                </div>
                                                        )}
                                                </CardContent>
                                        </Card>
                                </motion.div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.35 }}
                                >
                                        <Card className="h-full">
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                        <div>
                                                                <CardTitle className="flex items-center gap-2">
                                                                        <PieChart className="h-5 w-5" />
                                                                        Payment Mix
                                                                </CardTitle>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Distribution of orders across payment methods.
                                                                </p>
                                                        </div>
                                                        <Badge variant="outline">
                                                                {formatNumber(
                                                                        paymentBreakdown.reduce(
                                                                                (accumulator, method) =>
                                                                                        accumulator + method.count,
                                                                                0,
                                                                        ),
                                                                )}{" "}
                                                                orders
                                                        </Badge>
                                                </CardHeader>
                                                <CardContent>
                                                        {paymentBreakdown.length ? (
                                                                <div className="space-y-5">
                                                                        {paymentBreakdown.map((method) => (
                                                                                <div key={method.method} className="space-y-2">
                                                                                        <div className="flex items-center justify-between text-sm font-medium">
                                                                                                <span>{method.label}</span>
                                                                                                <span>{method.percentage.toFixed(1)}%</span>
                                                                                        </div>
                                                                                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                                                                <div
                                                                                                        className="h-full rounded-full"
                                                                                                        style={{
                                                                                                                width: `${method.percentage}%`,
                                                                                                                background: method.color,
                                                                                                        }}
                                                                                                />
                                                                                        </div>
                                                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                                                <span>{formatNumber(method.count)} orders</span>
                                                                                                <span>{formatCurrency(method.revenue)}</span>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        ) : (
                                                                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-muted-foreground">
                                                                        Not enough payment data yet.
                                                                </div>
                                                        )}
                                                </CardContent>
                                        </Card>
                                </motion.div>
                                <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                >
                                        <Card className="h-full">
                                                <CardHeader className="flex flex-row items-center justify-between">
                                                        <div>
                                                                <CardTitle className="flex items-center gap-2">
                                                                        <BarChart3 className="h-5 w-5" />
                                                                        Fulfilment Status Breakdown
                                                                </CardTitle>
                                                                <p className="text-sm text-muted-foreground">
                                                                        Share of orders across fulfilment stages.
                                                                </p>
                                                        </div>
                                                        <Badge variant="outline">
                                                                {formatNumber(
                                                                        orderStatusCards.reduce(
                                                                                (accumulator, status) =>
                                                                                        accumulator + status.count,
                                                                                0,
                                                                        ),
                                                                )}{" "}
                                                                orders
                                                        </Badge>
                                                </CardHeader>
                                                <CardContent>
                                                        {orderStatusCards.length ? (
                                                                <div className="space-y-4">
                                                                        {orderStatusCards.map((status) => (
                                                                                <div key={status.status} className="space-y-2">
                                                                                        <div className="flex items-center justify-between text-sm font-medium">
                                                                                                <div className="flex items-center gap-2">
                                                                                                        <status.icon
                                                                                                                className={`h-4 w-4 ${status.iconColor}`}
                                                                                                        />
                                                                                                        <span>{status.label}</span>
                                                                                                </div>
                                                                                                <span>{status.percentage.toFixed(1)}%</span>
                                                                                        </div>
                                                                                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                                                                                <div
                                                                                                        className="h-full rounded-full"
                                                                                                        style={{
                                                                                                                width: `${status.percentage}%`,
                                                                                                                background: status.barColor,
                                                                                                        }}
                                                                                                />
                                                                                        </div>
                                                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                                                <span>{formatNumber(status.count)} orders</span>
                                                                                                <span>{formatCurrency(status.revenue)}</span>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        ) : (
                                                                <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-muted-foreground">
                                                                        No fulfilment data yet.
                                                                </div>
                                                        )}
                                                </CardContent>
                                        </Card>
                                </motion.div>
                        </div>

                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.45 }}
                        >
                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                                <div>
                                                        <CardTitle>Recent Orders</CardTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                                Latest orders and their fulfilment progress.
                                                        </p>
                                                </div>
                                                <Button asChild variant="outline" size="sm">
                                                        <Link href="/admin/orders">View all orders</Link>
                                                </Button>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="overflow-x-auto">
                                                        <table className="w-full min-w-[900px] text-sm">
                                                                <thead>
                                                                        <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                                                                                <th className="py-3 px-4 font-medium">Order #</th>
                                                                                <th className="py-3 px-4 font-medium">Date</th>
                                                                                <th className="py-3 px-4 font-medium">Customer</th>
                                                                                <th className="py-3 px-4 font-medium">Payment Method</th>
                                                                                <th className="py-3 px-4 font-medium">Payment Status</th>
                                                                                <th className="py-3 px-4 font-medium">Total</th>
                                                                                <th className="py-3 px-4 font-medium">Fulfilment</th>
                                                                                <th className="py-3 px-4 font-medium">Action</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        {dashboardData?.recentOrders?.length ? (
                                                                                dashboardData.recentOrders.map((order) => {
                                                                                        const statusMeta =
                                                                                                STATUS_META[order.status] || DEFAULT_STATUS_META;
                                                                                        const paymentStatusClass =
                                                                                                PAYMENT_STATUS_META[order.paymentStatus] ||
                                                                                                "bg-slate-100 text-slate-700";
                                                                                        const paymentMethodLabel =
                                                                                                PAYMENT_METHOD_LABELS[order.paymentMethod] ||
                                                                                                order.paymentMethod ||
                                                                                                "--";

                                                                                        return (
                                                                                                <tr
                                                                                                        key={order.id || order.orderNumber}
                                                                                                        className="border-b last:border-none"
                                                                                                >
                                                                                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                                                                                                {order.orderNumber || "--"}
                                                                                                        </td>
                                                                                                        <td className="py-3 px-4 text-muted-foreground">
                                                                                                                {formatDateTime(order.createdAt)}
                                                                                                        </td>
                                                                                                        <td className="py-3 px-4">
                                                                                                                <div className="flex flex-col">
                                                                                                                        <span className="font-medium text-gray-900">
                                                                                                                                {order.customerName || "--"}
                                                                                                                        </span>
                                                                                                                        <span className="text-xs text-muted-foreground">
                                                                                                                                {order.customerEmail || "--"}
                                                                                                                        </span>
                                                                                                                </div>
                                                                                                        </td>
                                                                                                        <td className="py-3 px-4 text-muted-foreground">
                                                                                                                {paymentMethodLabel}
                                                                                                        </td>
                                                                                                        <td className="py-3 px-4">
                                                                                                                <Badge className={`${paymentStatusClass} font-medium capitalize`}>
                                                                                                                        {order.paymentStatus || "unknown"}
                                                                                                                </Badge>
                                                                                                        </td>
                                                                                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                                                                                                {formatCurrency(order.totalAmount)}
                                                                                                        </td>
                                                                                                        <td className="py-3 px-4">
                                                                                                                <div className="flex flex-col gap-2">
                                                                                                                        <Badge
                                                                                                                                className={`${statusMeta.bg} ${statusMeta.iconColor} font-medium capitalize`}
                                                                                                                        >
                                                                                                                                {statusMeta.label}
                                                                                                                        </Badge>
                                                                                                                        <Select
                                                                                                                                value={order.status || "pending"}
                                                                                                                                onValueChange={(value) =>
                                                                                                                                        handleOrderStatusChange(
                                                                                                                                                order.id,
                                                                                                                                                value,
                                                                                                                                        )
                                                                                                                                }
                                                                                                                                disabled={updatingOrderId === order.id}
                                                                                                                        >
                                                                                                                                <SelectTrigger className="w-40">
                                                                                                                                        <SelectValue />
                                                                                                                                </SelectTrigger>
                                                                                                                                <SelectContent>
                                                                                                                                        {ORDER_STATUS_OPTIONS.map((status) => (
                                                                                                                                                <SelectItem key={status} value={status}>
                                                                                                                                                        {STATUS_META[status]?.label ||
                                                                                                                                                                status}
                                                                                                                                                </SelectItem>
                                                                                                                                        ))}
                                                                                                                                </SelectContent>
                                                                                                                        </Select>
                                                                                                                </div>
                                                                                                        </td>
                                                                                                        <td className="py-3 px-4">
                                                                                                                <Button asChild variant="outline" size="sm">
                                                                                                                        <Link href="/admin/orders">Manage</Link>
                                                                                                                </Button>
                                                                                                        </td>
                                                                                                </tr>
                                                                                        );
                                                                                })
                                                                        ) : (
                                                                                <tr>
                                                                                        <td
                                                                                                className="py-8 px-4 text-center text-sm text-muted-foreground"
                                                                                                colSpan={8}
                                                                                        >
                                                                                                No orders yet.
                                                                                        </td>
                                                                                </tr>
                                                                        )}
                                                                </tbody>
                                                        </table>
                                                </div>
                                        </CardContent>
                                </Card>
                        </motion.div>
                </div>
        );
}

