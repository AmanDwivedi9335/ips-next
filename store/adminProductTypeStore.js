"use client";

import { create } from "zustand";
import { toast } from "sonner";

export const useAdminProductTypeStore = create((set, get) => ({
        productTypes: [],
        isLoading: false,
        error: null,

        fetchProductTypes: async () => {
                set({ isLoading: true, error: null });
                try {
                        const response = await fetch("/api/admin/product-types");
                        const data = await response.json();
                        if (data.success) {
                                set({ productTypes: data.productTypes, isLoading: false });
                        } else {
                                set({ error: data.message, isLoading: false });
                        }
                } catch (error) {
                        set({ error: "Failed to fetch product types", isLoading: false });
                }
        },

        addProductType: async (productTypeData) => {
                try {
                        const response = await fetch("/api/admin/product-types", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(productTypeData),
                        });
                        const data = await response.json();
                        if (data.success) {
                                toast.success("Product type added successfully");
                                get().fetchProductTypes();
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        toast.error("Failed to add product type");
                        return false;
                }
        },

        updateProductType: async (productTypeId, updateData) => {
                try {
                        const response = await fetch("/api/admin/product-types", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ productTypeId, ...updateData }),
                        });
                        const data = await response.json();
                        if (data.success) {
                                toast.success("Product type updated successfully");
                                get().fetchProductTypes();
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        toast.error("Failed to update product type");
                        return false;
                }
        },

        deleteProductType: async (productTypeId) => {
                try {
                        const response = await fetch("/api/admin/product-types", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ productTypeId }),
                        });
                        const data = await response.json();
                        if (data.success) {
                                toast.success("Product type deleted successfully");
                                get().fetchProductTypes();
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        toast.error("Failed to delete product type");
                        return false;
                }
        },

        deleteMultipleProductTypes: async (productTypeIds) => {
                try {
                        const response = await fetch("/api/admin/product-types", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ productTypeIds }),
                        });
                        const data = await response.json();
                        if (data.success) {
                                toast.success(data.message);
                                get().fetchProductTypes();
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        toast.error("Failed to delete product types");
                        return false;
                }
        },
}));
