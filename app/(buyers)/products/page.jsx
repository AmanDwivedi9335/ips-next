"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/productStore.js";
import ProductFilters from "@/components/BuyerPanel/products/ProductFilters.jsx";
import ProductGrid from "@/components/BuyerPanel/products/ProductGrid.jsx";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
	const searchParams = useSearchParams();

        const {
                error,
                fetchProducts,
                applyFilters,
                setCurrentCategory,
                setSearchQuery,
                setFilters,
        } = useProductStore();


        // Handle URL parameters
        useEffect(() => {

                const category = searchParams.get("category") || "all";
                const search = searchParams.get("search") || "";
                const subcategories = searchParams.get("subcategories");
                const minPrice = searchParams.get("minPrice");
                const maxPrice = searchParams.get("maxPrice");

                setCurrentCategory(category, false);
                setSearchQuery(search, false);
                setFilters({
                        categories: subcategories ? subcategories.split(",") : [],

                        priceRange: [
                                minPrice ? parseInt(minPrice, 10) : 0,
                                maxPrice ? parseInt(maxPrice, 10) : 10000,
                        ],

                });

                applyFilters();
        }, [searchParams, applyFilters, setCurrentCategory, setSearchQuery, setFilters]);

        if (error) {
                return (
                        <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#f4f0ff] via-white to-[#e8f9ff]" />
                                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl" />
                                <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
                                <div className="relative z-10 text-center px-6 py-10 rounded-3xl bg-white/80 backdrop-blur border border-white/60 shadow-xl">
                                        <h2 className="text-3xl font-semibold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-3">
                                                Something went wrong
                                        </h2>
                                        <p className="text-slate-600 max-w-md mx-auto">
                                                {error}
                                        </p>
                                        <button
                                                onClick={() => fetchProducts()}
                                                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-slate-800 hover:via-slate-700 hover:to-slate-800"
                                        >
                                                Try Again
                                        </button>
                                </div>
                        </div>
                );
        }

        return (
                <div className="relative min-h-screen overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f4f0ff] via-white to-[#e8f9ff]" />
                        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl" />
                        <div className="absolute -bottom-40 -right-28 h-96 w-96 rounded-full bg-sky-400/25 blur-3xl" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_55%)]" />
                        <div className="relative z-10 container mx-auto px-4 py-10 lg:py-16">
                                <div className="flex flex-col lg:flex-row gap-8">
					{/* Filters Sidebar */}
					<div className="lg:w-80 flex-shrink-0">
						<ProductFilters />
					</div>

					{/* Main Content */}
					<div className="flex-1">
						<ProductGrid />
					</div>
				</div>
			</div>
		</div>
	);
}
