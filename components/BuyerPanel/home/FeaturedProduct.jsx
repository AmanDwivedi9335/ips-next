"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { deriveProductPricing, normalizeDisplayPriceRange } from "@/lib/pricing.js";

export default function FeaturedProduct({ product }) {
        const router = useRouter();
        const { addItem, isLoading } = useCartStore();

        if (!product) {
		return (
			<div className="mb-12 md:mb-16">
				<h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
					Best Selling Products
				</h2>
				<div className="text-center py-8">
					<p className="text-gray-500">No best selling product available</p>
				</div>
			</div>
                );
        }

        const englishImage = product.languageImages?.find(
                (l) => l.language?.toLowerCase() === "english"
        )?.image;
        const defaultImage =
                englishImage ||
                product.languageImages?.[0]?.image ||
                product.images?.[0] ||
                product.image ||
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";

        const pricing = deriveProductPricing(product);
        const finalPrice = pricing.finalPrice;
        const originalPrice = pricing.mrp;
        const discountPercentage = pricing.discountPercentage;
        const priceRangeData = product.pricingRange || product.priceRange;
        const { min: saleMin, max: saleMax, mrpMin, mrpMax } =
                normalizeDisplayPriceRange(priceRangeData, pricing);

        const formatPriceValue = (value) => {
                if (typeof value !== "number" || !Number.isFinite(value)) {
                        return null;
                }

                return `₹${value.toLocaleString("en-IN")}`;
        };

        const formatRangeLabel = (min, max) => {
                const formattedMin = formatPriceValue(min);
                if (!formattedMin) {
                        return null;
                }

                const formattedMax = formatPriceValue(max);

                if (formattedMax && max > min) {
                        return `${formattedMin} - ${formattedMax}`;
                }

                return formattedMin;
        };

        const salePriceLabel =
                formatRangeLabel(saleMin, saleMax) || formatPriceValue(finalPrice);
        const mrpLabel = formatRangeLabel(mrpMin, mrpMax);
        const showMrpLabel = Boolean(mrpLabel) && (mrpMax > saleMax || mrpMin > saleMin);

        const handleAddToCart = async () => {
                await addItem({
                        id: product._id || product.id,
                        name: product.title || product.name,
                        description: product.description,
                        price: finalPrice,
                        originalPrice,
                        mrp: originalPrice,
                        discountPercentage,
                        discountAmount: pricing.discountAmount,
                        image: defaultImage,
                });
        };

        const handleBuyNow = () => {
                router.push(`/products/${product._id || product.id}`);
        };

	const handleViewProduct = () => {
                router.push(`/products/${product._id || product.id}`);
	};

        return (
                <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_45px_90px_-45px_rgba(15,23,42,0.9)] backdrop-blur"
                >
                        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
                                <div>
                                        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-100">
                                                Bestseller
                                        </span>
                                        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                                                Best selling product this week
                                        </h2>
                                        <p className="mt-2 max-w-xl text-sm text-slate-200">
                                                Crowd-favourite signage trusted by production leaders to keep teams aware and
                                                aligned.
                                        </p>
                                </div>
                                {discountPercentage > 0 && (
                                        <Badge className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
                                                Save {discountPercentage}%
                                        </Badge>
                                )}
                        </div>

                        <Card className="border border-white/10 bg-transparent text-white shadow-none">
                                <CardContent className="p-0">
                                        <div className="grid items-center gap-10 lg:grid-cols-2">
                                                <div
                                                        className="relative order-2 cursor-pointer rounded-3xl bg-white/5 p-6 backdrop-blur lg:order-1"
                                                        onClick={handleViewProduct}
                                                >
                                                        <div className="absolute inset-0 rounded-3xl border border-white/10" />
                                                        <Image
                                                                src={defaultImage}
                                                                alt={product.name}
                                                                width={520}
                                                                height={520}
                                                                className="relative z-10 w-full max-h-[420px] rounded-2xl object-contain"
                                                        />
                                                </div>
                                                <div className="order-1 space-y-6 text-white lg:order-2">
                                                        <div>
                                                                <h3
                                                                        className="text-2xl font-semibold sm:text-3xl lg:text-4xl"
                                                                        onClick={handleViewProduct}
                                                                >
                                                                        {product.title}
                                                                </h3>
                                                                <p className="mt-3 text-sm leading-relaxed text-indigo-100/80 sm:text-base">
                                                                        {product.longDescription || product.description}
                                                                </p>
                                                        </div>

                                                        <div className="space-y-2 text-white">
                                                                <p className="text-3xl font-semibold sm:text-4xl">
                                                                        {salePriceLabel}
                                                                </p>
                                                                {showMrpLabel && (
                                                                        <p className="text-sm text-indigo-100/70">
                                                                                <span className="mr-2 line-through">{mrpLabel}</span>
                                                                                <span className="text-emerald-300">
                                                                                        Save {discountPercentage}% today
                                                                                </span>
                                                                        </p>
                                                                )}
                                                        </div>

                                                        <div className="flex flex-col gap-3 sm:flex-row">
                                                                <Button
                                                                        onClick={handleBuyNow}
                                                                        className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 sm:w-auto"
                                                                >
                                                                        Buy now
                                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                        onClick={handleAddToCart}
                                                                        disabled={isLoading}
                                                                        className="h-12 rounded-full bg-[#301b70] px-6 text-sm font-semibold text-white shadow-lg transition hover:bg-[#2a1660] sm:w-auto"
                                                                >
                                                                        Add to cart
                                                                        <ShoppingCart className="ml-2 h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </motion.div>
        );
}
