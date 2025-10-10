import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

const comparisonData = [
        {
                feature: "Purpose & Impact",
                qr: {
                        status: "positive",
                        text: "Transforms walls into a digital training tool",
                },
                standard: {
                        status: "positive",
                        text: "Strong visual communication tool",
                },
        },
        {
                feature: "Multilingual",
                qr: {
                        status: "positive",
                        text: "Six languages accessible instantly via QR",
                },
                standard: {
                        status: "negative",
                        text: "Single language per print",
                },
        },
        {
                feature: "Video Training",
                qr: {
                        status: "positive",
                        text: "Watch short training videos on demand",
                },
                standard: {
                        status: "negative",
                        text: "Not applicable",
                },
        },
        {
                feature: "LMS & Certificate",
                qr: {
                        status: "positive",
                        text: "Direct LMS access plus 65% off on certification",
                },
                standard: {
                        status: "negative",
                        text: "Not available",
                },
        },
        {
                feature: "Smart Tech Appeal",
                qr: {
                        status: "positive",
                        text: "Modern, premium look with QR innovation",
                },
                standard: {
                        status: "negative",
                        text: "Traditional poster presentation",
                },
        },
        {
                feature: "Custom Printed Logo",
                qr: {
                        status: "positive",
                        text: "Available",
                },
                standard: {
                        status: "positive",
                        text: "Available",
                },
        },
        {
                feature: "Easy Reordering",
                qr: {
                        status: "positive",
                        text: "Instant digital tracking for quick reorders",
                },
                standard: {
                        status: "positive",
                        text: "Available via catalogue or website",
                },
        },
        {
                feature: "Durability & Print Quality",
                qr: {
                        status: "positive",
                        text: "Same IPS premium print quality",
                },
                standard: {
                        status: "positive",
                        text: "Same IPS premium print quality",
                },
        },
        {
                feature: "Updates & Add-ons",
                qr: {
                        status: "positive",
                        text: "Update digital content anytime",
                },
                standard: {
                        status: "negative",
                        text: "Reprint needed for changes",
                },
        },
];

const statusIcon = {
        positive: <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" aria-hidden="true" />,
        negative: <XCircle className="h-5 w-5 flex-shrink-0 text-rose-500" aria-hidden="true" />,
};

function ComparisonCell({ cell }) {
        const { status = "neutral", text } = cell;
        return (
                <div className="flex items-start gap-2">
                        {status !== "neutral" && statusIcon[status]}
                        <span className="text-sm leading-6 text-slate-700">{text}</span>
                </div>
        );
}

export const metadata = {
        title: "Smart QR vs Standard Posters | IPS",
        description:
                "Compare IPS Smart QR Safety Posters with traditional standard posters and discover the benefits of interactive, multilingual safety training.",
};

export default function SmartQrVsStandardPostersPage() {
        return (
                <div className="bg-gradient-to-br from-yellow-50 via-white to-blue-50 text-slate-900">
                        <section className="relative overflow-hidden">
                                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,229,143,0.4),_transparent_60%)]" aria-hidden="true" />
                                <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
                                        <div className="mx-auto max-w-3xl text-center">
                                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-300 shadow-lg shadow-slate-900/10">
                                                        Smart Safety Spotlight
                                                </span>
                                                <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                                        Smart QR vs Standard Safety Posters
                                                </h1>
                                                <p className="mt-4 text-base leading-7 text-slate-700 sm:text-lg">
                                                        Explore how IPS Smart QR Safety Posters transform your safety communication with interactive, always-current training experiences—all without compromising print quality.
                                                </p>
                                        </div>
                                </div>
                        </section>

                        <section className="mx-auto max-w-6xl px-4 pb-16 sm:pb-20">
                                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                                        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 sm:px-10">
                                                <div className="grid gap-6 text-center text-slate-100 sm:grid-cols-3 sm:text-left">
                                                        <div className="sm:col-span-1">
                                                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Feature</p>
                                                        </div>
                                                        <div className="sm:col-span-1">
                                                                <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">QR Safety Posters</p>
                                                        </div>
                                                        <div className="sm:col-span-1">
                                                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-100">Standard Posters</p>
                                                        </div>
                                                </div>
                                        </div>
                                        <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-slate-200">
                                                        <tbody className="divide-y divide-slate-100">
                                                                {comparisonData.map((row) => (
                                                                        <tr key={row.feature} className="bg-white/70 backdrop-blur">
                                                                                <th scope="row" className="whitespace-nowrap px-6 py-5 text-left text-sm font-semibold text-slate-900 sm:w-1/4">
                                                                                        {row.feature}
                                                                                </th>
                                                                                <td className="px-6 py-5 sm:w-5/12">
                                                                                        <ComparisonCell cell={row.qr} />
                                                                                </td>
                                                                                <td className="px-6 py-5 sm:w-5/12">
                                                                                        <ComparisonCell cell={row.standard} />
                                                                                </td>
                                                                        </tr>
                                                                ))}
                                                        </tbody>
                                                </table>
                                        </div>
                                </div>
                        </section>

                        <section className="mx-auto max-w-5xl px-4 pb-20">
                                <div className="rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-xl shadow-slate-200/70 backdrop-blur">
                                        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">What Makes IPS QR Safety Posters Truly Smart?</h2>
                                        <p className="mt-4 text-base leading-7 text-slate-700">
                                                IPS QR Safety Posters are not just visual reminders—they are interactive safety trainers fixed right on your factory walls. Each poster carries a unique QR code that, when scanned, instantly opens a digital page with six language options for better understanding across your team. Workers can watch short, topic-based videos, access the LMS portal at a special discounted rate, and even get certified—all from the same poster.
                                        </p>
                                        <p className="mt-4 text-base leading-7 text-slate-700">
                                                With IPS’s Smart QR Poster technology, you can update content anytime without reprinting, ensuring your safety communication always stays current. Designed with the same premium print quality and custom logo options as our standard posters, these QR versions add a modern, tech-smart appeal to your workplace. It’s not just a poster—it’s a complete scan-to-train system built for today’s industrial safety culture.
                                        </p>
                                        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                                                <p className="text-sm font-medium text-slate-600">Contact us if you want to know more about QR posters.</p>
                                                <Link
                                                        href="/contact"
                                                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-yellow-200 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 hover:text-yellow-100"
                                                >
                                                        Contact IPS Safety Experts
                                                </Link>
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
