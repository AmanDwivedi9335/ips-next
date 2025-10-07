"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useBannerStore } from "@/store/bannerStore.js";

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
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_55%)]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/10 to-slate-950/40" />

                        <div className="relative mx-auto w-full px-4 pb-16 pt-10 sm:px-6 lg:px-10" ref={emblaRef}>
                                <div className="relative flex h-[320px] w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/20 shadow-[0_28px_120px_rgba(15,23,42,0.28)] backdrop-blur-lg sm:h-[420px] lg:h-[520px]">
                                        {banners.map((banner) => {
                                                const title = banner?.title?.trim() || "banner";

                                                const SlideComponent = banner.link ? "a" : "div";

                                                return (
                                                        <div key={banner._id} className="relative flex-[0_0_100%] overflow-hidden">
                                                                <SlideComponent
                                                                        {...(banner.link
                                                                                ? {
                                                                                          href: banner.link,
                                                                                          "aria-label": title,
                                                                                  }
                                                                                : {})}
                                                                        className="group relative block h-full w-full"
                                                                >
                                                                        <img
                                                                                src={banner.image}
                                                                                alt={title}
                                                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                                                        />
                                                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/45 via-transparent to-slate-950/35 opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                                                                </SlideComponent>
                                                        </div>
                                                );
                                        })}
                                </div>

                                <div className="pointer-events-none absolute inset-x-12 -bottom-10 h-28 rounded-full bg-slate-950/55 blur-3xl" />

                                <div className="absolute inset-y-0 left-6 right-6 hidden items-center justify-between md:flex">
                                        <button
                                                type="button"
                                                onClick={scrollPrev}
                                                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white shadow-lg backdrop-blur transition hover:bg-slate-900/80"
                                        >
                                                <ChevronLeft className="h-6 w-6" />
                                                <span className="sr-only">Previous slide</span>
                                        </button>
                                        <button
                                                type="button"
                                                onClick={scrollNext}
                                                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white shadow-lg backdrop-blur transition hover:bg-slate-900/80"
                                        >
                                                <ChevronRight className="h-6 w-6" />
                                                <span className="sr-only">Next slide</span>
                                        </button>
                                </div>

                                <div className="mt-6 flex items-center justify-center gap-2">
                                        {banners.map((banner, index) => (
                                                <button
                                                        key={banner._id}
                                                        type="button"
                                                        onClick={() => emblaApi?.scrollTo(index)}
                                                        className={`h-2.5 rounded-full transition-all ${
                                                                selectedIndex === index
                                                                        ? "w-7 bg-white"
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
