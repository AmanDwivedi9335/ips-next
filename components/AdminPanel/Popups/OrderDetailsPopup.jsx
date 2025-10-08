"use client";

import { motion } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
        Package,
        User,
        MapPin,
        CreditCard,
        Calendar,
        Phone,
        Mail,
        Truck,
        BadgeCheck,
        UploadCloud,
} from "lucide-react";
import { formatCurrency as formatCurrencyValue } from "@/lib/pricing.js";

const formatCurrency = (value) => `₹${formatCurrencyValue(value ?? 0)}`;
const formatDiscount = (value) => `-₹${formatCurrencyValue(Math.abs(value ?? 0))}`;
const safeUpperCase = (value, fallback = "N/A") =>
        typeof value === "string" && value.trim().length
                ? value.trim().toUpperCase()
                : fallback;

const safeText = (value) => {
        if (typeof value === "string") return value;
        if (typeof value === "number") return String(value);
        return "";
};
const pickText = (...values) => {
        for (const value of values) {
                const text = safeText(value).trim();
                if (text) return text;
        }
        return "";
};
const pickNumber = (...values) => {
        for (const value of values) {
                if (value === null || value === undefined || value === "") continue;
                const numeric = Number(value);
                if (Number.isFinite(numeric)) {
                        return numeric;
                }
        }
        return null;
};
const pickBoolean = (...values) => {
        for (const value of values) {
                if (value === null || value === undefined || value === "") continue;

                if (typeof value === "boolean") {
                        return value;
                }

                if (typeof value === "number") {
                        if (value === 1) return true;
                        if (value === 0) return false;
                        continue;
                }

                if (typeof value === "string") {
                        const normalized = value.trim().toLowerCase();

                        if (!normalized) continue;

                        if (["true", "yes", "y", "1", "with qr", "with"].includes(normalized)) {
                                return true;
                        }

                        if (["false", "no", "n", "0", "without qr", "without"].includes(normalized)) {
                                return false;
                        }
                }
        }

        return null;
};

const formatDate = (value) => {
        if (!value) return "N/A";
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? "N/A" : parsed.toLocaleDateString();
};
const FALLBACK_PRODUCT_IMAGE =
        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";

export function OrderDetailsPopup({ open, onOpenChange, order }) {
        if (!order) return null;

        const getStatusColor = (status) => {
		const colors = {
			pending: "bg-yellow-100 text-yellow-800",
			confirmed: "bg-blue-100 text-blue-800",
			processing: "bg-purple-100 text-purple-800",
			shipped: "bg-indigo-100 text-indigo-800",
			delivered: "bg-green-100 text-green-800",
			cancelled: "bg-red-100 text-red-800",
			returned: "bg-gray-100 text-gray-800",
		};
		return colors[status] || "bg-gray-100 text-gray-800";
	};

        const getPaymentStatusColor = (status) => {
                const colors = {
                        paid: "bg-green-100 text-green-800",
                        pending: "bg-yellow-100 text-yellow-800",
                        failed: "bg-red-100 text-red-800",
                        refunded: "bg-gray-100 text-gray-800",
                };
                return colors[status] || "bg-gray-100 text-gray-800";
        };

        const products = Array.isArray(order.products) ? order.products : [];

        const userInfo =
                order && typeof order.userId === "object" && order.userId !== null
                        ? order.userId
                        : null;
        const userFirstName = safeText(userInfo?.firstName).trim();
        const userLastName = safeText(userInfo?.lastName).trim();
        const combinedUserName = [userFirstName, userLastName].filter(Boolean).join(" ");
        const customerNameRecord =
                order && typeof order.customerName === "object" && order.customerName !== null
                        ? order.customerName
                        : null;
        const customerRecordFirstName = safeText(customerNameRecord?.firstName).trim();
        const customerRecordLastName = safeText(customerNameRecord?.lastName).trim();
        const customerRecordAltFirstName = safeText(customerNameRecord?.first_name).trim();
        const customerRecordAltLastName = safeText(customerNameRecord?.last_name).trim();
        const combinedCustomerRecordName =
                [customerRecordFirstName, customerRecordLastName].filter(Boolean).join(" ");
        const combinedCustomerRecordAltName =
                [customerRecordAltFirstName, customerRecordAltLastName].filter(Boolean).join(" ");
        const displayCustomerName =
                pickText(
                        typeof order.customerName === "string" ? order.customerName : "",
                        customerNameRecord?.name,
                        customerNameRecord?.fullName,
                        customerNameRecord?.full_name,
                        customerNameRecord?.displayName,
                        customerNameRecord?.display_name,
                        combinedCustomerRecordName,
                        combinedCustomerRecordAltName,
                        userInfo?.name,
                        userInfo?.fullName,
                        userInfo?.full_name,
                        combinedUserName
                ) || "N/A";
        const customerEmailRecord =
                order && typeof order.customerEmail === "object" && order.customerEmail !== null
                        ? order.customerEmail
                        : null;
        const displayCustomerEmail =
                pickText(
                        typeof order.customerEmail === "string" ? order.customerEmail : "",
                        customerEmailRecord?.email,
                        customerEmailRecord?.emailAddress,
                        customerEmailRecord?.email_address,
                        customerEmailRecord?.address,
                        customerEmailRecord?.value,
                        userInfo?.email,
                        userInfo?.contactEmail,
                        userInfo?.contact_email
                ) || "N/A";
        const customerPhoneRecord =
                order && typeof order.customerMobile === "object" && order.customerMobile !== null
                        ? order.customerMobile
                        : null;
        const displayCustomerPhone =
                pickText(
                        typeof order.customerMobile === "string" ? order.customerMobile : "",
                        customerPhoneRecord?.mobile,
                        customerPhoneRecord?.phone,
                        customerPhoneRecord?.number,
                        customerPhoneRecord?.phoneNumber,
                        customerPhoneRecord?.phone_number,
                        customerPhoneRecord?.contactNumber,
                        customerPhoneRecord?.contact_number,
                        customerPhoneRecord?.value,
                        userInfo?.mobile,
                        userInfo?.phone,
                        userInfo?.contactNumber,
                        userInfo?.contact_number,
                        userInfo?.phoneNumber,
                        userInfo?.phone_number
                ) || "N/A";
        const displayCustomerId =
                pickText(
                        typeof order.userId === "string" ? order.userId : "",
                        userInfo?.userId ? String(userInfo.userId) : "",
                        userInfo?.id ? String(userInfo.id) : "",
                        userInfo?._id ? String(userInfo._id) : ""
                ) || "N/A";
        const displayPaymentMethod = (() => {
                const method = safeText(order.paymentMethod).replace(/_/g, " ").trim();
                return method || "N/A";
        })();

        const couponDetails =
                order.couponApplied && typeof order.couponApplied === "object"
                        ? order.couponApplied
                        : null;
        const couponCodeLabel = couponDetails
                ? pickText(
                                couponDetails.couponCode,
                                couponDetails.code,
                                couponDetails.name,
                                couponDetails.title
                        )
                : "";
        const subtotal = order.subtotal ?? 0;
        const totalAmount = order.totalAmount ?? subtotal;


        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<DialogHeader>
						<DialogTitle className="text-xl font-bold">
                                                        Order Details - {order.orderNumber || order._id || "Order"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-6 mt-6">
						{/* Order Status and Basic Info */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<Package className="w-8 h-8 text-blue-600" />
										<div>
											<p className="text-sm text-gray-600">Order Status</p>
                                                                                        <Badge className={getStatusColor(order.status)}>
                                                                                                {safeUpperCase(order.status)}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<CreditCard className="w-8 h-8 text-green-600" />
										<div>
											<p className="text-sm text-gray-600">Payment Status</p>
                                                                                        <Badge
                                                                                                className={getPaymentStatusColor(order.paymentStatus)}
                                                                                        >
                                                                                                {safeUpperCase(order.paymentStatus)}
											</Badge>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<Calendar className="w-8 h-8 text-purple-600" />
										<div>
											<p className="text-sm text-gray-600">Order Date</p>
											<p className="font-medium">
                                                                                                {formatDate(order.orderDate || order.createdAt)}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Customer Information */}
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle className="flex items-center gap-2">
                                                                        <User className="w-5 h-5" />
                                                                        Customer Information
                                                                </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div>
                                                                                <p className="text-sm text-gray-600">Name</p>

                                                                                <p className="font-medium">{displayCustomerName}</p>

                                                                        </div>
                                                                        <div>
                                                                                <p className="text-sm text-gray-600">Email</p>
                                                                                <div className="flex items-center gap-2">
                                                                                        <Mail className="w-4 h-4 text-gray-400" />

                                                                                        <p className="font-medium">{displayCustomerEmail}</p>

                                                                                </div>
                                                                        </div>
                                                                        <div>
                                                                                <p className="text-sm text-gray-600">Phone</p>
                                                                                <div className="flex items-center gap-2">
                                                                                        <Phone className="w-4 h-4 text-gray-400" />

                                                                                        <p className="font-medium">{displayCustomerPhone}</p>

                                                                                </div>
                                                                        </div>
                                                                        <div>
                                                                                <p className="text-sm text-gray-600">Customer ID</p>

                                                                                <p className="font-medium text-blue-600">{displayCustomerId}</p>

                                                                        </div>
                                                                </div>
                                                        </CardContent>
                                                </Card>

                                                {/* Branding Assets */}
                                                <Card>
                                                        <CardHeader>
                                                                <CardTitle className="flex items-center gap-2">
                                                                        <BadgeCheck className="w-5 h-5 text-primary" />
                                                                        Branding Assets
                                                                </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                                        <div className="space-y-2">
                                                                                <p className="text-sm text-gray-600">Logo status</p>
                                                                                <Badge
                                                                                        className={`${
                                                                                                order.logoStatus === "submitted" || order.logoUrl
                                                                                                        ? "bg-emerald-100 text-emerald-800"
                                                                                                        : "bg-amber-100 text-amber-800"
                                                                                        } capitalize`}
                                                                                >
                                                                                        {order.logoStatus === "submitted" || order.logoUrl
                                                                                                ? "Logo received"
                                                                                                : "Awaiting logo"}
                                                                                </Badge>
                                                                                {order.logoSubmittedAt && (
                                                                                        <p className="text-xs text-gray-500">
                                                                                                Uploaded on {formatDate(order.logoSubmittedAt)}
                                                                                        </p>
                                                                                )}
                                                                        </div>
                                                                        <div className="flex flex-col items-start gap-2 sm:items-end">
                                                                                {order.logoUrl ? (
                                                                                        <Button variant="outline" asChild>
                                                                                                <a
                                                                                                        href={order.logoUrl}
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                >
                                                                                                        View logo
                                                                                                </a>
                                                                                        </Button>
                                                                                ) : (
                                                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                                <UploadCloud className="h-4 w-4" />
                                                                                                <span>Waiting for customer upload</span>
                                                                                        </div>
                                                                                )}
                                                                                <p className="text-xs text-gray-500">
                                                                                        Provided logos are shared with the production team automatically.
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                                {order.logoUrl && (
                                                                        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                                                                                <img
                                                                                        src={order.logoUrl}
                                                                                        alt="Uploaded customer logo"
                                                                                        className="mx-auto h-32 w-auto object-contain"
                                                                                />
                                                                        </div>
                                                                )}
                                                        </CardContent>
                                                </Card>

                                                {/* Delivery Address */}
                                                {order.deliveryAddress && (
                                                        <Card>
                                                                <CardHeader>
									<CardTitle className="flex items-center gap-2">
										<MapPin className="w-5 h-5" />
										Delivery Address
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
                                                                                <p>{order.deliveryAddress.street || ""}</p>
										<p>
                                                                                        {order.deliveryAddress.city || ""},{" "}
                                                                                        {order.deliveryAddress.state || ""}
										</p>
										<p>
                                                                                        {order.deliveryAddress.zipCode || ""},{" "}
                                                                                        {order.deliveryAddress.country || ""}
										</p>
									</div>
								</CardContent>
							</Card>
						)}

						{/* Products */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Package className="w-5 h-5" />
                                                                        Products ({products.length} items)
								</CardTitle>
							</CardHeader>
							<CardContent>
                                                                <div className="space-y-4">
                                                                        {products.length === 0 ? (
                                                                                <p className="text-sm text-gray-500">No products found for this order.</p>
                                                                        ) : (

                                                                                products.map((product, index) => {
                                                                                        const productName =
                                                                                                pickText(
                                                                                                        product?.productName,
                                                                                                        product?.name,
                                                                                                        product?.title,
                                                                                                        product?.label,
                                                                                                        product?.product?.name,
                                                                                                        product?.product?.productName,
                                                                                                        product?.details?.name,
                                                                                                        product?.variantName,
                                                                                                        product?.variant_name
                                                                                                ) || "Product";
                                                                                        const primaryImage = Array.isArray(product?.images)
                                                                                                ? product.images.find((image) =>
                                                                                                          typeof image === "string" && image.trim().length
                                                                                                  ) || ""
                                                                                                : "";
                                                                                        const nestedImage = Array.isArray(product?.product?.images)
                                                                                                ? product.product.images.find((image) =>
                                                                                                          typeof image === "string" && image.trim().length
                                                                                                  ) || ""
                                                                                                : "";
                                                                                        const productImage =
                                                                                                pickText(
                                                                                                        product?.productImage,
                                                                                                        product?.image,
                                                                                                        product?.thumbnail,
                                                                                                        product?.thumb,
                                                                                                        product?.picture,
                                                                                                        product?.preview,
                                                                                                        product?.product?.image,
                                                                                                        product?.product?.productImage,
                                                                                                        product?.product?.thumbnail,
                                                                                                        product?.product?.thumb,
                                                                                                        primaryImage,
                                                                                                        nestedImage
                                                                                                ) || FALLBACK_PRODUCT_IMAGE;
                                                                                        const quantityValue =
                                                                                                pickNumber(
                                                                                                        product?.quantity,
                                                                                                        product?.qty,
                                                                                                        product?.count,
                                                                                                        product?.quantityOrdered,
                                                                                                        product?.quantity_ordered
                                                                                                );
                                                                                        const displayQuantity =
                                                                                                quantityValue !== null && quantityValue > 0
                                                                                                        ? quantityValue
                                                                                                        : 0;
                                                                                        const unitPriceValue =
                                                                                                pickNumber(
                                                                                                        product?.price,
                                                                                                        product?.unitPrice,
                                                                                                        product?.salePrice,
                                                                                                        product?.finalPrice,
                                                                                                        product?.amount,
                                                                                                        product?.unit_price
                                                                                                ) ?? 0;
                                                                                        const totalPriceValue =
                                                                                                pickNumber(
                                                                                                        product?.totalPrice,
                                                                                                        product?.total,
                                                                                                        product?.totalAmount,
                                                                                                        product?.total_amount,
                                                                                                        unitPriceValue * displayQuantity
                                                                                                ) ?? unitPriceValue * displayQuantity;

                                                                                        const selectedOptions =
                                                                                                product?.selectedOptions &&
                                                                                                typeof product.selectedOptions === "object"
                                                                                                        ? product.selectedOptions
                                                                                                        : null;
                                                                                        const language =
                                                                                                pickText(
                                                                                                        product?.language,
                                                                                                        product?.selectedLanguage,
                                                                                                        product?.productLanguage,
                                                                                                        product?.languageOption,
                                                                                                        product?.languageSelection,
                                                                                                        selectedOptions?.language,
                                                                                                        selectedOptions?.selectedLanguage,
                                                                                                        selectedOptions?.productLanguage,
                                                                                                        selectedOptions?.languageOption
                                                                                                );
                                                                                        const size =
                                                                                                pickText(
                                                                                                        product?.size,
                                                                                                        product?.selectedSize,
                                                                                                        product?.sizeOption,
                                                                                                        product?.sizeSelection,
                                                                                                        product?.dimension,
                                                                                                        selectedOptions?.size,
                                                                                                        selectedOptions?.selectedSize,
                                                                                                        selectedOptions?.sizeOption
                                                                                                );
                                                                                        const material =
                                                                                                pickText(
                                                                                                        product?.material,
                                                                                                        product?.selectedMaterial,
                                                                                                        product?.materialOption,
                                                                                                        product?.materialSelection,
                                                                                                        selectedOptions?.material,
                                                                                                        selectedOptions?.selectedMaterial,
                                                                                                        selectedOptions?.materialOption
                                                                                                );
                                                                                        const layout =
                                                                                                pickText(
                                                                                                        product?.layout,
                                                                                                        product?.selectedLayout,
                                                                                                        product?.layoutOption,
                                                                                                        product?.layoutSelection,
                                                                                                        selectedOptions?.layout,
                                                                                                        selectedOptions?.selectedLayout,
                                                                                                        selectedOptions?.layoutOption,
                                                                                                        selectedOptions?.layoutSelection
                                                                                                );
                                                                                        const qrFlag = pickBoolean(
                                                                                                selectedOptions?.qr,
                                                                                                selectedOptions?.hasQr,
                                                                                                selectedOptions?.withQr,
                                                                                                product?.qr,
                                                                                                product?.hasQr,
                                                                                                product?.withQr
                                                                                        );
                                                                                        const qrTextCandidate = pickText(
                                                                                                product?.qrLabel,
                                                                                                product?.qrOption,
                                                                                                product?.qrSelection,
                                                                                                selectedOptions?.qrLabel,
                                                                                                selectedOptions?.qrOption,
                                                                                                selectedOptions?.qrSelection,
                                                                                                product?.qrText,
                                                                                                selectedOptions?.qrText
                                                                                        );
                                                                                        const qrText =
                                                                                                qrFlag !== null
                                                                                                        ? qrFlag
                                                                                                                ? "With QR"
                                                                                                                : "Without QR"
                                                                                                        : qrTextCandidate;
                                                                                        const optionEntries = [
                                                                                                { label: "Language", value: language },
                                                                                                { label: "Size", value: size },
                                                                                                { label: "Material", value: material },
                                                                                                { label: "Layout", value: layout },
                                                                                                { label: "QR", value: qrText },
                                                                                        ].filter((entry) => Boolean(entry.value));

                                                                                        return (
                                                                                                <div
                                                                                                        key={index}
                                                                                                        className="flex items-center gap-4 p-4 border rounded-lg"
                                                                                                >
                                                                                                        <img
                                                                                                                src={productImage}
                                                                                                                alt={`${productName} image`}
                                                                                                                className="w-16 h-16 object-cover rounded"
                                                                                                        />
                                                                                                        <div className="flex-1">
                                                                                                                <h4 className="font-medium">{productName}</h4>
                                                                                                                <p className="text-sm text-gray-600">
                                                                                                                        Quantity: {displayQuantity} × {formatCurrency(unitPriceValue)}
                                                                                                                </p>
                                                                                                                {optionEntries.length > 0 && (
                                                                                                                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                                                                                                {optionEntries.map(({ label, value }) => (
                                                                                                                                        <p key={`${label}-${value}`}>
                                                                                                                                                <span className="font-medium text-gray-900">{label}:</span>{" "}
                                                                                                                                                {value}
                                                                                                                                        </p>
                                                                                                                                ))}
                                                                                                                        </div>
                                                                                                                )}
                                                                                                        </div>
                                                                                                        <div className="text-right">
                                                                                                                <p className="font-medium">
                                                                                                                        {formatCurrency(totalPriceValue)}
                                                                                                                </p>
                                                                                                        </div>
                                                                                                </div>
                                                                                        );
                                                                                })

                                                                        )}
                                                                </div>
                                                        </CardContent>
                                                </Card>

						{/* Payment Information */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CreditCard className="w-5 h-5" />
									Payment Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-600">Payment Method</p>

                                                                                <p className="font-medium capitalize">{displayPaymentMethod}</p>

									</div>
									<div>
										<p className="text-sm text-gray-600">Transaction ID</p>
										<p className="font-medium">
											{order.transactionId || "N/A"}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Summary */}
						<Card>
							<CardHeader>
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
                                                                        <div className="flex justify-between">
                                                                                <span>Subtotal</span>
                                                                                <span>{formatCurrency(subtotal)}</span>
                                                                        </div>
                                                                        {Number(order.tax) > 0 && (
                                                                                <div className="flex justify-between">
                                                                                        <span>Tax</span>
                                                                                        <span>{formatCurrency(order.tax)}</span>
                                                                                </div>
                                                                        )}
                                                                        {Number(order.shippingCost) > 0 && (
                                                                                <div className="flex justify-between">
                                                                                        <span>Shipping</span>
                                                                                        <span>{formatCurrency(order.shippingCost)}</span>
                                                                                </div>
                                                                        )}
                                                                        {Number(order.discount) > 0 && (
                                                                                <div className="flex justify-between text-green-600">
                                                                                        <span>Discount</span>
                                                                                        <span>{formatDiscount(order.discount)}</span>
                                                                                </div>
                                                                        )}
                                                                        {couponDetails && (
                                                                                <div className="flex justify-between text-blue-600">

                                                                                        <span>Coupon ({couponCodeLabel || "Applied"})</span>

                                                                                        <span>{formatDiscount(couponDetails.discountAmount)}</span>
                                                                                </div>
                                                                        )}
                                                                        <Separator />
                                                                        <div className="flex justify-between text-lg font-bold">
                                                                                <span>Total Amount</span>
                                                                                <span>{formatCurrency(totalAmount)}</span>
                                                                        </div>
								</div>
							</CardContent>
						</Card>

						{/* Tracking Information */}
						{order.trackingNumber && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Truck className="w-5 h-5" />
										Tracking Information
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<p className="text-sm text-gray-600">Tracking Number</p>
											<p className="font-medium">{order.trackingNumber}</p>
										</div>
										{order.estimatedDelivery && (
											<div>
												<p className="text-sm text-gray-600">
													Estimated Delivery
												</p>
                                                                                                <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}

						{/* Notes */}
						{(order.orderNotes || order.adminNotes) && (
							<Card>
								<CardHeader>
									<CardTitle>Notes</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{order.orderNotes && (
											<div>
												<p className="text-sm text-gray-600 font-medium">
													Customer Notes
												</p>
												<p className="text-sm bg-gray-50 p-3 rounded">
													{order.orderNotes}
												</p>
											</div>
										)}
										{order.adminNotes && (
											<div>
												<p className="text-sm text-gray-600 font-medium">
													Admin Notes
												</p>
												<p className="text-sm bg-blue-50 p-3 rounded">
													{order.adminNotes}
												</p>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
