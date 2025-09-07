"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { DEFAULT_PRODUCT_FAMILIES } from "@/constants/productFamilies.js";

export const useAdminProductFamilyStore = create((set, get) => ({
        productFamilies: DEFAULT_PRODUCT_FAMILIES,
        isLoading: false,
        error: null,

        fetchProductFamilies: async () => {
                set({ isLoading: true, error: null });
                try {
                        const response = await fetch("/api/admin/product-families");
                        const data = await response.json();
                        if (data.success) {
                                const fetched = data.productFamilies || [];
                                // Merge defaults with fetched families using slug as key.
                                // Fetched families override defaults when slugs match.
                                const familiesMap = new Map();
                                DEFAULT_PRODUCT_FAMILIES.forEach((df) => {
                                        familiesMap.set(df.slug, df);
                                });
                                fetched.forEach((f) => {
                                        if (f.slug) {
                                                familiesMap.set(f.slug, f);
                                        }
                                });
                                const merged = Array.from(familiesMap.values()).sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                );
                                set({ productFamilies: merged, isLoading: false });
                        } else {
                                set({ productFamilies: DEFAULT_PRODUCT_FAMILIES, error: data.message, isLoading: false });
                        }
                } catch (error) {
                        set({
                                productFamilies: DEFAULT_PRODUCT_FAMILIES,
                                error: "Failed to fetch product families",
                                isLoading: false,
                        });
                }
        },

        addProductFamily: async (productFamilyData) => {
                try {
                        const response = await fetch("/api/admin/product-families", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(productFamilyData),
                        });
                        const data = await response.json();
                        if (data.success) {
                                toast.success("Product family added successfully");
                                get().fetchProductFamilies();
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        toast.error("Failed to add product family");
                        return false;
                }
        },

        updateProductFamily: async (productFamilyId, updateData) => {
                try {
                        const response = await fetch("/api/admin/product-families", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ productFamilyId, ...updateData }),
                        });
                        const data = await response.json();
                        if (data.success) {
                                toast.success("Product family updated successfully");
                                get().fetchProductFamilies();
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        toast.error("Failed to update product family");
                        return false;
                }
        },

        deleteProductFamily: async (productFamilyId) => {
                try {
                        const response = await fetch("/api/admin/product-families", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ productFamilyId }),
                        });
                        const data = await response.json();
                        if (data.success) {
                                toast.success("Product family deleted successfully");
                                get().fetchProductFamilies();
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        toast.error("Failed to delete product family");
                        return false;
                }
        },

        deleteMultipleProductFamilies: async (productFamilyIds) => {
                try {
                        const response = await fetch("/api/admin/product-families", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ productFamilyIds }),
                        });
                        const data = await response.json();
                        if (data.success) {
                                toast.success(data.message);
                                get().fetchProductFamilies();
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        toast.error("Failed to delete product families");
                        return false;
                }
        },
}));
