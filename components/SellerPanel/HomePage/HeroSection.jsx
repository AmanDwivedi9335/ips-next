"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
        VideoBanner,
        Logo1,
        Logo2,
        Logo3,
        Logo4,
        Logo5,
        Logo6,
} from "@/public/images/seller-panel/home/hero";
import "./HeroSection.css";

const CTA_BASE_CLASSES =
        "rounded-full px-6 py-3 text-lg font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300";

const CTA_VARIANTS = {
        primary: "bg-amber-400 text-black shadow-lg shadow-amber-500/30 hover:bg-amber-300",
        outline:
                "border border-white/70 bg-white/5 text-white hover:bg-white/15 hover:border-white/80 backdrop-blur-sm",
        ghost: "bg-transparent text-white border border-transparent hover:border-white/40 hover:bg-white/10",
};

export default function HeroSection() {
        const [activeSlide, setActiveSlide] = useState(0);
        const [isHovered, setIsHovered] = useState(false);

        const logos = useMemo(() => [Logo1, Logo2, Logo3, Logo4, Logo5, Logo6], []);

        const slides = useMemo(
                () => [
                        {
                                id: "reach",
                                badge: "Trusted by sellers across India 🇮🇳",
                                title: "Sell Safety. Deliver Trust.",
                                highlight: "Expand Nationwide",
                                description:
                                        "Join India's most reliable marketplace for road safety, industrial protection, and emergency equipment. Showcase your products, gain verified buyers, and grow faster.",
                                overlayClass:
                                        "from-[#050505]/90 via-[#111111]/55 to-black/80",
                                ctas: [
                                        { label: "Register", variant: "primary" },
                                        { label: "Explore Buyer Marketplace", variant: "outline" },
                                        { label: "Schedule Demo Call", variant: "ghost" },
                                ],
                                stats: [
                                        { value: "12k+", label: "Active Buyers" },
                                        { value: "5k+", label: "Verified Products" },
                                        { value: "48h", label: "Lead Response" },
                                ],
                                highlights: [
                                        "Dedicated onboarding & catalog support",
                                        "Marketing boosts to unlock premium buyers",
                                        "GST-ready invoices & fulfillment assistance",
                                ],
                        },
                        {
                                id: "scale",
                                badge: "Power up your sales team",
                                title: "Smart Tools.",
                                highlight: "Bigger Deals.",
                                description:
                                        "Respond to tenders instantly, sync pricing across channels, and track performance with AI-powered insights built for safety suppliers.",
                                overlayClass:
                                        "from-[#03030a]/85 via-[#0c101f]/50 to-black/75",
                                ctas: [
                                        { label: "See Seller Toolkit", variant: "primary" },
                                        { label: "Download Prospectus", variant: "outline" },
                                ],
                                stats: [
                                        { value: "30%", label: "Faster Conversions" },
                                        { value: "2x", label: "Lead Visibility" },
                                        { value: "24/7", label: "Support" },
                                ],
                                highlights: [
                                        "Auto-match with bulk procurement requests",
                                        "Real-time pricing analytics and alerts",
                                        "Seamless CRM integrations with webhook support",
                                ],
                        },
                        {
                                id: "delight",
                                badge: "Deliver delight every time",
                                title: "Logistics Sorted.",
                                highlight: "Customers Happy.",
                                description:
                                        "Ship pan-India with vetted partners, offer doorstep installations, and manage returns effortlessly from one command centre.",
                                overlayClass:
                                        "from-[#140800]/85 via-[#201003]/50 to-black/80",
                                ctas: [
                                        { label: "Activate Fulfilment", variant: "primary" },
                                        { label: "Chat with Growth Coach", variant: "ghost" },
                                ],
                                stats: [
                                        { value: "45%", label: "Lower Shipping Costs" },
                                        { value: "97%", label: "On-time Delivery" },
                                        { value: "18h", label: "Average Resolution" },
                                ],
                                highlights: [
                                        "One-click shipment booking & tracking",
                                        "Installation experts in 120+ cities",
                                        "Unified dashboard for returns and warranties",
                                ],
                        },
                ],
                []
        );

        useEffect(() => {
                if (isHovered) return;

                const timer = setTimeout(() => {
                        setActiveSlide((current) => (current + 1) % slides.length);
                }, 7000);

                return () => clearTimeout(timer);
        }, [activeSlide, isHovered, slides.length]);

        const goToSlide = (index) => {
                setActiveSlide((index + slides.length) % slides.length);
        };

        const marqueeLogos = useMemo(
                () => [...logos, ...logos],
                [logos]
        );

        return (
                <section className="relative isolate overflow-hidden bg-[#111111] py-16 sm:py-24">
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111111] to-black opacity-80" aria-hidden="true" />

                        <div className="relative mx-auto flex max-w-6xl flex-col gap-14 px-6 sm:px-10">
                                <div
                                        className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_40px_120px_-45px_rgba(250,204,21,0.65)] backdrop-blur"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        onFocus={() => setIsHovered(true)}
                                        onBlur={() => setIsHovered(false)}
                                >
                                        <div
                                                className="flex h-full min-h-[520px] transform items-stretch transition-transform duration-700 ease-out"
                                                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                                        >
                                                {slides.map((slide, index) => (
                                                        <article
                                                                key={slide.id}
                                                                className="relative flex min-w-full flex-col justify-between gap-8 p-8 text-white sm:p-12 lg:flex-row"
                                                                aria-hidden={activeSlide !== index}
                                                                aria-live={activeSlide === index ? "polite" : undefined}
                                                        >
                                                                <div className="absolute inset-0">
                                                                        <Image
                                                                                src={VideoBanner.src}
                                                                                alt="Construction workers collaborating on safety infrastructure"
                                                                                fill
                                                                                className="object-cover"
                                                                                priority={index === 0}
                                                                        />
                                                                        <div
                                                                                className={`absolute inset-0 bg-gradient-to-br ${slide.overlayClass}`}
                                                                                aria-hidden="true"
                                                                        />
                                                                </div>

                                                                <div className="relative z-10 flex flex-1 flex-col gap-8">
                                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                                                                                {slide.badge && (
                                                                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-medium backdrop-blur">
                                                                                                {slide.badge}
                                                                                        </span>
                                                                                )}
                                                                                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-200/80">
                                                                                        Growth stories
                                                                                </span>
                                                                        </div>

                                                                        <div className="space-y-6">
                                                                                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                                                                                        {slide.title}
                                                                                        <span className="block text-amber-300">{slide.highlight}</span>
                                                                                </h1>
                                                                                <p className="max-w-3xl text-base text-white/80 sm:text-lg">
                                                                                        {slide.description}
                                                                                </p>

                                                                                <ul className="grid gap-3 text-left text-sm text-white/75 sm:grid-cols-2 sm:text-base">
                                                                                        {slide.highlights.map((highlight) => (
                                                                                                <li key={highlight} className="flex items-start gap-2">
                                                                                                        <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-400 text-[10px] font-semibold text-black">
                                                                                                                ✓
                                                                                                        </span>
                                                                                                        <span>{highlight}</span>
                                                                                                </li>
                                                                                        ))}
                                                                                </ul>
                                                                        </div>

                                                                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                                                                                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                                                                        {slide.ctas.map((cta) => (
                                                                                                <button
                                                                                                        key={`${slide.id}-${cta.label}`}
                                                                                                        type="button"
                                                                                                        className={`${CTA_BASE_CLASSES} ${CTA_VARIANTS[cta.variant]}`}
                                                                                                >
                                                                                                        {cta.label}
                                                                                                </button>
                                                                                        ))}
                                                                                </div>

                                                                                {slide.stats?.length ? (
                                                                                        <dl className="grid grid-cols-3 gap-4 text-left text-white/80">
                                                                                                {slide.stats.map((stat) => (
                                                                                                        <div key={`${slide.id}-${stat.label}`}>
                                                                                                                <dt className="text-xs uppercase tracking-[0.25em] text-white/50">
                                                                                                                        {stat.label}
                                                                                                                </dt>
                                                                                                                <dd className="text-2xl font-semibold text-white">
                                                                                                                        {stat.value}
                                                                                                                </dd>
                                                                                                        </div>
                                                                                                ))}
                                                                                        </dl>
                                                                                ) : null}
                                                                        </div>
                                                                </div>

                                                                <div className="relative z-10 flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 text-left shadow-2xl shadow-black/40 backdrop-blur-sm lg:w-[320px] lg:self-center">
                                                                        <span className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
                                                                                Seller snapshot
                                                                        </span>
                                                                        <p className="text-base font-medium text-white/90">
                                                                                “We listed 80+ SKUs in a week and converted institutional orders twice as fast with IPS's verified buyer network.”
                                                                        </p>
                                                                        <div className="flex items-center gap-3">
                                                                                <div className="flex -space-x-2">
                                                                                        {[0, 1, 2].map((avatar) => (
                                                                                                <span
                                                                                                        key={avatar}
                                                                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-xs font-semibold text-black"
                                                                                                >
                                                                                                        {(avatar + 1) * 5}
                                                                                                </span>
                                                                                        ))}
                                                                                </div>
                                                                                <div className="text-sm text-white/70">
                                                                                        <div className="font-semibold text-white">Pan-India partners</div>
                                                                                        <div>FireShield, GuardPlus & more</div>
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs text-amber-200/80">
                                                                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-black">
                                                                                        ★
                                                                                </span>
                                                                                4.9/5 seller satisfaction this quarter
                                                                        </div>
                                                                </div>
                                                        </article>
                                                ))}
                                        </div>

                                        <div className="relative z-20 flex flex-col items-center justify-between gap-6 border-t border-white/10 bg-black/40 px-6 py-5 text-white backdrop-blur-sm sm:flex-row sm:px-10">
                                                <div className="flex items-center gap-2 text-sm text-white/70">
                                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60">
                                                                {activeSlide + 1}
                                                        </span>
                                                        <span className="uppercase tracking-[0.3em] text-white/50">Slide</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                        <button
                                                                type="button"
                                                                onClick={() => goToSlide(activeSlide - 1)}
                                                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:border-white/40 hover:bg-white/10"
                                                                aria-label="Previous slide"
                                                        >
                                                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                        <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                        </button>
                                                        <button
                                                                type="button"
                                                                onClick={() => goToSlide(activeSlide + 1)}
                                                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:border-white/40 hover:bg-white/10"
                                                                aria-label="Next slide"
                                                        >
                                                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                        </button>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                        {slides.map((slide, index) => (
                                                                <button
                                                                        key={`${slide.id}-indicator`}
                                                                        type="button"
                                                                        onClick={() => goToSlide(index)}
                                                                        className={`h-2.5 rounded-full transition-all duration-200 ${
                                                                                activeSlide === index
                                                                                        ? "w-8 bg-amber-400"
                                                                                        : "w-2.5 bg-white/30 hover:bg-white/60"
                                                                        }`}
                                                                        aria-label={`Go to slide ${index + 1}`}
                                                                        aria-current={activeSlide === index}
                                                                />
                                                        ))}
                                                </div>
                                        </div>
                                </div>

                                <div className="relative text-center text-white">
                                        <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
                                                Trusted by leading safety innovators
                                        </h2>
                                        <div className="hero-logo-marquee mx-auto max-w-5xl rounded-full border border-white/10 bg-black/60 py-6">
                                                <div className="hero-logo-track">
                                                        {marqueeLogos.map((logo, index) => (
                                                                <Image
                                                                        key={`${logo.src}-${index}`}
                                                                        src={logo.src}
                                                                        alt="Partner logo"
                                                                        height={120}
                                                                        width={160}
                                                                        className="mx-10 h-12 w-auto object-contain opacity-80"
                                                                />
                                                        ))}
                                                </div>
                                        </div>
                                </div>
                        </div>
                </section>
        );
}
