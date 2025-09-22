import Image from "next/image";
import Link from "next/link";

import { ArrowRight, CalendarCheck, CheckCircle2, Layers, Mail, Sparkles, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import PlanEssentialsPoster from "@/public/images/products/PS-P2.png";
import PlanEngagePoster from "@/public/images/products/SB-P2.png";
import PlanEnterprisePoster from "@/public/images/products/RS-P6.png";
import PosterDigital from "@/public/images/products/Q-Please-P4.png";
import PosterBehaviour from "@/public/images/products/PS-P7.png";

export const metadata = {
        title: "Monthly Safety Poster Subscriptions | Infinite Poster Shop",
        description:
                "Choose from curated subscription tiers delivering fresh safety posters, digital assets and engagement toolkits every month.",
};

const navigationOptions = [
        { label: "All Safety Posters", href: "/all-safety-posters" },
        { label: "Industrial Safety Packs", href: "/industrial-safety-packs" },
        { label: "Monthly Poster Subscriptions", href: "#plans", highlight: true },
        { label: "Corporate Bulk/Custom Orders", href: "/corporate-bulk-orders" },
];

const subscriptionPlans = [
        {
                name: "Awareness Stream",
                price: "₹2,499/mo",
                description: "Keep a single facility inspired with timely safety campaigns and supervisor prompts.",
                image: PlanEssentialsPoster,
                perks: [
                        "3 theme-based posters and digital signage files",
                        "Monthly supervisor briefing card",
                        "Email + WhatsApp copy blocks in English",
                ],
        },
        {
                name: "Engagement Plus",
                price: "₹4,799/mo",
                description: "Drive conversations across multiple shopfloors with deeper storytelling assets.",
                image: PlanEngagePoster,
                highlight: true,
                perks: [
                        "5 posters including two semi-custom variants",
                        "Gamified challenge kit with stickers and leaderboard poster",
                        "Dual-language copy deck and campaign calendar",
                ],
        },
        {
                name: "Enterprise Impact",
                price: "₹8,499/mo",
                description: "Scale to multi-site programmes with localisation support and adoption analytics.",
                image: PlanEnterprisePoster,
                perks: [
                        "8 posters with plant-specific localisation",
                        "Quarterly mega-campaign toolkit with event collateral",
                        "Dedicated success manager + rollout dashboard",
                ],
        },
];

const monthlyDeliverables = [
        {
                title: "Poster storytelling kit",
                description:
                        "Illustrated, message-first posters ready for A2/A3 print along with editable files for quick tweaks.",
                icon: Sparkles,
        },
        {
                title: "Digital broadcast bundle",
                description:
                        "Portrait and landscape screen loops, WhatsApp snippets and social-ready graphics mirrored to the print theme.",
                icon: Layers,
        },
        {
                title: "Engagement toolbox",
                description:
                        "Toolbox talk prompts, employee challenge ideas, quiz cards and recognition badges to keep momentum high.",
                icon: Users,
        },
];

const onboardingSteps = [
        {
                title: "Share your focus areas",
                description: "Tell us about high-priority risks, key dates and internal branding guidelines.",
        },
        {
                title: "Approve the monthly slate",
                description: "Receive upcoming themes on the 20th of every month for quick comments and alignment.",
        },
        {
                title: "Deploy and measure",
                description: "Posters, digital assets and engagement trackers land by the 1st so you can kick off campaigns instantly.",
        },
];

export default function MonthlyPosterSubscriptionsPage() {
        return (
                <div className="bg-white text-slate-900">
                        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-white">
                                <div className="absolute -left-16 top-24 hidden h-52 w-52 rounded-full bg-amber-200/60 blur-3xl lg:block" />
                                <div className="absolute -right-12 bottom-0 hidden h-56 w-56 rounded-full bg-yellow-300/40 blur-3xl md:block" />
                                <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
                                        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                                                <div className="space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700">
                                                                Monthly Poster Subscriptions
                                                        </span>
                                                        <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                                                                Fresh safety campaigns on autopilot every month
                                                        </h1>
                                                        <p className="text-lg text-slate-600">
                                                                Pick a plan, set your priorities and receive poster storytelling kits, digital assets and engagement boosters right on schedule.
                                                        </p>
                                                        <div className="flex flex-wrap gap-3">
                                                                {navigationOptions.map((option) => (
                                                                        <Link
                                                                                key={option.label}
                                                                                href={option.href}
                                                                                className={`inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium transition-all ${
                                                                                        option.highlight
                                                                                                ? "bg-black text-yellow-300 shadow-lg ring-1 ring-yellow-400/60 animate-blink-slow hover:bg-yellow-400 hover:text-black"
                                                                                                : "bg-white/80 text-slate-700 hover:bg-amber-100 hover:text-slate-900"
                                                                                }`}
                                                                        >
                                                                                {option.label}
                                                                        </Link>
                                                                ))}
                                                        </div>
                                                        <div className="flex flex-wrap gap-3">
                                                                <Link
                                                                        href="/contact"
                                                                        className={cn(
                                                                                buttonVariants({ size: "lg" }),
                                                                                "bg-amber-500 text-white shadow-lg hover:bg-amber-400"
                                                                        )}
                                                                >
                                                                        Talk to a subscription specialist
                                                                        <ArrowRight className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                        href="/industrial-safety-packs"
                                                                        className={cn(
                                                                                buttonVariants({ variant: "outline", size: "lg" }),
                                                                                "border-amber-500 text-amber-700 hover:bg-amber-50"
                                                                        )}
                                                                >
                                                                        Explore signage packs
                                                                </Link>
                                                        </div>
                                                        <div className="flex flex-wrap gap-6 pt-4 text-sm text-amber-700">
                                                                <div className="flex items-center gap-2">
                                                                        <CalendarCheck className="h-5 w-5" />
                                                                        <span>New themes released every 30 days</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                        <Mail className="h-5 w-5" />
                                                                        <span>Delivery via email, WhatsApp and shared drive</span>
                                                                </div>
                                                        </div>
                                                </div>
                                                <div className="relative">
                                                        <Card className="overflow-hidden rounded-3xl border border-amber-100 bg-white/90 shadow-2xl">
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-semibold text-slate-900">
                                                                                Story-driven creative drops
                                                                        </CardTitle>
                                                                        <CardDescription className="text-slate-600">
                                                                                Poster narratives blend compliance reminders with culture-building hooks.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <Image
                                                                                src={PosterBehaviour}
                                                                                alt="Behavioural safety subscription poster"
                                                                                className="h-60 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <p className="text-sm text-slate-600">
                                                                                Annotated guides highlight talking points, campaign ideas and cross-channel suggestions tailored for your teams.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <section id="plans" className="bg-white py-20">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="mx-auto max-w-3xl text-center">
                                                <span className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700">
                                                        Plan comparison
                                                </span>
                                                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                        Three subscription paths to match your scale
                                                </h2>
                                                <p className="mt-4 text-base text-slate-600">
                                                        Every tier includes shipping-ready print files, digital variants and engagement prompts. Upgrade or downgrade any time after three cycles.
                                                </p>
                                        </div>
                                        <div className="mt-12 grid gap-8 lg:grid-cols-3">
                                                {subscriptionPlans.map((plan) => (
                                                        <Card
                                                                key={plan.name}
                                                                className={cn(
                                                                        "flex h-full flex-col border-amber-100 bg-white shadow-lg",
                                                                        plan.highlight && "border-amber-300 ring-2 ring-amber-300"
                                                                )}
                                                        >
                                                                <CardHeader className="space-y-3">
                                                                        <div className="flex items-start justify-between gap-3">
                                                                                <div>
                                                                                        <CardTitle className="text-lg text-slate-900">{plan.name}</CardTitle>
                                                                                        <CardDescription className="text-sm text-slate-600">{plan.description}</CardDescription>
                                                                                </div>
                                                                                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
                                                                                        {plan.price}
                                                                                </span>
                                                                        </div>
                                                                        {plan.highlight && (
                                                                                <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
                                                                                        <Sparkles className="h-3.5 w-3.5" /> Most popular
                                                                                </span>
                                                                        )}
                                                                </CardHeader>
                                                                <CardContent className="flex flex-1 flex-col gap-4">
                                                                        <div className="rounded-2xl bg-amber-50/70 p-4">
                                                                                <Image
                                                                                        src={plan.image}
                                                                                        alt={`${plan.name} poster preview`}
                                                                                        className="mx-auto h-52 w-full rounded-xl object-contain drop-shadow"
                                                                                />
                                                                        </div>
                                                                        <ul className="space-y-2 text-sm text-slate-600">
                                                                                {plan.perks.map((perk) => (
                                                                                        <li key={perk} className="flex items-start gap-2">
                                                                                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-500" />
                                                                                                <span>{perk}</span>
                                                                                        </li>
                                                                                ))}
                                                                        </ul>
                                                                        <Link
                                                                                href="/contact"
                                                                                className={cn(
                                                                                        buttonVariants({ size: "sm" }),
                                                                                        "mt-auto w-full bg-amber-500 text-white shadow-md hover:bg-amber-400"
                                                                                )}
                                                                        >
                                                                                Schedule a demo drop
                                                                                <ArrowRight className="h-4 w-4" />
                                                                        </Link>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        <section className="bg-amber-50/70 py-20">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="grid items-center gap-12 lg:grid-cols-2">
                                                <div className="space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow">
                                                                What's inside each drop
                                                        </span>
                                                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                                                Campaign assets for print, screens and people moments
                                                        </h2>
                                                        <p className="text-base text-slate-600">
                                                                Purpose-built collateral helps you activate awareness days, toolbox talks and leadership messaging without scrambling for creatives.
                                                        </p>
                                                        <div className="space-y-4">
                                                                {monthlyDeliverables.map((deliverable) => (
                                                                        <div key={deliverable.title} className="flex items-start gap-4 rounded-2xl bg-white/80 p-5 shadow-md ring-1 ring-amber-100">
                                                                                <deliverable.icon className="h-6 w-6 text-amber-600" />
                                                                                <div>
                                                                                        <h3 className="text-lg font-semibold text-slate-900">{deliverable.title}</h3>
                                                                                        <p className="mt-1 text-sm text-slate-600">{deliverable.description}</p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                                <div className="relative">
                                                        <div className="absolute -left-10 top-10 hidden h-44 w-44 rounded-full bg-amber-200/80 blur-3xl md:block" />
                                                        <Card className="overflow-hidden rounded-3xl border border-amber-100 bg-white text-slate-900 shadow-xl">
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-semibold text-slate-900">
                                                                                Digital signage companion
                                                                        </CardTitle>
                                                                        <CardDescription className="text-slate-600">
                                                                                Keep remote teams aligned with poster-matched loops and message reminders.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <Image
                                                                                src={PosterDigital}
                                                                                alt="Digital safety poster subscription asset"
                                                                                className="h-56 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <ul className="space-y-2 text-sm text-slate-600">
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-500" />
                                                                                        Portrait &amp; landscape screen ratios covered
                                                                                </li>
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-500" />
                                                                                        Weekly reminder captions for intranet or WhatsApp
                                                                                </li>
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-500" />
                                                                                        Link shorteners &amp; QR art for fast employee access
                                                                                </li>
                                                                        </ul>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <section className="bg-white py-20">
                                <div className="mx-auto max-w-5xl px-6 text-center">
                                        <span className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700">
                                                Getting started is simple
                                        </span>
                                        <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                                                Align, approve and launch in three collaborative steps
                                        </h2>
                                        <p className="mt-4 text-base text-slate-600">
                                                Our content strategists stay in touch throughout the month to capture feedback, share previews and measure poster adoption across every channel.
                                        </p>
                                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                                                {onboardingSteps.map((step, index) => (
                                                        <Card key={step.title} className="h-full border-amber-100 bg-white shadow-lg">
                                                                <CardHeader className="space-y-3">
                                                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-sm font-semibold text-amber-700">
                                                                                {index + 1}
                                                                        </span>
                                                                        <CardTitle className="text-lg text-slate-900">{step.title}</CardTitle>
                                                                        <CardDescription className="text-slate-600">{step.description}</CardDescription>
                                                                </CardHeader>
                                                        </Card>
                                                ))}
                                        </div>
                                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                                                <Link
                                                        href="/corporate-bulk-orders"
                                                        className={cn(
                                                                buttonVariants({ size: "lg" }),
                                                                "bg-amber-500 text-white shadow-lg hover:bg-amber-400"
                                                        )}
                                                >
                                                        Plan a corporate-wide subscription
                                                        <ArrowRight className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                        href="mailto:subscriptions@infinitesafety.in"
                                                        className="inline-flex items-center text-sm font-semibold text-amber-700 underline-offset-4 hover:text-amber-600 hover:underline"
                                                >
                                                        Email our subscription desk
                                                </Link>
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
