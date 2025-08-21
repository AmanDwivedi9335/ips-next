"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
       DropdownMenu,
       DropdownMenuContent,
       DropdownMenuItem,
       DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProductStore } from "@/store/productStore.js";

export default function NavigationBar({ isMenuOpen, onMenuClose }) {
       const [searchQuery, setSearchQuery] = useState("");
       const [categories, setCategories] = useState([
               { id: "all", label: "All" },
       ]);
       const [moreOpen, setMoreOpen] = useState(false);
       const router = useRouter();
       const {
               setSearchQuery: setGlobalSearch,
               currentCategory,
               setCurrentCategory,
       } = useProductStore();

       useEffect(() => {
               const fetchCategories = async () => {
                       try {
                               const res = await fetch(
                                       "/api/admin/categories?published=true&limit=100"
                               );
                               const data = await res.json();
                               if (data.success) {
                                       const mapped = data.categories.map((cat) => ({
                                               id: cat.slug,
                                               label: cat.name,
                                       }));
                                       setCategories([
                                               { id: "all", label: "All" },
                                               ...mapped,
                                       ]);
                               }
                       } catch (err) {
                               console.error("Failed to load categories:", err);
                       }
               };


               fetchCategories();
       }, []);

       const VISIBLE_CATEGORIES = 6;

       const handleCategoryClick = (categoryId) => {
               setCurrentCategory(categoryId);
               if (categoryId === "all") {
                       router.push("/products");
               } else {
                       router.push(`/products?category=${categoryId}`);
               }
               if (onMenuClose) onMenuClose();
       };

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			setGlobalSearch(searchQuery);
			router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
		}
	};

	return (
		<nav
			className={`${
				isMenuOpen ? "block" : "hidden"
			} lg:block bg-white border-t shadow-sm`}
		>
			<div className="px-4 lg:px-10">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 space-y-4 lg:space-y-0 overflow-x-auto hide-scrollbar">
                                        <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
                                                {categories
                                                        .slice(0, VISIBLE_CATEGORIES)
                                                        .map((category) => (
                                                                <Button
                                                                        key={category.id}
                                                                        variant="ghost"
                                                                        className={`whitespace-nowrap hover:bg-gray-100 ${
                                                                                currentCategory === category.id
                                                                                        ? "bg-gray-100"
                                                                                        : ""
                                                                        }`}
                                                                        onClick={() => handleCategoryClick(category.id)}
                                                                >
                                                                        {category.label}
                                                                </Button>
                                                        ))}
                                                {categories.length > VISIBLE_CATEGORIES && (
                                                        <DropdownMenu
                                                                open={moreOpen}
                                                                onOpenChange={setMoreOpen}
                                                        >
                                                                <DropdownMenuTrigger asChild>
                                                                        <Button
                                                                                variant="ghost"
                                                                                className="hover:bg-gray-100"
                                                                                onMouseEnter={() => setMoreOpen(true)}
                                                                                onMouseLeave={() => setMoreOpen(false)}
                                                                        >
                                                                                More
                                                                                <ChevronDown className="ml-1 h-4 w-4" />
                                                                        </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                        align="start"
                                                                        onMouseEnter={() => setMoreOpen(true)}
                                                                        onMouseLeave={() => setMoreOpen(false)}
                                                                >
                                                                        {categories.map((category) => (
                                                                                <DropdownMenuItem
                                                                                        key={category.id}
                                                                                        onSelect={() => handleCategoryClick(category.id)}
                                                                                >
                                                                                        {category.label}
                                                                                </DropdownMenuItem>
                                                                        ))}
                                                                </DropdownMenuContent>
                                                        </DropdownMenu>
                                                )}
                                        </div>

					<form
						onSubmit={handleSearch}
						className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
					>
						<div className="relative">
							<Input
								placeholder="Search products..."
								className="w-full sm:w-64 pr-10"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						</div>
					</form>
				</div>
			</div>
		</nav>
	);
}
