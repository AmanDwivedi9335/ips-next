"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { useBannerStore } from "@/store/bannerStore.js";

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

        const bannersToRender = banners.length ? banners : initialBanners;

        const scrollNext = useCallback(() => {
                emblaApi?.scrollNext();
        }, [emblaApi]);

        if (!bannersToRender.length) {
                return null;
        }

        return (
                <section className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_top,_#f8f7ff_0%,_#ffffff_55%)]">

                        <div
                                className="relative mx-auto w-full px-4 pb-16 pt-10 sm:px-6 lg:px-10"
                                ref={emblaRef}
                        >
                                <div className="relative flex h-[360px] sm:h-[420px] lg:h-[520px] w-full overflow-hidden rounded-[36px] border border-white/60 bg-white/80 shadow-[0_32px_120px_rgba(148,163,184,0.25)] backdrop-blur-xl">
                                        {bannersToRender.map((banner, index) => {
                                                const bannerKey =
                                                        banner?._id || `${banner?.image || "banner"}-${index}`;
                                                const altText = banner?.title?.trim() || "Home hero banner";

                                                return (
                                                        <div
                                                                key={bannerKey}
                                                                className="relative flex-[0_0_100%] overflow-hidden"
                                                        >
                                                                <img
                                                                        src={banner.image}
                                                                        alt={altText}
                                                                        className="h-full w-full object-cover"
                                                                />
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
                                        {bannersToRender.map((banner, index) => {
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
