"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

function ProductCardVarient({ product, variant = "vertical" }) {
        const router = useRouter();

        const handleViewProduct = () => {
                router.push(`/products/${product?._id || product?.id}`);
        };


        const englishImage = product?.languageImages?.find(

                (l) => l.language?.toLowerCase() === "english"
        )?.image;
        const defaultImage =
                englishImage ||

                product?.languageImages?.[0]?.image ||
                product?.images?.[0] ||
                product?.image ||

                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";
        const productCode = product?.productCode || product?.code;

        if (variant === "horizontal") {
                return (
                        <Card
                                onClick={handleViewProduct}
                                className="w-full hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
                        >
                                <CardContent className="p-0 flex justify-between h-full">
					{/* Left side - Product Info */}
					<div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
						<div>
							<div className="flex justify-between items-start">
								<div className="flex-1">
                                                                <h3 className="font-bold text-lg md:text-xl mb-2 line-clamp-2">
                                                                        {product?.title}
                                                                </h3>
                                                                {productCode && (

                                                                        <p className="text-gray-500 text-sm mb-2">Product Code: {productCode}</p>

                                                                )}
                                                                {product?.subtitle && (
                                                                        <p className="text-gray-600 text-sm mb-2">
                                                                                {product?.subtitle}
                                                                        </p>
                                                                )}
									<p className="text-gray-600 text-sm mb-4 line-clamp-3">
										{product?.description}
									</p>
								</div>
							</div>

							<div className="flex flex-col mb-4">
								<p className="flex font-bold text-xl md:text-2xl mb-2">
									{product?.price}
								</p>
								{product?.originalPrice && (
									<p className="text-gray-500 line-through text-sm">
										{product?.originalPrice}
										<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
											25% OFF
										</span>
									</p>
								)}
							</div>

							{product?.colors && (
								<div className="flex space-x-1">
									{product?.colors.map((color, i) => (
										<div
											key={i}
											className={`w-3 h-3 rounded-full ${
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

						{/* Action Buttons */}
						<div className="flex justify-between items-center">
							<div className="flex space-x-2">
								<Button variant="outline" size="icon" className="rounded-full">
									<ShoppingCart className="h-4 w-4" />
								</Button>
								<Button variant="outline" size="icon" className="rounded-full">
									<Heart className="h-4 w-4" />
								</Button>
							</div>
							<Button className="bg-black text-white hover:bg-gray-800 transition-colors rounded-full">
								BUY NOW
								<ArrowRight className="h-4 w-4" />
							</Button>
						</div>
					</div>

                                        {/* Right side - Product Image */}
                                        <div className="flex-1 w-full h-[300px] overflow-hidden relative">
                                                {productCode && (
                                                        <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                                                                {productCode}
                                                        </span>
                                                )}
                                                <Image
                                                        src={defaultImage}
                                                        alt={product?.title}
                                                        width={300}
                                                        height={300}
                                                        className="w-full h-[300px] object-contain"
                                                />
                                        </div>
				</CardContent>
			</Card>
		);
	}

	// Default vertical variant
        return (
                <Card
                        onClick={handleViewProduct}
                        className="w-full h-full max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-100 bg-white"
                >
                        <CardContent className="h-full p-0 flex flex-col">
                                <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-50 via-white to-gray-100">
                                        {productCode && (
                                                <span className="absolute top-4 right-4 bg-black text-white text-xs px-3 py-1 rounded-full shadow-md">
                                                        {productCode}
                                                </span>
                                        )}
                                        <img
                                                src={defaultImage}
                                                alt={product?.title}
                                                className="absolute inset-0 w-full h-full object-contain p-6 drop-shadow-md"
                                        />
                                </div>

                                <div className="flex-1 px-5 pt-5 pb-4 flex flex-col gap-4">
                                        <div className="space-y-2">
                                                <h3 className="font-semibold text-lg leading-tight text-gray-900 line-clamp-2">
                                                        {product?.title}
                                                </h3>
                                                {product?.subtitle && (
                                                        <p className="text-gray-500 text-sm line-clamp-1">
                                                                {product?.subtitle}
                                                        </p>
                                                )}
                                                {productCode && (
                                                        <p className="text-xs uppercase tracking-wide text-gray-400">
                                                                Code: <span className="text-gray-500">{productCode}</span>
                                                        </p>
                                                )}
                                                {product?.description && (
                                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                                                {product?.description}
                                                        </p>
                                                )}
                                        </div>

                                        {product?.colors && (
                                                <div className="flex items-center gap-2">
                                                        <span className="text-xs uppercase tracking-wide text-gray-400">
                                                                Colors
                                                        </span>
                                                        <div className="flex items-center gap-1.5">
                                                                {product?.colors.map((color, i) => (
                                                                        <span
                                                                                key={i}
                                                                                className={`w-3.5 h-3.5 rounded-full border border-white shadow-sm ${
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
                                                </div>
                                        )}

                                        <div className="mt-auto">
                                                <div className="flex items-baseline gap-3">
                                                        <p className="font-semibold text-2xl text-gray-900">
                                                                {product?.price}
                                                        </p>
                                                        {product?.originalPrice && (
                                                                <p className="text-sm text-gray-400 line-through">
                                                                        {product?.originalPrice}
                                                                </p>
                                                        )}
                                                </div>
                                        </div>
                                </div>

                                <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-white/80 backdrop-blur">
                                        <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                        <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="rounded-full w-10 h-10 border-gray-200 hover:bg-gray-100"
                                                        >
                                                                <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="rounded-full w-10 h-10 border-gray-200 hover:bg-gray-100"
                                                        >
                                                                <Heart className="h-4 w-4" />
                                                        </Button>
                                                </div>
                                                <Button className="bg-black text-white text-sm px-4 py-2 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2">
                                                        BUY NOW
                                                        <ArrowRight className="h-4 w-4" />
                                                </Button>
                                        </div>
                                </div>
                        </CardContent>
                </Card>
        );
}

export { ProductCardVarient };
