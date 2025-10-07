"use client";

import { useState } from "react";
import { useHomeData } from "@/hooks/useHomeData";
import BannerCarousel from "@/components/BuyerPanel/home/BannerCarousel.jsx";
import CategoriesGrid from "@/components/BuyerPanel/home/CategoriesGrid.jsx";
import CategorySection from "@/components/BuyerPanel/home/CategorySection.jsx";
import AboutSection from "@/components/BuyerPanel/home/AboutSection.jsx";
import SupportSection from "@/components/BuyerPanel/home/SupportSection.jsx";
import FeaturedSection from "@/components/BuyerPanel/home/FeaturedSection.jsx";
import SearchSection from "@/components/BuyerPanel/home/SearchSection.jsx";

export default function HomePage({ initialBanners = [] }) {
        const [searchQuery, setSearchQuery] = useState("");
        const [selectedCategory, setSelectedCategory] = useState("All");
        const [currentPage, setCurrentPage] = useState(1);

        const {
                discountedProducts,
                topSellingProducts,
                bestSellingProduct,
                featuredProducts,
                categoryProducts,
                categories,
                pagination,
                isLoading,
                error,
                refetch,
        } = useHomeData(selectedCategory, searchQuery, currentPage);

        const handleSearch = (query) => {
                setSearchQuery(query);
                setCurrentPage(1);
        };

        const handleCategoryChange = (category) => {
                setSelectedCategory(category);
                setCurrentPage(1);
        };

        const handleLoadMore = () => {
                if (pagination?.hasNextPage) {
                        setCurrentPage((prev) => prev + 1);
                }
        };

        if (error) {
                return (
                        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                                <div className="text-center space-y-4">
                                        <p className="text-rose-300 text-lg font-semibold">
                                                Error loading page: {error}
                                        </p>
                                        <button
                                                onClick={refetch}
                                                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 shadow-lg shadow-violet-900/30 transition-transform hover:-translate-y-0.5"
                                        >
                                                Retry
                                        </button>
                                </div>
                        </div>
                );
        }

        return (
                <div className="relative min-h-[calc(100vh-68px)] overflow-hidden bg-slate-950 text-white">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(91,33,182,0.35),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.35),_transparent_55%)]" />
                        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl" />
                        <div className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />

                        <div className="relative z-10 flex flex-col gap-20 pb-20">
                                <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/60 to-slate-950" />
                                        <BannerCarousel initialBanners={initialBanners} />
                                </div>

                                <div className="px-6 lg:px-10">
                                        <CategoriesGrid />
                                </div>

                                <div className="px-6 lg:px-10">
                                        <CategorySection
                                                products={categoryProducts}
                                                categories={categories}
                                                searchQuery={searchQuery}
                                                selectedCategory={selectedCategory}
                                                setSelectedCategory={handleCategoryChange}
                                                onSearch={handleSearch}
                                                pagination={pagination}
                                                onLoadMore={handleLoadMore}
                                                isLoading={isLoading}
                                        />
                                </div>

                                <div className="px-6 lg:px-10">
                                        <AboutSection />
                                </div>

                                <div className="px-6 lg:px-10">
                                        <SupportSection />
                                </div>

                                <div className="px-6 lg:px-10">
                                        <FeaturedSection
                                                topSellingProducts={topSellingProducts}
                                                bestSellingProduct={bestSellingProduct}
                                                featuredProducts={featuredProducts}
                                        />
                                </div>

                                <div className="px-6 lg:px-10">
                                        <SearchSection
                                                searchQuery={searchQuery}
                                                setSearchQuery={setSearchQuery}
                                        />
                                </div>
                        </div>
                </div>
        );
}
