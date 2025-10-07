"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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
                        <section className="relative py-20">
                                <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f7f5ff] to-white" />
                                <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                        <div className="mx-auto mb-12 max-w-md text-center">
                                                <div className="space-y-3">
                                                        <div className="mx-auto h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                                                        <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-slate-200" />
                                                </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                                        <div
                                                                key={i}
                                                                className="h-72 animate-pulse rounded-3xl border border-white/70 bg-white/70 shadow-inner"
                                                        />
                                                ))}
                                        </div>
                                </div>
                        </section>
                );
        }

        return (
                <section className="relative py-20">
                        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f7f5ff] to-white" />
                        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                <motion.div
                                        initial={{ opacity: 0, y: 26 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="mx-auto mb-14 max-w-3xl text-center"
                                >
                                        <span className="inline-flex items-center rounded-full bg-[#301b70] px-5 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                                                Catalogue
                                        </span>
                                        <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                Browse safety essentials by category
                                        </h2>
                                        <p className="mt-4 text-base text-slate-600">
                                                Filter by industry-ready categories, refine with search and switch between
                                                gallery or list view to explore the products that protect your workforce.
                                        </p>
                                </motion.div>

                                <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_40px_80px_-40px_rgba(30,41,59,0.35)] backdrop-blur"
                                >
                                        <div className="flex flex-col gap-6">
                                                {/* Search Bar */}
                                                <form onSubmit={handleSearchSubmit} className="relative">
                                                        <Input
                                                                placeholder="Search for posters, floor markings, safety kits..."
                                                                value={localSearch}
                                                                onChange={(e) => setLocalSearch(e.target.value)}
                                                                className="h-14 rounded-2xl border border-slate-200 bg-slate-50/70 pl-12 pr-6 text-base shadow-inner focus:border-[#301b70] focus:bg-white"
                                                        />
                                                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#301b70]" />
                                                        <Button
                                                                type="submit"
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#301b70] px-5 py-2 text-sm font-semibold shadow-lg hover:bg-[#2a1660]"
                                                        >
                                                                Apply
                                                        </Button>
                                                </form>

                                                {/* Category Filters */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                        {categories.map((category) => {
                                                                const isActive = selectedCategory === category;
                                                                return (
                                                                        <Button
                                                                                key={category}
                                                                                variant={isActive ? "default" : "outline"}
                                                                                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                                                                                        isActive
                                                                                                ? "border-transparent bg-[#301b70] text-white shadow-lg"
                                                                                                : "border-slate-200 bg-white/70 text-slate-600 hover:border-[#301b70]/40 hover:text-[#301b70]"
                                                                                }`}
                                                                                onClick={() => handleCategoryChange(category)}
                                                                                size="sm"
                                                                        >
                                                                                {category}
                                                                        </Button>
                                                                );
                                                        })}
                                                </div>

                                                {/* Controls */}
                                                <div className="flex flex-col gap-4 rounded-2xl bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                                <h3 className="text-lg font-semibold text-slate-900">
                                                                        Showing {pagination?.totalProducts || products.length} products
                                                                </h3>
                                                                <p className="text-sm text-slate-500">
                                                                        Switch layout or refine results to spot the perfect safety asset.
                                                                </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                                <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                                        <Filter className="h-4 w-4" />
                                                                        Filters
                                                                </span>
                                                                <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-inner">
                                                                        <Button
                                                                                type="button"
                                                                                variant={viewMode === "grid" ? "default" : "ghost"}
                                                                                className={`h-10 w-10 rounded-full ${
                                                                                        viewMode === "grid"
                                                                                                ? "bg-[#301b70] text-white hover:bg-[#2a1660]"
                                                                                                : "text-slate-500"
                                                                                }`}
                                                                                onClick={() => setViewMode("grid")}
                                                                        >
                                                                                <Grid className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                                type="button"
                                                                                variant={viewMode === "list" ? "default" : "ghost"}
                                                                                className={`h-10 w-10 rounded-full ${
                                                                                        viewMode === "list"
                                                                                                ? "bg-[#301b70] text-white hover:bg-[#2a1660]"
                                                                                                : "text-slate-500"
                                                                                }`}
                                                                                onClick={() => setViewMode("list")}
                                                                        >
                                                                                <List className="h-4 w-4" />
                                                                        </Button>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Products Grid */}
                                                <ProductGrid products={products} viewMode={viewMode} />

                                                {/* Load More Button */}
                                                {pagination && pagination.hasNextPage && (
                                                        <div className="mt-6 flex justify-center">
                                                                <Button
                                                                        variant="default"
                                                                        className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#301b70]"
                                                                        onClick={onLoadMore}
                                                                        disabled={isLoading}
                                                                >
                                                                        {isLoading ? "Loading more..." : "Load more products"}
                                                                </Button>
                                                        </div>
                                                )}
                                        </div>
                                </motion.div>
                        </div>
                </section>
        );
}
