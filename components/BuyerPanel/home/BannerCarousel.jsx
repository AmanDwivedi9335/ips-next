"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { useBannerStore } from "@/store/bannerStore.js";

const FALLBACK_CONTENT = {
        heading: "Discover Industrial Safety Excellence",
        subheading:
                "Empower your teams with purpose-built safety posters, signs, and training aids crafted for modern worksites.",
        cta: "Shop Safety Essentials",
};

export default function BannerCarousel() {
        const { banners, fetchBanners } = useBannerStore();
        const [selectedIndex, setSelectedIndex] = useState(0);
        const [emblaRef, emblaApi] = useEmblaCarousel(
                { loop: true, align: "center", skipSnaps: false },
                [Autoplay({ delay: 5500, stopOnInteraction: false })]
        );

        useEffect(() => {
                fetchBanners();
        }, [fetchBanners]);

        useEffect(() => {
                if (!emblaApi) return;

                const onSelect = () => {
                        setSelectedIndex(emblaApi.selectedScrollSnap());
                };

                emblaApi.on("select", onSelect);
                onSelect();

                return () => {
                        emblaApi.off("select", onSelect);
                };
        }, [emblaApi]);

        const scrollPrev = useCallback(() => {
                emblaApi?.scrollPrev();
        }, [emblaApi]);

        const scrollNext = useCallback(() => {
                emblaApi?.scrollNext();
        }, [emblaApi]);

        if (!banners.length) {
                return null;
        }

        return (
                <section className="relative w-full overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_55%)]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/60" />

                        <div
                                className="relative mx-auto w-full px-4 pb-16 pt-10 sm:px-6 lg:px-10"
                                ref={emblaRef}
                        >
                                <div className="relative flex h-[360px] sm:h-[420px] lg:h-[520px] w-full overflow-hidden rounded-[36px] border border-white/10 bg-slate-900/20 shadow-[0_32px_120px_rgba(15,23,42,0.35)] backdrop-blur-xl">
                                        {banners.map((banner) => {
                                                const heading = banner?.title?.trim() || FALLBACK_CONTENT.heading;
                                                const subheading =
                                                        banner?.description?.trim() || FALLBACK_CONTENT.subheading;
                                                const cta = banner?.ctaLabel?.trim() || FALLBACK_CONTENT.cta;

                                                return (
                                                        <div
                                                                key={banner._id}
                                                                className="relative flex-[0_0_100%] overflow-hidden"
                                                        >
                                                                <div className="group relative block h-full w-full">
                                                                        <img
                                                                                src={banner.image}
                                                                                alt={heading}
                                                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                        />
                                                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-slate-950/10" />

                                                                        <div className="absolute inset-y-0 left-0 flex h-full flex-col justify-center gap-4 px-6 sm:px-10 lg:px-16 text-white">
                                                                                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                                                                                        Safety Spotlight
                                                                                </span>
                                                                                <h2 className="max-w-2xl text-2xl font-black leading-tight sm:text-3xl lg:text-5xl">
                                                                                        {heading}
                                                                                </h2>
                                                                                <p className="max-w-xl text-sm text-slate-200/90 sm:text-base lg:text-lg">
                                                                                        {subheading}
                                                                                </p>
                                                                                {banner.link ? (
                                                                                        <Button
                                                                                                asChild
                                                                                                className="w-full max-w-xs rounded-full bg-white/90 text-slate-900 transition-colors hover:bg-white"
                                                                                        >
                                                                                                <Link href={banner.link}>{cta}</Link>
                                                                                        </Button>
                                                                                ) : (
                                                                                        <span className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-white/20 px-5 py-3 text-sm font-semibold text-white">
                                                                                                {cta}
                                                                                        </span>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                );
                                        })}
                                </div>

                                <div className="pointer-events-none absolute inset-x-16 -bottom-10 h-32 rounded-full bg-slate-950/60 blur-3xl" />

                                <div className="absolute inset-y-0 left-6 right-6 hidden items-center justify-between md:flex">
                                        <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full border border-white/20 bg-slate-900/50 text-white backdrop-blur"
                                                onClick={scrollPrev}
                                        >
                                                <ChevronLeft className="h-6 w-6" />
                                        </Button>
                                        <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full border border-white/20 bg-slate-900/50 text-white backdrop-blur"
                                                onClick={scrollNext}
                                        >
                                                <ChevronRight className="h-6 w-6" />
                                        </Button>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2">
                                        {banners.map((banner, index) => (
                                                <button
                                                        key={banner._id}
                                                        type="button"
                                                        onClick={() => emblaApi?.scrollTo(index)}
                                                        className={`h-2.5 rounded-full transition-all ${
                                                                selectedIndex === index
                                                                        ? "w-8 bg-white"
                                                                        : "w-2.5 bg-white/40 hover:bg-white/60"
                                                        }`}
                                                >
                                                        <span className="sr-only">Go to slide {index + 1}</span>
                                                </button>
                                        ))}
                                </div>
                        </div>
                </section>
        );
}
