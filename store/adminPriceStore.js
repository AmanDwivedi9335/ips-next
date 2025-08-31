"use client";

import { create } from "zustand";
import { toast } from "sonner";

export const useAdminPriceStore = create((set, get) => ({
        prices: [],
        isLoading: false,
        error: null,

        fetchPrices: async () => {
                set({ isLoading: true, error: null });
                try {
                        const res = await fetch("/api/prices");
                        const data = await res.json();
                        set({ prices: data.prices || [], isLoading: false });
                } catch (e) {
                        set({ error: "Failed to fetch prices", isLoading: false });
                }
        },

        addPrice: async (price) => {
                try {
                        const res = await fetch("/api/prices", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(price),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Price added");
                                get().fetchPrices();
                                return true;
                        }
                        toast.error(data.message || "Failed to add price");
                        return false;
                } catch (e) {
                        toast.error("Failed to add price");
                        return false;
                }
        },

        updatePrice: async (id, update) => {
                try {
                        const res = await fetch("/api/prices", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id, ...update }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Price updated");
                                get().fetchPrices();
                                return true;
                        }
                        toast.error(data.message || "Failed to update price");
                        return false;
                } catch (e) {
                        toast.error("Failed to update price");
                        return false;
                }
        },

        deletePrice: async (id) => {
                try {
                        const res = await fetch("/api/prices", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Price deleted");
                                get().fetchPrices();
                                return true;
                        }
                        toast.error(data.message || "Failed to delete price");
                        return false;
                } catch (e) {
                        toast.error("Failed to delete price");
                        return false;
                }
        },
}));
