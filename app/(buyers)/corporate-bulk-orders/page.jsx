import Image from "next/image";
import Link from "next/link";

import { ArrowRight, CalendarCheck, CheckCircle2, ClipboardCheck, Globe2, Layers, Palette, Sparkles, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import PosterCompliance from "@/public/images/products/PS-P1.png";
import PosterBehaviour from "@/public/images/products/PS-P7.png";
import PosterDigital from "@/public/images/products/Q-Please-P4.png";

export const metadata = {
        title: "Corporate Safety Poster Rollouts | Infinite Poster Shop",
        description:
                "End-to-end programme management for corporate safety poster deployments across plants, offices and warehouses with localisation and analytics.",
};

const programmePillars = [
        {
                title: "Brand-aligned storytelling",
                description: "Colour palettes, iconography and tone adapted to your brand while preserving compliance clarity.",
                icon: Palette,
        },
        {
                title: "Pan-location fulfilment",
                description: "Centralised printing, kitting and dispatch to every facility with tracking dashboards.",
                icon: Globe2,
        },
        {
                title: "Engagement amplification",
                description: "Campaign calendars, reward mechanics and leadership messaging kits keep initiatives alive longer.",
                icon: Sparkles,
        },
];

const rolloutServices = [
        {
                phase: "Discovery & blueprint",
                description: "Audit existing visuals, prioritise risk themes and blueprint poster families per site type.",
        },
        {
                phase: "Design & localisation",
                description: "Approve creative sprints covering multi-language adaptations, QR workflows and digital variants.",
        },
        {
                phase: "Production & logistics",
                description: "Print, laminate, pack and dispatch with site-specific labelling plus digital delivery for remote teams.",
        },
        {
                phase: "Engagement & reporting",
                description: "Activate with launch playbooks, challenge kits and monthly adoption dashboards for leadership.",
        },
];

const supportChannels = [
        {
                title: "Dedicated programme lead",
                description: "Single point of contact sharing weekly updates, mock-ups and deployment trackers.",
                icon: Users,
        },
        {
                title: "Creative ticket desk",
                description: "Rapid tweaks, language changes or poster requests handled within 48 hours.",
                icon: Layers,
        },
        {
                title: "Compliance documentation",
                description: "Audit trails with timestamped approvals, rollout photos and refresh reminders.",
                icon: ClipboardCheck,
        },
];

export default function CorporateBulkOrdersPage() {
        return (
                <div className="bg-white text-slate-900">
                        <section className="relative overflow-hidden bg-gradient-to-r from-black via-slate-900 to-black text-yellow-200">
                                <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-yellow-400/10 to-transparent" />
                                <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
                                        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
                                                <div className="relative z-10 space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-semibold text-yellow-200">
                                                                Corporate programmes
                                                        </span>
                                                        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                                                                Roll out one safety narrative across every location
                                                        </h1>
                                                        <p className="text-lg text-yellow-100/80">
                                                                We partner with HSE and communications teams to design, produce and monitor poster deployments at scale—keeping messaging consistent while respecting local realities.
                                                        </p>
                                                        <div className="flex flex-wrap gap-3">
                                                                <Link
                                                                        href="/contact"
                                                                        className={cn(
                                                                                buttonVariants({ size: "lg" }),
                                                                                "bg-yellow-400 text-black shadow-lg hover:bg-yellow-300"
                                                                        )}
                                                                >
                                                                        Schedule a programme consult
                                                                        <ArrowRight className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                        href="mailto:corporate@infinitesafety.in"
                                                                        className="inline-flex items-center text-sm font-semibold text-yellow-200 underline-offset-4 hover:text-white hover:underline"
                                                                >
                                                                        Email our enterprise desk
                                                                </Link>
                                                        </div>
                                                        <div className="flex flex-wrap gap-6 pt-4 text-sm text-yellow-100/80">
                                                                <div className="flex items-center gap-2">
                                                                        <CalendarCheck className="h-5 w-5 text-yellow-400" />
                                                                        <span>Rollout plans crafted in 10 business days</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                        <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                                                                        <span>Trusted by pan-India manufacturing &amp; FMCG majors</span>
                                                                </div>
                                                        </div>
                                                </div>
                                                <div className="relative z-10">
                                                        <div className="absolute -right-14 top-10 hidden h-48 w-48 rounded-full bg-yellow-400/30 blur-3xl lg:block" />
                                                        <Card className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white/5 text-white shadow-2xl backdrop-blur">
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-semibold text-yellow-200">
                                                                                Programme playbook preview
                                                                        </CardTitle>
                                                                        <CardDescription className="text-yellow-100/70">
                                                                                Custom-branded poster suites with rollout checklists and reporting templates.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <Image
                                                                                src={PosterCompliance}
                                                                                alt="Corporate safety poster programme"
                                                                                className="h-60 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <p className="text-sm text-yellow-100/80">
                                                                                Annotated blueprints map each poster family to risk zones and culture moments—ready for leadership sign-off.
                                                                        </p>
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
                                                        Programme pillars
                                                </span>
                                                <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                        Designed for consistency, delivered with agility
                                                </h2>
                                                <p className="mt-4 text-base text-slate-600">
                                                        From creative direction to logistics and change management, our team orchestrates every detail so your safety story stays unified.
                                                </p>
                                        </div>
                                        <div className="mt-12 grid gap-6 md:grid-cols-3">
                                                {programmePillars.map((pillar) => (
                                                        <Card key={pillar.title} className="h-full border-yellow-100 bg-white shadow-lg">
                                                                <CardHeader className="space-y-3">
                                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-700">
                                                                                <pillar.icon className="h-5 w-5" />
                                                                        </div>
                                                                        <CardTitle className="text-lg text-slate-900">{pillar.title}</CardTitle>
                                                                        <CardDescription className="text-slate-600">{pillar.description}</CardDescription>
                                                                </CardHeader>
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
                                                                Managed rollout lifecycle
                                                        </span>
                                                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                                                A four-stage governance model keeps projects on track
                                                        </h2>
                                                        <p className="text-base text-yellow-100/80">
                                                                Dedicated programme managers align stakeholders, track approvals and drive adoption with measurable actions every month.
                                                        </p>
                                                        <div className="space-y-4">
                                                                {rolloutServices.map((service) => (
                                                                        <div key={service.phase} className="flex items-start gap-4 rounded-2xl bg-white/5 p-5 backdrop-blur">
                                                                                <CheckCircle2 className="mt-0.5 h-5 w-5 text-yellow-300" />
                                                                                <div>
                                                                                        <h3 className="text-lg font-semibold text-white">{service.phase}</h3>
                                                                                        <p className="mt-1 text-sm text-yellow-100/80">{service.description}</p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                                <div className="relative">
                                                        <Card className="overflow-hidden rounded-3xl border border-yellow-500/30 bg-white/10 text-white shadow-2xl backdrop-blur">
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-semibold text-yellow-200">
                                                                                Multi-format delivery kits
                                                                        </CardTitle>
                                                                        <CardDescription className="text-yellow-100/70">
                                                                                Posters, digital signage loops and leadership messaging assets arrive together.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <Image
                                                                                src={PosterDigital}
                                                                                alt="Corporate digital safety posters"
                                                                                className="h-56 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <ul className="space-y-2 text-sm text-yellow-100/80">
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-yellow-300" />
                                                                                        Leadership briefings with talking points and townhall decks
                                                                                </li>
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-yellow-300" />
                                                                                        Plant-level translation with legal vetting and QR overlays
                                                                                </li>
                                                                                <li className="flex items-start gap-2">
                                                                                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-yellow-300" />
                                                                                        On-screen loops and mobile art for remote workforce reach
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
                                        <div className="grid items-center gap-12 lg:grid-cols-2">
                                                <div className="space-y-6">
                                                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-700">
                                                                Partnership support
                                                        </span>
                                                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                                                                Support ecosystem built for enterprise scale
                                                        </h2>
                                                        <p className="text-base text-slate-600">
                                                                Beyond delivering creatives, we embed governance rituals and service desks so internal teams stay confident and informed.
                                                        </p>
                                                        <div className="space-y-4">
                                                                {supportChannels.map((channel) => (
                                                                        <div key={channel.title} className="flex items-start gap-4 rounded-2xl bg-yellow-500/10 p-5">
                                                                                <channel.icon className="h-6 w-6 text-yellow-700" />
                                                                                <div>
                                                                                        <h3 className="text-lg font-semibold text-slate-900">{channel.title}</h3>
                                                                                        <p className="mt-1 text-sm text-slate-600">{channel.description}</p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>
                                                <div className="relative">
                                                        <Card className="overflow-hidden rounded-3xl border border-yellow-100 bg-white text-slate-900 shadow-xl">
                                                                <CardHeader>
                                                                        <CardTitle className="text-xl font-semibold text-slate-900">
                                                                                Behavioural campaign snapshot
                                                                        </CardTitle>
                                                                        <CardDescription className="text-slate-600">
                                                                                Ready-made poster sets and gamified assets to activate safety days and week-long drives.
                                                                        </CardDescription>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        <Image
                                                                                src={PosterBehaviour}
                                                                                alt="Behavioural safety campaign poster"
                                                                                className="h-56 w-full rounded-2xl object-contain drop-shadow"
                                                                        />
                                                                        <p className="text-sm text-slate-600">
                                                                                Combine with microsite templates, recognition certificates and social copy to keep leadership and employees aligned.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                                                <Link
                                                        href="/monthly-poster-subscriptions"
                                                        className={cn(
                                                                buttonVariants({ size: "lg" }),
                                                                "bg-yellow-500 text-black shadow-lg hover:bg-yellow-400"
                                                        )}
                                                >
                                                        Add an ongoing subscription
                                                        <ArrowRight className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                        href="mailto:corporate@infinitesafety.in"
                                                        className="inline-flex items-center text-sm font-semibold text-yellow-700 underline-offset-4 hover:text-yellow-600 hover:underline"
                                                >
                                                        Request sample packs
                                                </Link>
                                        </div>
                                </div>
                        </section>
                </div>
        );
}
