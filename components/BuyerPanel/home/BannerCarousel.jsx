"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useBannerStore } from "@/store/bannerStore.js";

export default function BannerCarousel() {
        const { banners } = useBannerStore();
        const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })]);

        if (!banners.length) return null;

        return (
                <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                                {banners.map((banner) => (
                                        <div
                                                key={banner.id}
                                                className="flex-[0_0_100%]"
                                        >
                                                <a href={banner.link || "#"}>
                                                        <img
                                                                src={banner.image}
                                                                alt="banner"
                                                                className="w-full h-48 object-cover"
                                                        />
                                                </a>
                                        </div>
                                ))}
                        </div>
                </div>
        );
}
