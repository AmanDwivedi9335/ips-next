"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/ipslogo.png";

import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart, Heart, User, X, GraduationCap } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import MiniCart from "./cart/MiniCart";
import {
	useUserFullName,
	useUserEmail,
	useUserProfilePic,
	useIsAuthenticated,
} from "@/store/authStore.js";

export default function Header({ onMenuToggle, isMenuOpen }) {
	const fullName = useUserFullName();
	const email = useUserEmail();
	const profilePic = useUserProfilePic();
	const isAuthenticated = useIsAuthenticated();

	// console.log("isAuthenticated", isAuthenticated);

        const { getTotalItems, openCart } = useCartStore();
        const totalItems = getTotalItems();

        const handleCartClick = () => {
                openCart();
        };

        const categories = [
                {
                        name: "Smart QR vs Standard Posters",
                        href: "/products?category=smart-qr-vs-standard-posters",
                },
                { name: "All Safety Posters", href: "/products?category=all-safety-posters" },
                { name: "ISO Posters", href: "/products?category=iso-posters" },
                { name: "Industry Bundles", href: "/products?category=industry-bundles" },
                { name: "Signs & Labels", href: "/products?category=signs-labels" },
                {
                        name: "Monthly Poster Subscriptions",
                        href: "/products?category=monthly-poster-subscriptions",
                },
                {
                        name: "Custom Printed Office Stationary",
                        href: "/products?category=custom-printed-office-stationary",
                },
                {
                        name: "New Arrivals",
                        href: "/products?category=new-arrivals",
                        poster: "/images/home/Img1.png",
                        isNew: true,
                },
                {
                        name: "Corporate Bulk/Custom Orders",
                        href: "/products?category=corporate-bulk-orders",
                        highlight: true,
                },
                { name: "Contact Us", href: "/contact" },
        ];

	return (
		<>
                        <header className="bg-white shadow-sm sticky top-0 z-40">
                                <div className="px-4 lg:px-10">
                                        {/* Top Bar */}
                                        <div className="flex items-center py-5">
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

                                                {/* Training Button */}
                                                <div className="flex justify-center">
                                                        <Link href="/lms">
                                                                <Button className="text-sm font-medium">
                                                                        <GraduationCap className="h-5 w-5 mr-2" />
                                                                        Get training now
                                                                </Button>
                                                        </Link>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-end flex-1 space-x-2 md:space-x-4">
                                                        <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="lg:hidden"
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
                                                                className="relative"
                                                                onClick={handleCartClick}
                                                        >
                                                                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                                                                {totalItems > 0 && (
                                                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                                                {totalItems > 99 ? "99+" : totalItems}
                                                                        </span>
                                                                )}
                                                        </Button>
                                                        <Button variant="ghost" size="icon">
                                                                <Heart className="h-5 w-5 md:h-6 md:w-6" />
                                                        </Button>

                                                        {isAuthenticated ? (
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
                                                                                                <p className="text-xs text-gray-600">{email}</p>
                                                                                        </div>
                                                                                </div>
                                                                        </Link>
                                                                </div>
                                                        ) : (
                                                                <Link href="/account">
                                                                        <Button variant="ghost" size="icon">
                                                                                <User className="h-5 w-5 md:h-6 md:w-6" />
                                                                        </Button>
                                                                </Link>
                                                        )}
                                                </div>
                                        </div>
                                </div>
                                <nav className="bg-gray-50 border-t">
                                        <div className="px-4 lg:px-10">
                                                <ul className="flex flex-wrap items-center justify-center gap-4 py-2 text-sm font-medium">
                                                        {categories.map((cat) => (
                                                                <li key={cat.name}>
                                                                        <Link
                                                                                href={cat.href}
                                                                                className={`flex items-center gap-2 hover:text-primary ${
                                                                                        cat.highlight ? "text-red-600 font-semibold animate-blink-slow" : ""
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
                                                                                        <span className="ml-1 text-red-600 font-bold animate-blink">
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
