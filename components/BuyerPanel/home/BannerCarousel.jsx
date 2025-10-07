"use client";

import { useEffect } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useBannerStore } from "@/store/bannerStore.js";

export default function BannerCarousel() {
        const { banners, fetchBanners } = useBannerStore();
        const [emblaRef] = useEmblaCarousel(
                { loop: true, align: "center" },
                [Autoplay({ delay: 4500, stopOnInteraction: false })]
        );

        useEffect(() => {
                fetchBanners();
        }, [fetchBanners]);

        if (!banners.length) return null;

        return (
                <div className="relative mx-auto max-w-7xl px-4 pt-10" ref={emblaRef}>
                        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-violet-600/40 via-transparent to-sky-500/40 blur-3xl" />
                        <div className="flex rounded-[32px] border border-white/10 bg-white/5 p-1 backdrop-blur-xl shadow-[0_25px_80px_rgba(59,130,246,0.2)]">
                                {banners.map((banner) => (
                                        <div
                                                key={banner._id}
                                                className="flex-[0_0_100%] overflow-hidden rounded-[28px]"
                                        >
                                                <a
                                                        href={banner.link || "#"}
                                                        className="group relative block h-full w-full"
                                                >
                                                        <img
                                                                src={banner.image}
                                                                alt={banner?.title || "banner"}
                                                                className="h-full w-full rounded-[28px] object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                        <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-r from-slate-900/60 via-slate-900/30 to-slate-900/60 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                                                </a>
                                        </div>
                                ))}
                        </div>
                        <div className="pointer-events-none absolute inset-x-12 -bottom-8 h-24 rounded-full bg-slate-900/60 blur-2xl" />
                </div>
        );
}
