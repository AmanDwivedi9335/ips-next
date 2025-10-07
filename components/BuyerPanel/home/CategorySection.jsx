"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Filter, Grid, List, Search } from "lucide-react";
import ProductGrid from "@/components/BuyerPanel/home/ProductGrid.jsx";

export default function CategorySection({
	products = [],
	categories = [],
	searchQuery = "",
	selectedCategory = "All",
	setSelectedCategory,
	onSearch,
	pagination,
	onLoadMore,
	isLoading = false,
}) {
	const [localSearch, setLocalSearch] = useState(searchQuery);
	const [viewMode, setViewMode] = useState("grid");

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (onSearch) {
			onSearch(localSearch);
		}
	};

	const handleCategoryChange = (category) => {
		setSelectedCategory(category);
	};

	// Loading state
        if (isLoading && products.length === 0) {
                return (
                        <section className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 text-white shadow-[0_30px_90px_rgba(30,64,175,0.3)] backdrop-blur-xl">
                                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.35),_transparent_55%)]" />
                                <div className="space-y-8">
                                        <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-white/30" />
                                        <div className="mx-auto h-8 w-56 animate-pulse rounded-full bg-white/40" />
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                                        <div key={i} className="h-48 rounded-2xl bg-white/10" />
                                                ))}
                                        </div>
                                </div>
                        </section>
                );
        }

        return (
                <section className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-white shadow-[0_30px_90px_rgba(59,130,246,0.25)] backdrop-blur-xl sm:p-12">
                        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.35),_transparent_55%)]" />
                        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.35),_transparent_55%)]" />

                        <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.7 }}
                                className="mx-auto mb-10 max-w-3xl text-center"
                        >
                                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Browse Top Products
                                </h2>
                                <p className="mt-3 text-base text-slate-200/70">
                                        Filter through categories, fine-tune with search, and discover the most loved products your facility depends on.
                                </p>
                        </motion.div>

                        <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className="mx-auto mb-6 w-full max-w-2xl"
                        >
                                <form onSubmit={handleSearchSubmit} className="relative">
                                        <Input
                                                placeholder="Search products..."
                                                value={localSearch}
                                                onChange={(e) => setLocalSearch(e.target.value)}
                                                className="h-12 rounded-full border-white/10 bg-white/10 pl-12 text-white placeholder:text-slate-200/60 focus:border-sky-300 focus:ring-0"
                                        />
                                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-200/70" />
                                </form>
                        </motion.div>

                        <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: 0.15, duration: 0.6 }}
                                className="flex flex-wrap items-center justify-center gap-3"
                        >
                                {categories.map((category) => {
                                        const isActive = selectedCategory === category;
                                        return (
                                                <button
                                                        key={category}
                                                        type="button"
                                                        onClick={() => handleCategoryChange(category)}
                                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                                                                isActive
                                                                        ? "border-transparent bg-gradient-to-r from-violet-500 to-sky-400 text-white shadow-[0_12px_30px_rgba(56,189,248,0.4)]"
                                                                        : "border-white/20 bg-white/5 text-slate-200/80 hover:border-sky-200/60 hover:text-white"
                                                        }`}
                                                >
                                                        {category}
                                                </button>
                                        );
                                })}
                        </motion.div>

                        <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
                        >
                                <h3 className="text-xl font-semibold">
                                        Top Products ({pagination?.totalProducts || products.length})
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 text-slate-200/70">
                                        <span className="inline-flex items-center gap-2 text-sm">
                                                <Filter className="h-4 w-4" />
                                                Quick View
                                        </span>
                                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 text-white">
                                                <button
                                                        type="button"
                                                        onClick={() => setViewMode("grid")}
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                                                                viewMode === "grid"
                                                                        ? "bg-gradient-to-br from-violet-500 to-sky-400 text-white shadow-[0_12px_30px_rgba(129,140,248,0.5)]"
                                                                        : "text-slate-200/70 hover:text-white"
                                                        }`}
                                                >
                                                        <Grid className="h-4 w-4" />
                                                </button>
                                                <button
                                                        type="button"
                                                        onClick={() => setViewMode("list")}
                                                        className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                                                                viewMode === "list"
                                                                        ? "bg-gradient-to-br from-violet-500 to-sky-400 text-white shadow-[0_12px_30px_rgba(129,140,248,0.5)]"
                                                                        : "text-slate-200/70 hover:text-white"
                                                        }`}
                                                >
                                                        <List className="h-4 w-4" />
                                                </button>
                                        </div>
                                </div>
                        </motion.div>

                        <div className="mt-10">
                                <ProductGrid products={products} viewMode={viewMode} />
                        </div>

                        {pagination && pagination.hasNextPage && (
                                <motion.div
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{ delay: 0.25, duration: 0.6 }}
                                        className="mt-12 text-center"
                                >
                                        <button
                                                type="button"
                                                onClick={onLoadMore}
                                                disabled={isLoading}
                                                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-sky-400 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_45px_rgba(59,130,246,0.35)] transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                                {isLoading ? "Loading..." : "Load More"}
                                        </button>
                                </motion.div>
                        )}
                </section>
        );
}
