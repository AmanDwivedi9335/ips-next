"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, ArrowRight, Star } from "lucide-react";
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
        const productCode = product.productCode || product.code;

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
                                                                {productCode && (
                                                                        <Badge className="bg-black text-white">
                                                                                {productCode}
                                                                        </Badge>
                                                                )}
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
                                                                {productCode && (

                                                                        <p className="text-sm text-gray-500">Product Code: {productCode}</p>

                                                                )}
                                                                <p className="text-gray-600 mt-2 line-clamp-2">
                                                                        {product.description}
                                                                </p>
								<div className="flex items-center gap-2 mt-2">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="h-4 w-4 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>
									<span className="text-sm text-gray-500">(4.5)</span>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
                                                                                <p className="text-2xl font-bold">
                                                                                        {salePriceLabel}
                                                                                </p>
                                                                                {showMrpLabel && (
                                                                                        <p className="text-lg text-gray-500 line-through">
                                                                                                {mrpLabel}
                                                                                        </p>
                                                                                )}
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
                                className="hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
                        >
                                <CardContent className="p-0 flex-1 flex flex-col">
					<div className="relative overflow-hidden">
                                                <div className="relative h-64 bg-gray-50 rounded-t-xl overflow-hidden">
                                                        <Image
                                                                src={defaultImage}
                                                                alt={productTitle}
                                                                fill
                                                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                                onClick={handleViewProduct}
                                                        />

                                                        {/* Left-side badges */}
                                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                                {discountPercentage > 0 && (
                                                                        <Badge className="bg-red-500 text-white">
                                                                                {discountPercentage}% OFF
                                                                        </Badge>
                                                                )}
                                                                {product.type === "featured" && (
                                                                        <Badge className="bg-blue-500 text-white">Featured</Badge>
                                                                )}
                                                        </div>

                                                        {/* Product code badge */}
                                                        {productCode && (
                                                                <Badge className="absolute top-2 right-2 bg-black text-white">
                                                                        {productCode}
                                                                </Badge>
                                                        )}

                                                        {/* Quick view overlay */}
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                                <Button
                                                                        variant="secondary"
									size="icon"
									className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
									onClick={handleViewProduct}
								>
									<Eye className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<div className="p-6 flex-1 flex flex-col">
                                                <div className="flex-1" onClick={handleViewProduct}>
                                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                                                {productTitle}
                                                        </h3>
                                                        {productCode && (

                                                                <p className="text-xs text-gray-500 mb-1">Product Code: {productCode}</p>

                                                        )}
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                                {product.description}
                                                        </p>

							{/* Rating */}
							<div className="flex items-center gap-2 mb-3">
								<div className="flex items-center">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className="h-3 w-3 fill-yellow-400 text-yellow-400"
										/>
									))}
								</div>
								<span className="text-xs text-gray-500">(4.5)</span>
							</div>
						</div>

						{/* Price */}
						<div className="space-y-2 mb-4">
							<div className="flex items-center gap-2">
                                                                <p className="text-xl font-bold">
                                                                        {salePriceLabel}
                                                                </p>
                                                                {showMrpLabel && (
                                                                        <p className="text-sm text-gray-500 line-through">
                                                                                {mrpLabel}
                                                                        </p>
                                                                )}
                                                        </div>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-between gap-2">
							<div className="flex gap-2">
                                                                <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={handleAddToWishlist}
                                                                        className="rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
                                                                >
                                                                        <Heart className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={handleAddToCart}
                                                                        disabled={isLoading}
                                                                        className="rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
                                                                >
									<ShoppingCart className="h-4 w-4" />
								</Button>
							</div>

                                                        <Button
                                                                onClick={handleBuyNow}
                                                                disabled={isLoading}
                                                                className="bg-black text-white hover:bg-gray-800 rounded-full flex-1 max-w-[120px]"
                                                                size="sm"
                                                        >
								Buy Now
								<ArrowRight className="ml-1 h-3 w-3" />
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
