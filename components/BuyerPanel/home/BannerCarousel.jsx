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

export default function BannerCarousel({ initialBanners = [] }) {
        const { banners, fetchBanners, setBanners } = useBannerStore();
        const [selectedIndex, setSelectedIndex] = useState(0);
        const [emblaRef, emblaApi] = useEmblaCarousel(
                { loop: true, align: "center", skipSnaps: false },
                [Autoplay({ delay: 5500, stopOnInteraction: false })]
        );

        const hasInitialBanners = initialBanners?.length > 0;

        useEffect(() => {
                if (!hasInitialBanners && !banners.length) {
                        fetchBanners();
                }
        }, [banners.length, fetchBanners, hasInitialBanners]);

        useEffect(() => {
                if (!hasInitialBanners) {
                        return;
                }

                const bannersMatchInitial =
                        banners.length === initialBanners.length &&
                        banners.every((banner, index) => {
                                const initialBanner = initialBanners[index];
                                if (!initialBanner) return false;

                                if (banner?._id && initialBanner?._id) {
                                        return banner._id === initialBanner._id;
                                }

                                return banner?.image === initialBanner?.image;
                        });

                if (!bannersMatchInitial) {
                        setBanners(initialBanners);
                }
        }, [banners, hasInitialBanners, initialBanners, setBanners]);

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
                <section className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_top,_#f8f7ff_0%,_#ffffff_55%)]">

                        <div
                                className="relative mx-auto w-full px-4 pb-16 pt-10 sm:px-6 lg:px-10"
                                ref={emblaRef}
                        >
                                <div className="relative flex h-[360px] sm:h-[420px] lg:h-[520px] w-full overflow-hidden rounded-[36px] border border-white/60 bg-white/80 shadow-[0_32px_120px_rgba(148,163,184,0.25)] backdrop-blur-xl">
                                        {banners.map((banner, index) => {
                                                const heading = banner?.title?.trim() || FALLBACK_CONTENT.heading;
                                                const subheading =
                                                        banner?.description?.trim() || FALLBACK_CONTENT.subheading;
                                                const cta = banner?.ctaLabel?.trim() || FALLBACK_CONTENT.cta;
                                                const bannerKey =
                                                        banner?._id || `${banner?.image || "banner"}-${index}`;

                                                return (
                                                        <div
                                                                key={bannerKey}
                                                                className="relative flex-[0_0_100%] overflow-hidden"
                                                        >
                                                                <div className="group relative block h-full w-full">
                                                                        <img
                                                                                src={banner.image}
                                                                                alt={heading}
                                                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                                        />
                                                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-white/10" />

                                                                        <div className="absolute inset-y-0 left-0 flex h-full flex-col justify-center gap-4 px-6 sm:px-10 lg:px-16 text-slate-900">
                                                                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 shadow-sm">
                                                                                        Safety Spotlight
                                                                                </span>
                                                                                <h2 className="max-w-2xl text-2xl font-black leading-tight sm:text-3xl lg:text-5xl">
                                                                                        {heading}
                                                                                </h2>
                                                                                <p className="max-w-xl text-sm text-slate-600 sm:text-base lg:text-lg">
                                                                                        {subheading}
                                                                                </p>
                                                                                {banner.link ? (
                                                                                        <Button
                                                                                                asChild
                                                                                                className="w-full max-w-xs rounded-full bg-slate-900 text-white shadow-sm transition-colors hover:bg-slate-700"
                                                                                        >
                                                                                                <Link href={banner.link}>{cta}</Link>
                                                                                        </Button>
                                                                                ) : (
                                                                                        <span className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                                                                                                {cta}
                                                                                        </span>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                );
                                        })}
                                </div>

                                <div className="pointer-events-none absolute inset-x-16 -bottom-10 h-32 rounded-full bg-white blur-3xl" />

                                <div className="absolute inset-y-0 left-6 right-6 hidden items-center justify-between md:flex">
                                        <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full border border-slate-200 bg-white/80 text-slate-700 backdrop-blur"
                                                onClick={scrollPrev}
                                        >
                                                <ChevronLeft className="h-6 w-6" />
                                        </Button>
                                        <Button
                                                variant="ghost"
                                                size="icon"
                                                className="rounded-full border border-slate-200 bg-white/80 text-slate-700 backdrop-blur"
                                                onClick={scrollNext}
                                        >
                                                <ChevronRight className="h-6 w-6" />
                                        </Button>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2">
                                        {banners.map((banner, index) => {
                                                const bannerKey =
                                                        banner?._id || `${banner?.image || "banner"}-${index}`;

                                                return (
                                                        <button
                                                                key={bannerKey}
                                                                type="button"
                                                                onClick={() => emblaApi?.scrollTo(index)}
                                                                className={`h-2.5 rounded-full transition-all ${
                                                                        selectedIndex === index
                                                                                ? "w-8 bg-slate-900"
                                                                                : "w-2.5 bg-slate-300 hover:bg-slate-400"
                                                                }`}
                                                        >
                                                                <span className="sr-only">Go to slide {index + 1}</span>
                                                        </button>
                                                );
                                        })}
                                </div>
                        </div>
                </section>
        );
}
