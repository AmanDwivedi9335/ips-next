"use client";

import { create } from "zustand";
import { toast } from "sonner";

export const useAdminSizeStore = create((set, get) => ({
        sizes: [],
        isLoading: false,
        error: null,

        fetchSizes: async () => {
                set({ isLoading: true, error: null });
                try {
                        const res = await fetch("/api/sizes");
                        const data = await res.json();
                        set({ sizes: data.sizes || [], isLoading: false });
                } catch (e) {
                        set({ error: "Failed to fetch sizes", isLoading: false });
                }
        },

        addSize: async (size) => {
                try {
                        const res = await fetch("/api/sizes", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(size),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Size added");
                                get().fetchSizes();
                                return true;
                        }
                        toast.error(data.message || "Failed to add size");
                        return false;
                } catch (e) {
                        toast.error("Failed to add size");
                        return false;
                }
        },

        updateSize: async (id, update) => {
                try {
                        const res = await fetch("/api/sizes", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id, ...update }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Size updated");
                                get().fetchSizes();
                                return true;
                        }
                        toast.error(data.message || "Failed to update size");
                        return false;
                } catch (e) {
                        toast.error("Failed to update size");
                        return false;
                }
        },

        deleteSize: async (id) => {
                try {
                        const res = await fetch("/api/sizes", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Size deleted");
                                get().fetchSizes();
                                return true;
                        }
                        toast.error(data.message || "Failed to delete size");
                        return false;
                } catch (e) {
                        toast.error("Failed to delete size");
                        return false;
                }
        },
}));
