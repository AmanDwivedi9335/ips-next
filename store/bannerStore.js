"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useBannerStore = create(
        devtools(
                persist(
                        (set) => ({
                                banners: [],
                                addBanner: (banner) =>
                                        set((state) => ({ banners: [...state.banners, { id: Date.now(), ...banner }] })),
                                updateBanner: (id, updated) =>
                                        set((state) => ({
                                                banners: state.banners.map((b) =>
                                                        b.id === id ? { ...b, ...updated } : b
                                                ),
                                        })),
                                removeBanner: (id) =>
                                        set((state) => ({ banners: state.banners.filter((b) => b.id !== id) })),
                        }),
                        {
                                name: "banner-storage",
                        }
                )
        )
);
