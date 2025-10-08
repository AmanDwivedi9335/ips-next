"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import Logo from "@/public/ipslogowhite.png";
import { ArrowRight, Facebook, Instagram, Linkedin, Loader2 } from "lucide-react";
import Logo from "@/public/ipslogo.png";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
        const [email, setEmail] = useState("");
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [feedback, setFeedback] = useState({ type: null, message: "" });
        const footerSections = {
                support: {
                        title: "Support",
                        items: ["info@industrialprintsolutions.com", "+919936814137"],
                },
                account: {
                        title: "Account",
                        items: [
                                { label: "My Account", href: "/account" },
                                { label: "Login / Register", href: "/login" },
                                { label: "Cart", href: "/cart" },
                                { label: "Wishlist", href: "/wishlist" },
                                { label: "Shop", href: "/products" },
                        ],
                },
                quickLinks: {
                        title: "Quick Links",
                        items: [
                                { label: "Contact Us", href: "/contact" },
                                { label: "Terms & Conditions", href: "/terms" },
                                {
                                        label: "Shipping & Delivery Policy",
                                        href: "/shipping-delivery-policy",
                                },
                                { label: "Privacy Policy", href: "/privacy-policy" },
                                {
                                        label: "Cancellation & Refund Policy",
                                        href: "/cancellation-refund-policy",
                                },
                                { label: "Disclaimer Policy", href: "/disclaimer" },
                        ],
                },
        };

        const renderFooterItem = (item, index) => {
                const textClasses = "hover:text-white cursor-pointer transition-colors";
                const linkClasses = "block hover:text-white transition-colors";

                if (typeof item === "string") {
                        const trimmedItem = item.trim();

                        if (trimmedItem.includes("@")) {
                                return (
                                        <a
                                                key={`${trimmedItem}-${index}`}
                                                href={`mailto:${trimmedItem}`}
                                                className={linkClasses}
                                        >
                                                {trimmedItem}
                                        </a>
                                );
                        }

                        if (/^\+?[0-9\s-]+$/.test(trimmedItem)) {
                                const telHref = `tel:${trimmedItem.replace(/\s+/g, "")}`;

                                return (
                                        <a
                                                key={`${trimmedItem}-${index}`}
                                                href={telHref}
                                                className={linkClasses}
                                        >
                                                {trimmedItem}
                                        </a>
                                );
                        }

                        return (
                                <p key={`${trimmedItem}-${index}`} className={textClasses}>
                                        {trimmedItem}
                                </p>
                        );
                }

                if (item && typeof item === "object") {
                        const label = item.label ?? item.text ?? item.href ?? `item-${index}`;

                        if (item.href) {
                                const key = `${label}-${index}`;

                                if (
                                        item.href.startsWith("http") ||
                                        item.href.startsWith("mailto:") ||
                                        item.href.startsWith("tel:")
                                ) {
                                        return (
                                                <a key={key} href={item.href} className={linkClasses}>
                                                        {label}
                                                </a>
                                        );
                                }

                                return (
                                        <Link key={key} href={item.href} className={linkClasses}>
                                                {label}
                                        </Link>
                                );
                        }

                        return (
                                <p key={`${label}-${index}`} className={textClasses}>
                                        {label}
                                </p>
                        );
                }

                return null;
        };

        const handleSubscribe = async (event) => {
                event.preventDefault();

                const trimmedEmail = email.trim().toLowerCase();

                if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
                        setFeedback({ type: "error", message: "Please enter a valid email address." });
                        return;
                }

                setIsSubmitting(true);
                setFeedback({ type: null, message: "" });

                try {
                        const response = await fetch("/api/subscribers", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: trimmedEmail, source: "buyer-footer" }),
                        });

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                                throw new Error(data?.error || "Unable to subscribe right now.");
                        }

                        setFeedback({ type: "success", message: data?.message || "You are now subscribed!" });
                        setEmail("");
                } catch (error) {
                        setFeedback({
                                type: "error",
                                message: error.message || "Unable to subscribe right now. Please try again later.",
                        });
                } finally {
                        setIsSubmitting(false);
                }
        };


return (
<footer className="relative overflow-hidden bg-gradient-to-b from-[#111111] via-[#0c0c0c] to-black text-white">
<div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
<div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(234,181,67,0.45),_transparent_70%)]" />
<div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_70%)]" />
</div>
<div className="relative mx-auto max-w-8xl px-6 py-16 md:px-10 md:py-20">
<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
{/* Logo & Social */}
<div className="flex flex-col space-y-8">
<Image src={Logo} alt="Logo" className="w-36 h-auto object-contain drop-shadow-[0_0_25px_rgba(234,181,67,0.25)]" />
<p className="text-sm text-white/70">
Industrial Print Solutions empowers businesses with premium quality industrial
printing supplies tailored for growth.
</p>
<div className="flex items-center gap-3">
{[
// { icon: Facebook, label: "Facebook" },
{ icon: Instagram, label: "Instagram" },
// { icon: Linkedin, label: "LinkedIn" },
].map(({ icon: Icon, label }) => (
<button
key={label}
type="button"
className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur transition hover:-translate-y-1 hover:border-amber-400/70 hover:bg-amber-400/20"
aria-label={label}
>
<Icon className="h-5 w-5 text-white transition group-hover:text-amber-300" />
</button>
))}
</div>
<Button
asChild
className="w-full sm:w-auto rounded-full bg-amber-400 px-6 py-2 text-black shadow-[0_15px_40px_rgba(234,181,67,0.35)] transition hover:bg-amber-300"
>
<Link href="/contact">Contact Us</Link>
</Button>
</div>

{/* Support */}
<div className="space-y-4">
<h3 className="text-xl font-semibold text-amber-300">
{footerSections.support.title}
</h3>
<div className="space-y-3 text-sm text-white/70">
{footerSections.support.items.map((item, index) => renderFooterItem(item, index))}
</div>
</div>

{/* Account */}
<div className="space-y-4">
<h3 className="text-xl font-semibold text-amber-300">
{footerSections.account.title}
</h3>
<div className="space-y-3 text-sm text-white/70">
{footerSections.account.items.map((item, index) => renderFooterItem(item, index))}
</div>
</div>

{/* Quick Links */}
<div className="space-y-4">
<h3 className="text-xl font-semibold text-amber-300">
{footerSections.quickLinks.title}
</h3>
<div className="space-y-3 text-sm text-white/70">
{footerSections.quickLinks.items.map((item, index) => renderFooterItem(item, index))}
</div>
</div>

        {/* Subscribe */}
        <div className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-300">Subscribe</h3>
                <p className="text-sm text-white/60">
                        Stay updated on the latest industrial print innovations, offers, and expert tips.
                </p>
                <form
                        onSubmit={handleSubscribe}
                        className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur"
                >
                        <Input
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={isSubmitting}
                                className="border-0 bg-transparent text-sm text-white placeholder:text-white/50 focus-visible:ring-0"
                        />
                        <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                disabled={isSubmitting}
                                className="h-10 w-10 rounded-full bg-amber-400 text-black transition hover:bg-amber-300 disabled:opacity-70"
                        >
                                {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                        <ArrowRight className="h-4 w-4" />
                                )}
                        </Button>
                </form>
                {feedback.message && (
                        <p
                                className={`text-xs font-medium ${
                                        feedback.type === "success" ? "text-emerald-300" : "text-rose-300"
                                }`}
                        >
                                {feedback.message}
                        </p>
                )}
        </div>
</div>

<div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
<p>© Copyright Industrial Print Solutions 2025. All rights reserved.</p>
<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.3em] text-white/40">
<span className="font-medium text-white/70">Industrial Excellence</span>
<span>•</span>
<span className="font-medium text-amber-300">Trusted by Businesses Nationwide</span>
</div>
</div>
</div>
</footer>
);
}
