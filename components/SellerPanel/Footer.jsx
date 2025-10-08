import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Facebook, Instagram, Linkedin } from "lucide-react";
import Logo from "@/public/ipslogo.png";

export default function Footer() {
	const footerSections = {
		support: {
			title: "Support",
			links: [
				{ label: "info@industrialprintsolutions.com", href: "mailto:info@industrialprintsolutions.com" },
                                { label: "+919936814137", href: "#" },
			],
		},
		account: {
			title: "Account",
			links: [
				{ label: "My Account", href: "/account" },
				{ label: "Login / Register", href: "/auth" },
				{ label: "Cart", href: "/cart" },
				{ label: "Wishlist", href: "/wishlist" },
				{ label: "Shop", href: "/shop" },
			],
		},
                quickLinks: {
                        title: "Quick Links",
                        links: [
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

return (
<footer className="relative overflow-hidden bg-gradient-to-b from-[#211f1d] via-[#181614] to-black text-white">
<div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
<div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(234,181,67,0.35),_transparent_70%)]" />
<div className="absolute bottom-10 right-0 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_70%)]" />
</div>
<div className="relative">
{/* Newsletter Section */}
<div className="bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 py-12 text-black">
<div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
<h3 className="text-3xl font-bold tracking-tight md:text-4xl">Start Selling Safety Today</h3>
<p className="max-w-2xl text-base text-black/80">
Join hundreds of verified suppliers already reaching India's top buyers with curated industrial safety solutions.
</p>
<div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
<button className="rounded-full bg-black px-7 py-3 text-base font-semibold text-white transition hover:bg-black/90">
Register as Seller
</button>
<button className="rounded-full border border-black/40 bg-white px-7 py-3 text-base font-semibold text-black transition hover:border-black hover:bg-white/90">
Talk to Sales Support
</button>
<button className="rounded-full border border-black/30 px-7 py-3 text-base font-semibold text-black transition hover:border-black/60">
Download Seller Guide PDF
</button>
</div>
</div>
</div>

{/* Main Footer */}
<div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
<div className="grid grid-cols-1 gap-10 md:grid-cols-5">
{/* Logo & Social */}
<div className="flex flex-col space-y-8">
<Image src={Logo} alt="Logo" className="w-36 h-auto object-contain drop-shadow-[0_0_25px_rgba(234,181,67,0.25)]" />
<p className="text-sm text-white/70">
Industrial Print Solutions partners with trusted suppliers to deliver dependable safety products nationwide.
</p>
<div className="flex items-center gap-3">
{[
{ icon: Facebook, label: "Facebook" },
{ icon: Instagram, label: "Instagram" },
{ icon: Linkedin, label: "LinkedIn" },
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
</div>

{/* Footer Links */}
{Object.entries(footerSections).map(([key, section]) => (
<div key={key} className="space-y-4">
<h4 className="text-lg font-semibold text-amber-300">{section.title}</h4>
<ul className="space-y-3 text-sm text-white/70">
{section.links.map((link, index) => (
<li key={index}>
<Link href={link.href} className="transition hover:text-white">
{link.label}
</Link>
</li>
))}
</ul>
</div>
))}

{/* Subscribe */}
<div className="space-y-4">
<h4 className="text-lg font-semibold text-amber-300">Subscribe</h4>
<p className="text-sm text-white/60">
Insights, tips, and exclusive programs to accelerate your seller growth.
</p>
<div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur">
<input
type="email"
placeholder="Enter your email"
className="flex-1 border-0 bg-transparent px-4 text-sm text-white placeholder:text-white/50 focus:outline-none"
/>
<button className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-black transition hover:bg-amber-300">
<ArrowRight className="w-5 h-5" />
</button>
</div>
</div>
</div>

{/* Copyright */}
<div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
<p className="font-medium">© Copyright Industrial Print Solutions 2025. All rights reserved.</p>
<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.25em] text-white/40">
<span className="font-medium text-white/70">Partner Network</span>
<span>•</span>
<span className="font-medium text-amber-300">Growing Together Nationwide</span>
</div>
</div>
</div>
</div>
</footer>
);
}
