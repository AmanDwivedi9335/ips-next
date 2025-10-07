"use client";

import { motion } from "framer-motion";
import ProductCarousel from "@/components/BuyerPanel/home/ProductCarousel.jsx";
import FeaturedProduct from "@/components/BuyerPanel/home/FeaturedProduct.jsx";
import ServiceGuarantees from "@/components/BuyerPanel/home/ServiceGuarantees.jsx";
import { ProductCardVarient } from "@/components/BuyerPanel/home/ProductCardVarient.jsx";

export default function FeaturedSection({
        topSellingProducts = [],
        bestSellingProduct = null,
        featuredProducts = [],
}) {
        const hasTopSelling = topSellingProducts?.length > 0;
        const hasFeatured = featuredProducts?.length > 0;

        if (!hasTopSelling && !bestSellingProduct && !hasFeatured) {
                return null;
        }

        const [firstFeatured, ...otherFeatured] = hasFeatured
                ? featuredProducts
                : [];

        return (
                <section className="relative isolate">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(15,118,110,0.18),_transparent_65%)]" />

                        <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6">
                                {hasTopSelling && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 32 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.4 }}
                                                transition={{ duration: 0.7 }}
                                                className="space-y-8"
                                        >
                                                <div className="flex flex-col gap-3">
                                                        <span className="inline-flex w-max items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-100/80 backdrop-blur">
                                                                Momentum
                                                        </span>
                                                        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                                                                Top Selling Products
                                                        </h2>
                                                        <p className="max-w-2xl text-base text-slate-200/80">
                                                                A snapshot of the most ordered IPS products across the nation this week.
                                                        </p>
                                                </div>
                                                <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                                                        <ProductCarousel products={topSellingProducts} showDots={true} />
                                                </div>
                                        </motion.div>
                                )}

                                {bestSellingProduct && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 32 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.4 }}
                                                transition={{ duration: 0.7, delay: 0.1 }}
                                                className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                                        >
                                                <FeaturedProduct product={bestSellingProduct} />
                                        </motion.div>
                                )}

                                {hasFeatured && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 32 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.4 }}
                                                transition={{ duration: 0.7, delay: 0.1 }}
                                                className="space-y-8"
                                        >
                                                <div className="flex flex-col gap-3">
                                                        <span className="inline-flex w-max items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-violet-100/80 backdrop-blur">
                                                                Spotlight
                                                        </span>
                                                        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                                                                Featured Products
                                                        </h2>
                                                        <p className="max-w-2xl text-base text-slate-200/75">
                                                                Curated picks from our creative studio – high-impact visuals, premium finishes and custom branding possibilities.
                                                        </p>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                                        {firstFeatured && (
                                                                <motion.div
                                                                        initial={{ opacity: 0, y: 36 }}
                                                                        whileInView={{ opacity: 1, y: 0 }}
                                                                        viewport={{ once: true, amount: 0.3 }}
                                                                        transition={{ duration: 0.6 }}
                                                                        className="col-span-1 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                                                                >
                                                                        <ProductCardVarient
                                                                                product={firstFeatured}
                                                                                variant="vertical"
                                                                        />
                                                                </motion.div>
                                                        )}

                                                        {otherFeatured.length > 0 && (
                                                                <div className="col-span-2 flex flex-col gap-6">
                                                                        {otherFeatured.map((product, index) => (
                                                                                <motion.div
                                                                                        key={product.id}
                                                                                        initial={{ opacity: 0, y: 36 }}
                                                                                        whileInView={{ opacity: 1, y: 0 }}
                                                                                        viewport={{ once: true, amount: 0.3 }}
                                                                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                                                                        className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                                                                                >
                                                                                        <ProductCardVarient
                                                                                                product={product}
                                                                                                variant="horizontal"
                                                                                        />
                                                                                </motion.div>
                                                                        ))}
                                                                </div>
                                                        )}
                                                </div>
                                        </motion.div>
                                )}

                                <motion.div
                                        initial={{ opacity: 0, y: 32 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.7, delay: 0.2 }}
                                        className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                                >
                                        <ServiceGuarantees />
                                </motion.div>
                        </div>
                </section>
        );
}
