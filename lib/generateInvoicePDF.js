import {
        Document,
        Page,
        Text,
        View,
        StyleSheet,
        pdf,
} from "@react-pdf/renderer";
import { formatCurrency, toNumber } from "@/lib/pricing.js";

const COMPANY = {
        name: "LADWA PARTNERS",
        tagline: "Industrial Procurement Specialists",
        address: [
                "NO. 3, AND 9, Khata No. 37/1, Singasandra Village, Begur Hobli,",
                "Bengaluru - 560068, Bengaluru Urban, Karnataka, India",
        ],
        gstin: "29AAEFL4254M1ZY",
        email: "sales@ladwapartners.com",
        website: "www.ladwapartners.com",
        phone: "+91 90350 44550",
};

const styles = StyleSheet.create({
        page: {
                padding: 32,
                backgroundColor: "#F8FAFC",
                fontFamily: "Helvetica",
                color: "#1F2937",
                fontSize: 10,
                lineHeight: 1.5,
        },
        container: {
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                padding: 28,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                flexGrow: 1,
        },
        header: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 24,
        },
        brandBlock: {
                flex: 1,
                paddingRight: 16,
        },
        brandName: {
                fontSize: 22,
                letterSpacing: 2,
                color: "#1E293B",
                fontWeight: "bold",
                marginBottom: 6,
        },
        brandTagline: {
                color: "#475569",
                marginBottom: 8,
        },
        brandDetail: {
                color: "#64748B",
        },
        invoiceMeta: {
                width: 220,
                padding: 18,
                borderRadius: 12,
                backgroundColor: "#0F172A",
                color: "#F8FAFC",
        },
        invoiceTitle: {
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
        },
        metaRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
        },
        metaLabel: {
                color: "#CBD5F5",
                fontSize: 9,
        },
        metaValue: {
                color: "#F8FAFC",
                fontSize: 10,
                fontWeight: "bold",
        },
        statusGroup: {
                flexDirection: "row",
                marginTop: 12,
        },
        statusBadge: {
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 999,
                backgroundColor: "#1E293B",
                marginRight: 8,
        },
        statusSecondary: {
                backgroundColor: "#334155",
                marginRight: 0,
        },
        statusLabel: {
                fontSize: 8,
                color: "#E2E8F0",
                marginBottom: 2,
        },
        statusValue: {
                fontSize: 10,
                fontWeight: "bold",
                color: "#F8FAFC",
                letterSpacing: 1,
        },
        section: {
                marginBottom: 20,
        },
        sectionTitle: {
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                color: "#475569",
                marginBottom: 8,
        },
        card: {
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 10,
                padding: 14,
                backgroundColor: "#FDFEFE",
        },
        gridTwo: {
                flexDirection: "row",
        },
        gridColumn: {
                flex: 1,
                marginRight: 16,
        },
        gridColumnLast: {
                marginRight: 0,
        },
        label: {
                fontSize: 9,
                color: "#94A3B8",
        },
        value: {
                fontSize: 10,
                fontWeight: "bold",
                color: "#1E293B",
        },
        addressLine: {
                color: "#475569",
                marginTop: 4,
        },
        divider: {
                height: 1,
                backgroundColor: "#E2E8F0",
                marginVertical: 12,
        },
        tableSection: {
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 12,
                overflow: "hidden",
        },
        tableHeader: {
                flexDirection: "row",
                backgroundColor: "#0F172A",
                color: "#F8FAFC",
                paddingVertical: 10,
                paddingHorizontal: 14,
        },
        headerCell: {
                fontSize: 9,
                fontWeight: "bold",
        },
        headerDescription: {
                flex: 4,
        },
        headerPrice: {
                flex: 1.5,
                textAlign: "center",
        },
        headerQty: {
                flex: 1,
                textAlign: "center",
        },
        headerTax: {
                flex: 1.5,
                textAlign: "center",
        },
        headerTotal: {
                flex: 1.5,
                textAlign: "right",
        },
        tableRow: {
                flexDirection: "row",
                paddingVertical: 12,
                paddingHorizontal: 14,
        },
        tableRowEven: {
                backgroundColor: "#F8FAFC",
        },
        tableCell: {
                fontSize: 9,
                color: "#1F2937",
        },
        descriptionCell: {
                flex: 4,
                paddingRight: 12,
        },
        priceCell: {
                flex: 1.5,
                textAlign: "center",
                justifyContent: "center",
        },
        qtyCell: {
                flex: 1,
                textAlign: "center",
                justifyContent: "center",
        },
        taxCell: {
                flex: 1.5,
                textAlign: "center",
                justifyContent: "center",
        },
        totalCell: {
                flex: 1.5,
                textAlign: "right",
                justifyContent: "center",
        },
        itemName: {
                fontSize: 10,
                fontWeight: "bold",
                color: "#1E293B",
        },
        itemMeta: {
                fontSize: 8,
                color: "#64748B",
                marginTop: 2,
        },
        amountBold: {
                fontSize: 10,
                fontWeight: "bold",
                color: "#111827",
        },
        muted: {
                fontSize: 8,
                color: "#94A3B8",
                marginTop: 2,
        },
        summarySection: {
                flexDirection: "row",
        },
        notesCard: {
                flex: 1.2,
                marginRight: 16,
        },
        totalsCard: {
                flex: 1,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 10,
                padding: 16,
                backgroundColor: "#F8FAFC",
        },
        summaryRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
        },
        summaryLabel: {
                color: "#64748B",
                fontSize: 9,
        },
        summaryValue: {
                color: "#1E293B",
                fontSize: 10,
                fontWeight: "bold",
        },
        summaryValueNegative: {
                color: "#B91C1C",
        },
        grandTotalLabel: {
                fontSize: 11,
                fontWeight: "bold",
                color: "#0F172A",
        },
        grandTotalValue: {
                fontSize: 12,
                fontWeight: "bold",
                color: "#0F172A",
        },
        balanceDue: {
                marginTop: 12,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 10,
                backgroundColor: "#FEF3C7",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
        },
        balanceLabel: {
                fontSize: 10,
                fontWeight: "bold",
                color: "#92400E",
        },
        balanceValue: {
                fontSize: 12,
                fontWeight: "bold",
                color: "#B45309",
        },
        footer: {
                marginTop: 28,
                paddingTop: 14,
                borderTopWidth: 1,
                borderTopColor: "#E2E8F0",
        },
        footerText: {
                fontSize: 8,
                color: "#94A3B8",
                marginBottom: 4,
        },
});

const formatDate = (value) => {
        if (!value) return "-";
        try {
                return new Date(value).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                });
        } catch (error) {
                return "-";
        }
};

const formatPaymentMethod = (value) => {
        if (!value) return "Not specified";
        return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const safeUpper = (value, fallback = "N/A") => {
        if (!value) return fallback;
        return String(value).toUpperCase();
};

const addressLines = (address = {}) => {
        if (!address) return [];
        const lines = [
                address.fullAddress,
                [address.street, address.city].filter(Boolean).join(", "),
                [address.state, address.zipCode].filter(Boolean).join(" - "),
                address.country,
        ]
                .map((line) => (line || "").trim())
                .filter((line) => Boolean(line));

        return Array.from(new Set(lines));
};

const coerceToString = (value) => {
        if (value === null || value === undefined) {
                return null;
        }

        if (typeof value === "string") {
                const trimmed = value.trim();
                return trimmed.length > 0 ? trimmed : null;
        }

        if (typeof value === "number") {
                return Number.isFinite(value) ? String(value) : null;
        }

        if (typeof value === "object") {
                if (typeof value.toString === "function") {
                        const asString = value.toString();
                        if (asString && asString !== "[object Object]") {
                                return asString;
                        }
                }

                if ("_id" in value) {
                        return coerceToString(value._id);
                }

                if ("id" in value) {
                        return coerceToString(value.id);
                }

                if ("code" in value) {
                        return coerceToString(value.code);
                }

                if ("sku" in value) {
                        return coerceToString(value.sku);
                }
        }

        return null;
};

const safeText = (value, fallback = "--") => {
        if (value === null || value === undefined) {
                return fallback;
        }

        if (typeof value === "boolean") {
                return value ? "Yes" : "No";
        }

        const normalized = coerceToString(value);
        if (normalized !== null) {
                return normalized;
        }

        if (typeof value === "number" && Number.isFinite(value)) {
                return String(value);
        }

        return fallback;
};

const resolveProductName = (product = {}) => {
        if (!product) return "Product";

        const directName = coerceToString(product.productName);
        if (directName) return directName;

        const populatedName = coerceToString(product?.productId?.name);
        if (populatedName) return populatedName;

        const identifier = coerceToString(product.productId);
        if (identifier) return identifier;

        return "Product";
};

const resolveProductIdentifier = (product = {}) => {
        const identifier = coerceToString(product.productId);
        if (identifier) {
                return identifier;
        }

        const variantId = coerceToString(product.variantId);
        if (variantId) {
                return variantId;
        }

        return null;
};

const calculateMetrics = (order = {}) => {
        const products = Array.isArray(order.products) ? order.products : [];
        const productTotals = products.map((product) => {
                const unitPrice = toNumber(product.price) ?? 0;
                const quantity = toNumber(product.quantity) ?? 0;
                const explicitTotal = toNumber(product.totalPrice);
                return explicitTotal !== null ? explicitTotal : unitPrice * quantity;
        });

        const subtotalExplicit = toNumber(order.subtotal);
        const subtotal =
                subtotalExplicit !== null
                        ? subtotalExplicit
                        : productTotals.reduce((sum, value) => sum + value, 0);

        const tax = toNumber(order.tax) ?? 0;
        const shipping = toNumber(order.shippingCost) ?? 0;
        const discount = toNumber(order.discount) ?? 0;
        const couponDiscount =
                toNumber(order?.couponApplied?.discountAmount) ?? 0;

        const totalExplicit = toNumber(order.totalAmount);
        const computedTotal = subtotal - discount - couponDiscount + shipping + tax;
        const total = totalExplicit !== null ? totalExplicit : computedTotal;

        return {
                products,
                productTotals,
                subtotal,
                tax,
                shipping,
                discount,
                couponDiscount,
                total,
        };
};

const allocateTax = (productTotals = [], subtotal = 0, totalTax = 0) => {
        if (!Array.isArray(productTotals) || productTotals.length === 0) {
                return [];
        }

        if (!(totalTax > 0) || !(subtotal > 0)) {
                return productTotals.map(() => ({ amount: 0, rate: null }));
        }

        let allocated = 0;
        return productTotals.map((lineTotal, index) => {
                const safeLineTotal = Number.isFinite(lineTotal) ? lineTotal : 0;

                if (index === productTotals.length - 1) {
                        const amount = Number((totalTax - allocated).toFixed(2));
                        const rate =
                                safeLineTotal > 0
                                        ? Number(
                                                      ((amount / safeLineTotal) * 100).toFixed(2)
                                              )
                                        : null;
                        return { amount, rate };
                }

                const proportion = safeLineTotal > 0 ? safeLineTotal / subtotal : 0;
                const rawAmount = totalTax * proportion;
                const amount = Number(rawAmount.toFixed(2));
                allocated += amount;

                const rate =
                        safeLineTotal > 0
                                ? Number(((amount / safeLineTotal) * 100).toFixed(2))
                                : null;

                return { amount, rate };
        });
};

const getAmountPaid = (order, total) => {
        if (!order) return 0;
        const paymentStatus = safeUpper(order.paymentStatus, "PENDING");
        if (paymentStatus === "PAID" || paymentStatus === "REFUNDED") {
                return total;
        }

        const paid = toNumber(order?.paymentDetails?.amountPaid);
        if (paid !== null && paid > 0) {
                return Math.min(paid, total);
        }

        return 0;
};

const InvoiceDocument = ({ order = {} }) => {
        const {
                products,
                productTotals,
                subtotal,
                tax,
                shipping,
                discount,
                couponDiscount,
                total,
        } = calculateMetrics(order);

        const taxAllocation = allocateTax(productTotals, subtotal, tax);
        const billAddress = order.billingAddress || order.deliveryAddress || order.shippingAddress;
        const shipAddress = order.deliveryAddress || order.shippingAddress || order.billingAddress;
        const amountPaid = getAmountPaid(order, total);
        const balanceDue = Math.max(total - amountPaid, 0);

        return (
                <Document>
                        <Page size="A4" style={styles.page}>
                                <View style={styles.container}>
                                        <View style={styles.header}>
                                                <View style={styles.brandBlock}>
                                                        <Text style={styles.brandName}>{COMPANY.name}</Text>
                                                        <Text style={styles.brandTagline}>{COMPANY.tagline}</Text>
                                                        {COMPANY.address.map((line, index) => (
                                                                <Text key={index} style={styles.brandDetail}>
                                                                        {line}
                                                                </Text>
                                                        ))}
                                                        <Text style={styles.brandDetail}>{COMPANY.website}</Text>
                                                        <Text style={styles.brandDetail}>{COMPANY.email}</Text>
                                                        <Text style={styles.brandDetail}>{COMPANY.phone}</Text>
                                                        <Text style={styles.brandDetail}>GSTIN: {COMPANY.gstin}</Text>
                                                </View>
                                                <View style={styles.invoiceMeta}>
                                                        <Text style={styles.invoiceTitle}>INVOICE</Text>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.metaLabel}>Invoice No.</Text>
                                                                <Text style={styles.metaValue}>
                                                                        {order.orderNumber || "--"}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.metaLabel}>Invoice Date</Text>
                                                                <Text style={styles.metaValue}>
                                                                        {formatDate(order.orderDate)}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.metaLabel}>Due Date</Text>
                                                                <Text style={styles.metaValue}>
                                                                        {formatDate(order.estimatedDelivery || order.orderDate)}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.statusGroup}>
                                                                <View style={styles.statusBadge}>
                                                                        <Text style={styles.statusLabel}>
                                                                                ORDER STATUS
                                                                        </Text>
                                                                        <Text style={styles.statusValue}>
                                                                                {safeUpper(order.status)}
                                                                        </Text>
                                                                </View>
                                                                <View style={[styles.statusBadge, styles.statusSecondary]}>
                                                                        <Text style={styles.statusLabel}>PAYMENT</Text>
                                                                        <Text style={styles.statusValue}>
                                                                                {safeUpper(order.paymentStatus)}
                                                                        </Text>
                                                                </View>
                                                        </View>
                                                </View>
                                        </View>

                                        <View style={[styles.section, styles.gridTwo]}>
                                                <View style={[styles.card, styles.gridColumn]}>
                                                        <Text style={styles.sectionTitle}>Bill To</Text>
                                                        <Text style={styles.value}>{safeText(order.customerName)}</Text>
                                                        <Text style={styles.addressLine}>{safeText(order.customerEmail)}</Text>
                                                        <Text style={styles.addressLine}>{safeText(order.customerMobile)}</Text>
                                                        {addressLines(billAddress).map((line, index) => (
                                                                <Text key={index} style={styles.addressLine}>
                                                                        {line}
                                                                </Text>
                                                        ))}
                                                </View>
                                                <View style={[styles.card, styles.gridColumn, styles.gridColumnLast]}>
                                                        <Text style={styles.sectionTitle}>Ship To</Text>
                                                        <Text style={styles.value}>{safeText(order.customerName)}</Text>
                                                        {addressLines(shipAddress).length > 0 ? (
                                                                addressLines(shipAddress).map((line, index) => (
                                                                        <Text key={index} style={styles.addressLine}>
                                                                                {line}
                                                                        </Text>
                                                                ))
                                                        ) : (
                                                                <Text style={styles.addressLine}>Same as billing address</Text>
                                                        )}
                                                </View>
                                        </View>

                                        <View style={[styles.section, styles.gridTwo]}>
                                                <View style={[styles.card, styles.gridColumn]}>
                                                        <Text style={styles.sectionTitle}>Order Summary</Text>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.label}>Order Date</Text>
                                                                <Text style={styles.value}>{formatDate(order.orderDate)}</Text>
                                                        </View>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.label}>Order Number</Text>
                                                                        <Text style={styles.value}>
                                                                                {safeText(order.orderNumber)}
                                                                        </Text>
                                                        </View>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.label}>Delivery ETA</Text>
                                                                <Text style={styles.value}>
                                                                        {formatDate(order.estimatedDelivery)}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.label}>Contact</Text>
                                                                <Text style={styles.value}>{safeText(order.customerMobile)}</Text>
                                                        </View>
                                                </View>
                                                <View style={[styles.card, styles.gridColumn, styles.gridColumnLast]}>
                                                        <Text style={styles.sectionTitle}>Payment Details</Text>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.label}>Method</Text>
                                                                <Text style={styles.value}>
                                                                        {formatPaymentMethod(order.paymentMethod)}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.label}>Status</Text>
                                                                <Text style={styles.value}>
                                                                        {safeUpper(order.paymentStatus)}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.label}>Transaction ID</Text>
                                                                        <Text style={styles.value}>
                                                                                {safeText(order.transactionId)}
                                                                        </Text>
                                                        </View>
                                                        <View style={styles.metaRow}>
                                                                <Text style={styles.label}>Amount Paid</Text>
                                                                <Text style={styles.value}>
                                                                        ₹{formatCurrency(amountPaid)}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>

                                        <View style={[styles.section, styles.tableSection]}>
                                                <View style={styles.tableHeader}>
                                                        <View style={styles.headerDescription}>
                                                                <Text style={styles.headerCell}>Item Description</Text>
                                                        </View>
                                                        <View style={styles.headerPrice}>
                                                                <Text style={styles.headerCell}>Unit Price</Text>
                                                        </View>
                                                        <View style={styles.headerQty}>
                                                                <Text style={styles.headerCell}>Qty</Text>
                                                        </View>
                                                        <View style={styles.headerTax}>
                                                                <Text style={styles.headerCell}>Tax</Text>
                                                        </View>
                                                        <View style={styles.headerTotal}>
                                                                <Text style={styles.headerCell}>Line Total</Text>
                                                        </View>
                                                </View>
                                                {products.map((product, index) => {
                                                        const quantity = toNumber(product.quantity) ?? 0;
                                                        const unitPrice = toNumber(product.price) ?? 0;
                                                        const mrp = toNumber(product.mrp);
                                                        const showMrp =
                                                                mrp !== null && mrp > 0 && mrp > unitPrice;
                                                        const subtotalValue = productTotals[index] ?? 0;
                                                        const taxInfo = taxAllocation[index] || { amount: 0, rate: null };
                                                        const productName = resolveProductName(product);
                                                        const productIdentifier = resolveProductIdentifier(product);

                                                        return (
                                                                <View
                                                                        key={productIdentifier || index}
                                                                        style={[
                                                                                styles.tableRow,
                                                                                index % 2 === 0 && styles.tableRowEven,
                                                                        ]}
                                                                >
                                                                        <View style={[styles.tableCell, styles.descriptionCell]}>
                                                                                <Text style={styles.itemName}>
                                                                                        {productName}
                                                                                </Text>
                                                                                {productIdentifier && (
                                                                                        <Text style={styles.itemMeta}>
                                                                                                SKU: {productIdentifier}
                                                                                        </Text>
                                                                                )}
                                                                                {showMrp && (
                                                                                        <Text style={styles.muted}>
                                                                                                MRP ₹{formatCurrency(mrp)}
                                                                                        </Text>
                                                                                )}
                                                                        </View>
                                                                        <View style={[styles.tableCell, styles.priceCell]}>
                                                                                <Text style={styles.amountBold}>
                                                                                        ₹{formatCurrency(unitPrice)}
                                                                                </Text>
                                                                        </View>
                                                                        <View style={[styles.tableCell, styles.qtyCell]}>
                                                                                <Text style={styles.amountBold}>{quantity}</Text>
                                                                        </View>
                                                                        <View style={[styles.tableCell, styles.taxCell]}>
                                                                                <Text style={styles.amountBold}>
                                                                                        {taxInfo.amount > 0
                                                                                                ? `₹${formatCurrency(taxInfo.amount)}`
                                                                                                : "-"}
                                                                                </Text>
                                                                                {taxInfo.rate ? (
                                                                                        <Text style={styles.muted}>
                                                                                                {taxInfo.rate}%
                                                                                        </Text>
                                                                                ) : null}
                                                                        </View>
                                                                        <View style={[styles.tableCell, styles.totalCell]}>
                                                                                <Text style={styles.amountBold}>
                                                                                        ₹{formatCurrency(subtotalValue + (taxInfo.amount || 0))}
                                                                                </Text>
                                                                        </View>
                                                                </View>
                                                        );
                                                })}
                                        </View>

                                        <View style={[styles.section, styles.summarySection]}>
                                                <View style={[styles.card, styles.notesCard]}>
                                                        <Text style={styles.sectionTitle}>Notes & Terms</Text>
                                                        <Text style={styles.addressLine}>
                                                                Thank you for choosing Ladwa Partners for your procurement
                                                                needs. Kindly review all items upon delivery. For any
                                                                discrepancies, contact us within 48 hours.
                                                        </Text>
                                                        {order.orderNotes ? (
                                                                <>
                                                                        <View style={styles.divider} />
                                                                        <Text style={styles.sectionTitle}>Order Notes</Text>
                                                                        <Text style={styles.addressLine}>
                                                                                {safeText(order.orderNotes, "--")}
                                                                        </Text>
                                                                </>
                                                        ) : null}
                                                </View>
                                                <View style={styles.totalsCard}>
                                                        <View style={styles.summaryRow}>
                                                                <Text style={styles.summaryLabel}>Subtotal</Text>
                                                                <Text style={styles.summaryValue}>
                                                                        ₹{formatCurrency(subtotal)}
                                                                </Text>
                                                        </View>
                                                        {discount > 0 && (
                                                                <View style={styles.summaryRow}>
                                                                        <Text style={styles.summaryLabel}>Discounts</Text>
                                                                        <Text
                                                                                style={[
                                                                                        styles.summaryValue,
                                                                                        styles.summaryValueNegative,
                                                                                ]}
                                                                        >
                                                                                -₹{formatCurrency(discount)}
                                                                        </Text>
                                                                </View>
                                                        )}
                                                        {couponDiscount > 0 && (
                                                                <View style={styles.summaryRow}>
                                                                        <Text style={styles.summaryLabel}>
                                                                                Coupon (
                                                                                {safeText(
                                                                                        order?.couponApplied?.couponCode,
                                                                                        "--"
                                                                                )}
                                                                                )
                                                                        </Text>
                                                                        <Text
                                                                                style={[
                                                                                        styles.summaryValue,
                                                                                        styles.summaryValueNegative,
                                                                                ]}
                                                                        >
                                                                                -₹{formatCurrency(couponDiscount)}
                                                                        </Text>
                                                                </View>
                                                        )}
                                                        {shipping > 0 && (
                                                                <View style={styles.summaryRow}>
                                                                        <Text style={styles.summaryLabel}>Shipping</Text>
                                                                        <Text style={styles.summaryValue}>
                                                                                ₹{formatCurrency(shipping)}
                                                                        </Text>
                                                                </View>
                                                        )}
                                                        {tax > 0 && (
                                                                <View style={styles.summaryRow}>
                                                                        <Text style={styles.summaryLabel}>Tax</Text>
                                                                        <Text style={styles.summaryValue}>
                                                                                ₹{formatCurrency(tax)}
                                                                        </Text>
                                                                </View>
                                                        )}
                                                        <View style={styles.divider} />
                                                        <View style={styles.summaryRow}>
                                                                <Text style={styles.grandTotalLabel}>Total Amount</Text>
                                                                <Text style={styles.grandTotalValue}>
                                                                        ₹{formatCurrency(total)}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.summaryRow}>
                                                                <Text style={styles.summaryLabel}>Amount Paid</Text>
                                                                <Text style={styles.summaryValue}>
                                                                        ₹{formatCurrency(amountPaid)}
                                                                </Text>
                                                        </View>
                                                        <View style={styles.balanceDue}>
                                                                <Text style={styles.balanceLabel}>Balance Due</Text>
                                                                <Text style={styles.balanceValue}>
                                                                        ₹{formatCurrency(balanceDue)}
                                                                </Text>
                                                        </View>
                                                </View>
                                        </View>

                                        <View style={styles.footer}>
                                                <Text style={styles.footerText}>
                                                        This is a system generated invoice and does not require a
                                                        physical signature.
                                                </Text>
                                                <Text style={styles.footerText}>
                                                        For support, write to {COMPANY.email} or call {COMPANY.phone}.
                                                </Text>
                                                <Text style={styles.footerText}>
                                                        GSTIN: {COMPANY.gstin} | CIN: U12345KA2014PTC000000
                                                </Text>
                                        </View>
                                </View>
                        </Page>
                </Document>
        );
};

const blobToBase64 = (blob) => {
        if (!blob) return Promise.resolve("");
        if (typeof window === "undefined" || typeof FileReader === "undefined") {
                return Promise.resolve("");
        }
        return new Promise((resolve, reject) => {
                try {
                        const reader = new FileReader();
                        reader.onerror = () => reject(new Error("Failed to read PDF blob"));
                        reader.onloadend = () => {
                                const result = reader.result;
                                if (typeof result === "string") {
                                        resolve(result);
                                } else {
                                        resolve("");
                                }
                        };
                        reader.readAsDataURL(blob);
                } catch (error) {
                        reject(error);
                }
        });
};

const bufferToBase64 = (buffer) => {
        if (!buffer) return "";
        if (typeof buffer.toString === "function") {
                return `data:application/pdf;base64,${buffer.toString("base64")}`;
        }

        if (typeof Buffer !== "undefined") {
                return `data:application/pdf;base64,${Buffer.from(buffer).toString("base64")}`;
        }

        return "";
};

const sanitizeOrderForInvoice = (order) => {
        if (!order) {
                return {};
        }


        const seen = new WeakSet();

        const sanitize = (value) => {
                if (value === null || value === undefined) {
                        return null;
                }

                const valueType = typeof value;

                if (valueType === "string" || valueType === "number" || valueType === "boolean") {
                        if (valueType === "number" && !Number.isFinite(value)) {
                                return null;
                        }
                        return value;
                }

                if (value instanceof Date) {
                        return value.toISOString();
                }

                if (
                        typeof Buffer !== "undefined" &&
                        typeof Buffer.isBuffer === "function" &&
                        Buffer.isBuffer(value)
                ) {
                        return value.toString("base64");
                }

                if (value && value._bsontype === "ObjectID" && typeof value.toString === "function") {
                        return value.toString();
                }

                if (value && value.$$typeof) {
                        return null;
                }

                if (valueType === "function" || valueType === "symbol") {
                        return null;
                }

                if (seen.has(value)) {
                        return null;
                }

                seen.add(value);

                if (typeof value.toJSON === "function" && value.toJSON !== Object.prototype.toJSON) {
                        try {
                                return sanitize(value.toJSON({ virtuals: true }));
                        } catch (error) {
                                console.warn("Failed to run toJSON when sanitising invoice data", error);
                        }
                }

                if (typeof value.toObject === "function") {
                        try {
                                return sanitize(value.toObject({ virtuals: true }));
                        } catch (error) {
                                console.warn("Failed to run toObject when sanitising invoice data", error);
                        }
                }

                if (Array.isArray(value)) {
                        return value
                                .map((entry) => sanitize(entry))
                                .filter((entry) => entry !== null && entry !== undefined);
                }

                if (value instanceof Map) {
                        const mapResult = {};
                        for (const [key, entry] of value.entries()) {
                                const sanitisedEntry = sanitize(entry);
                                if (sanitisedEntry !== null && sanitisedEntry !== undefined) {
                                        mapResult[key] = sanitisedEntry;
                                }
                        }
                        return mapResult;
                }

                if (value instanceof Set) {
                        return Array.from(value)
                                .map((entry) => sanitize(entry))
                                .filter((entry) => entry !== null && entry !== undefined);
                }

                if (value && typeof value === "object") {
                        const result = {};
                        for (const key of Object.keys(value)) {
                                const sanitisedValue = sanitize(value[key]);
                                if (sanitisedValue !== null && sanitisedValue !== undefined) {
                                        result[key] = sanitisedValue;
                                }
                        }
                        return result;
                }

                return null;
        };

        return sanitize(order) || {};

};

const createPdfInstance = (order) => {
        const sanitizedOrder = sanitizeOrderForInvoice(order);
        return pdf(<InvoiceDocument order={sanitizedOrder} />);
};

export const generateInvoicePdfData = async (order) => {
        const instance = createPdfInstance(order);

        if (typeof window === "undefined") {
                const buffer = await instance.toBuffer();
                return {
                        buffer,
                        base64: bufferToBase64(buffer),
                };
        }

        const blob = await instance.toBlob();
        const base64 = await blobToBase64(blob);
        return {
                blob,
                base64,
        };
};

export const generateInvoicePDF = async (order) => {
        const result = await generateInvoicePdfData(order);

        if (typeof window === "undefined") {
                return result.buffer;
        }

        return result.blob;
};

export default InvoiceDocument;
