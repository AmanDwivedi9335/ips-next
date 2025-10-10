"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const FALLBACK_IMAGE =
        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";

const skeletonItems = Array.from({ length: 6 });

export default function ParentCategoriesScroll() {
        const [categories, setCategories] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const router = useRouter();
        const prefetchedSlugs = useRef(new Set());

        useEffect(() => {
                let isMounted = true;

                const fetchCategories = async () => {
                        try {
                                const response = await fetch(
                                        "/api/admin/categories?published=true&limit=100"
                                );
                                const data = await response.json();

                                if (!isMounted) {
                                        return;
                                }

                                if (data?.success) {
                                        const topLevelCategories = (data.categories || [])
                                                .filter((category) => !category.parent)
                                                .sort((a, b) => {
                                                        const aOrder = Number(a.sortOrder);
                                                        const bOrder = Number(b.sortOrder);
                                                        const aIsFinite = Number.isFinite(aOrder);
                                                        const bIsFinite = Number.isFinite(bOrder);

                                                        if (aIsFinite && bIsFinite && aOrder !== bOrder) {
                                                                return aOrder - bOrder;
                                                        }

                                                        if (aIsFinite !== bIsFinite) {
                                                                return aIsFinite ? -1 : 1;
                                                        }

                                                        return a.name.localeCompare(b.name);
                                                });

                                        setCategories(topLevelCategories);
                                } else {
                                        setCategories([]);
                                }
                        } catch (error) {
                                console.error("Failed to load parent categories:", error);
                                if (isMounted) {
                                        setCategories([]);
                                }
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

        useEffect(() => {
                categories.forEach((category) => {
                        const slug = category?.slug;

                        if (!slug || prefetchedSlugs.current.has(slug)) {
                                return;
                        }

                        router.prefetch(`/categories/${slug}`);
                        prefetchedSlugs.current.add(slug);
                });
        }, [categories, router]);

        const handleNavigate = (slug) => {
                if (!slug) {
                        return;
                }

                router.push(`/categories/${slug}`);
        };

        if (!isLoading && categories.length === 0) {
                return null;
        }

        return (
                <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className="mb-12"
                >
                        <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-sm sm:p-8">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                                                        Keep exploring 😉
                                                </span>
                                                {/* <h2 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">
                                                        Shop by parent category
                                                </h2>
                                                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                                        Browse our full range of safety signage and compliance essentials curated by industry experts.
                                                </p> */}
                                        </div>
                                </div>

                                <div className="mt-6 overflow-hidden">
                                        <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-4 pt-2">
                                                {isLoading
                                                        ? skeletonItems.map((_, index) => (
                                                                        <div
                                                                                key={`category-skeleton-${index}`}
                                                                                className="flex min-w-[220px] max-w-[240px] flex-col gap-4 rounded-2xl border border-slate-200/60 bg-slate-50/60 p-4"
                                                                        >
                                                                                <div className="relative overflow-hidden rounded-xl">
                                                                                        <div className="aspect-[4/3] w-full animate-pulse rounded-xl bg-slate-200" />
                                                                                </div>
                                                                                <div className="space-y-2">
                                                                                        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
                                                                                        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200" />
                                                                                </div>
                                                                        </div>
                                                                ))
                                                        : categories.map((category, index) => (
                                                                        <motion.button
                                                                                key={category._id || category.slug}
                                                                                type="button"
                                                                                onClick={() => handleNavigate(category.slug)}
                                                                                initial={{ opacity: 0, y: 30 }}
                                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.03 }}
                                                                                whileHover={{ y: -4 }}
                                                                                className="group relative flex min-w-[220px] max-w-[240px] flex-col overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_20px_45px_-25px_rgba(15,23,42,0.35)]"
                                                                        >
                                                                                <div className="relative overflow-hidden">
                                                                                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/0 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                                                        <Image
                                                                                                src={category.icon || FALLBACK_IMAGE}
                                                                                                alt={category.name}
                                                                                                width={400}
                                                                                                height={320}
                                                                                                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                                        />
                                                                                        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-lg transition duration-300 group-hover:bg-slate-900 group-hover:text-white">
                                                                                                <span>{category.name}</span>
                                                                                                <span className="flex items-center gap-1 text-[10px]">
                                                                                                        View
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
                                                                                <div className="flex flex-1 flex-col justify-between gap-3 p-4 text-left">
                                                                                        <div>
                                                                                                <h3 className="text-lg font-semibold text-slate-900">
                                                                                                        {category.name}
                                                                                                </h3>
                                                                                                <p className="mt-1 text-sm text-slate-500">
                                                                                                        Discover specialised posters and safety visuals tailored to your team.
                                                                                                </p>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 transition group-hover:text-indigo-700">
                                                                                                Explore category
                                                                                                <svg
                                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                                        viewBox="0 0 24 24"
                                                                                                        fill="none"
                                                                                                        stroke="currentColor"
                                                                                                        strokeWidth="1.5"
                                                                                                        className="h-4 w-4"
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
                        </div>
                </motion.section>
        );
}
