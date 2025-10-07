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
                <section className="relative overflow-hidden py-24">
                        <div className="absolute inset-0 bg-slate-900" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%)]" />
                        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                {hasTopSelling && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 28 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="mb-20 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_45px_90px_-45px_rgba(15,23,42,0.85)] backdrop-blur"
                                        >
                                                <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                                        <div>
                                                                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white">
                                                                        Best sellers
                                                                </span>
                                                                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                                                                        Top selling safety upgrades
                                                                </h2>
                                                                <p className="mt-2 max-w-xl text-sm text-slate-200">
                                                                        Handpicked by plant heads and safety leaders across India.
                                                                </p>
                                                        </div>
                                                        <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-200">
                                                                Updated weekly
                                                        </div>
                                                </div>
                                                <div className="rounded-2xl bg-slate-900/20 p-4">
                                                        <ProductCarousel products={topSellingProducts} showDots={true} />
                                                </div>
                                        </motion.div>
                                )}

                                {bestSellingProduct && (
                                        <div className="mb-20">
                                                <FeaturedProduct product={bestSellingProduct} />
                                        </div>
                                )}

                                {hasFeatured && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 28 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="mb-20"
                                        >
                                                <div className="mb-10 text-center">
                                                        <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-100">
                                                                Spotlight
                                                        </span>
                                                        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                                                                Featured innovations for your shopfloor
                                                        </h2>
                                                        <p className="mt-3 text-sm text-slate-200">
                                                                Explore curated products engineered to elevate safety standards
                                                                and worker awareness.
                                                        </p>
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                                        {firstFeatured && (
                                                                <motion.div
                                                                        initial={{ opacity: 0, y: 30 }}
                                                                        whileInView={{ opacity: 1, y: 0 }}
                                                                        viewport={{ once: true }}
                                                                        className="col-span-1"
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
                                                                                        initial={{ opacity: 0, y: 30 }}
                                                                                        whileInView={{ opacity: 1, y: 0 }}
                                                                                        viewport={{ once: true }}
                                                                                        transition={{ delay: index * 0.1 }}
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

                                <div className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_45px_90px_-45px_rgba(15,23,42,0.9)] backdrop-blur">
                                        <ServiceGuarantees />
                                </div>
                        </div>
                </section>
        );
}
