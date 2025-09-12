"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
        persist(
                (set, get) => ({
                        items: [],
                        isOpen: false,
                        product: null,

                        addItem: (product) =>
                                set((state) => {
                                        if (state.items.find((item) => item.id === product.id)) {
                                                return state;
                                        }
                                        return { items: [...state.items, product] };
                                }),

                        removeItem: (productId) =>
                                set((state) => ({
                                        items: state.items.filter((item) => item.id !== productId),
                                })),

                        clear: () => set({ items: [] }),
                        openWishlist: (product) => set({ isOpen: true, product }),
                        closeWishlist: () => set({ isOpen: false, product: null }),
                }),
                {
                        name: "wishlist-store",
                },
        ),
);
