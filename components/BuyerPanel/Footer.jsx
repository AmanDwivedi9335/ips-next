"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import Logo from "@/public/ipslogo.png";

export default function Footer() {
	const footerSections = {
		support: {
			title: "Support",
			items: ["info@industrialprintsolutions.com", "7999704487"],
		},
		account: {
			title: "Account",
			items: ["My Account", "Login / Register", "Cart", "Wishlist", "Shop"],
		},
                quickLinks: {
                        title: "Quick Link",
                        items: [
                                "Privacy Policy",
                                "Terms Of Use",
                                "FAQ",
                                "Contact",
                                {
                                        label: "Cancellation & Refund Policy",
                                        href: "/cancellation-refund-policy",
                                },
                        ],
                },
	};

	return (
		<footer className="bg-black text-white py-8 md:py-16">
			<div className="px-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                                        {/* Logo & Social */}
                                        <div className="flex flex-col space-y-6">
                                                <Image
                                                        src={Logo}
                                                        alt="Logo"
                                                        className="w-32 h-auto object-contain"
                                                />
                                                <div className="flex space-x-4">
                                                        <Facebook className="h-6 w-6 hover:text-blue-400 cursor-pointer transition-colors" />
                                                        <Instagram className="h-6 w-6 hover:text-pink-400 cursor-pointer transition-colors" />
                                                        <Linkedin className="h-6 w-6 hover:text-blue-600 cursor-pointer transition-colors" />
                                                </div>
                                        </div>

					{/* Support */}
					<div>
						<h3 className="text-xl font-bold mb-4">
							{footerSections.support.title}
						</h3>
						<div className="space-y-3 text-gray-400">
							{footerSections.support.items.map((item, index) => (
								<p
									key={index}
									className="hover:text-white cursor-pointer transition-colors"
								>
									{item}
								</p>
							))}
						</div>
					</div>

					{/* Account */}
					<div>
						<h3 className="text-xl font-bold mb-4">
							{footerSections.account.title}
						</h3>
						<div className="space-y-3 text-gray-400">
							{footerSections.account.items.map((item, index) => (
								<p
									key={index}
									className="hover:text-white cursor-pointer transition-colors"
								>
									{item}
								</p>
							))}
						</div>
					</div>

                                        {/* Quick Links */}
                    <div>
                            <h3 className="text-xl font-bold mb-4">
                                    {footerSections.quickLinks.title}
                            </h3>
                            <div className="space-y-3 text-gray-400">
                                    {footerSections.quickLinks.items.map((item, index) => {
                                            if (typeof item === "string") {
                                                    return (
                                                            <p
                                                                    key={index}
                                                                    className="hover:text-white cursor-pointer transition-colors"
                                                            >
                                                                    {item}
                                                            </p>
                                                    );
                                            }

                                            return (
                                                    <Link
                                                            key={item.label}
                                                            href={item.href}
                                                            className="block hover:text-white transition-colors"
                                                    >
                                                            {item.label}
                                                    </Link>
                                            );
                                    })}
                            </div>
                    </div>

                                        {/* Subscribe */}
                                        <div>
                                                <h3 className="text-xl font-bold mb-4">Subscribe</h3>
                                                <div className="flex">
                                                        <Input
                                                                placeholder="Enter your email"
                                                                className="bg-transparent border-white/20 border-r-0 text-white placeholder-gray-400 rounded-r-none"
                                                        />
                                                        <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-white border border-l-0 border-white/20 rounded-l-none"
                                                        >
                                                                <ArrowRight className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                        </div>
                                </div>

				<div className="border-t border-white/20 mt-8 md:mt-12 pt-8 text-center text-gray-400">
					<p>© Copyright Industrial Print Solutions 2025. All right reserved</p>
				</div>
			</div>
		</footer>
	);
}
