"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ChevronLeft,
	ChevronRight,
	Grid,
	List,
	SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { useProductStore } from "@/store/productStore.js";
import ProductCard from "@/components/BuyerPanel/products/ProductCard.jsx";

export default function ProductGrid() {
	const [viewMode, setViewMode] = useState("grid");

	const {
		filteredProducts,
		currentPage,
		totalPages,
		isLoading,
		setCurrentPage,
		setSorting,
		sortBy,
		sortOrder,
	} = useProductStore();

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSortChange = (value) => {
		const [sortField, order] = value.split("-");
		setSorting(sortField, order);
	};

	const getSortValue = () => {
		return `${sortBy}-${sortOrder}`;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#f2f7ff] to-[#e7f2ff]" />
                                <div className="pointer-events-none absolute -top-20 -right-12 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-sky-400/25 blur-3xl" />
                                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                                <h1 className="text-3xl font-semibold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                                                        Discover our products
                                                </h1>
                                                <p className="text-slate-600 mt-2">
                                                        {isLoading
                                                                ? "Loading products..."
                                                                : `Showing ${filteredProducts.length} products to explore`}
                                                </p>
                                        </div>

					<div className="flex items-center gap-4">
						{/* Sort Dropdown */}
						<Select value={getSortValue()} onValueChange={handleSortChange}>
							<SelectTrigger className="w-48">
								<SlidersHorizontal className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="createdAt-desc">Newest First</SelectItem>
								<SelectItem value="createdAt-asc">Oldest First</SelectItem>
								<SelectItem value="price-asc">Price: Low to High</SelectItem>
								<SelectItem value="price-desc">Price: High to Low</SelectItem>
								<SelectItem value="name-asc">Name: A to Z</SelectItem>
								<SelectItem value="name-desc">Name: Z to A</SelectItem>
							</SelectContent>
						</Select>

						{/* View Mode Toggle */}
                                                <div className="flex items-center border border-white/70 rounded-xl bg-white/70 shadow-sm">
                                                        <Button
                                                                variant={viewMode === "grid" ? "default" : "ghost"}
                                                                size="sm"
                                                                onClick={() => setViewMode("grid")}
								className="rounded-r-none"
							>
								<Grid className="h-4 w-4" />
							</Button>
							<Button
								variant={viewMode === "list" ? "default" : "ghost"}
								size="sm"
								onClick={() => setViewMode("list")}
								className="rounded-l-none"
							>
								<List className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Products Grid/List */}
                        {isLoading ? (
                                <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-12 shadow-xl backdrop-blur">
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#f5f2ff] to-[#ebf8ff]" />
                                        <div className="relative flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                                        </div>
                                </div>
                        ) : filteredProducts.length === 0 ? (
                                <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-12 shadow-xl backdrop-blur text-center">
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#f5f2ff] to-[#ebf8ff]" />
                                        <h3 className="relative text-xl font-semibold text-slate-900 mb-2">
                                                No products found
                                        </h3>
                                        <p className="relative text-slate-600 max-w-md mx-auto">
                                                Try adjusting your filters or search terms.
                                        </p>
                                </div>
			) : (
                                <motion.div
                                        className={
                                                viewMode === "grid"
                                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                                        : "space-y-6"
                                        }
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
                                        {filteredProducts.map((product, index) => (
                                                <motion.div
                                                        key={product.id || product._id || index}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                >
                                                        <ProductCard product={product} viewMode={viewMode} />
                                                </motion.div>
                                        ))}
                                </motion.div>
                        )}

			{/* Pagination */}
                        {totalPages > 1 && (
                                <div className="relative overflow-hidden flex justify-between items-center rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-lg backdrop-blur">
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-[#f4f0ff] to-[#e8f7ff]" />
                                        <p className="relative text-center text-sm text-slate-600">
                                                Page {currentPage} of {totalPages}
                                        </p>
                                        <div className="relative">
                                                <div className="flex items-center justify-center space-x-2">
                                                        <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                                disabled={currentPage === 1}
                                                        >
                                                                <ChevronLeft className="h-4 w-4" />
                                                        </Button>

                                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                                let pageNum;
                                                                if (totalPages <= 5) {
                                                                        pageNum = i + 1;
                                                                } else if (currentPage <= 3) {
                                                                        pageNum = i + 1;
                                                                } else if (currentPage >= totalPages - 2) {
                                                                        pageNum = totalPages - 4 + i;
                                                                } else {
                                                                        pageNum = currentPage - 2 + i;
                                                                }

                                                                return (
                                                                        <Button
                                                                                key={pageNum}
                                                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                                                size="icon"
                                                                                className={
                                                                                        currentPage === pageNum
                                                                                                ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white"
                                                                                                : "bg-white/60"
                                                                                }
                                                                                onClick={() => handlePageChange(pageNum)}
                                                                        >
                                                                                {pageNum}
                                                                        </Button>
                                                                );
                                                        })}

                                                        <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() =>
                                                                        handlePageChange(Math.min(totalPages, currentPage + 1))
                                                                }
                                                                disabled={currentPage === totalPages}
                                                        >
                                                                <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        )}
		</div>
	);
}
