"use client";

import { create } from "zustand";
import { toast } from "sonner";

export const useAdminLayoutStore = create((set, get) => ({
        layouts: [],
        isLoading: false,
        error: null,

        fetchLayouts: async () => {
                set({ isLoading: true, error: null });
                try {
                        const res = await fetch("/api/layouts");
                        const data = await res.json();
                        set({ layouts: data.layouts || [], isLoading: false });
                } catch (e) {
                        set({ error: "Failed to fetch layouts", isLoading: false });
                }
        },

        addLayout: async (layout) => {
                try {
                        const res = await fetch("/api/layouts", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(layout),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Layout added");
                                get().fetchLayouts();
                                return true;
                        }
                        toast.error(data.message || "Failed to add layout");
                        return false;
                } catch (e) {
                        toast.error("Failed to add layout");
                        return false;
                }
        },

        updateLayout: async (id, update) => {
                try {
                        const res = await fetch("/api/layouts", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id, ...update }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Layout updated");
                                get().fetchLayouts();
                                return true;
                        }
                        toast.error(data.message || "Failed to update layout");
                        return false;
                } catch (e) {
                        toast.error("Failed to update layout");
                        return false;
                }
        },

        deleteLayout: async (id) => {
                try {
                        const res = await fetch("/api/layouts", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Layout deleted");
                                get().fetchLayouts();
                                return true;
                        }
                        toast.error(data.message || "Failed to delete layout");
                        return false;
                } catch (e) {
                        toast.error("Failed to delete layout");
                        return false;
                }
        },
}));
