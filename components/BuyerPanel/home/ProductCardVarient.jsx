"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE =
        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";

const namedColorMap = {
        blue: "#2563eb",
        black: "#111827",
        red: "#ef4444",
        orange: "#f97316",
        green: "#22c55e",
        white: "#f3f4f6",
        gray: "#9ca3af",
        silver: "#e5e7eb",
        gold: "#fbbf24",
};

const normaliseColor = (color) => {
        if (!color) {
                return namedColorMap.gray;
        }

        if (typeof color !== "string") {
                return namedColorMap.gray;
        }

        const trimmed = color.trim();

        if (trimmed.startsWith("#") || trimmed.startsWith("rgb")) {
                return trimmed;
        }

        const lower = trimmed.toLowerCase();

        return namedColorMap[lower] || namedColorMap.gray;
};

function ProductCardVarient({ product, variant = "vertical" }) {
        const router = useRouter();

        const handleViewProduct = () => {
                router.push(`/products/${product?._id || product?.id}`);
        };

        const englishImage = product?.languageImages?.find((l) =>
                l.language?.toLowerCase() === "english"
        )?.image;

        const defaultImage =
                englishImage ||
                product?.languageImages?.[0]?.image ||
                product?.images?.[0] ||
                product?.image ||
                FALLBACK_IMAGE;

        const productCode = product?.productCode || product?.code;
        const hasDiscount = Boolean(product?.originalPrice && product?.price);

        const colorSwatches =
                product?.colors?.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs uppercase tracking-wide text-gray-400">
                                        Colors
                                </span>
                                <div className="flex items-center gap-1.5">
                                        {product.colors.map((color, index) => (
                                                <span
                                                        key={`${color}-${index}`}
                                                        className="h-3.5 w-3.5 rounded-full border border-white shadow-sm"
                                                        style={{ backgroundColor: normaliseColor(color) }}
                                                        aria-label={
                                                                typeof color === "string"
                                                                        ? color
                                                                        : `Color ${index + 1}`
                                                        }
                                                />
                                        ))}
                                </div>
                        </div>
                ) : null;

        if (variant === "horizontal") {
                return (
                        <Card
                                onClick={handleViewProduct}
                                className="group relative mx-auto flex w-full max-w-[720px] cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                                <CardContent className="flex flex-col gap-4 p-0 md:flex-row md:gap-0">
                                        <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 md:w-1/2">
                                                {productCode && (
                                                        <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-medium uppercase tracking-wide text-white shadow-md">
                                                                {productCode}
                                                        </span>
                                                )}
                                                <Image
                                                        src={defaultImage}
                                                        alt={product?.title || "Product image"}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 360px"
                                                        className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                                                />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-5 p-6">
                                                <div className="space-y-2">
                                                        <h3 className="text-xl font-semibold leading-tight text-gray-900 line-clamp-2">
                                                                {product?.title}
                                                        </h3>
                                                        {product?.subtitle && (
                                                                <p className="text-sm text-gray-500 line-clamp-1">
                                                                        {product?.subtitle}
                                                                </p>
                                                        )}
                                                        {productCode && (
                                                                <p className="text-xs uppercase tracking-wide text-gray-400">
                                                                        Code: <span className="text-gray-500">{productCode}</span>
                                                                </p>
                                                        )}
                                                        {product?.description && (
                                                                <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                                                                        {product?.description}
                                                                </p>
                                                        )}
                                                </div>

                                                {colorSwatches}

                                                <div className="mt-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                        <div>
                                                                <p className="text-2xl font-semibold text-gray-900">
                                                                        {product?.price}
                                                                </p>
                                                                {hasDiscount && (
                                                                        <p className="text-sm text-gray-400">
                                                                                <span className="line-through">{product?.originalPrice}</span>
                                                                                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                                                        Save 25%
                                                                                </span>
                                                                        </p>
                                                                )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                                <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-100"
                                                                >
                                                                        <ShoppingCart className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-100"
                                                                >
                                                                        <Heart className="h-4 w-4" />
                                                                </Button>
                                                                <Button className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                                                                        BUY NOW
                                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                );
        }

        return (
                <Card
                        onClick={handleViewProduct}
                        className="group relative mx-auto flex h-full w-full max-w-[320px] cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                        <CardContent className="flex h-full flex-col p-0">
                                <div className="relative w-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
                                        <div className="absolute inset-0" aria-hidden="true">
                                                <div className="h-full w-full bg-[radial-gradient(circle_at_top,#f3f4f6,transparent_60%)]" />
                                        </div>
                                        {productCode && (
                                                <span className="absolute right-4 top-4 rounded-full bg-black px-3 py-1 text-xs font-medium uppercase tracking-wide text-white shadow-md">
                                                        {productCode}
                                                </span>
                                        )}
                                        <div className="relative aspect-[4/5]">
                                                <Image
                                                        src={defaultImage}
                                                        alt={product?.title || "Product image"}
                                                        fill
                                                        sizes="(max-width: 768px) 80vw, 320px"
                                                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                                                />
                                        </div>
                                </div>

                                <div className="flex flex-1 flex-col gap-5 px-6 pb-5 pt-6">
                                        <div className="space-y-2">
                                                <h3 className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">
                                                        {product?.title}
                                                </h3>
                                                {product?.subtitle && (
                                                        <p className="text-sm text-gray-500 line-clamp-1">
                                                                {product?.subtitle}
                                                        </p>
                                                )}
                                                {product?.description && (
                                                        <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                                                                {product?.description}
                                                        </p>
                                                )}
                                        </div>

                                        {colorSwatches}

                                        <div className="mt-auto flex flex-col gap-4">
                                                <div className="flex items-baseline gap-3">
                                                        <p className="text-2xl font-semibold text-gray-900">
                                                                {product?.price}
                                                        </p>
                                                        {hasDiscount && (
                                                                <p className="text-sm text-gray-400 line-through">
                                                                        {product?.originalPrice}
                                                                </p>
                                                        )}
                                                </div>
                                                <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                                <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-100"
                                                                >
                                                                        <ShoppingCart className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-10 w-10 rounded-full border-gray-200 hover:bg-gray-100"
                                                                >
                                                                        <Heart className="h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                        <Button className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
                                                                BUY NOW
                                                                <ArrowRight className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                        </div>
                                </div>
                        </CardContent>
                </Card>
        );
}

export { ProductCardVarient };
