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
                                        "/api/admin/categories?published=true&limit=100"
                                );
                                const data = await res.json();
                                if (data.success) {
                                        setCategories(data.categories);
                                }
                        } catch (err) {
                                console.error("Failed to load categories:", err);
                        }
                };
                fetchCategories();
        }, []);

        const handleClick = (slug) => {
                router.push(`/products?category=${slug}`);
        };

        return (
                <section className="py-8 md:py-16 bg-white">
                        <div className="px-10">
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="text-center mb-8 md:mb-12"
                                >
                                        <p className="text-yellow-500 text-sm font-medium mb-2">Category</p>
                                        <h2 className="text-2xl md:text-3xl font-bold">Browse Categories</h2>
                                </motion.div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                                        {categories.map((cat) => (
                                                <motion.div
                                                        key={cat._id}
                                                        whileHover={{ scale: 1.03 }}
                                                        className="cursor-pointer"
                                                        onClick={() => handleClick(cat.slug)}
                                                >
                                                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow group">
                                                                <Image
                                                                        src={
                                                                                cat.icon ||
                                                                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                                        }
                                                                        alt={cat.name}
                                                                        fill
                                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                                <div className="absolute inset-x-0 bottom-0 bg-white/90 text-center py-2 text-sm font-medium">
                                                                        {cat.name}
                                                                </div>
                                                        </div>
                                                </motion.div>
                                        ))}
                                </div>
                        </div>
                </section>
        );
}

