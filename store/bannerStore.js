"use client";

import { create } from "zustand";

const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
        });

export const useBannerStore = create((set) => ({
        banners: [],
        fetchBanners: async () => {
                try {
                        const res = await fetch("/api/settings/banners");
                        const data = await res.json();
                        if (data.success) {
                                set({ banners: data.banners });
                        }
                } catch (error) {
                        console.error("Failed to fetch banners", error);
                }
        },
        addBanner: async ({ file, link }) => {
                try {
                        const image = await fileToBase64(file);
                        const res = await fetch("/api/settings/banners", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ image, link }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                set((state) => ({ banners: [...state.banners, data.banner] }));
                        }
                } catch (error) {
                        console.error("Failed to add banner", error);
                }
        },
        updateBanner: async (id, { file, link }) => {
                try {
                        const payload = { id };
                        if (link !== undefined) payload.link = link;
                        if (file) payload.image = await fileToBase64(file);
                        const res = await fetch("/api/settings/banners", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(payload),
                        });
                        const data = await res.json();
                        if (data.success) {
                                set((state) => ({
                                        banners: state.banners.map((b) =>
                                                b._id === id ? data.banner : b
                                        ),
                                }));
                        }
                } catch (error) {
                        console.error("Failed to update banner", error);
                }
        },
        removeBanner: async (id) => {
                try {
                        await fetch("/api/settings/banners", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id }),
                        });
                        set((state) => ({
                                banners: state.banners.filter((b) => b._id !== id),
                        }));
                } catch (error) {
                        console.error("Failed to remove banner", error);
                }
        },
}));
