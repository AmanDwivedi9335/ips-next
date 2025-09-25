"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
        CheckCircle,
        Package,
        Truck,
        Home,
        Download,
        Loader2,
        CreditCard,
} from "lucide-react";

import Link from "next/link";

export default function OrderSuccessPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
        const [orderDetails, setOrderDetails] = useState(null);
        const [isConfirming, setIsConfirming] = useState(true);
        const [error, setError] = useState(null);


        const orderId = searchParams.get("orderId");
        const orderNumber = searchParams.get("orderNumber");

        useEffect(() => {
                if (!orderId || !orderNumber) {
                        router.push("/");
                        return;
                }

                const fetchOrderDetails = async () => {
                        setIsConfirming(true);
                        setError(null);

                        try {
                                const response = await fetch(`/api/orders/${orderId}`);

                                if (!response.ok) {
                                        throw new Error("Unable to fetch order details");
                                }

                                const data = await response.json();

                                if (!data?.success || !data?.order) {
                                        throw new Error(data?.message || "Order details not available");
                                }

                                setOrderDetails(data.order);
                        } catch (err) {
                                console.error("Failed to load order details", err);
                                setError(err.message || "Failed to load order details");
                        } finally {
                                setIsConfirming(false);
                        }
                };

                fetchOrderDetails();
        }, [orderId, orderNumber, router]);

        const purchasedItems = useMemo(() => {
                if (!orderDetails?.products?.length) {
                        return [];
                }

                return orderDetails.products.map((item) => ({
                        id: item.productId || item._id,
                        name: item.productName,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice,
                        discountAmount: item.discountAmount,
                        mrp: item.mrp,
                }));
        }, [orderDetails]);

        if (!orderDetails && isConfirming) {
                return (
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                                <div className="max-w-md w-full space-y-6 text-center">
                                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-blue-100">
                                                <div className="flex items-center justify-center gap-3">
                                                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                                        <p className="text-sm font-medium text-blue-700">
                                                                We are confirming your payment, please do not close this page.
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
        }

        if (error) {
                return (
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                                <div className="max-w-md w-full space-y-6 text-center">
                                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-red-100">
                                                <p className="text-sm font-medium text-red-600">{error}</p>
                                                <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
                                        </div>
                                </div>
                        </div>
                );
        }

        if (!orderDetails) {
                return null;
        }

        return (
                <div className="min-h-screen bg-gray-50 py-8">
                        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center space-y-8"
                                >
                                        {isConfirming && (
                                                <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        <span className="text-sm font-medium">
                                                                We are confirming your payment, please do not close this page.
                                                        </span>
                                                </div>
                                        )}

                                        {/* Success Icon */}
                                        <div className="flex justify-center">
                                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                                </div>

					</div>

					{/* Success Message */}
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Order Placed Successfully!
						</h1>
						<p className="text-gray-600">
							Thank you for your purchase. Your order has been confirmed and is
							being processed.
						</p>
					</div>

					{/* Order Details Card */}
					<Card>
						<CardHeader>
                                                        <CardTitle>Order Details</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Order Number:</span>
                                                                <Badge variant="secondary" className="font-mono">
                                                                        {orderDetails.orderNumber || orderNumber}
                                                                </Badge>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Order ID:</span>
                                                                <span className="font-medium">{orderDetails._id || orderId}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Placed On:</span>
                                                                <span className="font-medium">
                                                                        {new Date(orderDetails.createdAt || orderDetails.orderDate || Date.now()).toLocaleString()}
                                                                </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Status:</span>
                                                                <Badge variant="outline" className="capitalize">
                                                                        {orderDetails.status || "pending"}
                                                                </Badge>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Total Amount:</span>
                                                                <span className="font-semibold text-lg">
                                                                        ₹
                                                                        {orderDetails.totalAmount?.toLocaleString?.() ||
                                                                                orderDetails.totalAmount}
                                                                </span>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Purchased Items */}
                                        {purchasedItems.length > 0 && (
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle>Items Purchased</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                                {purchasedItems.map((item) => (
                                                                        <div
                                                                                key={item.id}
                                                                                className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50 p-4"
                                                                        >
                                                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                                                        <p className="font-semibold text-gray-900">
                                                                                                {item.name}
                                                                                        </p>
                                                                                        <Badge variant="secondary">
                                                                                                Qty: {item.quantity}
                                                                                        </Badge>
                                                                                </div>
                                                                                <div className="grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
                                                                                        <div>
                                                                                                <span className="block text-gray-500">MRP</span>
                                                                                                <span className="font-medium">
                                                                                                        ₹
                                                                                                        {item.mrp?.toLocaleString?.() ||
                                                                                                                item.mrp ||
                                                                                                                "-"}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div>
                                                                                                <span className="block text-gray-500">Price</span>
                                                                                                <span className="font-medium">
                                                                                                        ₹
                                                                                                        {item.price?.toLocaleString?.() || item.price}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div>
                                                                                                <span className="block text-gray-500">Discount</span>
                                                                                                <span className="font-medium">
                                                                                                        ₹
                                                                                                        {item.discountAmount?.toLocaleString?.() ||
                                                                                                                item.discountAmount ||
                                                                                                                0}
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                                                                                        <span>Total</span>
                                                                                        <span>
                                                                                                ₹
                                                                                                {item.totalPrice?.toLocaleString?.() ||
                                                                                                        item.totalPrice}
                                                                                        </span>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </CardContent>
                                                </Card>
                                        )}

                                        {/* Address Summary */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Billing & Shipping</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4 text-left">
                                                        {orderDetails.billingAddress && (
                                                                <div className="flex gap-3">
                                                                        <CreditCard className="h-5 w-5 text-primary" />
                                                                        <div>
                                                                                <p className="font-semibold">Billing Address</p>
                                                                                <p className="text-sm text-gray-600">
                                                                                        {orderDetails.billingAddress.name}
                                                                                        <br />
                                                                                        {orderDetails.billingAddress.street}
                                                                                        <br />
                                                                                        {orderDetails.billingAddress.city}, {orderDetails.billingAddress.state} -
                                                                                        {orderDetails.billingAddress.zipCode}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        )}
                                                        {orderDetails.shippingAddress && (
                                                                <div className="flex gap-3">
                                                                        <Truck className="h-5 w-5 text-primary" />
                                                                        <div>
                                                                                <p className="font-semibold">Shipping Address</p>
                                                                                <p className="text-sm text-gray-600">
                                                                                        {orderDetails.shippingAddress.name}
                                                                                        <br />
                                                                                        {orderDetails.shippingAddress.street}
                                                                                        <br />
                                                                                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} -
                                                                                        {orderDetails.shippingAddress.zipCode}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        )}
                                                </CardContent>
                                        </Card>

                                        {/* Payment Summary */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Payment Summary</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-2 text-sm text-gray-600">
                                                        <div className="flex justify-between">
                                                                <span>Subtotal</span>
                                                                <span className="font-medium text-gray-900">
                                                                        ₹
                                                                        {orderDetails.subtotal?.toLocaleString?.() ||
                                                                                orderDetails.subtotal}
                                                                </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                                <span>Shipping</span>
                                                                <span className="font-medium text-gray-900">
                                                                        ₹
                                                                        {orderDetails.shippingCost?.toLocaleString?.() ||
                                                                                orderDetails.shippingCost ||
                                                                                0}
                                                                </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                                <span>Discount</span>
                                                                <span className="font-medium text-gray-900">
                                                                        -₹
                                                                        {orderDetails.discount?.toLocaleString?.() ||
                                                                                orderDetails.discount ||
                                                                                0}
                                                                </span>
                                                        </div>
                                                        {orderDetails.tax ? (
                                                                <div className="flex justify-between">
                                                                        <span>Tax</span>
                                                                        <span className="font-medium text-gray-900">
                                                                                ₹
                                                                                {orderDetails.tax?.toLocaleString?.() ||
                                                                                        orderDetails.tax}
                                                                        </span>
                                                                </div>
                                                        ) : null}
                                                        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
                                                                <span>Total Paid</span>
                                                                <span>
                                                                        ₹
                                                                        {orderDetails.totalAmount?.toLocaleString?.() ||
                                                                                orderDetails.totalAmount}
                                                                </span>
                                                        </div>
                                                        <div className="flex justify-between pt-2 text-sm">
                                                                <span>Payment Method</span>
                                                                <span className="font-medium capitalize text-gray-900">
                                                                        {orderDetails.paymentMethod}
                                                                </span>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        {/* Order Status Steps */}
                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>Order Status</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                        <div className="flex items-center justify-between">
                                                                <div className="flex flex-col items-center">
                                                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                                                                                <CheckCircle className="w-5 h-5" />
                                                                        </div>
                                                                        <span className="text-sm mt-2 text-green-600 font-medium">
										Confirmed
									</span>
								</div>
								<div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                                                                <div className="flex flex-col items-center">
                                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                                                <Package className="w-5 h-5 text-gray-400" />
                                                                        </div>
                                                                        <span className="text-sm mt-2 text-gray-400">Processing</span>
								</div>
								<div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                                                                <div className="flex flex-col items-center">
                                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                                                <Truck className="w-5 h-5 text-gray-400" />
                                                                        </div>
                                                                        <span className="text-sm mt-2 text-gray-400">Shipped</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4">
						<Button asChild className="flex-1">
							<Link href="/orders">
								<Package className="w-4 h-4 mr-2" />
								Track Order
							</Link>
						</Button>
						<Button variant="outline" className="flex-1 bg-transparent">
							<Download className="w-4 h-4 mr-2" />
							Download Invoice
						</Button>
						<Button variant="outline" asChild className="flex-1 bg-transparent">
							<Link href="/products">
								<Home className="w-4 h-4 mr-2" />
								Continue Shopping
							</Link>
						</Button>
					</div>

					{/* Additional Info */}
					<div className="text-center text-sm text-gray-500">
						<p>
							You will receive an email confirmation shortly with your order
							details.
						</p>
						<p className="mt-1">
							For any questions, please contact our support team.
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
