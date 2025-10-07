"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CategoriesGrid() {
        const [categories, setCategories] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
                let isMounted = true;

                const fetchCategories = async () => {
                        if (!isMounted) {
                                return;
                        }

                        setIsLoading(true);
                        try {
                                const res = await fetch(
                                        "/api/categories?limit=9&topLevelOnly=true"
                                );
                                const data = await res.json();
                                if (data.success && isMounted) {
                                        const topLevel = data.categories?.filter(
                                                (cat) => !cat.parent
                                        );
                                        setCategories(topLevel || []);
                                }
                        } catch (err) {
                                console.error("Failed to load categories:", err);
                        } finally {
                                if (isMounted) {
                                        setIsLoading(false);
                                }
                        }
                };

                fetchCategories();

                return () => {
                        isMounted = false;
                };
        }, []);

        const handleClick = (slug) => {
                router.push(`/categories/${slug}`);
        };

        const skeletonItems = Array.from({ length: 9 }, (_, index) => index);

        return (
                <section className="relative py-16 sm:py-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f4f3ff] via-white to-[#e9f5ff]" />
                        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                <motion.div
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="mx-auto mb-12 max-w-2xl text-center"
                                >
                                        <span className="inline-flex items-center rounded-full bg-black/90 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white shadow-lg">
                                                Discover
                                        </span>
                                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                Explore our safety-first categories
                                        </h2>
                                        <p className="mt-3 text-sm text-slate-600 sm:text-base">
                                                From floor graphics to compliance posters, find exactly what your
                                                facility needs in a curated collection of categories crafted for
                                                modern industries.
                                        </p>
                                </motion.div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {isLoading &&
                                                skeletonItems.map((item) => (
                                                        <div
                                                                key={item}
                                                                className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)] backdrop-blur"
                                                        >
                                                                <div className="aspect-square w-full animate-pulse rounded-2xl bg-slate-200" />
                                                                <div className="mt-5 space-y-3">
                                                                        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
                                                                        <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
                                                                </div>
                                                        </div>
                                                ))}
                                        {!isLoading &&
                                                categories.map((cat, index) => (
                                                        <motion.button
                                                                key={cat._id}
                                                                type="button"
                                                                onClick={() => handleClick(cat.slug)}
                                                                initial={{ opacity: 0, y: 30 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: index * 0.05 }}
                                                                whileHover={{ y: -4 }}
                                                                className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-4 text-left shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)] backdrop-blur"
                                                >
                                                        <div className="relative overflow-hidden rounded-2xl">
                                                                <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/40 to-black/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                                <Image
                                                                        src={
                                                                                cat.icon ||
                                                                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                                        }
                                                                        alt={cat.name}
                                                                        width={600}
                                                                        height={600}
                                                                        className="aspect-square w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                                                                />
                                                                <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-full bg-white/90 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-900 shadow-lg transition duration-300 group-hover:bg-black group-hover:text-white">
                                                                        <span>{cat.name}</span>
                                                                        <span className="flex items-center gap-1 text-[11px] font-semibold">
                                                                                Shop Now
                                                                                <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        viewBox="0 0 24 24"
                                                                                        fill="none"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth="1.5"
                                                                                        className="h-3 w-3"
                                                                                >
                                                                                        <path
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                                d="M5 12h14m-7-7 7 7-7 7"
                                                                                        />
                                                                                </svg>
                                                                        </span>
                                                                </div>
                                                        </div>
                                                        <div className="mt-5 flex items-start justify-between gap-3">
                                                                <div>
                                                                        <h3 className="text-lg font-semibold text-slate-900">
                                                                                {cat.name}
                                                                        </h3>
                                                                        <p className="mt-1 text-sm text-slate-500">
                                                                                Tap to explore curated signage and safety visuals
                                                                                tailored for your team.
                                                                        </p>
                                                                </div>
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-all duration-300 group-hover:rotate-12 group-hover:bg-[#301b70]">
                                                                        <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="1.5"
                                                                                className="h-5 w-5"
                                                                        >
                                                                                <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                                                                />
                                                                        </svg>
                                                                </div>
                                                        </div>
                                                        </motion.button>
                                                ))}
                                </div>
                        </div>
                </section>
        );
}

