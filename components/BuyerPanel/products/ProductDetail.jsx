"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import {
        ArrowLeft,
        ShoppingCart,
        Heart,
        Share2,
        Minus,
        Plus,
        RotateCcw,
        Home,
        AlertCircle,
        Receipt,
        Lock,
        HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCheckoutStore } from "@/store/checkoutStore.js";
import ProductCard from "@/components/BuyerPanel/products/ProductCard.jsx";
import { toast } from "react-hot-toast";
import Image from "next/image";

const toNumber = (value) => {
        if (value === null || value === undefined || value === "") {
                return null;
        }

        const numericValue = Number(value);

        return Number.isFinite(numericValue) ? numericValue : null;
};

const sortByReference = (values = [], reference = []) => {
        const uniqueValues = Array.from(new Set(values.filter(Boolean)));

        if (!reference || reference.length === 0) {
                return uniqueValues.sort((a, b) =>
                        String(a).localeCompare(String(b), undefined, {
                                numeric: true,
                                sensitivity: "base",
                        })
                );
        }

        const referenceIndex = new Map();
        reference.filter(Boolean).forEach((item, index) => {
                if (!referenceIndex.has(item)) {
                        referenceIndex.set(item, index);
                }
        });

        const ordered = [];
        const extras = [];

        uniqueValues.forEach((value) => {
                if (referenceIndex.has(value)) {
                        ordered.push({ value, index: referenceIndex.get(value) });
                } else {
                        extras.push(value);
                }
        });

        ordered.sort((a, b) => a.index - b.index);
        extras.sort((a, b) =>
                String(a).localeCompare(String(b), undefined, {
                        numeric: true,
                        sensitivity: "base",
                })
        );

        return [...ordered.map((item) => item.value), ...extras];
};

const normalizeTextKey = (value) =>
        typeof value === "string"
                ? value
                          .toString()
                          .trim()
                          .replace(/\s+/g, " ")
                          .toLowerCase()
                : "";

const sanitizeSizes = (sizes = []) =>
        Array.from(
                new Set(
                        sizes
                                .map((size) =>
                                        typeof size === "string"
                                                ? size.trim()
                                                : size,
                                )
                                .filter(Boolean),
                ),
        );


const mergeLayoutSizeCollections = (existing = null, incoming = null) => {
        const normaliseSource = (source, target) => {
                if (!source) return;

                if (source instanceof Map) {
                        source.forEach((value, key) => {
                                const normalizedKey = normalizeTextKey(key);
                                if (!normalizedKey) return;

                                const normalizedSizes = sanitizeSizes(
                                        Array.isArray(value) ? value : [value],
                                );

                                if (normalizedSizes.length === 0) return;

                                const existingSizes = target.get(normalizedKey) || [];
                                target.set(
                                        normalizedKey,
                                        Array.from(
                                                new Set([
                                                        ...existingSizes,
                                                        ...normalizedSizes,
                                                ]),
                                        ),
                                );
                        });

                        return;
                }

                if (source && typeof source === "object") {
                        Object.entries(source).forEach(([key, value]) => {
                                const normalizedKey = normalizeTextKey(key);
                                if (!normalizedKey) return;

                                const normalizedSizes = sanitizeSizes(
                                        Array.isArray(value) ? value : [value],
                                );

                                if (normalizedSizes.length === 0) return;

                                const existingSizes = target.get(normalizedKey) || [];
                                target.set(
                                        normalizedKey,
                                        Array.from(
                                                new Set([
                                                        ...existingSizes,
                                                        ...normalizedSizes,
                                                ]),
                                        ),
                                );
                        });
                }
        };

        const merged = new Map();

        normaliseSource(existing, merged);
        normaliseSource(incoming, merged);

        return merged;
};

const deriveLayoutSizesFromPrices = (prices = []) => {
        const result = new Map();

        prices.forEach((entry) => {
                const normalizedLayout = normalizeTextKey(entry?.layout);
                if (!normalizedLayout) return;

                const sanitizedSize = sanitizeSizes([entry?.size])[0];
                if (!sanitizedSize) return;

                const existing = result.get(normalizedLayout) || [];
                if (!existing.includes(sanitizedSize)) {
                        result.set(normalizedLayout, [...existing, sanitizedSize]);
                }
        });

        return result;
};


export default function ProductDetail({ product, relatedProducts = [] }) {
        const [selectedImage, setSelectedImage] = useState(0);
        const [quantity, setQuantity] = useState(1);
        const languages =
                product.languages && product.languages.length > 0
                        ? product.languages
                        : product.languageImages?.map((li) => li.language) || [];
        const normalizedLanguages = languages.map((l) => l?.toLowerCase());
        const englishImage = product.languageImages?.find(
                (l) => l.language?.toLowerCase() === "english"
        )?.image;
        const productCode = product.productCode || product.code;
        const [selectedLanguage, setSelectedLanguage] = useState(
                normalizedLanguages.includes("english")
                        ? languages[normalizedLanguages.indexOf("english")]
                        : languages[0] || ""
        );
        const initialSortedLayouts = sortByReference(
                product.layouts || [],
                product.layouts || [],
        );
        const sanitizedProductSizes = sanitizeSizes(product.sizes || []);
        const initialSortedSizes = sortByReference(
                sanitizedProductSizes,
                sanitizedProductSizes,
        );
        const [availableLayouts, setAvailableLayouts] = useState(
                initialSortedLayouts,
        );
        const [baseSizes, setBaseSizes] = useState(initialSortedSizes);
        const [availableSizes, setAvailableSizes] = useState(initialSortedSizes);
        const [layoutSizeMap, setLayoutSizeMap] = useState(null);
        const [availableMaterials, setAvailableMaterials] = useState(
                sortByReference(product.materials || [], product.materials || []),
        );
        const [selectedSize, setSelectedSize] = useState(
                product.sizes?.[0] || ""
        );
        const [selectedMaterial, setSelectedMaterial] = useState(
                product.materials?.[0] || ""
        );
        const [selectedLayout, setSelectedLayout] = useState(
                product.layouts?.[0] || "",
        );

        const normalizedProductFamily = (product.productFamily || "")
                .toLowerCase()
                .trim();
        const isSafetySignFamily = normalizedProductFamily === "safety signs";

        const [hasQr, setHasQr] = useState(false);
        const [hasQrOption, setHasQrOption] = useState(false);
        const [calculatedPrice, setCalculatedPrice] = useState(null);
        const [calculatedMrp, setCalculatedMrp] = useState(null);
        const [isMrpMissingForSelection, setIsMrpMissingForSelection] = useState(false);
        const [isPriceLoading, setIsPriceLoading] = useState(false);
        const [hasFetchedPrice, setHasFetchedPrice] = useState(false);
        const router = useRouter();
        const { addItem, isLoading } = useCartStore();
        const { addItem: addWishlistItem } = useWishlistStore();
        const setBuyNowContext = useCheckoutStore((state) => state.setBuyNowContext);

        useEffect(() => {
                const productSizes = sanitizeSizes(product.sizes || []);
                setBaseSizes(
                        sortByReference(productSizes, productSizes),
                );
        }, [product]);

        useEffect(() => {
                if (!isSafetySignFamily) {
                        setLayoutSizeMap(null);
                        return;
                }

                const controller = new AbortController();

                const fetchLayoutSizes = async () => {
                        try {
                                const res = await fetch("/api/layouts", {
                                        signal: controller.signal,
                                });
                                const data = await res.json();
                                if (Array.isArray(data.layouts)) {
                                        const map = new Map();
                                        data.layouts.forEach((layout) => {
                                                const normalizedName = normalizeTextKey(
                                                        layout?.name,
                                                );
                                                if (!normalizedName) return;
                                                const sanitizedSizes = Array.isArray(
                                                        layout?.sizes,
                                                )
                                                        ? Array.from(
                                                                  new Set(
                                                                          layout.sizes
                                                                                  .map((size) =>
                                                                                          String(size)
                                                                                                  .trim()
                                                                                  )
                                                                                  .filter(Boolean),
                                                                  ),
                                                          )
                                                        : [];
                                                map.set(normalizedName, sanitizedSizes);
                                        });
                                        setLayoutSizeMap((prev) =>
                                                mergeLayoutSizeCollections(prev, map),
                                        );
                                }
                        } catch (error) {
                                if (error.name !== "AbortError") {
                                        setLayoutSizeMap(null);
                                }
                        }
                };

                fetchLayoutSizes();

                return () => controller.abort();
        }, [isSafetySignFamily]);

        useEffect(() => {
                if (!isSafetySignFamily || layoutSizeMap === null) {
                        setAvailableSizes(baseSizes);
                        setSelectedSize((prev) => {
                                if (baseSizes.length === 0) {
                                        return prev ? "" : prev;
                                }

                                return baseSizes.includes(prev)
                                        ? prev
                                        : baseSizes[0] || "";
                        });
                        return;
                }

                const normalizedSelectedLayoutKey = normalizeTextKey(selectedLayout);
                const rawLayoutSizes = (() => {
                        if (!normalizedSelectedLayoutKey) {
                                return [];
                        }

                        if (layoutSizeMap instanceof Map) {
                                return layoutSizeMap.get(normalizedSelectedLayoutKey) || [];
                        }

                        const candidate =
                                layoutSizeMap?.[normalizedSelectedLayoutKey] ||
                                layoutSizeMap?.[selectedLayout];

                        return Array.isArray(candidate) ? candidate : [];
                })();

                const normalizedLayoutSizes = Array.isArray(rawLayoutSizes)

                        ? sanitizeSizes(rawLayoutSizes)
                        : [];
                const hasLayoutSpecificSizes = normalizedLayoutSizes.length > 0;

                const prioritizedLayoutSizes = hasLayoutSpecificSizes

                        ? sortByReference(
                                  normalizedLayoutSizes,
                                  baseSizes.length > 0
                                          ? baseSizes
                                          : normalizedLayoutSizes,
                          )
                        : [];


                const filteredSizes = hasLayoutSpecificSizes
                        ? baseSizes.length > 0
                                ? prioritizedLayoutSizes.filter((size) =>
                                          baseSizes.includes(size),
                                  )
                                : prioritizedLayoutSizes
                        : baseSizes;

                setAvailableSizes(Array.from(new Set(filteredSizes)));


                setSelectedSize((prev) => {
                        if (filteredSizes.length === 0) {
                                return prev ? "" : prev;
                        }

                        return filteredSizes.includes(prev)
                                ? prev
                                : filteredSizes[0];
                });
        }, [baseSizes, isSafetySignFamily, layoutSizeMap, selectedLayout]);

        useEffect(() => {
                const checkQrOption = async () => {
                        try {
                                const res = await fetch(
                                        `/api/prices?product=${product._id || product.id}`
                                );
                                const data = await res.json();
                                if (data.prices) {
                                        const qrValues = new Set(
                                                data.prices.map((p) => p.qr)
                                        );
                                        if (qrValues.size > 1) {
                                                setHasQrOption(true);
                                                setHasQr(false);
                                        } else if (qrValues.has(true)) {
                                                setHasQr(true);
                                        }

                                        const layoutSet = new Set(
                                                data.prices
                                                        .map((p) => p.layout)
                                                        .filter(Boolean)
                                        );
                                        const sizeSet = new Set(
                                                data.prices
                                                        .map((p) => p.size)
                                                        .filter(Boolean)
                                        );
                                        const materialSet = new Set(
                                                data.prices
                                                        .map((p) => p.material)
                                                        .filter(Boolean)
                                        );

                                        const sortedLayouts = sortByReference(
                                                Array.from(layoutSet),
                                                product.layouts || [],
                                        );
                                        const sortedSizes = sortByReference(
                                                sanitizeSizes(Array.from(sizeSet)),
                                                sanitizedProductSizes,
                                        );
                                        const sortedMaterials = sortByReference(
                                                Array.from(materialSet),
                                                product.materials || [],
                                        );

                                        setAvailableLayouts(sortedLayouts);
                                        setBaseSizes(sortedSizes);
                                        setAvailableMaterials(sortedMaterials);

                                        if (isSafetySignFamily) {
                                                const layoutSizesFromPrices =
                                                        deriveLayoutSizesFromPrices(
                                                                data.prices,
                                                        );

                                                setLayoutSizeMap((prev) =>
                                                        mergeLayoutSizeCollections(
                                                                prev,
                                                                layoutSizesFromPrices,
                                                        ),
                                                );
                                        }

                                        setSelectedLayout((prev) =>
                                                prev && sortedLayouts.includes(prev)
                                                        ? prev
                                                        : sortedLayouts[0] || ""
                                        );
                                        setSelectedMaterial((prev) =>
                                                prev &&
                                                sortedMaterials.includes(prev)
                                                        ? prev
                                                        : sortedMaterials[0] || ""
                                        );
                                }
                        } catch (e) {
                                // ignore
                        }
                };
                checkQrOption();
        }, [isSafetySignFamily, product]);

        useEffect(() => {
                const fetchPrice = async () => {
                        setIsPriceLoading(true);
                        setHasFetchedPrice(false);
                        setCalculatedMrp(null);
                        setIsMrpMissingForSelection(false);
                        try {
                                const params = new URLSearchParams({
                                        product: product._id || product.id,
                                        layout: selectedLayout,
                                        size: selectedSize,
                                        material: selectedMaterial,
                                        qr: hasQr,
                                });
                                const res = await fetch(`/api/prices?${params.toString()}`);
                                const data = await res.json();

                                if (Array.isArray(data.prices) && data.prices.length > 0) {
                                        const [priceEntry] = data.prices;
                                        const normalizedPrice = toNumber(priceEntry?.price);
                                        const normalizedMrp = toNumber(priceEntry?.mrp);
                                        const hasPriceValue = normalizedPrice !== null;
                                        const hasMrpValue =
                                                normalizedMrp !== null && normalizedMrp > 0;

                                        setCalculatedPrice(hasPriceValue ? normalizedPrice : null);
                                        setCalculatedMrp(hasMrpValue ? normalizedMrp : null);
                                        setIsMrpMissingForSelection(!hasPriceValue || !hasMrpValue);
                                } else {
                                        setCalculatedPrice(null);
                                        setCalculatedMrp(null);
                                        setIsMrpMissingForSelection(true);

                                }
                                setHasFetchedPrice(true);
                        } catch (e) {
                                // ignore
                                setCalculatedPrice(null);
                                setCalculatedMrp(null);

                                setIsMrpMissingForSelection(true);

                                setHasFetchedPrice(true);
                        } finally {
                                setIsPriceLoading(false);
                        }
                };
                fetchPrice();
        }, [selectedLayout, selectedSize, selectedMaterial, hasQr, product]);

        const languageImage =
                product.languageImages?.find(
                        (l) =>
                                l.language?.toLowerCase() ===
                                selectedLanguage.toLowerCase()
                )?.image || englishImage;
        const categoryName = product.category?.replace("-", " ");
        const subcategoryName = product.subcategory?.replace("-", " ");

        const handleAddToCart = async (e) => {
                e.stopPropagation();

                const numericPriceForCart = toNumber(calculatedPrice);

                if (numericPriceForCart === null || isPriceLoading || isMrpMissingForSelection) {
                        toast.error("Please select another size");
                        return;
                }

                const numericMrpForCart =
                        toNumber(calculatedMrp) ??
                        toNumber(product.mrp) ??
                        toNumber(product.price);

                const originalPriceValue =
                        numericMrpForCart !== null && numericMrpForCart > numericPriceForCart
                                ? numericMrpForCart
                                : numericPriceForCart;

                // Use the unified addItem function
                await addItem({
                        id: product.id || product._id,
                        name: product.title,
                        description: product.description,
                        price: numericPriceForCart,
                        originalPrice: originalPriceValue,
                        image:
                                languageImage ||
                                englishImage ||
                                product.images?.[0] ||
                                product.image,
                });
        };

        const handleAddToWishlist = (e) => {
                e.stopPropagation();

                const numericPriceForWishlist = toNumber(calculatedPrice);

                if (
                        numericPriceForWishlist === null ||
                        isPriceLoading ||
                        isMrpMissingForSelection
                ) {
                        toast.error("Please select another size");
                        return;
                }

                const numericMrpForWishlist =
                        toNumber(calculatedMrp) ??
                        toNumber(product.mrp) ??
                        toNumber(product.price);

                const originalWishlistPrice =
                        numericMrpForWishlist !== null &&
                        numericMrpForWishlist > numericPriceForWishlist
                                ? numericMrpForWishlist
                                : numericPriceForWishlist;

                addWishlistItem({
                        id: product.id || product._id,
                        name: product.title,
                        description: product.description,
                        price: numericPriceForWishlist,
                        originalPrice: originalWishlistPrice,
                        image:
                                languageImage ||
                                englishImage ||
                                product.images?.[0] ||
                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png",
                });
                toast.success("Added to wishlist!");
        };

        const handleBuyNow = async (e) => {
                e.stopPropagation();

                const numericPriceForBuyNow = toNumber(calculatedPrice);

                if (numericPriceForBuyNow === null || isPriceLoading || isMrpMissingForSelection) {
                        toast.error("Please select another size");
                        return;
                }

                const numericMrpForBuyNow =
                        toNumber(calculatedMrp) ??
                        toNumber(product.mrp) ??
                        toNumber(product.price);

                const normalizedMrp =
                        numericMrpForBuyNow !== null && numericMrpForBuyNow > 0
                                ? numericMrpForBuyNow
                                : numericPriceForBuyNow;

                const discountAmount = Math.max(
                        (normalizedMrp || 0) - numericPriceForBuyNow,
                        0
                );

                const discountPercentage =
                        normalizedMrp && normalizedMrp > 0
                                ? Math.round((discountAmount / normalizedMrp) * 100)
                                : 0;

                const fallbackImage =
                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png";

                setBuyNowContext(
                        {
                                id: product.id || product._id,
                                name: product.title,
                                title: product.title,
                                description: product.description,
                                price: numericPriceForBuyNow,
                                mrp: normalizedMrp,
                                originalPrice: normalizedMrp,
                                image:
                                        languageImage ||
                                        englishImage ||
                                        product.images?.[0] ||
                                        product.image ||
                                        fallbackImage,
                                selectedOptions: {
                                        layout: selectedLayout || null,
                                        size: selectedSize || null,
                                        material: selectedMaterial || null,
                                        language: selectedLanguage || null,
                                        qr: hasQr,
                                },
                                discountAmount,
                                discountPercentage,
                        },
                        quantity
                );

                // Redirect to checkout with buy now parameters
                router.push(
                        `/checkout?buyNow=true&id=${product.id || product._id}&qty=${quantity}`
                );
	};

        const handleQuantityChange = (change) => {
                const newQuantity = quantity + change;
                if (newQuantity >= 1) {
                        setQuantity(newQuantity);
                }
        };

	const colors = [
		"bg-blue-500",
		"bg-black",
		"bg-red-500",
		"bg-orange-500",
		"bg-gray-500",
	];

        const numericCalculatedPrice = toNumber(calculatedPrice);
        const numericCalculatedMrp = toNumber(calculatedMrp);
        const numericSalePrice = toNumber(product.salePrice);
        const numericPrice = toNumber(product.price);
        const numericBaseMrp = toNumber(product.mrp) ?? numericPrice;
        const effectiveMrp = numericCalculatedMrp ?? numericBaseMrp;
        const fallbackPrice = numericSalePrice ?? numericPrice ?? null;
        const baseDisplayPrice = numericCalculatedPrice ?? fallbackPrice;
        const shouldShowUnavailableMessage =
                isMrpMissingForSelection ||
                (hasFetchedPrice &&
                        numericCalculatedPrice === null &&
                        baseDisplayPrice === null);
        const displayPrice = shouldShowUnavailableMessage ? null : baseDisplayPrice;
        const priceDifference =
                effectiveMrp !== null && displayPrice !== null ? effectiveMrp - displayPrice : 0;
        const showOriginalPrice =
                effectiveMrp !== null && displayPrice !== null && priceDifference > 0;
        const explicitDiscount = toNumber(product.discountPercentage);
        const calculatedDiscount =
                showOriginalPrice && effectiveMrp && effectiveMrp > 0
                        ? Math.round((priceDifference / effectiveMrp) * 100)
                        : 0;
        const discountToShow =
                explicitDiscount !== null && explicitDiscount > 0
                        ? Math.round(explicitDiscount)
                        : calculatedDiscount > 0
                          ? calculatedDiscount
                          : 0;
        const showDiscountBadge = discountToShow > 0;
        const isLoadingPriceWithoutValue = isPriceLoading && baseDisplayPrice === null;

        if (!product) {
                return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">
						Product Not Found
					</h1>
					<p className="text-gray-600 mb-8">
						The requested product could not be found.
					</p>
					<Link href="/products">
						<Button className="bg-black text-white hover:bg-gray-800">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Products
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
                <div className="min-h-screen bg-gray-50">
                        <div className="container mx-auto px-4 lg:px-10 py-8">
                                <div className="text-sm mb-4">
                                        <Link
                                                href="/"
                                                className="text-gray-600 hover:underline"
                                        >
                                                Home
                                        </Link>
                                        {" > "}
                                        <Link
                                                href={`/products?category=${product.category}`}
                                                className="text-gray-600 hover:underline"
                                        >
                                                {categoryName}
                                        </Link>
                                        {product.subcategory && (
                                                <>
                                                        {" > "}
                                                        <span className="text-gray-600">
                                                                {subcategoryName}
                                                        </span>
                                                </>
                                        )}
                                </div>
                                {/* Product Details */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
					{/* Product Images */}
					<div className="space-y-6">
                                                <motion.div
                                                        className="relative bg-white rounded-lg overflow-hidden shadow-sm"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5 }}
                                                >
                                                        <div className="absolute top-4 left-4 z-10">
                                                                <Link
                                                                        href="/products"
                                                                        className="inline-flex items-center bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition-colors"
                                                                >
                                                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                                                        Back
                                                                </Link>
                                                        </div>

                                                        {productCode && (
                                                                <Badge className="absolute top-4 right-4 z-10 bg-black text-white">
                                                                        {productCode}
                                                                </Badge>
                                                        )}

                                                        <div className="relative w-full h-96 lg:h-[400px]">
                                                               <Image
                                                                       src={
                                                                               languageImage ||
                                                                               product.images?.[selectedImage] ||
                                                                               product.image ||
                                                                               "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                                       }
                                                                       alt={product.name}
                                                                       fill
                                                                       className="object-contain p-8"
                                                                       priority
                                                               />
							</div>
						</motion.div>

						{/* Image Gallery */}
						{product.images && product.images.length > 1 && (
							<div className="flex space-x-4 justify-center overflow-x-auto">
								{product.images.map((image, index) => (
									<button
										key={index}
										onClick={() => setSelectedImage(index)}
										className={`relative w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 ${
											selectedImage === index
												? "border-black"
												: "border-gray-200 hover:border-gray-400"
										}`}
									>
										<Image
											src={
												image ||
												"https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
											}
											alt={`${product.name} view ${index + 1}`}
											fill
											className="object-contain p-2"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Product Info */}
					<motion.div
						className="space-y-6"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<div>
							<Badge variant="secondary" className="mb-4">
								{product.category?.replace("-", " ").toUpperCase()}
							</Badge>
							<h1 className="text-3xl lg:text-4xl font-bold mb-4">
								{product.name}
							</h1>

                                                        {/* Product code */}
                                                        {productCode && (
                                                                <p className="text-sm text-gray-600 mb-2">
                                                                        Code: {productCode}
                                                                </p>
                                                        )}

                                                        {/* Product price */}
                                        {isLoadingPriceWithoutValue ? (
                                                <p className="text-sm text-gray-500 mb-2">
                                                        Fetching latest price...
                                                </p>
                                        ) : shouldShowUnavailableMessage ? (
                                                <p className="text-lg lg:text-xl font-semibold text-red-600 mb-2">
                                                        Please select another size
                                                </p>
                                        ) : displayPrice !== null ? (
                                                <div className="space-y-1 mb-2">
                                                        <div className="flex items-baseline gap-3 flex-wrap">
                                                                <p className="text-xl lg:text-2xl font-semibold text-black">
                                                                        ₹ {displayPrice.toLocaleString()}
                                                                </p>
                                                                {showOriginalPrice && (
                                                                        <p className="text-base text-gray-500 line-through">
                                                                                ₹ {effectiveMrp.toLocaleString()}
                                                                        </p>
                                                                )}
                                                                {showDiscountBadge && (
                                                                        <Badge className="bg-red-500 text-white">
                                                                                {discountToShow}% OFF
                                                                        </Badge>
                                                                )}
                                                        </div>
                                                        {numericCalculatedPrice !== null ? (
                                                                <p className="text-sm text-gray-500">
                                                                        Price based on selected options
                                                                </p>
                                                        ) : showDiscountBadge ? (
                                                                <p className="text-sm text-green-600 font-medium">
                                                                        Sale price after discount
                                                                </p>
                                                        ) : null}
                                                </div>
                                        ) : null}
                                       {hasQrOption && (
                                                <div className="mt-4">
                                                        <Select
                                                                value={hasQr ? "yes" : "no"}
                                                                onValueChange={(v) => setHasQr(v === "yes")}
                                                        >
                                                                <SelectTrigger className="w-40">
                                                                        <SelectValue placeholder="QR Code" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        <SelectItem value="yes">
                                                                                With QR Code
                                                                        </SelectItem>
                                                                        <SelectItem value="no">
                                                                                Without QR Code
                                                                        </SelectItem>
                                                                </SelectContent>
                                                        </Select>
                                                </div>
                                        )}
                                </div>

                                {/* Product Colors */}
                                {/* <div className="w-fit flex space-x-2 p-3 bg-gray-200 rounded-lg">
                                        {colors.map((color, i) => (
                                                <div
                                                        key={i}
                                                        className={`w-6 h-6 rounded-full border border-gray-200 cursor-pointer ${color}`}
                                                />
                                        ))}
                                </div> */}

                                {languages.length > 0 && (
                                        <div className="mt-4">
                                                <Select
                                                        value={selectedLanguage}
                                                        onValueChange={setSelectedLanguage}
                                                >
                                                        <SelectTrigger className="w-40">
                                                                <SelectValue placeholder="Language" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {languages.map((lang) => (
                                                                        <SelectItem key={lang} value={lang}>
                                                                                {lang}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                        </div>
                                )}

                                                {availableLayouts && availableLayouts.length > 0 && (
                                                        <div className="mt-4">
                                                                <Select
                                                                        value={selectedLayout}
                                                                        onValueChange={setSelectedLayout}
                                                                >
                                                                        <SelectTrigger className="w-40">
                                                                                <SelectValue placeholder="Layout" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                {availableLayouts.map((lay) => (
                                                                                        <SelectItem key={lay} value={lay}>
                                                                                                {lay}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                        </div>
                                                )}
                                                {availableSizes && availableSizes.length > 0 && (
                                                        <div className="mt-4">
                                                                <Select
                                                                        value={selectedSize}
                                                                        onValueChange={setSelectedSize}
                                                                >
                                                                        <SelectTrigger className="w-40">
                                                                                <SelectValue placeholder="Size" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                {availableSizes.map((size) => (
                                                                                        <SelectItem key={size} value={size}>
                                                                                                {size}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                        </div>
                                                )}

                                                {availableMaterials && availableMaterials.length > 0 && (
                                                        <div className="mt-4">
                                                                <Select
                                                                        value={selectedMaterial}
                                                                        onValueChange={setSelectedMaterial}
                                                                >
                                                                        <SelectTrigger className="w-40">
                                                                                <SelectValue placeholder="Material" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                {availableMaterials.map((mat) => (
                                                                                        <SelectItem key={mat} value={mat}>
                                                                                                {mat}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                        </div>
                                                )}

                                                {/* Quantity and Add to Cart */}
                                                <div className="space-y-4">
							<div className="flex items-center space-x-4">
								<span className="font-medium">Quantity:</span>
								<div className="flex items-center border rounded-lg">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleQuantityChange(-1)}
										disabled={quantity <= 1}
									>
										<Minus className="h-4 w-4" />
									</Button>
									<span className="px-4 py-2 font-medium">{quantity}</span>
                                                                        <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => handleQuantityChange(1)}
                                                                        >
                                                                                <Plus className="h-4 w-4" />
                                                                        </Button>
                                                                </div>
                                                        </div>

							<div className="flex flex-col sm:flex-row gap-4">
                                                                <Button
                                                                        onClick={handleAddToCart}
                                                                        disabled={
                                                                                isLoading ||
                                                                                calculatedPrice === null ||
                                                                                isPriceLoading ||
                                                                                isMrpMissingForSelection
                                                                        }
                                                                        className="flex-1 bg-black text-white hover:bg-gray-800"
                                                                        size="lg"
                                                                >
									<ShoppingCart className="h-5 w-5 mr-2" />
									Add to Cart
								</Button>
                                                                <Button
                                                                        onClick={handleBuyNow}
                                                                        disabled={
                                                                                calculatedPrice === null ||
                                                                                isPriceLoading ||
                                                                                isMrpMissingForSelection
                                                                        }
                                                                        className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                                                        size="lg"
                                                                >
                                                                        Buy Now
                                                                </Button>
                                                                <Button
                                                                        variant="outline"
                                                                        size="lg"
                                                                        onClick={handleAddToWishlist}
                                                                        disabled={
                                                                                calculatedPrice === null ||
                                                                                isPriceLoading ||
                                                                                isMrpMissingForSelection
                                                                        }
                                                                >
                                                                        <Heart className="h-5 w-5 mr-2" />
                                                                        Wishlist
                                                                </Button>
								<Button variant="outline" size="lg">
									<Share2 className="h-5 w-5" />
								</Button>
							</div>
						</div>

                                                {/* Availability status removed */}
                                        </motion.div>
                                </div>
                                {product.materialSpecification ||
                                        product.description ||
                                        product.longDescription ? (
                                        <div className="space-y-6 mb-10">
                                                {product.materialSpecification && (
                                                        <div>
                                                                <h2 className="text-xl font-bold mb-2">
                                                                        Material Specification
                                                                </h2>
                                                                <p className="text-gray-700 whitespace-pre-line">
                                                                        {product.materialSpecification}
                                                                </p>
                                                        </div>
                                                )}
                                                {product.description && (
                                                        <div>
                                                                <h2 className="text-xl font-bold mb-2">
                                                                        Product Short Description
                                                                </h2>
                                                                <p className="text-gray-700 whitespace-pre-line">
                                                                        {product.description}
                                                                </p>
                                                        </div>
                                                )}
                                                {product.longDescription && (
                                                        <div>
                                                                <h2 className="text-xl font-bold mb-2">
                                                                        Description
                                                                </h2>
                                                                <p className="text-gray-700 whitespace-pre-line">
                                                                        {product.longDescription}
                                                                </p>
                                                        </div>
                                                )}
                                        </div>
                                ) : null}

                                {/* Product Features */}
                                {product.features && product.features.length > 0 && (
                                        <motion.div
                                                className="mb-10"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<h2 className="text-2xl font-bold mb-8">Product Features</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							{product.features.map((feature, index) => (
								<Card key={index} className="bg-white rounded-xl p-6 shadow-sm">
									<h3 className="font-semibold text-lg mb-3">
										{feature.title}
									</h3>
									<p className="text-gray-600">{feature.description}</p>
								</Card>
							))}
						</div>
						{product.longDescription && (
							<Card className="bg-white rounded-xl p-6 shadow-sm">
								<h2 className="text-2xl font-bold mb-4">Product Description</h2>
								<p className="text-gray-600 leading-relaxed">
									{product.longDescription}
								</p>
							</Card>
						)}
					</motion.div>
				)}

                                {/* Related Products */}
				{relatedProducts.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.7 }}
						className="mb-10"
					>
						<h2 className="text-2xl font-bold mb-8">Related Products</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{relatedProducts.map((relatedProduct) => (
								<ProductCard key={relatedProduct.id} product={relatedProduct} />
							))}
						</div>
					</motion.div>
				)}

				{/* Benefits and Warranty Section */}
				<motion.div
					className="mb-10"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.8 }}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Store Benefits */}
						<Card>
							<CardContent className="p-6">
								<h2 className="text-xl font-bold mb-6">Store Benefits</h2>
								<div className="space-y-4">
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<Receipt className="h-5 w-5 text-green-600" />
										<span className="font-medium">GST Invoice Available</span>
									</div>
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<Lock className="h-5 w-5 text-green-600" />
										<span className="font-medium">Secure Payments</span>
									</div>
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<HelpCircle className="h-5 w-5 text-green-600" />
										<span className="font-medium">365 Days Help Desk</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Return & Warranty Policy */}
						<Card>
							<CardContent className="p-6">
								<h2 className="text-xl font-bold mb-6">
									Return & Warranty Policy
								</h2>
								<div className="space-y-4">
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<RotateCcw className="h-5 w-5 text-green-600" />
										<span className="font-medium">
											Upto 7 Days Return Policy
										</span>
									</div>
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<Home className="h-5 w-5 text-green-600" />
										<span className="font-medium">Damage Products</span>
									</div>
									<div className="flex items-center space-x-3 p-3 border border-green-200 rounded-lg">
										<AlertCircle className="h-5 w-5 text-green-600" />
										<span className="font-medium">Wrong Product</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
