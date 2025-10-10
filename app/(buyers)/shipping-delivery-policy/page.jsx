import Link from "next/link";

export const metadata = {
        title: "Shipping & Delivery Policy | Industrial Print Solutions",
};

const sections = [
        {
                title: "1) Scope & Coverage",
                items: [
                        {
                                type: "paragraph",
                                text: "We ship pan-India via reputed courier partners. International shipping can be enabled on request (duties/taxes/KYC borne by buyer).",
                        },
                        {
                                type: "paragraph",
                                text: "We may ship an order in multiple consignments to speed delivery.",
                        },
                ],
        },
        {
                title: "2) Order Processing & Production",
                items: [
                        {
                                type: "paragraph",
                                text: "Customized items (with your logo/QR):",
                        },
                        {
                                type: "list",
                                items: [
                                        "Design proof: typically 1–2 business days.",
                                        "Production: 2–4 business days after you approve the proof.",
                                ],
                        },
                        {
                                type: "paragraph",
                                text: "Standard items: usually 1–2 business days to dispatch.",
                        },
                        {
                                type: "paragraph",
                                text: "Production/dispatch timelines are estimates, vary by quantity, finishes, and approval speed.",
                        },
                ],
        },
        {
                title: "3) Dispatch & Transit",
                items: [
                        {
                                type: "paragraph",
                                text: "Dispatch on business days (no Sundays/public holidays unless stated).",
                        },
                        {
                                type: "paragraph",
                                text: "Typical domestic transit: 2–10 business days; remote areas may take longer.",
                        },
                        {
                                type: "paragraph",
                                text: "Tracking details are shared by email/SMS/WhatsApp once the shipment is booked.",
                        },
                ],
        },
        {
                title: "4) Shipping Charges & COD",
                items: [
                        {
                                type: "paragraph",
                                text: "Shipping is free across India on every order—no minimum purchase or hidden fees.",
                        },
                        {
                                type: "paragraph",
                                text: "International shipping can be enabled on request; duties/taxes/KYC formalities remain the buyer's responsibility.",
                        },
                        {
                                type: "paragraph",
                                text: "COD, if available, may carry a handling fee and limits; repeated COD refusals may disable COD for future orders.",
                        },
                ],
        },
        {
                title: "5) Address Changes & Delivery Attempts",
                items: [
                        {
                                type: "paragraph",
                                text: "Address changes are possible before dispatch only.",
                        },
                        {
                                type: "paragraph",
                                text: "Couriers usually make 2–3 attempts; undelivered parcels may be RTO (returned to origin). We will coordinate with you for the smoothest possible resolution.",
                        },
                ],
        },
        {
                title: "6) On-Delivery Inspection & Damage Claims",
                items: [
                        {
                                type: "paragraph",
                                text: "Please inspect on delivery. For transit damage/shortage, email us within 48 hours of delivery with order # + unboxing video + photos.",
                        },
                        {
                                type: "paragraph",
                                text: "Keep the packaging until we complete assessment. Approved cases are resolved via reprint/replacement (refund only if reprint isn’t reasonably possible).",
                        },
                ],
        },
        {
                title: "7) Risk, Title & Delays",
                items: [
                        {
                                type: "paragraph",
                                text: "Risk and title pass to you on delivery confirmation (PoD/OTP).",
                        },
                        {
                                type: "paragraph",
                                text: "We’re not liable for delays caused by courier operational issues, weather, regulations, strikes, or force-majeure; we’ll support with escalation/tracking.",
                        },
                ],
        },
        {
                title: "8) Logo & Privacy Note (for shipping docs)",
                items: [
                        {
                                type: "paragraph",
                                text: "We only use your logo to produce your ordered materials and related QR pages. We do not print your logo on shipping labels/marketing collateral unless you ask us to.",
                        },
                        {
                                type: "paragraph",
                                text: "We share only necessary data with couriers to deliver your order (see Privacy Policy).",
                        },
                ],
        },
];

export default function ShippingDeliveryPolicyPage() {
        return (
                <main className="bg-white text-gray-900">
                        <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 px-6 py-16 sm:px-8 lg:px-12">
                                <header className="space-y-4">
                                        <p className="text-sm font-medium uppercase tracking-wide text-amber-600">
                                                Effective date: 01 September 2025
                                        </p>
                                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                                Shipping &amp; Delivery Policy
                                        </h1>
                                        <p className="text-base text-gray-600">
                                                Grievance contact:{" "}
                                                <Link
                                                        href="mailto:info@industrialprintsolutions.com"
                                                        className="text-amber-600 hover:text-amber-700"
                                                >
                                                        info@industrialprintsolutions.com
                                                </Link>
                                        </p>
                                </header>

                                <div className="space-y-10 text-base leading-relaxed text-gray-700">
                                        {sections.map((section) => (
                                                <section key={section.title} className="space-y-4">
                                                        <h2 className="text-xl font-semibold text-gray-900">
                                                                {section.title}
                                                        </h2>
                                                        <div className="space-y-3">
                                                                {section.items.map((item) => {
                                                                        if (item.type === "list") {
                                                                                return (
                                                                                        <ul
                                                                                                key={item.items.join("-")}
                                                                                                className="list-disc space-y-2 pl-6 text-gray-700"
                                                                                        >
                                                                                                {item.items.map((listItem) => (
                                                                                                        <li key={listItem}>{listItem}</li>
                                                                                                ))}
                                                                                        </ul>
                                                                                );
                                                                        }

                                                                        const isLabel = item.text.trim().endsWith(":");

                                                                        return (
                                                                                <p
                                                                                        key={item.text}
                                                                                        className={
                                                                                                isLabel
                                                                                                        ? "font-semibold text-gray-900"
                                                                                                        : undefined
                                                                                        }
                                                                                >
                                                                                        {item.text}
                                                                                </p>
                                                                        );
                                                                })}
                                                        </div>
                                                </section>
                                        ))}

                                        <section className="space-y-3">
                                                <h2 className="text-xl font-semibold text-gray-900">9) Contact</h2>
                                                <p>
                                                        For shipping questions or escalations, write to{" "}
                                                        <Link
                                                                href="mailto:info@industrialprintsolutions.com"
                                                                className="text-amber-600 hover:text-amber-700"
                                                        >
                                                                info@industrialprintsolutions.com
                                                        </Link>{" "}
                                                        with subject “Shipping – [Order #]”.
                                                </p>
                                        </section>
                                </div>
                        </div>
                </main>
        );
}
