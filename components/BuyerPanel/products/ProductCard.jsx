"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, ArrowRight, ArrowDownRight } from "lucide-react";
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
                                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        >
                                <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                                <div className="relative w-full sm:w-48 h-48 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image
                                                                src={defaultImage}
                                                                alt={productTitle}
                                                                fill
                                                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                                onClick={handleViewProduct}
                                                        />

                                                        {discountPercentage > 0 && (
                                                                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                                                                        {discountPercentage}% OFF
                                                                </Badge>
                                                        )}

                                                        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                                                                {product.type === "featured" && (
                                                                        <Badge className="bg-blue-500 text-white">Featured</Badge>
                                                                )}
                                                        </div>
                                                </div>

						<div className="flex-1 space-y-4">
                                                        <div onClick={handleViewProduct}>
                                                                <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                                                                        {productTitle}
                                                                </h3>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
                                                                                <p className="text-2xl font-bold">
                                                                                        {salePriceLabel}
                                                                                </p>
                                                                        </div>
                                                                </div>

								<div className="flex items-center gap-2">
                                                                        <Button
                                                                                variant="outline"
                                                                                size="icon"
                                                                                onClick={handleAddToWishlist}
                                                                                className="rounded-full bg-transparent"
                                                                        >
                                                                                <Heart className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                                onClick={handleAddToCart}
                                                                                disabled={isLoading}
                                                                                variant="outline"
                                                                                className="rounded-full bg-transparent"
                                                                        >
										<ShoppingCart className="h-4 w-4 mr-2" />
										Add to Cart
									</Button>
                                                                        <Button
                                                                                onClick={handleBuyNow}
                                                                                disabled={isLoading}
                                                                                className="bg-black text-white hover:bg-gray-800 rounded-full"
                                                                        >
										Buy Now
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</div>
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
                                className="group relative flex h-full cursor-pointer flex-col overflow-hidden border-none bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                        >
                                <CardContent className="flex h-full flex-col p-0">
                                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-slate-100 via-white to-slate-200">
                                                <div className="absolute inset-0">
                                                        <Image
                                                                src={defaultImage}
                                                                alt={productTitle}
                                                                fill
                                                                className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                                                                onClick={handleViewProduct}
                                                        />
                                                </div>

                                                {discountPercentage > 0 && (
                                                        <Badge className="absolute left-4 top-4 bg-red-500 text-white shadow-lg">
                                                                {discountPercentage}% OFF
                                                        </Badge>
                                                )}

                                                {product.type === "featured" && (
                                                        <Badge className="absolute right-4 top-4 bg-blue-600 text-white shadow-lg">
                                                                Featured
                                                        </Badge>
                                                )}

                                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                                <div className="pointer-events-none absolute inset-0 rounded-b-[2.5rem] border border-white/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                                <div className="pointer-events-none absolute bottom-6 right-6 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto">
                                                        <Button
                                                                variant="secondary"
                                                                size="icon"
                                                                className="rounded-full bg-white/90 text-gray-900 shadow-lg transition hover:bg-white"
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
                                                                className="rounded-full bg-white/90 text-gray-900 shadow-lg transition hover:bg-white"
                                                                onClick={handleAddToWishlist}
                                                        >
                                                                <Heart className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                        </div>

                                        <div className="flex h-full flex-col gap-5 px-6 pb-6 pt-10">
                                                <div className="space-y-2" onClick={handleViewProduct}>
                                                        <span className="text-xs font-medium uppercase tracking-[0.28em] text-gray-400">
                                                                {categoryLabel}
                                                        </span>
                                                        <h3 className="text-lg font-semibold leading-snug text-gray-900 transition-colors line-clamp-2 group-hover:text-gray-700">
                                                                {productTitle}
                                                        </h3>
                                                </div>

                                                <div className="space-y-3">
                                                        <div className="flex items-baseline gap-3">
                                                                <p className="text-2xl font-semibold text-gray-900">
                                                                        {salePriceLabel}
                                                                </p>
                                                                {formattedOriginalPrice && (
                                                                        <span className="text-sm text-gray-400 line-through">
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

                                                <div className="mt-auto flex items-center gap-3">
                                                        <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={handleAddToWishlist}
                                                                className="rounded-full border-gray-200 bg-white text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                                        >
                                                                <Heart className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={handleAddToCart}
                                                                disabled={isLoading}
                                                                className="rounded-full border-gray-200 bg-white text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                                                        >
                                                                <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                                onClick={handleBuyNow}
                                                                disabled={isLoading}
                                                                className="flex-1 rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-gray-700 hover:shadow-xl"
                                                        >
                                                                Buy Now
                                                                <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </motion.div>
        );
}
