"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CategoriesGrid() {
        const [categories, setCategories] = useState([]);
        const router = useRouter();

        useEffect(() => {
                const fetchCategories = async () => {
                        try {
                                const res = await fetch(
                                        "/api/admin/categories?published=true&limit=9"
                                );
                                const data = await res.json();
                                if (data.success) {
                                        const topLevel = data.categories.filter(
                                                (cat) => !cat.parent
                                        );
                                        setCategories(topLevel);
                                }
                        } catch (err) {
                                console.error("Failed to load categories:", err);
                        }
                };
                fetchCategories();
        }, []);

        const handleClick = (slug) => {
                router.push(`/categories/${slug}`);
        };

        return (
                <section className="relative isolate py-16">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.15),_transparent_60%)]" />
                        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(76,29,149,0.15),rgba(14,116,144,0.1))]" />

                        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6">
                                <motion.div
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.7, ease: "easeOut" }}
                                        className="mx-auto max-w-3xl text-center"
                                >
                                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-sky-200/80 backdrop-blur">
                                                Explore
                                        </span>
                                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                                Browse Categories
                                        </h2>
                                        <p className="mt-3 text-base text-slate-300/80">
                                                Shop by the themes your team trusts. Discover curated ranges from safety prints to immersive training collaterals in a single glance.
                                        </p>
                                </motion.div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {categories.map((cat, index) => (
                                                <motion.button
                                                        key={cat._id}
                                                        type="button"
                                                        onClick={() => handleClick(cat.slug)}
                                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0 text-left backdrop-blur-xl transition-all duration-500 hover:border-sky-300/60 hover:shadow-[0_20px_60px_rgba(56,189,248,0.25)]"
                                                        initial={{ opacity: 0, y: 32 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, amount: 0.3 }}
                                                        transition={{ delay: index * 0.05, duration: 0.6 }}
                                                >
                                                        <div className="relative aspect-[4/5] w-full overflow-hidden">
                                                                <Image
                                                                        src={
                                                                                cat.icon ||
                                                                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                                        }
                                                                        alt={cat.name}
                                                                        fill
                                                                        className="object-cover brightness-[0.85] transition-transform duration-700 group-hover:scale-110"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/60 to-slate-950/90" />
                                                                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6">
                                                                        <span className="inline-flex w-max items-center rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-sky-100/90 backdrop-blur">
                                                                                {cat.name}
                                                                        </span>
                                                                        <p className="text-lg font-semibold text-white">
                                                                                {cat.name}
                                                                        </p>
                                                                        <div className="flex items-center justify-between text-sm text-slate-200/80">
                                                                                <span>Experience the range</span>
                                                                                <span className="font-semibold text-sky-300 transition-transform duration-500 group-hover:translate-x-1">
                                                                                        Shop Now →
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        <div className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-700 group-hover:opacity-100">
                                                                <div className="absolute -left-10 top-0 h-56 w-56 rounded-full bg-sky-300/40 blur-3xl" />
                                                                <div className="absolute -right-6 bottom-0 h-44 w-44 rounded-full bg-violet-500/30 blur-3xl" />
                                                        </div>
                                                </motion.button>
                                        ))}
                                </div>
                        </div>
                </section>
        );
}

