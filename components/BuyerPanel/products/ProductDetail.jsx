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
        ArrowRight,
        ShoppingCart,
        Heart,
        Share2,
        Minus,
        Plus,
        Star,
        User,
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
        const normalizedFamily =
                typeof product?.productFamily === "string"
                        ? product.productFamily.toLowerCase()
                        : "";
        const isSignsFamily = normalizedFamily.includes("signs");
        const isLayoutSelectionEnabled = !isSignsFamily;
        const [availableLayouts, setAvailableLayouts] = useState(
                sortByReference(product.layouts || [], product.layouts || []),
        );
        const [availableSizes, setAvailableSizes] = useState(
                sortByReference(product.sizes || [], product.sizes || []),
        );
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
                isLayoutSelectionEnabled ? product.layouts?.[0] || "" : "",
        );
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
                                                Array.from(sizeSet),
                                                product.sizes || [],
                                        );
                                        const sortedMaterials = sortByReference(
                                                Array.from(materialSet),
                                                product.materials || [],
                                        );

                                        setAvailableLayouts(sortedLayouts);
                                        setAvailableSizes(sortedSizes);
                                        setAvailableMaterials(sortedMaterials);

                                        if (isLayoutSelectionEnabled) {
                                                setSelectedLayout((prev) =>
                                                        prev && sortedLayouts.includes(prev)
                                                                ? prev
                                                                : sortedLayouts[0] || ""
                                                );
                                        }
                                        setSelectedSize((prev) =>
                                                prev && sortedSizes.includes(prev)
                                                        ? prev
                                                        : sortedSizes[0] || ""
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
        }, [product, isLayoutSelectionEnabled]);

        useEffect(() => {
                const fetchPrice = async () => {
                        setIsPriceLoading(true);
                        setHasFetchedPrice(false);
                        setCalculatedMrp(null);
                        setIsMrpMissingForSelection(false);
                        try {
                                const params = new URLSearchParams();
                                params.set("product", product._id || product.id);
                                if (isLayoutSelectionEnabled && selectedLayout) {
                                        params.set("layout", selectedLayout);
                                }
                                if (selectedSize) {
                                        params.set("size", selectedSize);
                                }
                                if (selectedMaterial) {
                                        params.set("material", selectedMaterial);
                                }
                                params.set("qr", String(hasQr));
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
        }, [
                selectedLayout,
                selectedSize,
                selectedMaterial,
                hasQr,
                product,
                isLayoutSelectionEnabled,
        ]);

        const languageImage =
                product.languageImages?.find(
                        (l) =>
                                l.language?.toLowerCase() ===
                                selectedLanguage.toLowerCase()
                )?.image || englishImage;
        const categoryName = product.category?.replace("-", " ");
        const subcategoryName = product.subcategory?.replace("-", " ");

        const [reviews, setReviews] = useState(product.reviews || []);
        const [newRating, setNewRating] = useState(0);
        const [newComment, setNewComment] = useState("");
        const [submittingReview, setSubmittingReview] = useState(false);

        const averageRating =
                reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                        : 0;

        const handleSubmitReview = async (e) => {
                e.preventDefault();
                if (!newRating || !newComment) return;
                try {
                        setSubmittingReview(true);
                        const res = await fetch(
                                `/api/products/${product.id || product._id}/reviews`,
                                {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ rating: newRating, comment: newComment }),
                                }
                        );
                        const data = await res.json();
                        if (res.ok) {
                                setReviews((prev) => [...prev, data.review]);
                                setNewRating(0);
                                setNewComment("");
                                toast.success("Review submitted");
                        } else {
                                toast.error(data.message || "Failed to submit review");
                        }
                } catch (error) {
                        toast.error("Failed to submit review");
                } finally {
                        setSubmittingReview(false);
                }
        };


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
                        selectedOptions: {
                                layout: isLayoutSelectionEnabled ? selectedLayout || null : null,
                                size: selectedSize || null,
                                material: selectedMaterial || null,
                                language: selectedLanguage || null,
                                qr: hasQr,
                        },
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
                                        layout: isLayoutSelectionEnabled
                                                ? selectedLayout || null
                                                : null,
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

        const renderStars = (rating) => {
                return Array.from({ length: 5 }, (_, i) => (
                        <Star
                                key={i}
                                className={`w-4 h-4 ${
                                        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                        />
                ));
        };

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
                                                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.8)]"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.5 }}
                                                >
                                                        <div className="pointer-events-none absolute inset-0 opacity-80">
                                                                <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
                                                                <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
                                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),rgba(15,23,42,0.2))]" />
                                                        </div>

                                                        <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
                                                                <Link
                                                                        href="/products"
                                                                        className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2 text-sm font-medium text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                                                                >
                                                                        <ArrowLeft className="h-4 w-4" />
                                                                        Back to products
                                                                </Link>
                                                        </div>

                                                        {productCode && (
                                                                <Badge className="absolute top-6 right-6 z-20 rounded-full border border-white/30 bg-white/15 px-4 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
                                                                        {productCode}
                                                                </Badge>
                                                        )}

                                                        <div className="relative w-full h-[520px] lg:h-[560px]">
                                                                <Image
                                                                        src={
                                                                                languageImage ||
                                                                                product.images?.[selectedImage] ||
                                                                                product.image ||
                                                                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                                        }
                                                                        alt={product.name}
                                                                        fill
                                                                        className="object-contain p-10 drop-shadow-[0_25px_50px_rgba(0,0,0,0.45)]"
                                                                        priority
                                                                />
                                                        </div>
                                                </motion.div>

                                                {/* Image Gallery */}
                                                {product.images && product.images.length > 1 && (
                                                        <div className="flex justify-center gap-4 overflow-x-auto pb-2">
                                                                {product.images.map((image, index) => (
                                                                        <button
                                                                                key={index}
                                                                                onClick={() => setSelectedImage(index)}
                                                                                className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                                                                                        selectedImage === index
                                                                                                ? "border-slate-900 shadow-lg"
                                                                                                : "border-transparent bg-white/40 hover:border-slate-300"
                                                                                }`}
                                                                        >
                                                                                <Image
                                                                                        src={
                                                                                                image ||
                                                                                                "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                                                        }
                                                                                        alt={`${product.name} view ${index + 1}`}
                                                                                        fill
                                                                                        className="object-contain p-3"
                                                                                />
                                                                        </button>
                                                                ))}
                                                        </div>
                                                )}
                                        </div>

                                        {/* Product Info */}
                                        <motion.div
                                                className="relative"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                                <Card className="relative overflow-hidden border-none bg-white/85 backdrop-blur-xl shadow-[0_45px_80px_-40px_rgba(15,23,42,0.55)]">
                                                        <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-amber-100/80 blur-3xl" />
                                                        <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-emerald-100/70 blur-3xl" />
                                                        <CardContent className="relative z-10 space-y-8 p-8 lg:p-10">
                                                                <div className="space-y-4">
                                                                        <Badge variant="secondary" className="w-fit rounded-full bg-slate-900/5 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-slate-600">
                                                                                {product.category?.replace("-", " ").toUpperCase()}
                                                                        </Badge>
                                                                        <h1 className="text-3xl font-bold leading-tight text-slate-900 lg:text-4xl">
                                                                                {product.name}
                                                                        </h1>

                                                                        {productCode && (
                                                                                <p className="text-sm font-medium text-slate-500">
                                                                                        Product Code: <span className="text-slate-800">{productCode}</span>
                                                                                </p>
                                                                        )}

                                                                        <div className="flex flex-wrap items-center gap-3">
                                                                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-sm font-semibold text-white shadow">
                                                                                        <Star className="h-4 w-4 fill-white text-white" />
                                                                                        {averageRating.toFixed(1)}
                                                                                </span>
                                                                                <span className="text-sm font-semibold text-slate-500">
                                                                                        {reviews.length} review{reviews.length === 1 ? "" : "s"}
                                                                                </span>
                                                                        </div>
                                                                </div>

                                                                <div>
                                                                        {isLoadingPriceWithoutValue ? (
                                                                                <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 text-sm font-medium text-slate-500">
                                                                                        Fetching latest price...
                                                                                </div>
                                                                        ) : shouldShowUnavailableMessage ? (
                                                                                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 text-base font-semibold text-red-600">
                                                                                        Please select another size
                                                                                </div>
                                                                        ) : displayPrice !== null ? (
                                                                                <div className="relative overflow-hidden rounded-2xl border border-slate-900/10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-inner">
                                                                                        <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                                                                                        <div className="relative z-10 flex flex-wrap items-end gap-4">
                                                                                                <p className="text-3xl font-bold tracking-tight">
                                                                                                        ₹ {displayPrice.toLocaleString()}
                                                                                                </p>
                                                                                                {showOriginalPrice && (
                                                                                                        <p className="text-base font-medium text-white/70 line-through">
                                                                                                                ₹ {effectiveMrp.toLocaleString()}
                                                                                                        </p>
                                                                                                )}
                                                                                                {showDiscountBadge && (
                                                                                                        <Badge className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                                                                                                                {discountToShow}% OFF
                                                                                                        </Badge>
                                                                                                )}
                                                                                        </div>
                                                                                        {numericCalculatedPrice !== null ? (
                                                                                                <p className="mt-2 text-sm text-white/70">
                                                                                                        Price shown for the selected configuration
                                                                                                </p>
                                                                                        ) : showDiscountBadge ? (
                                                                                                <p className="mt-2 text-sm font-medium text-emerald-200">
                                                                                                        Limited-time savings applied automatically
                                                                                                </p>
                                                                                        ) : null}
                                                                                </div>
                                                                        ) : null}
                                                                </div>

                                                                <div className="grid gap-4 sm:grid-cols-2">
                                                                        {hasQrOption && (
                                                                                <div className="flex flex-col gap-2">
                                                                                        <span className="text-sm font-medium text-slate-600">QR Code</span>
                                                                                        <Select value={hasQr ? "yes" : "no"} onValueChange={(v) => setHasQr(v === "yes")}>
                                                                                                <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-white/70 px-4 text-sm font-medium text-slate-700 shadow-sm">
                                                                                                        <SelectValue placeholder="QR Code" />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                        <SelectItem value="yes">With QR Code</SelectItem>
                                                                                                        <SelectItem value="no">Without QR Code</SelectItem>
                                                                                                </SelectContent>
                                                                                        </Select>
                                                                                </div>
                                                                        )}

                                                                        {languages.length > 0 && (
                                                                                <div className="flex flex-col gap-2">
                                                                                        <span className="text-sm font-medium text-slate-600">Language</span>
                                                                                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                                                                                <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-white/70 px-4 text-sm font-medium text-slate-700 shadow-sm">
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

                                                                        {isLayoutSelectionEnabled && availableLayouts && availableLayouts.length > 0 && (
                                                                                <div className="flex flex-col gap-2">
                                                                                        <span className="text-sm font-medium text-slate-600">Layout</span>
                                                                                        <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                                                                                                <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-white/70 px-4 text-sm font-medium text-slate-700 shadow-sm">
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
                                                                                <div className="flex flex-col gap-2">
                                                                                        <span className="text-sm font-medium text-slate-600">Size</span>
                                                                                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                                                                                                <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-white/70 px-4 text-sm font-medium text-slate-700 shadow-sm">
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
                                                                                <div className="flex flex-col gap-2">
                                                                                        <span className="text-sm font-medium text-slate-600">Material</span>
                                                                                        <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                                                                                                <SelectTrigger className="h-12 w-full rounded-xl border border-slate-200 bg-white/70 px-4 text-sm font-medium text-slate-700 shadow-sm">
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
                                                                </div>

                                                                <div className="space-y-5">
                                                                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4">
                                                                        <div className="space-y-1">
                                                                                <p className="text-xs font-medium uppercase tracking-widest text-slate-400">Quantity</p>
                                                                                <p className="text-sm text-slate-600">Choose how many units you need</p>
                                                                        </div>
                                                                        <div className="flex items-center rounded-full border border-slate-200 bg-white/80 shadow-sm">
                                                                                <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="h-11 w-11 rounded-full text-slate-600 hover:bg-slate-100"
                                                                                                onClick={() => handleQuantityChange(-1)}
                                                                                                disabled={quantity <= 1}
                                                                                        >
                                                                                                <Minus className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <span className="px-6 text-lg font-semibold text-slate-800">{quantity}</span>
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="icon"
                                                                                                className="h-11 w-11 rounded-full text-slate-600 hover:bg-slate-100"
                                                                                                onClick={() => handleQuantityChange(1)}
                                                                                        >
                                                                                                <Plus className="h-4 w-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </div>

                                                                        <div className="grid gap-3 sm:grid-cols-2">
                                                                                <Button
                                                                                        onClick={handleAddToCart}
                                                                                        disabled={
                                                                                                isLoading ||
                                                                                                calculatedPrice === null ||
                                                                                                isPriceLoading ||
                                                                                                isMrpMissingForSelection
                                                                                        }
                                                                                        className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-lg font-semibold text-white shadow-lg transition hover:from-slate-800 hover:to-slate-600"
                                                                                >
                                                                                        <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                                                        Add to Cart
                                                                                </Button>
                                                                                <Button
                                                                                        onClick={handleBuyNow}
                                                                                        disabled={
                                                                                                calculatedPrice === null ||
                                                                                                isPriceLoading ||
                                                                                                isMrpMissingForSelection
                                                                                        }
                                                                                        className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-lg font-semibold text-white shadow-lg transition hover:from-emerald-600 hover:to-emerald-700"
                                                                                >
                                                                                        Buy Now
                                                                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                                                </Button>
                                                                                <Button
                                                                                        variant="outline"
                                                                                        onClick={handleAddToWishlist}
                                                                                        disabled={
                                                                                                calculatedPrice === null ||
                                                                                                isPriceLoading ||
                                                                                                isMrpMissingForSelection
                                                                                        }
                                                                                        className="flex h-14 items-center justify-center gap-2 rounded-2xl border-slate-200 bg-white/80 text-slate-700 transition hover:border-slate-300 hover:bg-white"
                                                                                >
                                                                                        <Heart className="h-5 w-5" />
                                                                                        Wishlist
                                                                                </Button>
                                                                                <Button
                                                                                        variant="outline"
                                                                                        className="flex h-14 items-center justify-center gap-2 rounded-2xl border-slate-200 bg-white/80 text-slate-700 transition hover:border-slate-300 hover:bg-white"
                                                                                >
                                                                                        <Share2 className="h-5 w-5" />
                                                                                        Share
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                        </CardContent>
                                                </Card>
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

				{/* Reviews & Ratings Section */}
				<motion.div
					className="mb-10"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
				>
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold">Reviews & Ratings</h2>
								<Button className="bg-black text-white hover:bg-gray-800">
									WRITE A REVIEW
								</Button>
							</div>

							<p className="text-gray-600 mb-6">
								{product.name} - Customer Reviews and Ratings
							</p>

							{/* Rating Summary */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
								<div className="text-center">
									<div className="flex items-center justify-center space-x-2 mb-2">
                                                                                <span className="text-4xl font-bold text-green-600">
                                                                                        {averageRating.toFixed(1)}
                                                                                </span>
										<Star className="w-8 h-8 fill-green-600 text-green-600" />
									</div>
									<p className="text-gray-600">
                                                                                Average Rating based on {reviews.length} ratings and {reviews.length} reviews
									</p>
								</div>

								<div className="space-y-2">
									{[5, 4, 3, 2, 1].map((stars) => (
										<div key={stars} className="flex items-center space-x-3">
											<span className="w-4 text-sm">{stars}</span>
											<div className="flex-1 bg-gray-200 rounded-full h-2">
												<div
													className="bg-green-600 h-2 rounded-full"
													style={{
														width:
															stars === 5 ? "58%" : stars === 4 ? "41%" : "0%",
													}}
												></div>
											</div>
											<span className="text-sm text-gray-600 w-12">
												{stars === 5 ? "58%" : stars === 4 ? "41%" : "0%"}
											</span>
										</div>
									))}
								</div>
							</div>

                                                        {/* Review Form */}
                                                        <form onSubmit={handleSubmitReview} className="mb-8">
                                                                <div className="flex items-center space-x-2 mb-4">
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                                <Star
                                                                                        key={star}
                                                                                        className={`w-6 h-6 cursor-pointer ${
                                                                                                star <= newRating
                                                                                                        ? "text-yellow-400 fill-yellow-400"
                                                                                                        : "text-gray-300"
                                                                                        }`}
                                                                                        onClick={() => setNewRating(star)}
                                                                                />
                                                                        ))}
                                                                </div>
                                                                <textarea
                                                                        className="w-full border rounded p-2 mb-4"
                                                                        rows={3}
                                                                        value={newComment}
                                                                        onChange={(e) => setNewComment(e.target.value)}
                                                                        placeholder="Share your thoughts about the product"
                                                                />
                                                                <Button type="submit" disabled={submittingReview}>
                                                                        {submittingReview
                                                                                ? "Submitting..."
                                                                                : "Submit Review"}
                                                                </Button>
                                                        </form>

                                                        {/* Individual Reviews */}
                                                        <div className="space-y-6">
                                                                {reviews.map((review) => (
                                                                        <div
                                                                                key={review.id || review._id}
                                                                                className="border-b border-gray-200 pb-6 last:border-b-0"
                                                                        >
                                                                                <div className="flex items-start space-x-4">
                                                                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                                                                <User className="w-5 h-5 text-gray-600" />
                                                                                        </div>
                                                                                        <div className="flex-1">
                                                                                                <div className="flex items-center space-x-2 mb-2">
                                                                                                        <h4 className="font-semibold">
                                                                                                                {review.user
                                                                                                                        ? `${review.user.firstName} ${review.user.lastName}`
                                                                                                                        : "User"}
                                                                                                        </h4>
                                                                                                </div>
                                                                                                <div className="flex items-center space-x-1 mb-3">
                                                                                                        {renderStars(review.rating)}
                                                                                                </div>
                                                                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                                                                        {review.comment}
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </CardContent>
                                        </Card>
				</motion.div>

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
