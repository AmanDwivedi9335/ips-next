import Image from "next/image";
import Link from "next/link";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
        ArrowRight,
        Building2,
        CalendarCheck,
        CheckCircle2,
        ClipboardCheck,
        Layers,
        MessageCircle,
        Palette,
        Phone,
        ShieldCheck,
        Sparkles,
        Users,
} from "lucide-react";

import PosterCompliance from "@/public/images/products/PS-P1.png";
import PosterEmergency from "@/public/images/products/PS-P5.png";
import PosterBehaviour from "@/public/images/products/PS-P7.png";
import PosterDigital from "@/public/images/products/Q-Please-P4.png";
import PosterSignageKitA from "@/public/images/products/RS-P3.png";
import PosterSignageKitB from "@/public/images/products/RS-P5.png";
import PlanEssentialsPoster from "@/public/images/products/PS-P2.png";
import PlanEngagePoster from "@/public/images/products/SB-P2.png";
import PlanEnterprisePoster from "@/public/images/products/RS-P6.png";


export const metadata = {
        title: "Safety Posters & Industrial Packs | Infinite Poster Shop",
        description:
                "Discover curated safety posters, industrial safety packs, subscriptions and custom corporate solutions designed for modern workplaces.",
};

const navigationOptions = [
        { label: "All Safety Posters", href: "#posters" },
        { label: "Industrial Safety Packs", href: "/industrial-safety-packs" },
        { label: "Monthly Poster Subscriptions", href: "/monthly-poster-subscriptions" },
        {
                label: "Corporate Bulk/Custom Orders",
                href: "/corporate-bulk-orders",

                highlight: true,
        },
];

const posterShowcase = [
        {
                title: "Compliance Essentials",
                description:
                        "Keep mandatory instructions front and centre with high-impact typography and iconography designed to meet regulatory guidelines.",
                image: PosterCompliance,
                highlights: [
                        "Ready-to-print in English & Hindi",
                        "High-contrast icons for quick scanning",
                        "QR-enabled space for linking SOP videos",
                ],
        },
        {
                title: "Emergency Response Series",
                description:
                        "Colour-coded layouts for fire, evacuation, first-aid and hazard communication scenarios that employees can understand at a glance.",
                image: PosterEmergency,
                highlights: [
                        "A2 & A3 sizes with matte or glossy finish",
                        "Laminated for long-life in high traffic areas",
                        "Includes editable templates for site-specific data",
                ],
        },
        {
                title: "Behavioural Safety Collection",
                description:
                        "Motivate safer habits with story-led illustrations and micro-messaging that encourage conversations around safety culture.",
                image: PosterBehaviour,
                highlights: [
                        "Engaging illustrations to reinforce key messages",
                        "Space to add your branding and helpline numbers",
                        "Available as printable and digital signage variants",
                ],
        },
];

const packHighlights = [
        {

                title: "Risk-zone specific poster sets",
                description:
                        "Curated bundles for production lines, warehouses and utilities featuring hazard signage sequenced for footfall-heavy areas.",
                icon: Layers,
        },
        {
                title: "Print + digital signage bundle",
                description:
                        "Receive press-ready artwork alongside screen loops, screen saver slides and QR labels that mirror the on-wall posters.",
                icon: ClipboardCheck,
        },
        {
                title: "Deployment & refresh guidance",
                description:
                        "Playbooks map poster placement, rotation cadence and engagement prompts so supervisors can activate every corner quickly.",

                icon: Users,
        },
];

const packContents = [

        "Hazard communication poster suite",
        "Emergency exit & muster point signage",
        "Lockout/tagout instruction infographics",
        "Machine-specific SOP poster pairings",
        "Daily checklist & audit status board",
        "Incident hotline QR sticker set",

];

const subscriptionMilestones = [
        {
                title: "Fresh designs every month",
                description:
                        "Receive three themed posters covering trending safety topics, seasonal risks and campaign ideas for toolbox talks.",
                icon: CalendarCheck,
        },
        {
                title: "Digital + print bundle",
                description:
                        "High-resolution print files alongside screen-ready graphics for emails, WhatsApp and digital signage loops.",
                icon: Layers,
        },
        {
                title: "Engagement toolkit",
                description:
                        "Includes talking points, employee challenge ideas and QR codes that link to micro-learning capsules.",
                icon: Sparkles,
        },
];


const corporateHighlights = [
        {
                title: "Brand-aligned storytelling",
                description:
                        "Tailor colours, tone and imagery to match your corporate identity without losing compliance accuracy.",
                icon: Palette,
        },
        {
                title: "Pan-India fulfilment",
                description:
                        "Print, pack and dispatch to every plant and regional office with centralised tracking and re-order support.",
                icon: Building2,
        },
        {
                title: "Workforce engagement",
                description:
                        "Gamified campaigns, reward charts and event kits to activate safety days and awareness weeks across teams.",
                icon: Users,
        },
        {
                title: "Audit-ready documentation",
                description:
                        "Get digital archives, roll-out logs and photographic evidence packs to simplify compliance reporting.",
                icon: ShieldCheck,
        },
];

const contactChannels = [
        {
                title: "Book a design consultation",
                description: "30-minute virtual walkthrough with our safety communication strategist.",
                href: "mailto:solutions@infinitesafety.in",
                cta: "Schedule now",
                icon: CalendarCheck,
        },
        {
                title: "Request WhatsApp catalogue",
                description: "Preview monthly poster drops and industrial pack combos instantly.",
                href: "https://wa.me/919876543210",
                cta: "Open WhatsApp",
                icon: MessageCircle,
        },
        {
                title: "Call our corporate desk",
                description: "Speak with a specialist for bulk pricing and rollout timelines.",
                href: "tel:+919811223344",
                cta: "Call now",
                icon: Phone,
        },
];

export default function AllSafetyPostersPage() {
        return (
                <div className="bg-white text-slate-900">
                        <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-white">
                                <div className="absolute -right-10 top-16 hidden h-56 w-56 rounded-full bg-yellow-200/60 blur-3xl md:block" />
                                <div className="absolute -left-16 bottom-10 hidden h-48 w-48 rounded-full bg-amber-100/70 blur-2xl lg:block" />
                                <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
                                        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                                                <div className="relative z-10 space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-700">
                                                                <Sparkles className="h-4 w-4" />
                                                                Your Safety Story, Beautifully Told
                                                        </span>
                                                        <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                                                                Simplify workplace safety communication with design-first resources
                                                        </h1>
                                                        <p className="text-lg text-slate-600">
                                                                From quick-win posters to enterprise rollouts, Infinite Poster Shop delivers ready-to-use creatives that keep teams informed, engaged and audit-ready.
                                                        </p>
                                                        <div className="flex flex-wrap gap-3">
                                                                {navigationOptions.map((option) => (
                                                                        <Link
                                                                                key={option.label}
                                                                                href={option.href}
                                                                                className={`inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium transition-all ${
                                                                                        option.highlight
                                                                                                ? "bg-black text-yellow-300 shadow-lg ring-1 ring-yellow-400/60 animate-blink-slow hover:bg-yellow-400 hover:text-black"
                                                                                                : "bg-white/80 text-slate-700 hover:bg-yellow-100 hover:text-slate-900"
                                                                                }`}
                                                                        >
                                                                                {option.label}
                                                                        </Link>
                                                                ))}
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 pt-4">
                                                                <Link
                                                                        href="#posters"
                                                                        className={cn(
                                                                                buttonVariants({ size: "lg" }),
                                                                                "bg-yellow-500 text-black shadow-lg hover:bg-yellow-400"
                                                                        )}
                                                                >
                                                                        Explore posters
                                                                        <ArrowRight className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                        href="#contact"
                                                                        className={cn(
                                                                                buttonVariants({ variant: "outline", size: "lg" }),
                                                                                "border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                                                                        )}
                                                                >
                                                                        Talk to a specialist
                                                                </Link>
                                                        </div>
                                                        <div className="flex flex-wrap gap-6 pt-6 text-sm text-slate-500">
                                                                <div className="flex items-center gap-2">
                                                                        <ShieldCheck className="h-5 w-5 text-yellow-500" />
                                                                        <span>Aligned with OSHA & IS 9457 guidelines</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                        <Users className="h-5 w-5 text-yellow-500" />
                                                                        <span>Trusted by 250+ manufacturing units</span>
                                                                </div>
                                                        </div>
                                                </div>
                                                <div className="relative z-10">
                                                        <div className="absolute -left-12 top-0 hidden h-40 w-40 rounded-full bg-yellow-200/70 blur-3xl md:block" />
                                                        <div className="relative grid gap-4 sm:grid-cols-2">
                                                                <div className="col-span-1 row-span-2 rounded-3xl bg-white/90 p-6 shadow-2xl ring-1 ring-black/5">
                                                                        <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-700">
                                                                                Top Pick
                                                                        </span>
                                                                        <Image
                                                                                src={PosterCompliance}
                                                                                alt="Safety compliance poster"
                                                                                className="mt-4 h-56 w-full rounded-2xl object-contain drop-shadow-xl"
                                                                                priority
                                                                        />
                                                                        <p className="mt-4 text-sm text-slate-600">
                                                                                High-contrast layouts keep emergency protocols visible even in dimly lit shop floors.
                                                                        </p>
                                                                </div>
                                                                <div className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-black/5">
                                                                        <Image
                                                                                src={PosterEmergency}
                                                                                alt="Emergency response safety poster"
                                                                                className="h-44 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <h3 className="mt-4 text-lg font-semibold">Emergency Response Series</h3>
                                                                        <p className="mt-2 text-sm text-slate-600">
                                                                                Colour-coded messaging to guide evacuation and first-aid actions in under a glance.
                                                                        </p>
                                                                </div>
                                                                <div className="rounded-3xl bg-yellow-500/10 p-6 shadow-xl ring-1 ring-yellow-500/30">
                                                                        <div className="flex items-center gap-3">
                                                                                <Sparkles className="h-5 w-5 text-yellow-600" />
                                                                                <p className="text-sm font-semibold text-yellow-700">
                                                                                        Personalise with your branding in minutes
                                                                                </p>
                                                                        </div>
                                                                        <Image
                                                                                src={PosterDigital}
                                                                                alt="Digital safety poster mockup"
                                                                                className="mt-4 h-40 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                                                                                <div className="rounded-xl bg-white/70 px-3 py-2 text-center font-medium shadow-sm">
                                                                                        A2 &amp; A3 sizes
                                                                                </div>
                                                                                <div className="rounded-xl bg-white/70 px-3 py-2 text-center font-medium shadow-sm">
                                                                                        Multilingual options
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <section id="posters" className="bg-white py-20">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="mx-auto max-w-3xl text-center">
                                                <span className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-700">
                                                        <Layers className="h-4 w-4" />
                                                        All Safety Posters
                                                </span>
                                                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                        Curated visuals that make safety reminders impossible to miss
                                                </h2>
                                                <p className="mt-4 text-base text-slate-600">
                                                        Choose from compliance-ready collections or collaborate with our illustrators to craft bespoke campaigns for your workplace.
                                                </p>
                                        </div>
                                        <div className="mt-12 grid gap-8 lg:grid-cols-3">
                                                {posterShowcase.map((poster) => (
                                                        <Card
                                                                key={poster.title}
                                                                className="group h-full overflow-hidden border-yellow-100 bg-white shadow-lg transition-transform hover:-translate-y-1"
                                                        >
                                                                <CardHeader className="border-b border-yellow-100 pb-4">
                                                                        <CardTitle className="flex items-center justify-between text-lg text-slate-900">
                                                                                {poster.title}
                                                                                <Sparkles className="h-4 w-4 text-yellow-500 transition-transform group-hover:rotate-12" />
                                                                        </CardTitle>
                                                                        <CardDescription className="text-slate-600">
                                                                                {poster.description}
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <div className="relative overflow-hidden rounded-2xl bg-yellow-50/60 p-4">
                                                                                <Image
                                                                                        src={poster.image}
                                                                                        alt={poster.title}
                                                                                        className="mx-auto h-48 w-full object-contain drop-shadow"
                                                                                />
                                                                        </div>
                                                                        <ul className="space-y-2 text-sm text-slate-600">
                                                                                {poster.highlights.map((point) => (
                                                                                        <li key={point} className="flex items-start gap-2">
                                                                                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-yellow-500" />
                                                                                                <span>{point}</span>
                                                                                        </li>
                                                                                ))}
                                                                        </ul>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        <section id="packs" className="bg-slate-950 py-20 text-white">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
                                                <div className="space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-yellow-300">
                                                                Industrial Safety Packs
                                                        </span>
                                                        <h2 className="text-3xl font-bold sm:text-4xl">
                                                                Purpose-built PPE combinations for every facility type
                                                        </h2>
                                                        <p className="text-base text-slate-300">
                                                                Reduce procurement cycles with category-specific kits stocked with certified gear, training aids and ready-to-display visuals.
                                                        </p>
                                                        <div className="space-y-4">
                                                                {packHighlights.map((feature) => (
                                                                        <div
                                                                                key={feature.title}
                                                                                className="flex items-start gap-4 rounded-2xl bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
                                                                        >
                                                                                <feature.icon className="h-6 w-6 text-yellow-300" />
                                                                                <div>
                                                                                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                                                                        <p className="mt-1 text-sm text-slate-300">{feature.description}</p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                                <div className="relative">
                                                        <div className="absolute -right-12 -top-12 hidden h-36 w-36 rounded-full bg-yellow-500/30 blur-3xl lg:block" />
                                                        <Card className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl backdrop-blur">
                                                                <CardHeader className="pb-4">
                                                                        <CardTitle className="text-xl font-semibold text-yellow-300">
                                                                                Pack spotlight: Factory Floor Essentials
                                                                        </CardTitle>
                                                                        <CardDescription className="text-slate-300">
                                                                                Curated for heavy engineering units with medium-to-high risk zones.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-6">
                                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                                                <div className="rounded-2xl bg-white/10 p-4">
                                                                                        <Image

                                                                                                src={PosterSignageKitA}
                                                                                                alt="Layered industrial safety signage set"

                                                                                                className="h-40 w-full object-contain drop-shadow"
                                                                                        />
                                                                                </div>
                                                                                <div className="rounded-2xl bg-white/10 p-4">
                                                                                        <Image

                                                                                                src={PosterSignageKitB}
                                                                                                alt="Emergency response poster wall"

                                                                                                className="h-40 w-full object-contain drop-shadow"
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                        <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                                                                                {packContents.map((item) => (
                                                                                        <div
                                                                                                key={item}
                                                                                                className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2"
                                                                                        >
                                                                                                <CheckCircle2 className="h-4 w-4 text-yellow-300" />
                                                                                                <span>{item}</span>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                        <p className="text-xs text-slate-400">
                                                                                Each shipment includes deployment checklists, replenishment reminders and multilingual how-to-use infographics.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>

                                </div>
                        </section>

                        <section id="subscriptions" className="bg-amber-50/70 py-20">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="grid items-center gap-12 lg:grid-cols-2">
                                                <div className="space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow">
                                                                Monthly Poster Subscriptions
                                                        </span>
                                                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                                                Stay relevant all year long with campaign-ready drops
                                                        </h2>
                                                        <p className="text-base text-slate-600">
                                                                Keep your communication calendar full with themed poster bundles, micro-copy ideas and digital assets delivered straight to your inbox.
                                                        </p>
                                                        <div className="space-y-4">
                                                                {subscriptionMilestones.map((milestone) => (
                                                                        <div
                                                                                key={milestone.title}
                                                                                className="flex items-start gap-4 rounded-2xl bg-white/80 p-5 shadow-md ring-1 ring-amber-100"
                                                                        >
                                                                                <milestone.icon className="h-6 w-6 text-amber-600" />
                                                                                <div>
                                                                                        <h3 className="text-lg font-semibold text-slate-900">
                                                                                                {milestone.title}
                                                                                        </h3>
                                                                                        <p className="mt-1 text-sm text-slate-600">{milestone.description}</p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm font-medium text-amber-700">
                                                                <CalendarCheck className="h-5 w-5" />
                                                                Cancel or pause anytime after three cycles.
                                                        </div>
                                                </div>
                                                <div className="relative">
                                                        <div className="absolute -left-10 top-10 hidden h-40 w-40 rounded-full bg-amber-200/80 blur-3xl md:block" />

                                                        <div className="relative grid gap-6">
                                                                {subscriptionPlans.map((plan) => (
                                                                        <Card
                                                                                key={plan.name}
                                                                                className={cn(
                                                                                        "overflow-hidden border-amber-100 shadow-xl",
                                                                                        plan.highlight
                                                                                                ? "bg-amber-100/80 ring-2 ring-amber-300"
                                                                                                : "bg-white"
                                                                                )}
                                                                        >
                                                                                <CardHeader className="space-y-3">
                                                                                        <div className="flex items-start justify-between gap-3">
                                                                                                <div>
                                                                                                        <CardTitle className="text-lg font-semibold text-slate-900">
                                                                                                                {plan.name}
                                                                                                        </CardTitle>
                                                                                                        <CardDescription className="text-sm text-slate-600">
                                                                                                                {plan.tagline}
                                                                                                        </CardDescription>
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
                                                                                <CardContent className="space-y-4">
                                                                                        <div className="rounded-2xl bg-amber-50/80 p-4">
                                                                                                <Image
                                                                                                        src={plan.image}
                                                                                                        alt={`${plan.name} poster preview`}
                                                                                                        className="h-44 w-full rounded-xl object-contain drop-shadow"
                                                                                                />
                                                                                        </div>
                                                                                        <ul className="space-y-2 text-sm text-slate-600">
                                                                                                {plan.benefits.map((benefit) => (
                                                                                                        <li key={benefit} className="flex items-start gap-2">
                                                                                                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-500" />
                                                                                                                <span>{benefit}</span>
                                                                                                        </li>
                                                                                                ))}
                                                                                        </ul>
                                                                                        <Link
                                                                                                href="#contact"
                                                                                                className={cn(
                                                                                                        buttonVariants({ size: "sm" }),
                                                                                                        "w-full bg-amber-500 text-white shadow-md hover:bg-amber-400"
                                                                                                )}
                                                                                        >
                                                                                                Talk to the team
                                                                                                <ArrowRight className="h-4 w-4" />
                                                                                        </Link>
                                                                                </CardContent>
                                                                        </Card>
                                                                ))}
                                                        </div>
                                                </div>
                                        </div>
                                        <div className="mt-12 text-center">
                                                <Link
                                                        href="/monthly-poster-subscriptions"
                                                        className={cn(
                                                                buttonVariants({ size: "lg" }),
                                                                "bg-amber-500 text-white shadow-lg hover:bg-amber-400"
                                                        )}
                                                >
                                                        Compare subscription plans in detail
                                                        <ArrowRight className="h-4 w-4" />
                                                </Link>
                                        </div>

                                </div>
                        </section>

                        <section id="corporate" className="relative overflow-hidden bg-gradient-to-r from-black via-slate-900 to-black py-20 text-yellow-200">
                                <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-yellow-500/10 to-transparent" />
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                                                <div className="relative z-10 space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-200">
                                                                Corporate Bulk / Custom Orders
                                                        </span>
                                                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                                                Scale your safety messaging across every location effortlessly
                                                        </h2>
                                                        <p className="text-base text-yellow-100/80">
                                                                Enterprise-grade project management ensures every site receives branded, localised assets with centralised approval workflows.
                                                        </p>
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                                {corporateHighlights.map((item) => (
                                                                        <div
                                                                                key={item.title}
                                                                                className="rounded-2xl bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
                                                                        >
                                                                                <item.icon className="mb-3 h-6 w-6 text-yellow-300" />
                                                                                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                                                                                <p className="mt-2 text-sm text-yellow-100/80">{item.description}</p>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                        <div className="flex flex-wrap gap-4 pt-4">
                                                                <Link

                                                                        href="/corporate-bulk-orders"

                                                                        className={cn(
                                                                                buttonVariants({ size: "lg" }),
                                                                                "bg-yellow-400 text-black shadow-lg hover:bg-yellow-300"
                                                                        )}
                                                                >

                                                                        Explore enterprise programme

                                                                        <ArrowRight className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                        href="mailto:sales@infinitesafety.in"
                                                                        className="inline-flex items-center text-sm font-medium text-yellow-200 underline-offset-4 hover:text-white hover:underline"
                                                                >
                                                                        Request a custom quote
                                                                </Link>
                                                        </div>
                                                </div>
                                                <div className="relative z-10">
                                                        <Card className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white/5 text-white shadow-2xl backdrop-blur">
                                                                <CardHeader className="pb-4">
                                                                        <CardTitle className="text-xl font-semibold text-yellow-300">
                                                                                Customisation snapshot
                                                                        </CardTitle>
                                                                        <CardDescription className="text-yellow-100/80">
                                                                                Layer brand colours, multilingual content and QR-ready workflows in a single request.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-6">
                                                                        <Image
                                                                                src={PosterCompliance}
                                                                                alt="Custom safety poster preview"
                                                                                className="h-56 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <div className="grid gap-3 text-sm text-yellow-100/80">
                                                                                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                                                                                        <Palette className="h-5 w-5 text-yellow-300" />
                                                                                        Custom brand palette &amp; typography
                                                                                </div>
                                                                                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                                                                                        <Users className="h-5 w-5 text-yellow-300" />
                                                                                        Site-specific language localisation
                                                                                </div>
                                                                                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                                                                                        <ShieldCheck className="h-5 w-5 text-yellow-300" />
                                                                                        Pre-approved compliance checklist overlay
                                                                                </div>
                                                                                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
                                                                                        <ClipboardCheck className="h-5 w-5 text-yellow-300" />
                                                                                        Rollout tracker &amp; version control logs
                                                                                </div>
                                                                        </div>
                                                                        <p className="text-xs text-yellow-100/70">
                                                                                Dedicated project managers coordinate design approvals, proofing, printing and dispatch with weekly status dashboards.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <section id="contact" className="bg-white py-20">
                                <div className="mx-auto max-w-4xl px-6 text-center">
                                        <span className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-700">
                                                Ready when you are
                                        </span>
                                        <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">
                                                Talk to our safety communication specialists
                                        </h2>
                                        <p className="mt-4 text-base text-slate-600">
                                                We love translating complex safety requirements into visuals your teams will remember. Choose the channel that suits you best.
                                        </p>
                                        <div className="mt-12 grid gap-6 sm:grid-cols-3">
                                                {contactChannels.map((channel) => (
                                                        <Card key={channel.title} className="h-full border-yellow-100 shadow-lg">
                                                                <CardHeader className="space-y-2">
                                                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                                                                                <channel.icon className="h-5 w-5 text-yellow-600" />
                                                                        </div>
                                                                        <CardTitle className="text-base font-semibold text-slate-900">
                                                                                {channel.title}
                                                                        </CardTitle>
                                                                        <CardDescription className="text-sm text-slate-600">
                                                                                {channel.description}
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="pt-0">
                                                                        <Link
                                                                                href={channel.href}
                                                                                className={cn(
                                                                                        buttonVariants({ size: "sm" }),
                                                                                        "w-full bg-yellow-500 text-black shadow-md hover:bg-yellow-400"
                                                                                )}
                                                                        >
                                                                                {channel.cta}
                                                                                <ArrowRight className="h-4 w-4" />
                                                                        </Link>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                        <p className="mt-10 text-sm text-slate-500">
                                                Prefer email? Write to <a className="font-semibold text-slate-700 hover:text-yellow-600" href="mailto:hello@infinitesafety.in">hello@infinitesafety.in</a> and our team will reply within one business day.
                                        </p>
                                </div>
                        </section>
                </div>
        );
}

