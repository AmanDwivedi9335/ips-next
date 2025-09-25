"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const PRODUCT_CACHE_TTL = 60 * 1000;
const FILTER_CACHE_TTL = 5 * 60 * 1000;
const MAX_PRODUCT_CACHE_ENTRIES = 20;
const MAX_FILTER_CACHE_ENTRIES = 15;
const productCache = new Map();
const filterCache = new Map();
let activeProductsController = null;

const trimCache = (cache, maxEntries) => {
        if (cache.size > maxEntries) {
                const firstKey = cache.keys().next().value;
                if (firstKey !== undefined) {
                        cache.delete(firstKey);
                }
        }
};

export const useProductStore = create(
	devtools(
		persist(
			(set, get) => ({
				// Initial State
				products: [],
				filteredProducts: [],
                                filters: {
                                        categories: [],
                                        priceRange: [0, 10000],
                                },
				availableFilters: null,
				currentCategory: "all",
				currentPage: 1,
				totalPages: 1,
				searchQuery: "",
				isLoading: false,
				error: null,
				sortBy: "createdAt",
				sortOrder: "desc",

				// Actions
                                fetchProducts: async () => {
                                        let controller;

                                        try {
                                                const {
                                                        currentCategory,
                                                        searchQuery,
                                                        filters,
                                                        currentPage,
                                                        sortBy,
                                                        sortOrder,
                                                } = get();

                                                const params = new URLSearchParams({
                                                        page: currentPage.toString(),
                                                        limit: "12",
                                                        sort: sortBy,
                                                        order: sortOrder,
                                                });

                                                if (currentCategory !== "all") {
                                                        params.append("category", currentCategory);
                                                }

                                                if (searchQuery) {
                                                        params.append("search", searchQuery);
                                                }

                                                if (filters.priceRange[0] > 0) {
                                                        params.append("minPrice", filters.priceRange[0].toString());
                                                }

                                                if (filters.priceRange[1] < 10000) {
                                                        params.append("maxPrice", filters.priceRange[1].toString());
                                                }

                                                if (filters.categories.length > 0) {
                                                        params.append(
                                                                "subcategories",
                                                                filters.categories.join(",")
                                                        );
                                                }

                                                const cacheKey = params.toString();
                                                const cachedEntry = productCache.get(cacheKey);

                                                if (
                                                        cachedEntry &&
                                                        Date.now() - cachedEntry.timestamp < PRODUCT_CACHE_TTL
                                                ) {
                                                        set({
                                                                products: cachedEntry.products,
                                                                filteredProducts: cachedEntry.products,
                                                                totalPages: cachedEntry.totalPages,
                                                                isLoading: false,
                                                                error: null,
                                                        });
                                                        return;
                                                }

                                                if (activeProductsController) {
                                                        activeProductsController.abort();
                                                }

                                                controller = new AbortController();
                                                activeProductsController = controller;

                                                set({ isLoading: true, error: null });

                                                const response = await fetch(`/api/products?${params}`, {
                                                        signal: controller.signal,
                                                });
                                                const data = await response.json();

                                                if (controller.signal.aborted) {
                                                        if (activeProductsController === controller) {
                                                                activeProductsController = null;
                                                        }
                                                        return;
                                                }

                                                activeProductsController = null;

                                                if (!response.ok) {
                                                        set({
                                                                error: data?.message || "Failed to fetch products",
                                                                isLoading: false,
                                                        });
                                                        return;
                                                }

                                                if (data.success) {
                                                        productCache.set(cacheKey, {
                                                                timestamp: Date.now(),
                                                                products: data.products,
                                                                totalPages: data.pagination.totalPages,
                                                        });
                                                        trimCache(productCache, MAX_PRODUCT_CACHE_ENTRIES);
                                                        set({
                                                                products: data.products,
                                                                filteredProducts: data.products,
                                                                totalPages: data.pagination.totalPages,
                                                                isLoading: false,
                                                        });
                                                } else {
                                                        set({ error: data.message, isLoading: false });
                                                }
                                        } catch (error) {
                                                if (controller && activeProductsController === controller) {
                                                        activeProductsController = null;
                                                }

                                                if (error.name !== "AbortError") {
                                                        set({
                                                                error: "Failed to fetch products",
                                                                isLoading: false,
                                                        });
                                                }
                                        }
                                },

                                fetchFilters: async () => {
                                        try {
                                                const { currentCategory } = get();
                                                const params = new URLSearchParams();
                                                if (currentCategory) {
                                                        params.append("category", currentCategory);
                                                }
                                                const cacheKey = params.toString();
                                                const cachedFilters = filterCache.get(cacheKey);

                                                if (
                                                        cachedFilters &&
                                                        Date.now() - cachedFilters.timestamp < FILTER_CACHE_TTL
                                                ) {
                                                        set({
                                                                availableFilters: cachedFilters.filters,
                                                                filters: {
                                                                        ...get().filters,
                                                                        priceRange: [
                                                                                cachedFilters.filters.priceRange.min,
                                                                                cachedFilters.filters.priceRange.max,
                                                                        ],
                                                                },
                                                        });
                                                        return;
                                                }

                                                const response = await fetch(
                                                        `/api/products/filters?${params.toString()}`,
                                                        {
                                                                cache: "no-store",
                                                        }
                                                );
                                                const data = await response.json();

                                                if (data.success) {
                                                        filterCache.set(cacheKey, {
                                                                timestamp: Date.now(),
                                                                filters: data.filters,
                                                        });
                                                        trimCache(filterCache, MAX_FILTER_CACHE_ENTRIES);
                                                        set({
                                                                availableFilters: data.filters,
                                filters: {
                                        ...get().filters,
                                        priceRange: [
                                                data.filters.priceRange.min,
                                                data.filters.priceRange.max,
                                        ],
                                },
							});
						}
					} catch (error) {
						console.error("Failed to fetch filters:", error);
					}
				},

                                setCurrentCategory: (category, fetch = true) => {
                                        set({
                                                currentCategory: category,
                                                currentPage: 1,
                                                filters: { ...get().filters, categories: [] },
                                        });
                                        if (fetch) {
                                                get().fetchProducts();
                                        }
                                },

				setCurrentPage: (page) => {
					set({ currentPage: page });
					get().fetchProducts();
				},

                                setSearchQuery: (query, fetch = true) => {
                                        set({
                                                searchQuery: query,
                                                currentPage: 1,
                                        });
                                        if (fetch) {
                                                get().fetchProducts();
                                        }
                                },

				setFilters: (newFilters) => {
					set((state) => ({
						filters: { ...state.filters, ...newFilters },
						currentPage: 1,
					}));
				},

				setSorting: (sortBy, order) => {
					set({ sortBy, sortOrder: order, currentPage: 1 });
					get().fetchProducts();
				},

				applyFilters: async () => {
					set({ currentPage: 1 });
					await get().fetchProducts();
				},

				getProductById: (id) => {
					return get().products.find((product) => product.id === id);
				},

				addToCart: async (productId, quantity = 1) => {
					try {
						const response = await fetch(
							`/api/products/add-to-cart/${productId}`,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({ quantity }),
							}
						);

						const data = await response.json();
						return data.success;
					} catch (error) {
						console.error("Failed to add to cart:", error);
						return false;
					}
				},

				buyNow: async (productId, quantity = 1) => {
					try {
						const response = await fetch(`/api/products/buy-now/${productId}`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ quantity }),
						});

						const data = await response.json();

						if (data.success) {
							return data.redirectUrl;
						}

						return null;
					} catch (error) {
						console.error("Failed to process buy now:", error);
						return null;
					}
				},
			}),
			{
				name: "product-store",
				partialize: (state) => ({
					currentCategory: state.currentCategory,
					filters: state.filters,
					sortBy: state.sortBy,
					sortOrder: state.sortOrder,
				}),
			}
		)
	)
);
