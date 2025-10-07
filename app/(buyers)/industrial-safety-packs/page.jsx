import Image from "next/image";
import Link from "next/link";

import { ArrowRight, CheckCircle2, ClipboardCheck, Layers, Map, Settings2, Sparkles, Timer, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import PosterSignageKitA from "@/public/images/products/RS-P3.png";
import PosterSignageKitB from "@/public/images/products/RS-P5.png";
import PosterCompliance from "@/public/images/products/PS-P1.png";
import PosterEmergency from "@/public/images/products/PS-P5.png";

export const metadata = {
        title: "Industrial Safety Signage Packs | Infinite Poster Shop",
        description:
                "Pre-assembled safety poster suites for manufacturing, logistics and utility facilities complete with deployment playbooks and refresh calendars.",
};

const navigationOptions = [
        { label: "All Safety Posters", href: "/products?category=safety-posters" },
        { label: "Industrial Safety Packs", href: "#packs", highlight: true },
        { label: "Monthly Poster Subscriptions", href: "/monthly-poster-subscriptions" },
        { label: "Corporate Bulk/Custom Orders", href: "/corporate-bulk-orders" },
];

const signagePacks = [
        {
                name: "Production Floor Command Set",
                description:
                        "Sequential posters guide workers through pre-start, shutdown and emergency protocols across the line.",
                image: PosterSignageKitA,
                badge: "Best Seller",
                highlights: [
                        "12-piece poster wall with QR-ready SOP overlays",
                        "Machine-specific caution, warning and danger frames",
                        "Daily start-up checklist with shift handover tracker",
                ],
        },
        {
                name: "Warehouse Motion Control Kit",
                description:
                        "Bold, icon-led messaging for forklift corridors, pallet staging and pedestrian crossings.",
                image: PosterSignageKitB,
                highlights: [
                        "Floor-to-eye signage pairs for rapid comprehension",
                        "Loading bay hazard, PPE and stacking etiquette posters",
                        "Reflective decals for night or low-light operations",
                ],
        },
        {
                name: "Emergency Resilience Bundle",
                description:
                        "Fire, evacuation and first-aid visuals synchronised for muster points and control rooms.",
                image: PosterEmergency,
                highlights: [
                        "Area-specific evacuation flowchart posters",
                        "A2 emergency contact matrix with QR-coded call trees",
                        "Weekly drill reminder placards and digital slides",
                ],
        },
];

const rolloutPhases = [
        {
                title: "Site mapping session",
                description: "Safety consultants blueprint poster placements using your latest risk assessments.",
                icon: Map,
        },
        {
                title: "Artwork localisation",
                description: "Languages, brand palette and statutory references aligned to each plant.",
                icon: Users,
        },
        {
                title: "Print & dispatch",
                description: "Posters land laminated, numbered and sequence-packed for effortless installation.",
                icon: Timer,
        },
        {
                title: "Engagement refresh",
                description: "Quarterly swap-outs with new campaigns plus adoption snapshots for audits.",
                icon: Sparkles,
        },
];

const addOnServices = [
        {
                title: "Digital signage sync",
                description: "Loop-ready MP4s and portrait screen carousels mirror the on-wall messaging.",
                icon: Settings2,
        },
        {
                title: "Audit documentation",
                description: "Deployment log, maintenance tracker and compliance photo evidence templates.",
                icon: ClipboardCheck,
        },
        {
                title: "Supervisor activation kit",
                description: "Toolbox talk scripts, observation cards and reward chart posters for team leads.",
                icon: CheckCircle2,
        },
];

export default function IndustrialSafetyPacksPage() {
        return (
                <div className="bg-white text-slate-900">
                        <section className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-white">
                                <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-yellow-200/40 to-transparent lg:block" />
                                <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
                                        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                                                <div className="space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-700">
                                                                Industrial Safety Signage Packs
                                                        </span>
                                                        <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                                                                Transform high-risk zones with cohesive, compliant poster ecosystems
                                                        </h1>
                                                        <p className="text-lg text-slate-600">
                                                                Reduce rollout time and keep audits tidy with curated poster suites, installation roadmaps and ready-to-share digital variants.
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
                                                        <div className="flex flex-wrap gap-3">
                                                                <Link
                                                                        href="/contact"
                                                                        className={cn(
                                                                                buttonVariants({ size: "lg" }),
                                                                                "bg-yellow-500 text-black shadow-lg hover:bg-yellow-400"
                                                                        )}
                                                                >
                                                                        Book a walkthrough
                                                                        <ArrowRight className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                        href="/products?category=safety-posters"
                                                                        className={cn(
                                                                                buttonVariants({ variant: "outline", size: "lg" }),
                                                                                "border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                                                                        )}
                                                                >
                                                                        Browse all posters
                                                                </Link>
                                                        </div>
                                                        <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-500">
                                                                <div className="flex items-center gap-2">
                                                                        <ClipboardCheck className="h-5 w-5 text-yellow-500" />
                                                                        <span>Built with ISO 45001 &amp; IS 9457 references</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                        <Timer className="h-5 w-5 text-yellow-500" />
                                                                        <span>Standard rollout in 12 business days</span>
                                                                </div>
                                                        </div>
                                                </div>
                                                <div className="relative">
                                                        <div className="absolute -left-10 top-12 hidden h-48 w-48 rounded-full bg-yellow-200/70 blur-3xl md:block" />
                                                        <Card className="overflow-hidden rounded-3xl border border-yellow-100 bg-white/90 shadow-2xl">
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-semibold text-slate-900">
                                                                                Facility-ready signage grid
                                                                        </CardTitle>
                                                                        <CardDescription className="text-slate-600">
                                                                                Layered posters create a storytelling wall for quick scanning and retention.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <Image
                                                                                src={PosterCompliance}
                                                                                alt="Industrial compliance signage wall"
                                                                                className="h-60 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <p className="text-sm text-slate-600">
                                                                                Each bundle ships labelled for zone-by-zone placement along with adhesive guides and upkeep tips.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <section id="packs" className="bg-white py-20">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="mx-auto max-w-3xl text-center">
                                                <span className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-700">
                                                        <Layers className="h-4 w-4" />
                                                        Curated signage suites
                                                </span>
                                                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                        Packs tailored to your facility layout
                                                </h2>
                                                <p className="mt-4 text-base text-slate-600">
                                                        Mix and match sets or deploy as-is. Every pack includes laminated prints, mounting hardware suggestions and refresh reminders.
                                                </p>
                                        </div>
                                        <div className="mt-12 grid gap-8 lg:grid-cols-3">
                                                {signagePacks.map((pack) => (
                                                        <Card key={pack.name} className="flex h-full flex-col border-yellow-100 bg-white shadow-lg">
                                                                <CardHeader className="space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                                <CardTitle className="text-lg text-slate-900">{pack.name}</CardTitle>
                                                                                {pack.badge && (
                                                                                        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-700">
                                                                                                {pack.badge}
                                                                                        </span>
                                                                                )}
                                                                        </div>
                                                                        <CardDescription className="text-slate-600">{pack.description}</CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="flex flex-1 flex-col gap-4">
                                                                        <div className="rounded-2xl bg-yellow-50/70 p-4">
                                                                                <Image
                                                                                        src={pack.image}
                                                                                        alt={`${pack.name} poster set`}
                                                                                        className="mx-auto h-52 w-full rounded-xl object-contain drop-shadow"
                                                                                />
                                                                        </div>
                                                                        <ul className="space-y-2 text-sm text-slate-600">
                                                                                {pack.highlights.map((item) => (
                                                                                        <li key={item} className="flex items-start gap-2">
                                                                                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-yellow-500" />
                                                                                                <span>{item}</span>
                                                                                        </li>
                                                                                ))}
                                                                        </ul>
                                                                </CardContent>
                                                        </Card>
                                                ))}
                                        </div>
                                </div>
                        </section>

                        <section className="bg-slate-950 py-20 text-yellow-100">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="grid items-center gap-12 lg:grid-cols-2">
                                                <div className="space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-yellow-200">
                                                                Guided implementation
                                                        </span>
                                                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                                                A four-phase rollout keeps every plant aligned
                                                        </h2>
                                                        <p className="text-base text-yellow-100/80">
                                                                We orchestrate all tasks from planning to pulse checks so your team simply mounts and monitors.
                                                        </p>
                                                        <div className="space-y-4">
                                                                {rolloutPhases.map((phase) => (
                                                                        <div key={phase.title} className="flex items-start gap-4 rounded-2xl bg-white/5 p-5 backdrop-blur">
                                                                                <phase.icon className="h-6 w-6 text-yellow-300" />
                                                                                <div>
                                                                                        <h3 className="text-lg font-semibold text-white">{phase.title}</h3>
                                                                                        <p className="mt-1 text-sm text-yellow-100/80">{phase.description}</p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                                <div className="relative">
                                                        <Card className="overflow-hidden rounded-3xl border border-yellow-500/30 bg-white/10 text-white shadow-2xl backdrop-blur">
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-semibold text-yellow-200">
                                                                                Deployment dossier snapshot
                                                                        </CardTitle>
                                                                        <CardDescription className="text-yellow-100/70">
                                                                                Stay audit-ready with templated logs and progress dashboards.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <Image
                                                                                src={PosterCompliance}
                                                                                alt="Safety poster deployment tracker"
                                                                                className="h-52 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <ul className="space-y-2 text-sm text-yellow-100/80">
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-yellow-300" />
                                                                                        Mounting checklist with photo verification slots
                                                                                </li>
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-yellow-300" />
                                                                                        Rotation calendar pre-filled for twelve months
                                                                                </li>
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-yellow-300" />
                                                                                        QR engagement analytics rolled into monthly snapshot
                                                                                </li>
                                                                        </ul>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <section className="bg-white py-20">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="mx-auto max-w-3xl text-center">
                                                <span className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-700">
                                                        Tailor your rollout
                                                </span>
                                                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                        Add-on services to maximise visibility
                                                </h2>
                                                <p className="mt-4 text-base text-slate-600">
                                                        Extend the impact with digital, documentation and engagement modules built to pair with every signage pack.
                                                </p>
                                        </div>
                                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                                                {addOnServices.map((service) => (
                                                        <Card key={service.title} className="h-full border-yellow-100 bg-white shadow-lg">
                                                                <CardHeader className="space-y-3">
                                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-700">
                                                                                <service.icon className="h-5 w-5" />
                                                                        </div>
                                                                        <CardTitle className="text-lg text-slate-900">{service.title}</CardTitle>
                                                                        <CardDescription className="text-slate-600">{service.description}</CardDescription>
                                                                </CardHeader>
                                                        </Card>
                                                ))}
                                        </div>
                                        <div className="mt-12 text-center">
                                                <Link
                                                        href="/corporate-bulk-orders"
                                                        className={cn(
                                                                buttonVariants({ size: "lg" }),
                                                                "bg-yellow-500 text-black shadow-lg hover:bg-yellow-400"
                                                        )}
                                                >
                                                        Plan a multi-site deployment
                                                        <ArrowRight className="h-4 w-4" />
                                                </Link>
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
