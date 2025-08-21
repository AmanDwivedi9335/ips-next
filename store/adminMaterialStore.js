"use client";

import { create } from "zustand";
import { toast } from "sonner";

export const useAdminMaterialStore = create((set, get) => ({
        materials: [],
        isLoading: false,
        error: null,

        fetchMaterials: async () => {
                set({ isLoading: true, error: null });
                try {
                        const res = await fetch("/api/materials");
                        const data = await res.json();
                        set({ materials: data.materials || [], isLoading: false });
                } catch (e) {
                        set({ error: "Failed to fetch materials", isLoading: false });
                }
        },

        addMaterial: async (material) => {
                try {
                        const res = await fetch("/api/materials", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(material),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Material added");
                                get().fetchMaterials();
                                return true;
                        }
                        toast.error(data.message || "Failed to add material");
                        return false;
                } catch (e) {
                        toast.error("Failed to add material");
                        return false;
                }
        },

        updateMaterial: async (id, update) => {
                try {
                        const res = await fetch("/api/materials", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id, ...update }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Material updated");
                                get().fetchMaterials();
                                return true;
                        }
                        toast.error(data.message || "Failed to update material");
                        return false;
                } catch (e) {
                        toast.error("Failed to update material");
                        return false;
                }
        },

        deleteMaterial: async (id) => {
                try {
                        const res = await fetch("/api/materials", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Material deleted");
                                get().fetchMaterials();
                                return true;
                        }
                        toast.error(data.message || "Failed to delete material");
                        return false;
                } catch (e) {
                        toast.error("Failed to delete material");
                        return false;
                }
        },
}));
