"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
        ArrowRight,
        Flame,
        Search,
        ShieldCheck,
        Sparkles,
        ShoppingBag,
        Star,
        Truck,
} from "lucide-react";

import { useHomeData } from "@/hooks/useHomeData";
import { normalizeDisplayPriceRange } from "@/lib/pricing";

const cx = (...values) => values.filter(Boolean).join(" ");

const AnimatedSection = ({ children, className, delay = 0 }) => (
        <motion.section
                initial={{ opacity: 0, y: 64 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, ease: "easeOut", delay }}
                className={cx("relative", className)}
        >
                {children}
        </motion.section>
);

const GlassPanel = ({ children, className }) => (
        <div
                className={cx(
                        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5",
                        "backdrop-blur-2xl shadow-[0_32px_90px_-40px_rgba(15,23,42,0.85)]",
                        className
                )}
        >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative z-10">{children}</div>
        </div>
);

const formatPriceLabel = (product = {}) => {
        const priceRangeData = product.pricingRange || product.priceRange || {};
        const fallbackPricing = {
                finalPrice: product.price,
                mrp: product.originalPrice,
        };
        const { min, max } = normalizeDisplayPriceRange(priceRangeData, fallbackPricing);

        if (!Number.isFinite(min) || min <= 0) {
                return "Price on request";
        }

        const formatValue = (value) => `₹${Math.round(value).toLocaleString("en-IN")}`;

        if (Number.isFinite(max) && max > min) {
                return `${formatValue(min)} - ${formatValue(max)}`;
        }

        return formatValue(min);
};

const resolveProductImage = (product = {}) => {
        const englishImage = product.languageImages?.find((item) =>
                item?.language?.toLowerCase?.() === "english"
        )?.image;

        return (
                englishImage ||
                product.languageImages?.[0]?.image ||
                product.images?.[0] ||
                product.image ||
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
        );
};

const SpotlightBadge = ({ icon: Icon, label }) => (
        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-indigo-200">
                <Icon className="h-3.5 w-3.5" />
                {label}
        </span>
);

const ProductCard = ({ product, index = 0 }) => {
        const productId = product?._id || product?.id;
        const image = resolveProductImage(product);
        const priceLabel = formatPriceLabel(product);

        return (
                <motion.article
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.05 }}
                        whileHover={{ y: -10 }}
                        className="relative h-full"
                >
                        <GlassPanel className="h-full">
                                <div className="flex h-full flex-col gap-6 p-6">
                                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.35),transparent_55%)]" />
                                                <Image
                                                        src={image}
                                                        alt={product?.title || "Product"}
                                                        width={520}
                                                        height={320}
                                                        className="relative z-10 h-52 w-full object-contain"
                                                />
                                                <div className="absolute left-4 top-4 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-indigo-100 backdrop-blur">
                                                        {product?.productCode || product?.code || "New Arrival"}
                                                </div>
                                        </div>

                                        <div className="flex flex-1 flex-col gap-4">
                                                <div>
                                                        <h3 className="text-lg font-semibold text-white md:text-xl">
                                                                {product?.title || "Untitled Product"}
                                                        </h3>
                                                        {product?.subtitle && (
                                                                <p className="mt-2 text-sm text-slate-300">
                                                                        {product.subtitle}
                                                                </p>
                                                        )}
                                                        {product?.description && (
                                                                <p className="mt-3 line-clamp-2 text-sm text-slate-400">
                                                                        {product.description}
                                                                </p>
                                                        )}
                                                </div>

                                                <div className="flex flex-col gap-4">
                                                        <div className="flex items-center justify-between">
                                                                <div>
                                                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                                                                Starting at
                                                                        </p>
                                                                        <p className="text-2xl font-semibold text-indigo-200">
                                                                                {priceLabel}
                                                                        </p>
                                                                </div>
                                                                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-indigo-100">
                                                                        <Star className="h-4 w-4 text-amber-300" />
                                                                        {product?.rating ? product.rating.toFixed?.(1) : "4.8"}
                                                                </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                                                        <Truck className="h-4 w-4 text-indigo-200" />
                                                                        Swift Delivery
                                                                </div>
                                                                {productId ? (
                                                                        <Link
                                                                                href={`/products/${productId}`}
                                                                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-400/40"
                                                                        >
                                                                                Explore
                                                                                <ArrowRight className="h-4 w-4" />
                                                                        </Link>
                                                                ) : (
                                                                        <span className="rounded-full border border-white/20 px-4 py-2 text-xs text-slate-200">
                                                                                Contact Sales
                                                                        </span>
                                                                )}
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </GlassPanel>
                </motion.article>
        );
};

const FeatureCard = ({ icon: Icon, title, description }) => (
        <GlassPanel className="h-full p-6">
                <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400/70 to-purple-500/70 text-white shadow-lg shadow-indigo-500/40">
                                <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">{description}</p>
        </GlassPanel>
);

export default function HomePage() {
        const [searchQuery, setSearchQuery] = useState("");
        const [selectedCategory, setSelectedCategory] = useState("All");
        const [currentPage, setCurrentPage] = useState(1);

        const normalizedCategory = selectedCategory === "All" ? "all" : selectedCategory;

        const {
                topSellingProducts,
                bestSellingProduct,
                featuredProducts,
                categoryProducts,
                categories,
                pagination,
                isLoading,
                error,
                refetch,
        } = useHomeData(normalizedCategory, searchQuery, currentPage);

        const availableCategories = useMemo(() => {
                if (!categories?.length) {
                        return ["All"];
                }

                const sanitized = categories.filter(Boolean);
                const hasAll = sanitized.some((category) =>
                        category?.toLowerCase?.() === "all"
                );

                return hasAll ? sanitized : ["All", ...sanitized];
        }, [categories]);

        const handleSearch = (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const query = String(formData.get("search") || "");
                setSearchQuery(query);
                setCurrentPage(1);
        };

        const handleCategoryChange = (category) => {
                setSelectedCategory(category);
                setCurrentPage(1);
        };

        const handleLoadMore = () => {
                if (pagination?.hasNextPage) {
                        setCurrentPage((prev) => prev + 1);
                }
        };

        const heroProduct = bestSellingProduct || featuredProducts?.[0] || topSellingProducts?.[0];

        if (error) {
                return (
                        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                                <GlassPanel className="max-w-md p-10 text-center">
                                        <h2 className="text-2xl font-semibold">We hit a snag</h2>
                                        <p className="mt-4 text-sm text-slate-300">
                                                {error}
                                        </p>
                                        <button
                                                onClick={refetch}
                                                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-400/40"
                                        >
                                                Try Again
                                        </button>
                                </GlassPanel>
                        </div>
                );
        }

        return (
                <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-24 text-white">
                        <div className="pointer-events-none absolute inset-0">
                                <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 0.7, scale: 1 }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-500/50 via-sky-400/40 to-purple-500/30 blur-3xl"
                                />
                                <motion.div
                                        animate={{
                                                y: [0, -30, 0],
                                                rotate: [0, 2, -2, 0],
                                        }}
                                        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                                        className="absolute bottom-0 right-20 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/30 to-amber-400/20 blur-3xl"
                                />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(148,163,255,0.18),transparent_60%)]" />
                        </div>

                        <div className="relative z-10">
                                <AnimatedSection className="px-4 pt-28 sm:px-6 lg:px-10">
                                        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                                                <div className="space-y-8">
                                                        <SpotlightBadge icon={Sparkles} label="IPS EXPERIENCE" />
                                                        <motion.h1
                                                                initial={{ opacity: 0, y: 40 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                                                                className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
                                                        >
                                                                Elevate your sourcing with
                                                                <span className="ml-3 inline-block bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                                                                        immersive design
                                                                </span>
                                                        </motion.h1>
                                                        <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
                                                                Discover modern industrial solutions curated to match your brand. Glide through a visually rich experience, tailored recommendations, and responsive support—all in one futuristic hub.
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-4">
                                                                <Link
                                                                        href="#catalogue"
                                                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-400/40"
                                                                >
                                                                        Browse catalogue
                                                                        <ArrowRight className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                        href="/contact"
                                                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40"
                                                                >
                                                                        Talk to experts
                                                                </Link>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-6 pt-6 sm:grid-cols-3">
                                                                {[{
                                                                        label: "Happy partners",
                                                                        value: "4.8k",
                                                                },
                                                                {
                                                                        label: "Ready catalogues",
                                                                        value: "1.2k",
                                                                },
                                                                {
                                                                        label: "Avg. rating",
                                                                        value: "4.9/5",
                                                                }].map((stat) => (
                                                                        <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur">
                                                                                <p className="text-3xl font-semibold text-indigo-200">
                                                                                        {stat.value}
                                                                                </p>
                                                                                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-slate-400">
                                                                                        {stat.label}
                                                                                </p>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                                {heroProduct && (
                                                        <GlassPanel className="overflow-hidden">
                                                                <div className="relative flex flex-col gap-6 p-8">
                                                                        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-400/30 to-sky-500/10 blur-3xl" />
                                                                        <SpotlightBadge icon={Flame} label="Spotlight" />
                                                                        <h3 className="text-2xl font-semibold text-white">
                                                                                {heroProduct.title || "Featured innovation"}
                                                                        </h3>
                                                                        <p className="text-sm leading-relaxed text-slate-300">
                                                                                {heroProduct.description ||
                                                                                        "Meticulously engineered to exceed expectations with premium materials and impeccable finish."}
                                                                        </p>
                                                                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10">
                                                                                <Image
                                                                                        src={resolveProductImage(heroProduct)}
                                                                                        alt={heroProduct.title || "Spotlight"}
                                                                                        width={640}
                                                                                        height={400}
                                                                                        className="h-64 w-full object-contain"
                                                                                />
                                                                        </div>
                                                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                                                                <div>
                                                                                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                                                                                                Starting at
                                                                                        </p>
                                                                                        <p className="text-2xl font-semibold text-indigo-200">
                                                                                                {formatPriceLabel(heroProduct)}
                                                                                        </p>
                                                                                </div>
                                                                                <Link
                                                                                        href={heroProduct._id || heroProduct.id ? `/products/${heroProduct._id || heroProduct.id}` : "#catalogue"}
                                                                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                                                                                >
                                                                                        View details
                                                                                        <ArrowRight className="h-4 w-4" />
                                                                                </Link>
                                                                        </div>
                                                                </div>
                                                        </GlassPanel>
                                                )}
                                        </div>
                                </AnimatedSection>

                                <AnimatedSection className="-mt-10 px-4 sm:px-6 lg:px-10" delay={0.1}>
                                        <GlassPanel className="mx-auto flex max-w-5xl flex-col gap-6 p-6 sm:p-8">
                                                <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row md:items-center">
                                                        <div className="relative flex-1">
                                                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-200" />
                                                                <input
                                                                        type="text"
                                                                        name="search"
                                                                        defaultValue={searchQuery}
                                                                        placeholder="Search curated catalogues, product codes or materials"
                                                                        className="h-14 w-full rounded-full border border-white/10 bg-white/10 pl-14 pr-6 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-0"
                                                                />
                                                        </div>
                                                        <button
                                                                type="submit"
                                                                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-400/40"
                                                        >
                                                                Refine search
                                                        </button>
                                                </form>

                                                <div className="no-scrollbar flex gap-3 overflow-x-auto pt-2">
                                                        {availableCategories.map((category) => {
                                                                const isActive = selectedCategory === category;
                                                                return (
                                                                        <button
                                                                                key={category}
                                                                                type="button"
                                                                                onClick={() => handleCategoryChange(category)}
                                                                                className={cx(
                                                                                        "whitespace-nowrap rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition",
                                                                                        isActive
                                                                                                ? "border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white shadow-lg shadow-indigo-500/30"
                                                                                                : "border-white/10 bg-white/5 text-slate-200 hover:border-white/30"
                                                                                )}
                                                                        >
                                                                                {category}
                                                                        </button>
                                                                );
                                                        })}
                                                </div>
                                        </GlassPanel>
                                </AnimatedSection>

                                <AnimatedSection
                                        className="px-4 pt-16 sm:px-6 lg:px-10"
                                        delay={0.15}
                                        id="catalogue"
                                >
                                        <div className="mx-auto flex max-w-6xl flex-col gap-10">
                                                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                                        <div>
                                                                <SpotlightBadge icon={ShoppingBag} label="Curated Catalogue" />
                                                                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                                                                        Products tailored for modern brands
                                                                </h2>
                                                                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                                                                        Explore meticulously sourced collections with premium finishes, trending materials, and detailed documentation ready for your procurement workflow.
                                                                </p>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm text-slate-300">
                                                                <div className="flex items-center gap-2">
                                                                        <Star className="h-4 w-4 text-amber-300" />
                                                                        Verified suppliers
                                                                </div>
                                                                <div className="hidden h-4 w-px bg-white/10 md:block" />
                                                                <div className="flex items-center gap-2">
                                                                        <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                                                        Secure fulfillment
                                                                </div>
                                                        </div>
                                                </div>

                                                {isLoading && (!categoryProducts || categoryProducts.length === 0) ? (
                                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                                                {[...Array(6).keys()].map((key) => (
                                                                        <div
                                                                                key={key}
                                                                                className="h-full animate-pulse rounded-3xl border border-white/5 bg-white/5 p-6"
                                                                        >
                                                                                <div className="h-52 rounded-2xl bg-white/10" />
                                                                                <div className="mt-6 h-4 w-3/4 rounded bg-white/10" />
                                                                                <div className="mt-3 h-3 w-full rounded bg-white/10" />
                                                                                <div className="mt-3 h-3 w-2/3 rounded bg-white/10" />
                                                                        </div>
                                                                ))}
                                                        </div>
                                                ) : categoryProducts?.length ? (
                                                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
                                                                {categoryProducts.map((product, index) => (
                                                                        <ProductCard key={`${product?._id || product?.id || index}`} product={product} index={index} />
                                                                ))}
                                                        </div>
                                                ) : (
                                                        <GlassPanel className="p-10 text-center">
                                                                <h3 className="text-xl font-semibold">No products found</h3>
                                                                <p className="mt-2 text-sm text-slate-300">
                                                                        Try adjusting your filters or search query to discover more catalogue options.
                                                                </p>
                                                        </GlassPanel>
                                                )}

                                                {pagination?.hasNextPage && (
                                                        <div className="flex justify-center">
                                                                <button
                                                                        type="button"
                                                                        onClick={handleLoadMore}
                                                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                                                                        disabled={isLoading}
                                                                >
                                                                        {isLoading ? "Loading..." : "Load more inspirations"}
                                                                        {!isLoading && <ArrowRight className="h-4 w-4" />}
                                                                </button>
                                                        </div>
                                                )}
                                        </div>
                                </AnimatedSection>

                                {featuredProducts?.length ? (
                                        <AnimatedSection className="px-4 pt-20 sm:px-6 lg:px-10" delay={0.2}>
                                                <div className="mx-auto max-w-6xl">
                                                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                                                <div>
                                                                        <SpotlightBadge icon={Star} label="Featured drops" />
                                                                        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                                                                                Fresh releases for immersive spaces
                                                                        </h2>
                                                                </div>
                                                                <Link
                                                                        href="#catalogue"
                                                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/40"
                                                                >
                                                                        See catalogue
                                                                </Link>
                                                        </div>

                                                        <div className="mt-10 no-scrollbar grid gap-6 overflow-x-auto sm:grid-cols-2 lg:grid-cols-3">
                                                                {featuredProducts.slice(0, 6).map((product, index) => (
                                                                        <ProductCard key={`${product?._id || product?.id || index}`} product={product} index={index} />
                                                                ))}
                                                        </div>
                                                </div>
                                        </AnimatedSection>
                                ) : null}

                                <AnimatedSection className="px-4 pt-20 sm:px-6 lg:px-10" delay={0.25}>
                                        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
                                                <FeatureCard
                                                        icon={ShieldCheck}
                                                        title="Quality vetted"
                                                        description="Every product undergoes rigorous compliance checks, certification validation, and detailed material verification to align with your procurement standards."
                                                />
                                                <FeatureCard
                                                        icon={Truck}
                                                        title="Logistics handled"
                                                        description="Dedicated delivery orchestration ensures predictable lead times, consolidated shipments, and visibility across your supply chain."
                                                />
                                                <FeatureCard
                                                        icon={Sparkles}
                                                        title="Brand-ready assets"
                                                        description="Access high-definition renders, spec sheets, and storytelling assets optimized for your sales and marketing teams."
                                                />
                                        </div>
                                </AnimatedSection>

                                <AnimatedSection className="px-4 pt-24 sm:px-6 lg:px-10" delay={0.3}>
                                        <GlassPanel className="mx-auto max-w-5xl overflow-hidden p-10 text-center md:p-14">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
                                                <div className="relative z-10 space-y-6">
                                                        <SpotlightBadge icon={Sparkles} label="Let's collaborate" />
                                                        <h2 className="text-3xl font-semibold md:text-4xl">
                                                                Design immersive procurement journeys with IPS
                                                        </h2>
                                                        <p className="mx-auto max-w-2xl text-sm text-slate-200">
                                                                Our specialists co-create catalogues, configure integrations, and craft elevated experiences to help your brand stand out across every touchpoint.
                                                        </p>
                                                        <div className="flex flex-wrap justify-center gap-4">
                                                                <Link
                                                                        href="/signup"
                                                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-indigo-400/40"
                                                                >
                                                                        Create account
                                                                        <ArrowRight className="h-4 w-4" />
                                                                </Link>
                                                                <Link
                                                                        href="/contact"
                                                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40"
                                                                >
                                                                        Schedule demo
                                                                </Link>
                                                        </div>
                                                </div>
                                        </GlassPanel>
                                </AnimatedSection>
                        </div>
                </div>
        );
}
