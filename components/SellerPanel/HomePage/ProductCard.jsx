"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product, viewMode = "grid" }) {
        const router = useRouter();
        const priceRange = product.pricingRange || product.priceRange;
        const saleMin =
                typeof priceRange?.min === "number" && Number.isFinite(priceRange.min)
                        ? priceRange.min
                        : null;
        const saleMaxRaw =
                typeof priceRange?.max === "number" && Number.isFinite(priceRange.max)
                        ? priceRange.max
                        : null;
        const saleMax = saleMaxRaw !== null ? saleMaxRaw : saleMin;

        const formatPriceValue = (value) => {
                if (typeof value === "number" && Number.isFinite(value)) {
                        return `₹${value.toLocaleString("en-IN")}`;
                }

                return value;
        };

        const formatRangeLabel = (min, max, fallback) => {
                if (typeof min === "number" && Number.isFinite(min)) {
                        const formattedMin = formatPriceValue(min);
                        const formattedMax =
                                typeof max === "number" && Number.isFinite(max)
                                        ? formatPriceValue(max)
                                        : null;

                        if (formattedMax && max > min) {
                                return `${formattedMin} - ${formattedMax}`;
                        }

                        return formattedMin;
                }

                return fallback;
        };

        const salePriceLabel = formatRangeLabel(
                saleMin,
                saleMax,
                formatPriceValue(product.price)
        );

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
                router.push(`/products/${product.id || product._id}`);
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
                                                                alt={product.title}
                                                                fill
                                                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        {product.discountPercentage > 0 && (
                                                                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                                                                        {product.discountPercentage}% OFF
                                                                </Badge>
                                                        )}
							{product.type === "featured" && (
								<Badge className="absolute top-2 right-2 bg-blue-500 text-white">
									Featured
								</Badge>
							)}
						</div>

                                                <div className="flex-1 space-y-4">
                                                        <div>
                                                                <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                                                                        {product.title}
                                                                </h3>
							</div>

							<div className="flex items-center justify-between">
								<div className="space-y-1">
                                                                        <div className="flex items-center gap-2">
                                                                                <p className="text-2xl font-bold">
                                                                                        {salePriceLabel}
                                                                                </p>
                                                                        </div>
                                                                        {/* Availability status removed */}
								</div>

								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="icon"
										className="rounded-full bg-transparent"
									>
										<Heart className="h-4 w-4" />
									</Button>
                                                                        <Button
                                                                                variant="outline"
                                                                                className="rounded-full bg-transparent"
                                                                        >
										<ShoppingCart className="h-4 w-4 mr-2" />
										Add to Cart
									</Button>
                                                                        <Button
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
                                                                alt={product.title}
                                                                fill
                                                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                        />

                                                        {/* Badges */}
                                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                                {product.discount && (
                                                                        <Badge className="bg-red-500 text-white">
										{product.discount}
									</Badge>
								)}
								{product.type === "featured" && (
									<Badge className="bg-blue-500 text-white">Featured</Badge>
								)}
							</div>

							{/* Quick view overlay */}
							<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
								<Button
									variant="secondary"
									size="icon"
									className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
								>
									<Eye className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<div className="p-6 flex-1 flex flex-col">
                                                <div className="flex-1">
                                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                                                {product.title}
                                                        </h3>
                                                        <div className="mb-3" aria-hidden="true" />
						</div>

						{/* Price */}
						<div className="space-y-2 mb-4">
                                                        <div className="flex flex-col items-start gap-2">
                                                                <p className="text-xl font-bold">
                                                                        {salePriceLabel}
                                                                </p>
                                                        </div>
                                                        {/* Availability information removed */}
						</div>

						{/* Actions */}
						<div className="flex items-center justify-between gap-2">
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="icon"
									className="rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
								>
									<Heart className="h-4 w-4" />
								</Button>
                                                                <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
                                                                >
									<ShoppingCart className="h-4 w-4" />
								</Button>
							</div>

                                                        <Button
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
