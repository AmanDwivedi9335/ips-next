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
               { id: "all", label: "All Products" },
       ]);
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
                                               { id: "all", label: "All Products" },
                                               ...mapped,
                                       ]);
                               }
                       } catch (err) {
                               console.error("Failed to load categories:", err);
                       }
               };

               fetchCategories();
       }, []);

       const currentLabel =
               categories.find((cat) => cat.id === currentCategory)?.label ||
               "All Products";

	const handleCategoryClick = (categoryId) => {
		setCurrentCategory(categoryId);
		router.push(`/products?category=${categoryId}`);
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
                                        <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-8">
                                                <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                                <Button
                                                                        variant="ghost"
                                                                        className="justify-start lg:justify-center hover:bg-gray-100"
                                                                >
                                                                        {currentLabel}
                                                                        <ChevronDown className="ml-1 h-4 w-4" />
                                                                </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start">
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
