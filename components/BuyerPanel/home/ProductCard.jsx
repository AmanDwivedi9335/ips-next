"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { normalizeDisplayPriceRange } from "@/lib/pricing.js";

export default function ProductCard({ product }) {
        const router = useRouter();

        const handleViewProduct = () => {
                router.push(`/products/${product._id || product.id}`);
        };

        const englishImage = product.languageImages?.find(
                (l) => l.language?.toLowerCase() === "english"
        )?.image;
        const defaultImage =
                englishImage ||
                product.languageImages?.[0]?.image ||
                product.images?.[0] ||
                product.image ||
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";
        const priceRangeData = product.pricingRange || product.priceRange;
        const fallbackPricing = {
                finalPrice: product.price,
                mrp: product.originalPrice,
        };
        const { min: saleMin, max: saleMax } = normalizeDisplayPriceRange(
                priceRangeData,
                fallbackPricing
        );

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
                formatRangeLabel(saleMin, saleMax) ||
                (typeof product.price === "number"
                        ? formatPriceValue(product.price)
                        : product.price);

        return (
                <Card
                        onClick={handleViewProduct}
                        className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                >
                        <CardContent className="flex h-full flex-col gap-4 p-5">
                                <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                                <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
                                                        {product.title}
                                                </h3>
                                                {product.subtitle && (
                                                        <p className="mt-1 text-sm text-slate-500">
                                                                {product.subtitle}
                                                        </p>
                                                )}
                                                <p className="mt-3 text-xl font-bold text-slate-900">
                                                        {salePriceLabel}
                                                </p>
                                        </div>
                                        {product.colors && product.colors.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                        {product.colors.map((color, i) => (
                                                                <span
                                                                        key={i}
                                                                        className={`h-4 w-4 rounded-full border border-white shadow-sm ${
                                                                                color === "blue"
                                                                                        ? "bg-blue-500"
                                                                                        : color === "black"
                                                                                        ? "bg-black"
                                                                                        : color === "red"
                                                                                        ? "bg-red-500"
                                                                                        : "bg-orange-500"
                                                                        }`}
                                                                />
                                                        ))}
                                                </div>
                                        )}
                                </div>

                                <div className="relative w-full overflow-hidden rounded-xl bg-slate-50">
                                        <div className="aspect-[4/3] w-full">
                                                <img
                                                        src={defaultImage}
                                                        alt={product.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                        </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-2">
                                        <div className="flex gap-2">
                                                <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="rounded-full border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                                                >
                                                        <ShoppingCart className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="rounded-full border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                                                >
                                                        <Heart className="h-4 w-4" />
                                                </Button>
                                        </div>
                                        <Button className="rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700">
                                                BUY NOW
                                        </Button>
                                </div>
                        </CardContent>
                </Card>
        );
}
