"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import { Loader2, Eye, RefreshCw } from "lucide-react";
import { useLoggedInUser } from "@/store/authStore";
import { formatCurrency } from "@/lib/pricing";
import { getOrderItemOptionEntries } from "@/lib/orderOptions.js";

const ORDER_STATUS_STYLES = {
        pending: "bg-amber-100 text-amber-800",
        confirmed: "bg-blue-100 text-blue-800",
        processing: "bg-indigo-100 text-indigo-800",
        shipped: "bg-sky-100 text-sky-800",
        delivered: "bg-emerald-100 text-emerald-800",
        cancelled: "bg-rose-100 text-rose-800",
        returned: "bg-gray-200 text-gray-800",
};

const PAYMENT_STATUS_STYLES = {
        paid: "bg-emerald-100 text-emerald-800",
        pending: "bg-amber-100 text-amber-800",
        failed: "bg-rose-100 text-rose-800",
        refunded: "bg-blue-100 text-blue-800",
};

const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
        },
};

const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
};

const formatStatusLabel = (status) => {
        if (!status) return "Unknown";
        return status
                .toString()
                .split(/[\s_-]+/)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
};

const formatDate = (date) => {
        if (!date) return "-";
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return "-";
        return parsed.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
        });
};

const formatAddress = (address) => {
        if (!address) return "No delivery address on file.";
        if (address.fullAddress) return address.fullAddress;

        const parts = [
                address.name,
                address.street,
                address.city,
                address.state,
                address.zipCode,
                address.country,
        ].filter(Boolean);

        return parts.length ? parts.join(", ") : "No delivery address on file.";
};

const DEFAULT_PAGE_SIZE = 10;

export function OrderHistory() {
        const user = useLoggedInUser();
        const [orders, setOrders] = useState([]);
        const [pagination, setPagination] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [isLoadingMore, setIsLoadingMore] = useState(false);
        const [error, setError] = useState(null);
        const [selectedOrder, setSelectedOrder] = useState(null);

        const hasMore = pagination?.hasNextPage;

        const fetchOrders = useCallback(
                async (page = 1, append = false) => {
                        if (!user?._id) return;

                        append ? setIsLoadingMore(true) : setIsLoading(true);
                        setError(null);

                        try {
                                const params = new URLSearchParams({
                                        userId: user._id,
                                        page: page.toString(),
                                        limit: DEFAULT_PAGE_SIZE.toString(),
                                });

                                const response = await fetch(`/api/orders?${params.toString()}`);

                                if (!response.ok) {
                                        throw new Error("Unable to load your orders right now. Please try again.");
                                }

                                const data = await response.json();
                                const fetchedOrders = data?.orders ?? [];

                                if (append) {
                                        setOrders((prev) => {
                                                const existingIds = new Set(prev.map((item) => item?._id));
                                                const merged = fetchedOrders.filter((item) => !existingIds.has(item?._id));
                                                return [...prev, ...merged];
                                        });
                                } else {
                                        setOrders(fetchedOrders);
                                }

                                setPagination(data?.pagination ?? null);
                        } catch (err) {
                                console.error("Failed to fetch orders", err);
                                setError(err.message || "Failed to fetch orders. Please try again later.");
                                if (!append) {
                                        setOrders([]);
                                        setPagination(null);
                                }
                        } finally {
                                append ? setIsLoadingMore(false) : setIsLoading(false);
                        }
                },
                [user?._id]
        );

        useEffect(() => {
                if (!user?._id) {
                        setOrders([]);
                        setPagination(null);
                        return;
                }

                fetchOrders();
        }, [user?._id, fetchOrders]);

        const totalQuantity = useCallback((order) => {
                if (!order?.products?.length) return 0;

                return order.products.reduce((sum, item) => {
                        const quantity = Number(item?.quantity);
                        return sum + (Number.isNaN(quantity) ? 0 : quantity);
                }, 0);
        }, []);

        const totalOrdersPlaced = pagination?.totalOrders ?? orders.length ?? 0;

        const orderSummaryText = useMemo(() => {
                if (!user?._id) {
                        return "Sign in to view your recent orders and track deliveries.";
                }

                if (isLoading && !orders.length) {
                        return "Fetching your latest orders...";
                }

                if (!orders.length) {
                        return "You haven't placed any orders yet.";
                }

                return `Showing ${orders.length} of ${totalOrdersPlaced} order${totalOrdersPlaced === 1 ? "" : "s"}.`;
        }, [user?._id, isLoading, orders.length, totalOrdersPlaced]);

        const handleViewDetails = (order) => {
                setSelectedOrder(order);
        };

        const renderTableBody = () => (
                <TableBody>
                        {orders.map((order) => {
                                const firstProduct = order?.products?.[0];
                                const additionalCount = (order?.products?.length ?? 0) - 1;
                                const productName =
                                        firstProduct?.productName ||
                                        firstProduct?.productId?.title ||
                                        "Products";
                                const quantity =
                                        typeof firstProduct?.quantity === "number"
                                                ? firstProduct.quantity
                                                : firstProduct?.quantity ?? null;
                                const price =
                                        typeof firstProduct?.price === "number"
                                                ? firstProduct.price
                                                : firstProduct?.price ?? null;
                                let subtitle = "";
                                const optionEntries = getOrderItemOptionEntries(firstProduct);
                                const optionSummary = optionEntries
                                        .map((entry) => `${entry.label}: ${entry.value}`)
                                        .join(" • ");

                                if (additionalCount > 0) {
                                        subtitle = `+${additionalCount} more item${additionalCount === 1 ? "" : "s"}`;
                                } else if (quantity !== null && price !== null) {
                                        subtitle = `Qty ${quantity} × ₹${formatCurrency(price)}`;
                                } else if (quantity !== null) {
                                        subtitle = `Qty ${quantity}`;
                                } else if (
                                        firstProduct?.productId?.title &&
                                        firstProduct?.productId?.title !== productName
                                ) {
                                        subtitle = firstProduct.productId.title;
                                }

                                return (
                                        <motion.tr
                                                key={order?._id ?? order?.orderNumber}
                                                variants={rowVariants}
                                                className="transition-colors hover:bg-muted/50"
                                        >
                                                <TableCell className="font-medium">
                                                        {order?.orderNumber ?? order?._id}
                                                </TableCell>
                                                <TableCell>
                                                        <div className="flex flex-col gap-1">
                                                                <span className="font-medium">{productName}</span>
                                                                {subtitle && (
                                                                        <span className="text-sm text-muted-foreground">{subtitle}</span>
                                                                )}
                                                                {optionSummary && (
                                                                        <span className="text-xs text-muted-foreground">{optionSummary}</span>
                                                                )}
                                                        </div>
                                                </TableCell>
                                                <TableCell>{totalQuantity(order)}</TableCell>
                                                <TableCell>{formatDate(order?.orderDate || order?.createdAt)}</TableCell>
                                                <TableCell className="font-medium">
                                                        ₹{formatCurrency(order?.totalAmount ?? 0)}
                                                </TableCell>
                                                <TableCell>
                                                        <div className="flex flex-col gap-2">
                                                                <Badge
                                                                        className={`${
                                                                                ORDER_STATUS_STYLES[order?.status] ??
                                                                                "bg-gray-200 text-gray-800"
                                                                        } capitalize`}
                                                                >
                                                                        {formatStatusLabel(order?.status)}
                                                                </Badge>
                                                                {order?.paymentStatus && (
                                                                        <Badge
                                                                                className={`${
                                                                                        PAYMENT_STATUS_STYLES[order?.paymentStatus] ??
                                                                                        "bg-gray-200 text-gray-800"
                                                                                } capitalize`}
                                                                        >
                                                                                {formatStatusLabel(order?.paymentStatus)}
                                                                        </Badge>
                                                                )}
                                                        </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                        <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(order)}
                                                        >
                                                                <Eye className="h-4 w-4" />
                                                                <span className="sr-only">View order details</span>
                                                        </Button>
                                                </TableCell>
                                        </motion.tr>
                                );
                        })}
                </TableBody>
        );

        return (
                <>
                        <Card>
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                        <div>
                                                <CardTitle>Order History</CardTitle>
                                                <CardDescription>{orderSummaryText}</CardDescription>
                                        </div>
                                        {user?._id && (
                                                <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fetchOrders(1, false)}
                                                        disabled={isLoading}
                                                >
                                                        {isLoading ? (
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        ) : (
                                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                        )}
                                                        Refresh
                                                </Button>
                                        )}
                                </CardHeader>
                                <CardContent>
                                        {!user?._id ? (
                                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
                                                        <p className="text-sm text-muted-foreground">
                                                                You need to be signed in to access your order history.
                                                        </p>
                                                </div>
                                        ) : isLoading && !orders.length ? (
                                                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm text-muted-foreground">
                                                        <Loader2 className="h-6 w-6 animate-spin" />
                                                        Loading your orders…
                                                </div>
                                        ) : error && !orders.length ? (
                                                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                                                        <p className="text-sm text-red-600">{error}</p>
                                                        <Button variant="outline" size="sm" onClick={() => fetchOrders(1, false)}>
                                                                Try again
                                                        </Button>
                                                </div>
                                        ) : !orders.length ? (
                                                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center">
                                                        <p className="text-sm font-medium">No orders yet</p>
                                                        <p className="text-sm text-muted-foreground">
                                                                When you place an order, it will appear here for quick tracking and downloads.
                                                        </p>
                                                </div>
                                        ) : (
                                                <>
                                                        <motion.div variants={tableVariants} initial="hidden" animate="visible" className="overflow-x-auto">
                                                                <Table>
                                                                        <TableHeader>
                                                                                <TableRow>
                                                                                        <TableHead>Order #</TableHead>
                                                                                        <TableHead>Items</TableHead>
                                                                                        <TableHead>Qty</TableHead>
                                                                                        <TableHead>Placed On</TableHead>
                                                                                        <TableHead>Total</TableHead>
                                                                                        <TableHead>Status</TableHead>
                                                                                        <TableHead className="text-right">Actions</TableHead>
                                                                                </TableRow>
                                                                        </TableHeader>
                                                                        {renderTableBody()}
                                                                </Table>
                                                        </motion.div>
                                                        {error && (
                                                                <p className="mt-4 text-sm text-red-600">
                                                                        {error}
                                                                </p>
                                                        )}
                                                        {hasMore && (
                                                                <div className="flex justify-center pt-4">
                                                                        <Button
                                                                                variant="outline"
                                                                                onClick={() => fetchOrders((pagination?.currentPage ?? 1) + 1, true)}
                                                                                disabled={isLoadingMore}
                                                                        >
                                                                                {isLoadingMore ? (
                                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                ) : (
                                                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                                                )}
                                                                                Load more
                                                                        </Button>
                                                                </div>
                                                        )}
                                                </>
                                        )}
                                </CardContent>
                        </Card>

                        <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                                <DialogContent className="max-w-3xl">
                                        {selectedOrder && (
                                                <div className="space-y-6">
                                                        <DialogHeader>
                                                                <DialogTitle>
                                                                        Order {selectedOrder?.orderNumber ?? selectedOrder?._id}
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                        Placed on {formatDate(selectedOrder?.orderDate || selectedOrder?.createdAt)}
                                                                </DialogDescription>
                                                        </DialogHeader>

                                                        <div className="flex flex-wrap items-center gap-3">
                                                                <Badge
                                                                        className={`${
                                                                                ORDER_STATUS_STYLES[selectedOrder?.status] ??
                                                                                "bg-gray-200 text-gray-800"
                                                                        } capitalize`}
                                                                >
                                                                        {formatStatusLabel(selectedOrder?.status)}
                                                                </Badge>
                                                                {selectedOrder?.paymentStatus && (
                                                                        <Badge
                                                                                className={`${
                                                                                        PAYMENT_STATUS_STYLES[selectedOrder?.paymentStatus] ??
                                                                                        "bg-gray-200 text-gray-800"
                                                                                } capitalize`}
                                                                        >
                                                                                {formatStatusLabel(selectedOrder?.paymentStatus)}
                                                                        </Badge>
                                                                )}
                                                                {selectedOrder?.paymentMethod && (
                                                                        <Badge variant="outline" className="capitalize">
                                                                                {formatStatusLabel(selectedOrder.paymentMethod)}
                                                                        </Badge>
                                                                )}
                                                        </div>

                                                        <div className="grid gap-6 md:grid-cols-2">
                                                                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                                                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                                                                Delivery details
                                                                        </h3>
                                                                        <div className="space-y-1 text-sm">
                                                                                <p className="font-medium">
                                                                                        {selectedOrder?.customerName}
                                                                                </p>
                                                                                <p className="text-muted-foreground">
                                                                                        {selectedOrder?.customerEmail}
                                                                                </p>
                                                                                <p className="text-muted-foreground">
                                                                                        {selectedOrder?.customerMobile}
                                                                                </p>
                                                                                <p className="text-muted-foreground">
                                                                                        {formatAddress(selectedOrder?.deliveryAddress)}
                                                                                </p>
                                                                                {selectedOrder?.trackingNumber && (
                                                                                        <p className="text-muted-foreground">
                                                                                                Tracking #: {selectedOrder.trackingNumber}
                                                                                        </p>
                                                                                )}
                                                                        </div>
                                                                </div>

                                                                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                                                                        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                                                                Payment summary
                                                                        </h3>
                                                                        <div className="space-y-2 text-sm">
                                                                                <div className="flex items-center justify-between">
                                                                                        <span className="text-muted-foreground">Subtotal</span>
                                                                                        <span>₹{formatCurrency(selectedOrder?.subtotal ?? 0)}</span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                        <span className="text-muted-foreground">Tax</span>
                                                                                        <span>₹{formatCurrency(selectedOrder?.tax ?? 0)}</span>
                                                                                </div>
                                                                                <div className="flex items-center justify-between">
                                                                                        <span className="text-muted-foreground">Shipping</span>
                                                                                        <span>₹{formatCurrency(selectedOrder?.shippingCost ?? 0)}</span>
                                                                                </div>
                                                                                {selectedOrder?.discount ? (
                                                                                        <div className="flex items-center justify-between text-emerald-600">
                                                                                                <span>Discount</span>
                                                                                                <span>-₹{formatCurrency(selectedOrder.discount)}</span>
                                                                                        </div>
                                                                                ) : null}
                                                                                <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                                                                                        <span>Total paid</span>
                                                                                        <span>₹{formatCurrency(selectedOrder?.totalAmount ?? 0)}</span>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                                                        Order items
                                                                </h3>
                                                                <div className="space-y-4">
                                                                        {selectedOrder?.products?.map((item) => {
                                                                                const name =
                                                                                        item?.productName || item?.productId?.title || "Product";
                                                                                const quantity = item?.quantity ?? 0;
                                                                                const unitPrice = item?.price ?? 0;
                                                                                const lineTotal = item?.totalPrice ?? unitPrice * quantity;
                                                                                const optionEntries = getOrderItemOptionEntries(item);

                                                                                return (
                                                                                        <div
                                                                                                key={item?._id ?? `${name}-${quantity}-${unitPrice}`}
                                                                                                className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                                                                                        >
                                                                                                <div>
                                                                                                        <p className="font-medium">{name}</p>
                                                                                                        <p className="text-sm text-muted-foreground">
                                                                                                                Qty {quantity} × ₹{formatCurrency(unitPrice)}
                                                                                                        </p>
                                                                                                        {optionEntries.length > 0 && (
                                                                                                                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                                                                                                        {optionEntries.map(({ label, value }) => (
                                                                                                                                <li key={`${name}-${label}`}>
                                                                                                                                        <span className="font-medium text-gray-900">{label}:</span> {value}
                                                                                                                                </li>
                                                                                                                        ))}
                                                                                                                </ul>
                                                                                                        )}
                                                                                                </div>
                                                                                                <div className="text-right">
                                                                                                        <p className="font-semibold">₹{formatCurrency(lineTotal)}</p>
                                                                                                        {item?.discountAmount ? (
                                                                                                                <p className="text-xs text-emerald-600">
                                                                                                                        Saved ₹{formatCurrency(item.discountAmount)}
                                                                                                                </p>
                                                                                                        ) : null}
                                                                                                </div>
                                                                                        </div>
                                                                                );
                                                                        })}
                                                                </div>
                                                        </div>
                                                </div>
                                        )}
                                </DialogContent>
                        </Dialog>
                </>
        );
}
