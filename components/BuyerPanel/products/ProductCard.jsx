"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
        ShoppingCart,
        Heart,
        Eye,
        ArrowRight,
        ArrowDownRight,
        Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { deriveProductPricing, normalizeDisplayPriceRange } from "@/lib/pricing.js";

export default function ProductCard({ product, viewMode = "grid" }) {
        const router = useRouter();
        const { addItem, isLoading } = useCartStore();
        const { addItem: addWishlistItem } = useWishlistStore();

        // Ensure consistent identifiers and titles across different API shapes
        const productId = product.id || product._id;
        const productTitle = product.title || product.name || "";
        const pricing = deriveProductPricing(product);
        const finalPrice = pricing.finalPrice;
        const originalPrice = pricing.mrp;
        const discountPercentage = pricing.discountPercentage;
        const priceRangeData = product.pricingRange || product.priceRange;
        const { min: saleMin, max: saleMax } = normalizeDisplayPriceRange(
                priceRangeData,
                pricing
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
                formatRangeLabel(saleMin, saleMax) || formatPriceValue(finalPrice);

        const categoryLabel =
                typeof product.category === "string"
                        ? product.category
                        : product.category?.name ||
                          product.primaryCategory?.name ||
                          "Product";

        const showOriginalPrice =
                typeof originalPrice === "number" &&
                Number.isFinite(originalPrice) &&
                originalPrice > finalPrice;

        const formattedOriginalPrice =
                showOriginalPrice && formatPriceValue(originalPrice);

        const englishImage = product.languageImages?.find(
                (l) => l.language?.toLowerCase() === "english"
        )?.image;
        const defaultImage =
                englishImage ||
                product.languageImages?.[0]?.image ||
                product.images?.[0] ||
                product.image ||
                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";

        const descriptionSource =
                product.subtitle ||
                product.tagline ||
                (typeof product.description === "string" ? product.description : "");
        const sanitizedDescription = descriptionSource
                ? descriptionSource.replace(/<[^>]*>?/gm, "")
                : "";
        const shortDescription =
                sanitizedDescription.length > 110
                        ? `${sanitizedDescription.slice(0, 107)}...`
                        : sanitizedDescription;

        const handleViewProduct = () => {
                if (productId) {
                        router.push(`/products/${productId}`);
                }
        };

        const handleAddToCart = async (e) => {
                e.stopPropagation();

                // Use the unified addItem function
                await addItem({
                        id: productId,
                        name: productTitle,
                        description: product.description,
                        price: finalPrice,
                        originalPrice,
                        mrp: originalPrice,
                        discountPercentage,
                        discountAmount: pricing.discountAmount,
                        image: defaultImage,
                });
        };

        const handleAddToWishlist = (e) => {
                e.stopPropagation();

                addWishlistItem({
                        id: productId,
                        name: productTitle,
                        description: product.description,
                        price: finalPrice,
                        originalPrice,
                        mrp: originalPrice,
                        discountPercentage,
                        discountAmount: pricing.discountAmount,
                        image: defaultImage,
                });
                toast.success("Added to wishlist!");
        };

        const handleBuyNow = (e) => {
                e.stopPropagation();

                if (productId) {
                        router.push(`/products/${productId}`);
                }
        };

        if (viewMode === "list") {
                return (
                        <Card
                                onClick={handleViewProduct}
                                className="group relative cursor-pointer overflow-hidden border border-slate-200/70 bg-white/80 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_32px_80px_-40px_rgba(15,23,42,0.3)]"
                        >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-100 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <CardContent className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-stretch">
                                        <div className="relative flex w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-8 shadow-inner sm:w-60">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
                                                <div className="absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl" />
                                                <div className="absolute -top-8 -right-6 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
                                                <Image
                                                        src={defaultImage}
                                                        alt={productTitle}
                                                        fill
                                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                                        onClick={handleViewProduct}
                                                />

                                                <div className="absolute right-4 top-4 flex flex-col gap-2">
                                                        {discountPercentage > 0 && (
                                                                <Badge className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                                                                        Save {discountPercentage}%
                                                                </Badge>
                                                        )}
                                                        {product.type === "featured" && (
                                                                <Badge className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase text-white backdrop-blur">
                                                                        <Sparkles className="h-3 w-3" /> Featured
                                                                </Badge>
                                                        )}
                                                </div>
                                        </div>

                                        <div className="flex flex-1 flex-col gap-6">
                                                <div className="space-y-3" onClick={handleViewProduct}>
                                                        <div className="inline-flex items-center gap-2">
                                                                <Badge className="rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-slate-500">
                                                                        {categoryLabel}
                                                                </Badge>
                                                        </div>
                                                        <h3 className="text-2xl font-semibold leading-tight text-slate-900 transition-colors group-hover:text-slate-700">
                                                                {productTitle}
                                                        </h3>
                                                        {shortDescription && (
                                                                <p className="max-w-2xl text-sm text-slate-500">
                                                                        {shortDescription}
                                                                </p>
                                                        )}
                                                </div>

                                                <div className="flex flex-wrap items-end gap-4">
                                                        <div>
                                                                <p className="text-3xl font-semibold text-slate-900">
                                                                        {salePriceLabel}
                                                                </p>
                                                                {formattedOriginalPrice && (
                                                                        <span className="text-sm text-slate-400 line-through">
                                                                                {formattedOriginalPrice}
                                                                        </span>
                                                                )}
                                                        </div>

                                                        {discountPercentage > 0 && (
                                                                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                                                                        <ArrowDownRight className="h-3 w-3" />
                                                                        Limited time offer
                                                                </div>
                                                        )}
                                                </div>

                                                <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="flex items-center gap-2">
                                                                <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={handleAddToWishlist}
                                                                        className="rounded-full border border-transparent bg-slate-900/5 text-slate-700 transition hover:border-slate-200 hover:bg-slate-900/10"
                                                                >
                                                                        <Heart className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={handleAddToCart}
                                                                        disabled={isLoading}
                                                                        className="rounded-full border border-transparent bg-slate-900/5 text-slate-700 transition hover:border-slate-200 hover:bg-slate-900/10"
                                                                >
                                                                        <ShoppingCart className="h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-1 sm:flex-row sm:justify-end">
                                                                <Button
                                                                        onClick={handleAddToCart}
                                                                        disabled={isLoading}
                                                                        className="flex-1 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 hover:shadow-xl"
                                                                >
                                                                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                                                </Button>
                                                                <Button
                                                                        onClick={handleBuyNow}
                                                                        disabled={isLoading}
                                                                        className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-900 shadow-md transition-all duration-300 hover:border-slate-300 hover:bg-slate-50"
                                                                >
                                                                        Buy Now
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
                <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                >
                        <Card
                                onClick={handleViewProduct}
                                className="group relative flex h-full cursor-pointer flex-col overflow-hidden border border-slate-100/70 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.28)] transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-200 hover:shadow-[0_40px_120px_-45px_rgba(15,23,42,0.35)]"
                        >
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                <CardContent className="relative flex h-full flex-col p-0">
                                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-b-[2.75rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.35),transparent_60%)]" />
                                                <div className="absolute inset-0">
                                                        <Image
                                                                src={defaultImage}
                                                                alt={productTitle}
                                                                fill
                                                                className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                                                                onClick={handleViewProduct}
                                                        />
                                                </div>

                                                {discountPercentage > 0 && (
                                                        <Badge className="absolute left-6 top-6 rounded-full bg-emerald-500/95 px-4 py-1 text-xs font-semibold uppercase text-white shadow-lg">
                                                                {discountPercentage}% Off
                                                        </Badge>
                                                )}

                                                {product.type === "featured" && (
                                                        <Badge className="absolute right-6 top-6 flex items-center gap-1 rounded-full bg-white/25 px-4 py-1 text-xs font-semibold uppercase text-white backdrop-blur">
                                                                <Sparkles className="h-3 w-3" /> Featured
                                                        </Badge>
                                                )}

                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                                <div className="pointer-events-none absolute bottom-6 left-6 flex translate-y-3 items-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                        <Button
                                                                variant="secondary"
                                                                size="icon"
                                                                className="rounded-full border border-white/40 bg-white/80 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white"
                                                                onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleViewProduct();
                                                                }}
                                                        >
                                                                <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                                variant="secondary"
                                                                size="icon"
                                                                className="rounded-full border border-white/40 bg-white/80 text-slate-900 shadow-lg backdrop-blur transition hover:bg-white"
                                                                onClick={handleAddToWishlist}
                                                        >
                                                                <Heart className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                        </div>

                                        <div className="flex h-full flex-col gap-6 px-7 pb-7 pt-10">
                                                <div className="space-y-3" onClick={handleViewProduct}>
                                                        <div className="inline-flex items-center gap-2">
                                                                <Badge className="rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-slate-500">
                                                                        {categoryLabel}
                                                                </Badge>
                                                        </div>
                                                        <h3 className="text-xl font-semibold leading-snug text-slate-900 transition-colors line-clamp-2 group-hover:text-slate-700">
                                                                {productTitle}
                                                        </h3>
                                                        {shortDescription && (
                                                                <p className="text-sm text-slate-500 line-clamp-2">
                                                                        {shortDescription}
                                                                </p>
                                                        )}
                                                </div>

                                                <div className="space-y-4">
                                                        <div className="flex items-baseline gap-3">
                                                                <p className="text-3xl font-semibold text-slate-900">
                                                                        {salePriceLabel}
                                                                </p>
                                                                {formattedOriginalPrice && (
                                                                        <span className="text-sm text-slate-400 line-through">
                                                                                {formattedOriginalPrice}
                                                                        </span>
                                                                )}
                                                        </div>

                                                        {discountPercentage > 0 && (
                                                                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                                                                        <ArrowDownRight className="h-3 w-3" />
                                                                        Save {discountPercentage}% today
                                                                </div>
                                                        )}
                                                </div>

                                                <div className="mt-auto flex flex-col gap-3">
                                                        <div className="flex items-center gap-2">
                                                                <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={handleAddToWishlist}
                                                                        className="rounded-full border border-transparent bg-slate-900/5 text-slate-700 transition hover:border-slate-200 hover:bg-slate-900/10"
                                                                >
                                                                        <Heart className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={handleAddToCart}
                                                                        disabled={isLoading}
                                                                        className="rounded-full border border-transparent bg-slate-900/5 text-slate-700 transition hover:border-slate-200 hover:bg-slate-900/10"
                                                                >
                                                                        <ShoppingCart className="h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                        <div className="flex flex-col gap-2 sm:flex-row">
                                                                <Button
                                                                        onClick={handleAddToCart}
                                                                        disabled={isLoading}
                                                                        className="flex-1 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 hover:shadow-xl"
                                                                >
                                                                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                                                </Button>
                                                                <Button
                                                                        onClick={handleBuyNow}
                                                                        disabled={isLoading}
                                                                        className="flex-1 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-900 shadow-md transition-all duration-300 hover:border-slate-300 hover:bg-slate-50"
                                                                >
                                                                        Buy Now
                                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </motion.div>
        );
}
