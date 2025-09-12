"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/ipslogo.png";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, ShoppingCart, Heart, User, X, Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import MiniCart from "./cart/MiniCart";
import {
        useUserFullName,
        useUserEmail,
        useUserProfilePic,
        useIsAuthenticated,
} from "@/store/authStore.js";
import { useProductStore } from "@/store/productStore.js";

export default function Header({ onMenuToggle, isMenuOpen }) {
        const [searchQuery, setSearchQuery] = useState("");
        const [hasMounted, setHasMounted] = useState(false);
        useEffect(() => {
                setHasMounted(true);
        }, []);
        const router = useRouter();
        const { setSearchQuery: setGlobalSearch } = useProductStore();

        const fullName = useUserFullName();
        const email = useUserEmail();
        const profilePic = useUserProfilePic();
        const isAuthenticated = useIsAuthenticated();

        const { getTotalItems, openCart } = useCartStore();
        const totalItems = getTotalItems();

        const handleCartClick = () => {
                openCart();
        };

        const handleSearch = (e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                        setGlobalSearch(searchQuery);
                        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                }
        };

        const categories = [
                { name: "All Safety Posters", href: "/all-safety-posters" },
                { name: "Industrial Safety Packs", href: "/industrial-safety-packs" },
                { name: "Monthly Poster Subscriptions", href: "/monthly-poster-subscriptions" },
                {
                        name: "Corporate Bulk/Custom Orders",
                        href: "/corporate-bulk-orders",
                        highlight: true
                }
        ];

        return (
                <>
                        <header className="bg-gray-50 text-gray-900 sticky top-0 z-40 shadow-md">
                                <div className="px-4 lg:px-10">
                                        {/* Top Bar */}
                                        <div className="flex items-center py-5 space-x-4">
                                                {/* Logo */}
                                                <div className="flex items-center flex-1 space-x-2 md:space-x-4">
                                                        <Link href="/" className="flex items-center space-x-2">
                                                                <Image
                                                                        src={Logo}
                                                                        alt="Logo"
                                                                        className="h-auto w-32 lg:w-40 object-contain"
                                                                />
                                                        </Link>
                                                </div>

                                                {/* Search */}
                                                <form onSubmit={handleSearch} className="hidden md:flex flex-1 justify-center">
                                                        <div className="relative w-full max-w-md">
                                                                <Input
                                                                        placeholder="Search products..."
                                                                        className="w-full bg-white text-black pr-10"
                                                                        value={searchQuery}
                                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                                />
                                                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                        </div>
                                                </form>

                                                {/* Actions */}
                                                <div className="flex items-center justify-end flex-1 space-x-2 md:space-x-4">
                                                        <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="lg:hidden text-gray-900 hover:bg-gray-200"
                                                                onClick={onMenuToggle}
                                                        >
                                                                {isMenuOpen ? (
                                                                        <X className="h-6 w-6" />
                                                                ) : (
                                                                        <Menu className="h-6 w-6" />
                                                                )}
                                                        </Button>

                                                        <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="relative text-gray-900 hover:bg-gray-200"
                                                                onClick={handleCartClick}
                                                        >
                                                                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                                                                {hasMounted && totalItems > 0 && (
                                                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                                                {totalItems > 99 ? "99+" : totalItems}
                                                                        </span>
                                                                )}
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-gray-900 hover:bg-gray-200">
                                                                <Heart className="h-5 w-5 md:h-6 md:w-6" />
                                                        </Button>

                                                        {hasMounted && isAuthenticated ? (
                                                                <div className="flex items-center space-x-2 md:space-x-4">
                                                                        <Link href="/account">
                                                                                <div className="flex items-center space-x-2">
                                                                                        <Image
                                                                                                src={profilePic}
                                                                                                alt="Profile"
                                                                                                width={40}
                                                                                                height={40}
                                                                                                className="h-6 w-6 md:h-8 md:w-8 rounded-full"
                                                                                        />
                                                                                        <div className="hidden md:block">
                                                                                                <p className="text-sm font-medium">{fullName}</p>
                                                                                                <p className="text-xs text-gray-300">{email}</p>
                                                                                        </div>
                                                                                </div>
                                                                        </Link>
                                                                </div>
                                                        ) : (
                                                                <Link href="/account">
                                                                        <Button variant="ghost" size="icon" className="text-gray-900 hover:bg-gray-200">
                                                                                <User className="h-5 w-5 md:h-6 md:w-6" />
                                                                        </Button>
                                                                </Link>
                                                        )}
                                                </div>
                                        </div>
                                </div>
                                <nav className="border-t border-gray-200">
                                        <div className="px-4 lg:px-10">
                                                <ul className="flex flex-wrap items-center justify-center gap-4 py-2 text-sm font-medium text-gray-900">
                                                        {categories.map((cat) => (
                                                                <li key={cat.name}>
                                                                        <Link
                                                                                href={cat.href}
                                                                                className={`flex items-center gap-2 hover:text-yellow-600 ${
                                                                                        cat.highlight ? "text-yellow-600 font-semibold animate-blink-slow" : ""
                                                                                }`}
                                                                        >
                                                                                {cat.poster && (
                                                                                        <Image
                                                                                                src={cat.poster}
                                                                                                alt={cat.name}
                                                                                                width={40}
                                                                                                height={40}
                                                                                                className="h-10 w-10 object-cover rounded"
                                                                                        />
                                                                                )}
                                                                                <span>{cat.name}</span>
                                                                                {cat.isNew && (
                                                                                        <span className="ml-1 text-red-300 font-bold animate-blink">
                                                                                                New
                                                                                        </span>
                                                                                )}
                                                                        </Link>
                                                                </li>
                                                        ))}
                                                </ul>
                                        </div>
                                </nav>
                        </header>
                        <MiniCart />
                </>
        );
}
