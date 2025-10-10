"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter, X } from "lucide-react";
import { useProductStore } from "@/store/productStore.js";

export default function ProductFilters() {
	const [isOpen, setIsOpen] = useState(false);
        const {
                filters,
                availableFilters,
                setFilters,
                applyFilters,
                fetchFilters,
                currentCategory,
        } = useProductStore();

        useEffect(() => {
                fetchFilters();
        }, [fetchFilters, currentCategory]);

	const handleCategoryChange = (categoryId, checked) => {
		const newCategories = checked
			? [...filters.categories, categoryId]
			: filters.categories.filter((id) => id !== categoryId);

		setFilters({ categories: newCategories });
	};

	const handlePriceChange = (value) => {
		setFilters({ priceRange: value });
	};


        const handleApplyFilters = () => {
                applyFilters();
                setIsOpen(false);
        };

	const clearFilters = () => {
		setFilters({
			categories: [],
                        priceRange: availableFilters
                                ? [availableFilters.priceRange.min, availableFilters.priceRange.max]
                                : [0, 10000],
                });
                applyFilters();
        };

        if (!availableFilters) {
                return (
                        <div className="hidden lg:block relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#f5f2ff] to-[#ebf8ff]" />
                                <div className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-sky-400/25 blur-3xl" />
                                <div className="relative animate-pulse space-y-4">
                                        <div className="h-6 bg-white/60 rounded w-1/2"></div>
                                        <div className="space-y-2">
                                                {[...Array(5)].map((_, i) => (
                                                        <div key={i} className="h-4 bg-white/60 rounded"></div>
                                                ))}
                                        </div>
                                </div>
                        </div>
                );
        }

	return (
		<>
			{/* Mobile Filter Button */}
			<div className="lg:hidden mb-4">
				<Button
					variant="outline"
					onClick={() => setIsOpen(true)}
					className="w-full justify-center"
				>
					<Filter className="h-4 w-4 mr-2" />
					Filters
				</Button>
			</div>

			{/* Desktop Filters */}
                        <div className="hidden lg:block relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur sticky top-0">
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#f4f0ff] to-[#e8f7ff]" />
                                <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />
                                <div className="pointer-events-none absolute -bottom-24 -left-12 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" />
                                <div className="relative flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
                                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-600 hover:text-slate-900">
                                                Clear All
                                        </Button>
                                </div>

                                <FilterContent
                                        availableFilters={availableFilters}
                                        filters={filters}
                                        onCategoryChange={handleCategoryChange}
                                        onPriceChange={handlePriceChange}
                                        onApply={handleApplyFilters}
                                />
			</div>

			{/* Mobile Filter Modal */}
			<AnimatePresence>
				{isOpen && (
                                        <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                                                onClick={() => setIsOpen(false)}
                                        >
                                                <motion.div
                                                        initial={{ x: "-100%" }}
                                                        animate={{ x: 0 }}
                                                        exit={{ x: "-100%" }}
                                                        className="relative h-full w-80 overflow-y-auto rounded-r-3xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur"
                                                        onClick={(e) => e.stopPropagation()}
                                                >
                                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-[#f4f0ff] to-[#e8f7ff]" />
                                                        <div className="pointer-events-none absolute -top-24 -right-12 h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl" />
                                                        <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-sky-400/30 blur-3xl" />
                                                        <div className="relative flex items-center justify-between mb-6">
                                                                <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
                                                                <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="text-slate-600 hover:text-slate-900"
                                                                >
                                                                        <X className="h-4 w-4" />
                                                                </Button>
                                                        </div>

                                                        <div className="relative">
                                                                <FilterContent
                                                                        availableFilters={availableFilters}
                                                                        filters={filters}
                                                                        onCategoryChange={handleCategoryChange}
                                                                        onPriceChange={handlePriceChange}
                                                                        onApply={handleApplyFilters}
                                                                />
                                                        </div>
                                                </motion.div>
                                        </motion.div>
                                )}
                        </AnimatePresence>
                </>
        );
}

function FilterContent({
        availableFilters,
        filters,
        onCategoryChange,
        onPriceChange,
        onApply,
}) {
        return (
                <div className="space-y-6">
                        {/* Subcategories */}
                        <Accordion type="single" collapsible defaultValue="categories">
                                <AccordionItem value="categories">
                                        <AccordionTrigger>Subcategories</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-3 pt-2">
							{availableFilters.categories.map((category) => (
								<div key={category.id} className="flex items-center space-x-2">
									<Checkbox
										id={category.id}
										checked={filters.categories.includes(category.id)}
										onCheckedChange={(checked) =>
											onCategoryChange(category.id, checked)
										}
									/>
									<label
										htmlFor={category.id}
										className="text-sm font-medium leading-none cursor-pointer flex-1"
									>
										{category.label} ({category.count})
									</label>
								</div>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* Price Range */}
			<Accordion type="single" collapsible defaultValue="price">
				<AccordionItem value="price">
					<AccordionTrigger>Price Range</AccordionTrigger>
					<AccordionContent>
						<div className="pt-4 space-y-4">
							<Slider
								value={filters.priceRange}
								onValueChange={onPriceChange}
								max={availableFilters.priceRange.max}
								min={availableFilters.priceRange.min}
								step={100}
								className="mb-4"
							/>
							<div className="flex justify-between text-sm text-gray-600">
								<span>₹{filters.priceRange[0].toLocaleString()}</span>
								<span>₹{filters.priceRange[1].toLocaleString()}</span>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

                        {/* Apply Button */}
                        <Button
                                onClick={onApply}
                                className="w-full bg-black text-white hover:bg-gray-800"
                        >
                                Apply Filters
			</Button>
		</div>
	);
}
