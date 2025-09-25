"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Truck, Home, Download, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
        const [orderDetails, setOrderDetails] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

	const orderId = searchParams.get("orderId");
	const orderNumber = searchParams.get("orderNumber");

	useEffect(() => {
                if (!orderId || !orderNumber) {
                        router.push("/");
                        return;
                }

                const fetchOrder = async () => {
                        try {
                                setLoading(true);
                                const response = await fetch(`/api/orders/${orderId}`);
                                const data = await response.json();

                                if (!response.ok || !data.success) {
                                        throw new Error(data.message || "Unable to load order details");
                                }

                                const order = data.order;
                                setOrderDetails({
                                        ...order,
                                        orderId: order._id,
                                        orderNumber: order.orderNumber || orderNumber,
                                        estimatedDelivery: order.estimatedDelivery
                                                ? new Date(order.estimatedDelivery).toLocaleDateString()
                                                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                                });
                                setError(null);
                        } catch (err) {
                                console.error("Order success fetch error:", err);
                                setError(err.message || "Failed to load order details");
                        } finally {
                                setLoading(false);
                        }
                };

                fetchOrder();
        }, [orderId, orderNumber, router]);

        if (loading) {
                return (
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                <div className="text-center space-y-2">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" />
                                        <p className="text-sm text-gray-600">Preparing your order details...</p>
                                </div>
                        </div>
                );
        }

        if (error) {
                return (
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                <Card className="max-w-md">
                                        <CardHeader>
                                                <CardTitle>Order summary unavailable</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 text-center">
                                                <p className="text-sm text-gray-600">{error}</p>
                                                <Button variant="outline" onClick={() => router.push("/orders")}>Return to orders</Button>
                                        </CardContent>
                                </Card>
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
                                                                        {orderDetails.orderNumber}
                                                                </Badge>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Order ID:</span>
                                                                <span className="font-medium">{orderDetails.orderId}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Placed On:</span>
                                                                <span className="font-medium">
                                                                        {new Date(orderDetails.createdAt || Date.now()).toLocaleDateString()}
                                                                </span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Estimated Delivery:</span>
                                                                <span className="font-medium">{orderDetails.estimatedDelivery}</span>
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
                                                                        ₹{orderDetails.totalAmount?.toLocaleString?.() || orderDetails.totalAmount}
                                                                </span>
                                                        </div>
                                                </CardContent>
                                        </Card>

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
                                                                                        {orderDetails.billingAddress.city}, {orderDetails.billingAddress.state} - {orderDetails.billingAddress.zipCode}
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
                                                                                        {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} - {orderDetails.shippingAddress.zipCode}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        )}
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
