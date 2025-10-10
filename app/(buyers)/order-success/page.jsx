"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { extractOrderItemOptions } from "@/lib/orderOptions.js";
import {
        CheckCircle,
        Truck,
        Home,
        Download,
        Loader2,
        CreditCard,
        UploadCloud,
        BadgeCheck,
} from "lucide-react";

import Link from "next/link";
import { toast } from "react-hot-toast";

export default function OrderSuccessPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
        const [orderDetails, setOrderDetails] = useState(null);
        const [isConfirming, setIsConfirming] = useState(true);
        const [error, setError] = useState(null);
        const [isUploadingLogo, setIsUploadingLogo] = useState(false);

        const fileInputRef = useRef(null);


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

        const handleLogoUpload = async (file) => {
                if (!file || !orderDetails?._id) {
                        return;
                }

                if (file.type && !file.type.startsWith("image/")) {
                        toast.error("Please upload an image file for your logo.");
                        return;
                }

                if (file.size > 5 * 1024 * 1024) {
                        toast.error("Logo must be 5MB or smaller.");
                        return;
                }

                const formData = new FormData();
                formData.append("file", file);

                setIsUploadingLogo(true);

                try {
                        const response = await fetch(`/api/orders/${orderDetails._id}/logo`, {
                                method: "POST",
                                body: formData,
                        });

                        const data = await response.json();

                        if (!response.ok || !data?.success) {
                                throw new Error(data?.message || "Failed to upload logo");
                        }

                        setOrderDetails(data.order);
                        toast.success("Logo uploaded successfully.");
                } catch (uploadError) {
                        console.error("Logo upload failed", uploadError);
                        toast.error(uploadError.message || "Failed to upload logo");
                } finally {
                        setIsUploadingLogo(false);
                }
        };

        const handleLogoInputChange = (event) => {
                const [file] = event.target.files || [];
                if (file) {
                        handleLogoUpload(file);
                }

                if (event.target) {
                        event.target.value = "";
                }
        };

        const purchasedItems = useMemo(() => {
                if (!orderDetails?.products?.length) {
                        return [];
                }

                return orderDetails.products.map((item) => {
                        const options = extractOrderItemOptions(item);

                        return {
                                id: item.productId || item._id,
                                name: item.productName,
                                quantity: item.quantity,
                                price: item.price,
                                totalPrice: item.totalPrice,
                                discountAmount: item.discountAmount,
                                mrp: item.mrp,
                                options,
                        };
                });
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

                                        {/* Logo Upload Prompt */}
                                        <Card className="border-dashed border-primary/40 bg-primary/5">
                                                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="flex items-start gap-3 text-left">
                                                                <div className="mt-1 rounded-full bg-primary/10 p-2">
                                                                        {orderDetails.logoStatus === "submitted" ? (
                                                                                <BadgeCheck className="h-5 w-5 text-primary" />
                                                                        ) : (
                                                                                <UploadCloud className="h-5 w-5 text-primary" />
                                                                        )}
                                                                </div>
                                                                <div>
                                                                        <CardTitle className="text-lg">
                                                                                {orderDetails.logoStatus === "submitted"
                                                                                        ? "Thank you for sharing your logo"
                                                                                        : "Add your company logo for customisation"}
                                                                        </CardTitle>
                                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                                                {orderDetails.logoStatus === "submitted"
                                                                                        ? "Our team has received your branding assets. We'll use them to personalise your posters."
                                                                                        : "Upload a high-quality version of your company logo so we can personalise your posters exactly the way you need."}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                        {orderDetails.logoStatus === "submitted" && orderDetails.logoUrl ? (
                                                                <Button variant="outline" asChild>
                                                                        <a
                                                                                href={orderDetails.logoUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                        >
                                                                                View logo
                                                                        </a>
                                                                </Button>
                                                        ) : (
                                                                <div className="flex items-center gap-3">
                                                                        <input
                                                                                ref={fileInputRef}
                                                                                type="file"
                                                                                accept="image/*"
                                                                                className="hidden"
                                                                                onChange={handleLogoInputChange}
                                                                        />
                                                                        <Button
                                                                                onClick={() => fileInputRef.current?.click()}
                                                                                disabled={isUploadingLogo}
                                                                        >
                                                                                {isUploadingLogo ? (
                                                                                        <>
                                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                                Uploading
                                                                                        </>
                                                                                ) : (
                                                                                        "Upload logo"
                                                                                )}
                                                                        </Button>
                                                                        <p className="text-xs text-muted-foreground">
                                                                                PNG, JPG or SVG up to 5MB.
                                                                        </p>
                                                                </div>
                                                        )}
                                                </CardHeader>
                                                {orderDetails.logoStatus === "submitted" && orderDetails.logoUrl && (
                                                        <CardContent>
                                                                <div className="overflow-hidden rounded-lg border bg-white p-4">
                                                                        <img
                                                                                src={orderDetails.logoUrl}
                                                                                alt="Uploaded company logo"
                                                                                className="mx-auto h-32 w-auto object-contain"
                                                                        />
                                                                        {orderDetails.logoSubmittedAt ? (
                                                                                <p className="mt-2 text-center text-xs text-muted-foreground">
                                                                                        Uploaded on {new Date(orderDetails.logoSubmittedAt).toLocaleString()}
                                                                                </p>
                                                                        ) : (
                                                                                <p className="mt-2 text-center text-xs text-muted-foreground">
                                                                                        Thanks! Our design team will review your logo shortly.
                                                                                </p>
                                                                        )}
                                                                </div>
                                                        </CardContent>
                                                )}
                                        </Card>

                                        {/* Purchased Items */}
                                        {purchasedItems.length > 0 && (
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle>Items Purchased</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                                {purchasedItems.map((item) => {
                                                                        const optionEntries = [
                                                                                {
                                                                                        label: "Language",
                                                                                        value: item.options?.language,
                                                                                },
                                                                                {
                                                                                        label: "Size",
                                                                                        value: item.options?.size,
                                                                                },
                                                                                {
                                                                                        label: "Material",
                                                                                        value: item.options?.material,
                                                                                },
                                                                                {
                                                                                        label: "Layout",
                                                                                        value: item.options?.layout,
                                                                                },
                                                                                {
                                                                                        label: "QR",
                                                                                        value: item.options?.qrOption,
                                                                                },
                                                                        ].filter((entry) => Boolean(entry.value));

                                                                        return (
                                                                        <div
                                                                                key={item.id}
                                                                                className="overflow-hidden rounded-xl border border-gray-100 bg-white"
                                                                        >
                                                                                <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
                                                                                        <p className="text-base font-semibold text-gray-900">
                                                                                                {item.name}
                                                                                        </p>
                                                                                        <Badge variant="secondary" className="shrink-0">
                                                                                                Qty: {item.quantity}
                                                                                        </Badge>
                                                                                </div>
                                                                                {optionEntries.length > 0 && (
                                                                                        <div className="px-5 py-3 text-sm text-gray-600 border-b border-gray-100">
                                                                                                <dl className="grid gap-2 sm:grid-cols-2">
                                                                                                        {optionEntries.map(({ label, value }) => (
                                                                                                                <div key={`${item.id}-${label}`} className="flex items-center gap-2">
                                                                                                                        <dt className="font-medium text-gray-900 min-w-[4.5rem]">
                                                                                                                                {label}:
                                                                                                                        </dt>
                                                                                                                        <dd className="text-gray-600">{value}</dd>
                                                                                                                </div>
                                                                                                        ))}
                                                                                                </dl>
                                                                                        </div>
                                                                                )}
                                                                                <div className="grid gap-0 px-5 py-4 text-sm sm:grid-cols-3">
                                                                                        <div className="py-2 sm:py-0">
                                                                                                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                                                                        MRP
                                                                                                </span>
                                                                                                <span className="mt-1 block font-semibold text-gray-900">
                                                                                                        ₹
                                                                                                        {item.mrp?.toLocaleString?.() || item.mrp || "-"}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div className="py-2 sm:py-0 sm:text-center">
                                                                                                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                                                                        Price
                                                                                                </span>
                                                                                                <span className="mt-1 block font-semibold text-gray-900">
                                                                                                        ₹
                                                                                                        {item.price?.toLocaleString?.() || item.price}
                                                                                                </span>
                                                                                        </div>
                                                                                        <div className="py-2 sm:py-0 sm:text-right">
                                                                                                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                                                                        Discount
                                                                                                </span>
                                                                                                <span className="mt-1 block font-semibold text-gray-900">
                                                                                                        ₹
                                                                                                        {item.discountAmount?.toLocaleString?.() ||
                                                                                                                item.discountAmount ||
                                                                                                                0}
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                                        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-900">
                                                                                                <span>Total</span>
                                                                                                <span>
                                                                                                        ₹
                                                                                                        {item.totalPrice?.toLocaleString?.() || item.totalPrice}
                                                                                                </span>
                                                                                        </div>
                                                                                </div>
                                                                        );
                                                                })}
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
                                                                        {Number(orderDetails.shippingCost) > 0
                                                                                ? `₹${
                                                                                          orderDetails.shippingCost?.toLocaleString?.() ||
                                                                                          orderDetails.shippingCost
                                                                                  }`
                                                                                : "Free"}
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

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-4">
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
