"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FALLBACK_IMAGE =
        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";

export default function CategoryPage({ params }) {
        const { slug } = params;
        const router = useRouter();
        const [categories, setCategories] = useState([]);
        const [currentCategory, setCurrentCategory] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
                const fetchCategories = async () => {
                        try {
                                const res = await fetch(
                                        "/api/admin/categories?published=true&limit=1000"
                                );
                                const data = await res.json();
                                if (data.success) {
                                        setCategories(data.categories);
                                        const parent = data.categories.find(
                                                (cat) => cat.slug === slug
                                        );
                                        setCurrentCategory(parent || null);
                                }
                        } catch (err) {
                                console.error("Failed to load categories:", err);
                        } finally {
                                setLoading(false);
                        }
                };
                fetchCategories();
        }, [slug]);

        if (loading) {
                return <div className="p-8">Loading...</div>;
        }

        if (!currentCategory) {
                return <div className="p-8">Category not found</div>;
        }

        const topCategories = categories.filter((cat) => !cat.parent);
        const subCategories = categories.filter(
                (cat) => cat.parent === currentCategory._id
        );

        const handleCategoryChange = (catSlug) => {
                router.push(`/categories/${catSlug}`);
        };

        const handleSubcategoryClick = (subSlug) => {
                router.push(`/products?category=${subSlug}`);
        };

        return (
                <div className="min-h-screen bg-white">
                        <div className="flex flex-col md:flex-row">
                                <aside className="md:w-64 border-b md:border-b-0 md:border-r p-4">
                                        <ul className="space-y-2">
                                                {topCategories.map((cat) => (
                                                        <li key={cat._id}>
                                                                <button
                                                                        onClick={() =>
                                                                                handleCategoryChange(cat.slug)
                                                                        }
                                                                        className={`w-full text-left px-2 py-1 rounded ${
                                                                                cat.slug ===
                                                                                currentCategory.slug
                                                                                        ? "font-semibold bg-gray-200"
                                                                                        : ""
                                                                        }`}
                                                                >
                                                                        {cat.name}
                                                                </button>
                                                        </li>
                                                ))}
                                        </ul>
                                </aside>
                                <main className="flex-1 p-4">
                                        <h1 className="text-2xl font-bold mb-4">
                                                {currentCategory.name}
                                        </h1>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {subCategories.map((sub) => (
                                                        <div
                                                                key={sub._id}
                                                                onClick={() =>
                                                                        handleSubcategoryClick(
                                                                                sub.slug
                                                                        )
                                                                }
                                                                className="cursor-pointer group"
                                                        >
                                                                <div className="relative aspect-square rounded-lg overflow-hidden shadow">
                                                                        <Image
                                                                                src={
                                                                                        sub.icon ||
                                                                                        FALLBACK_IMAGE
                                                                                }
                                                                                alt={sub.name}
                                                                                fill
                                                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <span className="text-white font-semibold">
                                                                                        Shop Now
                                                                                </span>
                                                                        </div>
                                                                </div>
                                                                <p className="mt-2 text-center font-medium">
                                                                        {sub.name}
                                                                </p>
                                                        </div>
                                                ))}
                                                {subCategories.length === 0 && (
                                                        <p className="col-span-full text-center text-gray-500">
                                                                No subcategories found.
                                                        </p>
                                                )}
                                        </div>
                                </main>
                        </div>
                </div>
        );
}
