"use client";

import { create } from "zustand";
import { toast } from "sonner";

export const useAdminProductStore = create((set, get) => ({
	// State
	products: [],
	isLoading: false,
	error: null,
	filters: {
		search: "",
		category: "all",
		minPrice: "",
		maxPrice: "",
                discount: "",
                published: null,
	},
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalProducts: 0,
		limit: 10,
	},
	selectedProducts: [],
	sortBy: "createdAt",
	sortOrder: "desc",

	// Actions
	fetchProducts: async () => {
		set({ isLoading: true, error: null });

		try {
			const { filters, pagination, sortBy, sortOrder } = get();

			const params = new URLSearchParams({
				page: pagination.currentPage.toString(),
				limit: pagination.limit.toString(),
				sort: sortBy,
				order: sortOrder,
			});

			// Add filters to params
			Object.entries(filters).forEach(([key, value]) => {
				if (
					value !== null &&
					value !== undefined &&
					value !== "" &&
					value !== "all"
				) {
					params.append(key, value.toString());
				}
			});

			const response = await fetch(
				`/api/admin/product/getAllProducts?${params}`
			);
			const data = await response.json();

			if (data.success) {
				set({
					products: data.products,
					pagination: data.pagination,
					isLoading: false,
				});
			} else {
				set({ error: data.message, isLoading: false });
			}
		} catch (error) {
			set({
				error: "Failed to fetch products",
				isLoading: false,
			});
		}
	},

       // Upload language images to Cloudinary and submit product
       addProduct: async (productData) => {
               try {
                       // Language images are already uploaded in the form component
                       // and provided here as Cloudinary URLs. Simply pass them through.
                       const validLanguageImages = productData.languageImages || [];

                       // Create FormData for submitting product details
                       const formData = new FormData();

                       // Add all text fields
                       formData.append("title", productData.title);
                       if (productData.productCode)
                               formData.append("productCode", productData.productCode);
                       formData.append("description", productData.description);
                       formData.append(
                               "longDescription",
                               productData.longDescription || productData.description
                       );
                       formData.append("category", productData.category);
                       formData.append(
                               "subcategory",
                               productData.subcategory || ""
                       );
                       if (productData.productFamily)
                               formData.append("productFamily", productData.productFamily);
                       formData.append("type", productData.type);
                       formData.append("published", productData.published);

                       // Add features as JSON string
                       formData.append("features", JSON.stringify(productData.features || []));

                       // Add arrays as JSON strings
                       formData.append(
                               "languages",
                               JSON.stringify(productData.languages || [])
                       );
                       formData.append(
                               "materials",
                               JSON.stringify(productData.materials || [])
                       );
                       formData.append(
                               "sizes",
                               JSON.stringify(productData.sizes || [])
                       );
                       formData.append(
                               "layouts",
                               JSON.stringify(productData.layouts || [])
                       );
                       formData.append(
                               "images",
                               JSON.stringify(productData.images || [])
                       );
                       formData.append(
                               "languageImages",
                               JSON.stringify(validLanguageImages)
                       );
                       formData.append(
                               "pricing",
                               JSON.stringify(productData.pricing || [])
                       );

                       const response = await fetch("/api/admin/product/addProduct", {
                               method: "POST",
                               body: formData,
                       });

                       const data = await response.json();

                       if (data.success) {
                               toast.success("Product added successfully");
                               get().fetchProducts(); // Refresh the list
                               return true;
                       } else {
                               toast.error(data.message);
                               return false;
                       }
               } catch (error) {
                       console.error("Add product error:", error);
                       toast.error("Failed to add product");
                       return false;
               }
       },

        updateProduct: async (productId, updateData) => {
                try {
                        const formData = new FormData();

                       formData.append("productId", productId);

                       formData.append("title", updateData.title);
                       if (updateData.productCode)
                               formData.append("productCode", updateData.productCode);
                       formData.append("description", updateData.description);
                        formData.append(
                                "longDescription",
                                updateData.longDescription || updateData.description
                        );
                        formData.append("category", updateData.category);
                        formData.append("subcategory", updateData.subcategory || "");
                        if (updateData.productFamily)
                                formData.append("productFamily", updateData.productFamily);
                        formData.append("type", updateData.type);
                        formData.append("published", updateData.published);

                        formData.append("features", JSON.stringify(updateData.features || []));

                        formData.append(
                                "languages",
                                JSON.stringify(updateData.languages || [])
                        );
                        formData.append(
                                "materials",
                                JSON.stringify(updateData.materials || [])
                        );
                        formData.append(
                                "sizes",
                                JSON.stringify(updateData.sizes || [])
                        );
                        formData.append(
                                "layouts",
                                JSON.stringify(updateData.layouts || [])
                        );
                        formData.append(
                                "languageImages",
                                JSON.stringify(updateData.languageImages || [])
                        );
                        formData.append(
                                "images",
                                JSON.stringify(updateData.images || [])
                        );
                        formData.append(
                                "pricing",
                                JSON.stringify(updateData.pricing || [])
                        );

                        const response = await fetch("/api/admin/product/updateProduct", {
                                method: "PUT",
                                body: formData,
                        });

                        const data = await response.json();

                        if (data.success) {
                                toast.success("Product updated successfully");
                                get().fetchProducts(); // Refresh the list
                                return true;
                        } else {
                                toast.error(data.message);
                                return false;
                        }
                } catch (error) {
                        console.error("Update product error:", error);
                        toast.error("Failed to update product");
                        return false;
                }
        },

        cloneProduct: async (productId) => {
                try {
                        const response = await fetch("/api/admin/product/cloneProduct", {
                                method: "POST",
                                headers: {
                                        "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ productId }),
                        });

                        const data = await response.json();

                        if (data.success) {
                                toast.success(data.message || "Product cloned successfully");
                                get().fetchProducts();
                                return data.product;
                        } else {
                                toast.error(data.message || "Failed to clone product");
                                return null;
                        }
                } catch (error) {
                        toast.error("Failed to clone product");
                        return null;
                }
        },

        deleteProduct: async (productId) => {
                try {
			const response = await fetch("/api/admin/product/deleteProduct", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ productId }),
			});

			const data = await response.json();

			if (data.success) {
				toast.success("Product deleted successfully");
				get().fetchProducts(); // Refresh the list
				return true;
			} else {
				toast.error(data.message);
				return false;
			}
		} catch (error) {
			toast.error("Failed to delete product");
			return false;
		}
	},

	deleteMultipleProducts: async (productIds) => {
		try {
			const response = await fetch("/api/admin/product/deleteMultipleProduct", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ productIds }),
			});

			const data = await response.json();

			if (data.success) {
				toast.success(data.message);
				set({ selectedProducts: [] }); // Clear selection
				get().fetchProducts(); // Refresh the list
				return true;
			} else {
				toast.error(data.message);
				return false;
			}
		} catch (error) {
			toast.error("Failed to delete products");
			return false;
		}
	},

	bulkUploadProducts: async (products) => {
		try {
			const response = await fetch("/api/admin/product/bulkUploadProduct", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ products }),
			});

			const data = await response.json();

			if (data.success) {
				toast.success(data.message);
				get().fetchProducts(); // Refresh the list
				return data.results;
			} else {
				toast.error(data.message);
				return null;
			}
		} catch (error) {
			toast.error("Failed to bulk upload products");
			return null;
		}
	},

	// Filter and pagination actions
	setFilters: (newFilters) => {
		set((state) => ({
			filters: { ...state.filters, ...newFilters },
			pagination: { ...state.pagination, currentPage: 1 },
		}));
	},

	resetFilters: () => {
		set({
			filters: {
				search: "",
				category: "all",
				minPrice: "",
				maxPrice: "",
				discount: "",
				published: null,
                            
			},
			pagination: { ...get().pagination, currentPage: 1 },
		});
		get().fetchProducts();
	},

	setPage: (page) => {
		set((state) => ({
			pagination: { ...state.pagination, currentPage: page },
		}));
		get().fetchProducts();
	},

	setSorting: (sortBy, order) => {
		set({ sortBy, sortOrder: order });
		get().fetchProducts();
	},

	// Selection actions
	selectProduct: (productId) => {
		set((state) => ({
			selectedProducts: [...state.selectedProducts, productId],
		}));
	},

	deselectProduct: (productId) => {
		set((state) => ({
			selectedProducts: state.selectedProducts.filter((id) => id !== productId),
		}));
	},

	selectAllProducts: () => {
		set((state) => ({
			selectedProducts: state.products.map((product) => product._id),
		}));
	},

	clearSelection: () => {
		set({ selectedProducts: [] });
	},

	toggleProductSelection: (productId) => {
		const { selectedProducts } = get();
		if (selectedProducts.includes(productId)) {
			get().deselectProduct(productId);
		} else {
			get().selectProduct(productId);
		}
	},
}));
