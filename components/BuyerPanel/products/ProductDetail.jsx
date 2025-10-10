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
        Receipt,
        Lock,
        AlertCircle,
        Home,
        ChevronRight,
        CheckCircle2,
        Sparkles,
        Truck,
        ShieldCheck,
        Headphones,
        Gift,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCheckoutStore } from "@/store/checkoutStore.js";
import ProductCard from "@/components/BuyerPanel/products/ProductCard.jsx";
import ParentCategoriesScroll from "@/components/BuyerPanel/products/ParentCategoriesScroll.jsx";
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

        const quickHighlights = [
                {
                        icon: Sparkles,
                        label: "Premium print finish",
                },
                {
                        icon: Truck,
                        label: "Fast pan-India delivery",
                },
                {
                        icon: CheckCircle2,
                        label: "Quality checked materials",
                },
        ];

        const storeBenefits = [
                {
                        icon: Receipt,
                        title: "GST Invoice Available",
                        description: "Official billing for easy reimbursement and records.",
                },
                {
                        icon: Lock,
                        title: "Secure Payments",
                        description: "Encrypted checkout that keeps your data protected.",
                },
                {
                        icon: Headphones,
                        title: "Priority Support",
                        description: "Expert assistance 7 days a week for every order.",
                },
                {
                        icon: Truck,
                        title: "Express Shipping",
                        description: "Reliable doorstep delivery across India with tracking.",
                },
                {
                        icon: ShieldCheck,
                        title: "Quality Assurance",
                        description: "Each item undergoes strict multi-step quality checks.",
                },
                {
                        icon: Gift,
                        title: "Member Rewards",
                        description: "Exclusive offers and loyalty perks for repeat buyers.",
                },
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
        const heroDescription =
                product.shortDescription ||
                product.tagline ||
                product.metaDescription ||
                product.description;

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
                <div className="relative min-h-screen bg-slate-100">
                        <div
                                className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-white via-slate-100/80 to-transparent"
                                aria-hidden="true"
                        />
                        <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-2 lg:py-7">
                                <nav
                                        aria-label="Breadcrumb"
                                        className="flex items-center gap-2 text-sm text-slate-500"
                                >
                                        <Link
                                                href="/"
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                                        >
                                                <Home className="h-4 w-4" />
                                                Home
                                        </Link>
                                        {categoryName && (
                                                <>
                                                        <ChevronRight
                                                                className="h-3.5 w-3.5 text-slate-300"
                                                                aria-hidden="true"
                                                        />
                                                        <Link
                                                                href={`/products?category=${product.category}`}
                                                                className="rounded-full border border-transparent px-3 py-1.5 text-slate-600 transition hover:text-slate-900"
                                                        >
                                                                {categoryName}
                                                        </Link>
                                                </>
                                        )}
                                        {product.subcategory && (
                                                <>
                                                        <ChevronRight
                                                                className="h-3.5 w-3.5 text-slate-300"
                                                                aria-hidden="true"
                                                        />
                                                        <span className="rounded-full bg-white/70 px-3 py-1.5 text-slate-500 shadow-sm">
                                                                {subcategoryName}
                                                        </span>
                                                </>
                                        )}
                                </nav>

                                {/* <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
                                        <div className="max-w-3xl space-y-3">
                                                <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                                                        {product.title}
                                                </h1>
                                                {heroDescription && (
                                                        <p className="text-base leading-relaxed text-slate-600">
                                                                {heroDescription}
                                                        </p>
                                                )}
                                                <div className="flex flex-wrap gap-2">
                                                        {product.productFamily && (
                                                                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 shadow-sm">
                                                                        {product.productFamily}
                                                                </Badge>
                                                        )}
                                                        {categoryName && (
                                                                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 shadow-sm">
                                                                        {categoryName}
                                                                </Badge>
                                                        )}
                                                        {product.subcategory && (
                                                                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 shadow-sm">
                                                                        {subcategoryName}
                                                                </Badge>
                                                        )}
                                                </div>
                                        </div>
                                </div> */}

                                <div className="mt-5 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
                                        <Card className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 shadow-xl backdrop-blur">
                                                {/* <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                                                                <Link
                                                                        href="/products"
                                                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                                                                >
                                                                        <ArrowLeft className="h-4 w-4" />
                                                                        Back to products
                                                                </Link>
                                                                 {productCode && (
                                                                        <Badge className="rounded-full border border-slate-200 bg-slate-900/90 px-4 py-1 text-white shadow-sm">
                                                                                {productCode}
                                                                        </Badge>
                                                                )}
                                                </div> */}
                                                <div className="relative w-full h-[550px] lg:h-[500px]">
                                                        <Image
                                                        src={
                                                        languageImage ||
                                                        product.images?.[selectedImage] ||
                                                        product.image ||
                                                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                        }
                                                        alt={product.name}
                                                        fill
                                                        className="object-contain m-0 p-0"
                                                        priority
                                                        />
                                                </div>
                                                <p className="mt-2 mb-2 text-xs text-center text-slate-500">
                                                        ** Images shown are of low resolution due to privacy concerns, actual product will be clear, sharp and high quality.
                                                </p>
                                                {product.specialNote && (
                                                                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-800">
                                                                        <div className="flex items-start gap-3">
                                                                                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                                                                                <p className="leading-relaxed">{product.specialNote}</p>
                                                                        </div>
                                                                </div>
                                                )}

                                                {/* <CardContent className="p-6 sm:p-8">
                                                        

                                                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-white">
                                                                
                                                        </div>

                                                        

                                                        {product.images && product.images.length > 1 && (
                                                                <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                                                                        {product.images.map((image, index) => (
                                                                                <button
                                                                                        key={index}
                                                                                        onClick={() => setSelectedImage(index)}
                                                                                        className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                                                                                                selectedImage === index
                                                                                                        ? "border-slate-900 shadow-md"
                                                                                                        : "border-slate-200 hover:border-slate-400"
                                                                                        }`}
                                                                                >
                                                                                        <Image
                                                                                                src={
                                                                                                        image ||
                                                                                                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                                                                }
                                                                                                alt={`${product.name} view ${index + 1}`}
                                                                                                fill
                                                                                                className="object-cover"
                                                                                        />
                                                                                </button>
                                                                        ))}
                                                                </div>
                                                        )}
                                                </CardContent> */}
                                        </Card>

                                        <div className="space-y-6">
                                                <Card className="rounded-3xl border border-white/60 bg-white shadow-xl">
                                                        <CardContent className="space-y-6 p-3 sm:p-8">
                                                                <div className="space-y-3">
                                                                        <div className="max-w-3xl space-y-3">
                                                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                                                        {product.title}
                                                </h1>
                                                {heroDescription && (
                                                        <p className="text-base leading-relaxed text-slate-600">
                                                                {heroDescription}
                                                        </p>
                                                )}
                                                <div className="flex flex-wrap gap-2">
                                                        {product.productFamily && (
                                                                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 shadow-sm">
                                                                        {product.productFamily}
                                                                </Badge>
                                                        )}
                                                        {categoryName && (
                                                                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 shadow-sm">
                                                                        {categoryName}
                                                                </Badge>
                                                        )}
                                                        {product.subcategory && (
                                                                <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 shadow-sm">
                                                                        {subcategoryName}
                                                                </Badge>
                                                        )}
                                                </div>
                                        </div>
                                                                        {displayPrice !== null ? (
                                                                                <>
                                                                                        <div className="flex flex-wrap items-end gap-3">
                                                                                                <p className="text-3xl font-semibold text-slate-900">
                                                                                                        ₹ {displayPrice.toLocaleString()}
                                                                                                </p>
                                                                                                {showOriginalPrice && (
                                                                                                        <p className="text-base text-slate-400 line-through">
                                                                                                                ₹ {effectiveMrp.toLocaleString()}
                                                                                                        </p>
                                                                                                )}
                                                                                                {showDiscountBadge && (
                                                                                                        <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                                                                                                                {discountToShow}% OFF
                                                                                                        </Badge>
                                                                                                )}
                                                                                        </div>
                                                                                        {numericCalculatedPrice !== null ? (
                                                                                                <p className="text-sm text-slate-500">
                                                                                                        Price based on selected options
                                                                                                </p>
                                                                                        ) : showDiscountBadge ? (
                                                                                                <p className="text-sm font-medium text-emerald-600">
                                                                                                        Sale price after discount
                                                                                                </p>
                                                                                        ) : null}
                                                                                </>
                                                                        ) : isLoadingPriceWithoutValue ? (
                                                                                <p className="text-sm text-slate-500">
                                                                                        Fetching latest price...
                                                                                </p>
                                                                        ) : shouldShowUnavailableMessage ? (
                                                                                <p className="text-sm font-medium text-amber-600">
                                                                                        Currently unavailable for the selected configuration. Please try a different combination.
                                                                                </p>
                                                                        ) : null}
                                                                </div>

                                                                <div className="space-y-5">
                                                                        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-800">
                                                                                Customise your selection
                                                                        </h3>
                                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                                                {languages.length > 0 && (
                                                                                        <div className="space-y-2">
                                                                                                <span className="text-sm font-medium text-slate-700">
                                                                                                        Language
                                                                                                </span>
                                                                                                <Select
                                                                                                        value={selectedLanguage}
                                                                                                        onValueChange={setSelectedLanguage}
                                                                                                >
                                                                                                        <SelectTrigger className="w-full border border-slate-200 bg-white focus:ring-slate-300">
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
                                                                                {isLayoutSelectionEnabled &&
                                                                                        availableLayouts &&
                                                                                        availableLayouts.length > 0 && (
                                                                                                <div className="space-y-2">
                                                                                                        <span className="text-sm font-medium text-slate-700">
                                                                                                                Layout
                                                                                                        </span>
                                                                                                        <Select
                                                                                                                value={selectedLayout}
                                                                                                                onValueChange={setSelectedLayout}
                                                                                                        >
                                                                                                                <SelectTrigger className="w-full border border-slate-200 bg-white focus:ring-slate-300">
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
                                                                                        <div className="space-y-2">
                                                                                                <span className="text-sm font-medium text-slate-700">
                                                                                                        Size
                                                                                                </span>
                                                                                                <Select
                                                                                                        value={selectedSize}
                                                                                                        onValueChange={setSelectedSize}
                                                                                                >
                                                                                                        <SelectTrigger className="w-full border border-slate-200 bg-white focus:ring-slate-300">
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
                                                                                        <div className="space-y-2">
                                                                                                <span className="text-sm font-medium text-slate-700">
                                                                                                        Material
                                                                                                </span>
                                                                                                <Select
                                                                                                        value={selectedMaterial}
                                                                                                        onValueChange={setSelectedMaterial}
                                                                                                >
                                                                                                        <SelectTrigger className="w-full border border-slate-200 bg-white focus:ring-slate-300">
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
                                                                                {hasQrOption && (
                                                                                        <div className="space-y-2">
                                                                                                <span className="text-sm font-medium text-slate-700">
                                                                                                        QR Code
                                                                                                </span>
                                                                                                <Select
                                                                                                        value={hasQr ? "yes" : "no"}
                                                                                                        onValueChange={(v) => setHasQr(v === "yes")}
                                                                                                >
                                                                                                        <SelectTrigger className="w-full border border-slate-200 bg-white focus:ring-slate-300">
                                                                                                                <SelectValue placeholder="QR Code" />
                                                                                                        </SelectTrigger>
                                                                                                        <SelectContent>
                                                                                                                <SelectItem value="yes">With QR Code</SelectItem>
                                                                                                                <SelectItem value="no">Without QR Code</SelectItem>
                                                                                                        </SelectContent>
                                                                                                </Select>
                                                                                        </div>
                                                                                )}
                                                                        </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                        <div className="space-y-2">
                                                                                <span className="text-sm font-medium text-slate-700">
                                                                                        Quantity
                                                                                </span>
                                                                                <div className="flex flex-wrap items-center gap-4">
                                                                                        <div className="flex items-center rounded-full border border-slate-200 bg-white shadow-sm">
                                                                                                <Button
                                                                                                        variant="ghost"
                                                                                                        size="icon"
                                                                                                        onClick={() => handleQuantityChange(-1)}
                                                                                                        disabled={quantity <= 1}
                                                                                                        className="rounded-full text-slate-700 hover:text-slate-900"
                                                                                                >
                                                                                                        <Minus className="h-4 w-4" />
                                                                                                </Button>
                                                                                                <span className="px-4 py-2 font-medium text-slate-900">
                                                                                                        {quantity}
                                                                                                </span>
                                                                                                <Button
                                                                                                        variant="ghost"
                                                                                                        size="icon"
                                                                                                        onClick={() => handleQuantityChange(1)}
                                                                                                        className="rounded-full text-slate-700 hover:text-slate-900"
                                                                                                >
                                                                                                        <Plus className="h-4 w-4" />
                                                                                                </Button>
                                                                                        </div>
                                                                                        <p className="text-xs text-slate-500">
                                                                                                Need more? Bulk discounts available on request.
                                                                                        </p>
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
                                                                                        className="w-full bg-slate-900 text-white transition hover:bg-slate-800"
                                                                                        size="lg"
                                                                                >
                                                                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                                                                        Add to Cart
                                                                                </Button>
                                                                                <Button
                                                                                        onClick={handleBuyNow}
                                                                                        disabled={
                                                                                                calculatedPrice === null ||
                                                                                                isPriceLoading ||
                                                                                                isMrpMissingForSelection
                                                                                        }
                                                                                        className="w-full bg-emerald-600 text-white transition hover:bg-emerald-700"
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
                                                                                        className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                                                                                >
                                                                                        <Heart className="mr-2 h-5 w-5" />
                                                                                        Wishlist
                                                                                </Button>
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="lg"
                                                                                        className="w-full border-slate-200 text-slate-700 hover:bg-slate-50"
                                                                                >
                                                                                        <Share2 className="mr-2 h-5 w-5" />
                                                                                        Share
                                                                                </Button>
                                                                        </div>

                                                                        <div className="grid gap-3 sm:grid-cols-3">
                                                                                {quickHighlights.map(({ icon: Icon, label }) => (
                                                                                        <div key={label}
                                                                                                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600"
                                                                                                >
                                                                                                <Icon className="h-4 w-4 text-slate-500" />
                                                                                                <span>{label}</span>
                                                                                        </div>
                                                                                ))}
                                                                        </div>

                                                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                                                                Looking for bulk pricing or customisation?{" "}
                                                                                <Link
                                                                                        href="/corporate-bulk-orders"
                                                                                        className="font-semibold text-slate-900 underline-offset-4 hover:underline"
                                                                                >
                                                                                        Let's talk
                                                                                </Link>
                                                                                .
                                                                        </div>
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        </div>
                                </div>
                                {(product.materialSpecification ||
                                        product.description ||
                                        product.longDescription) && (
                                        <div className="mb-12 mt-12 grid gap-6">
                                                {product.materialSpecification && (
                                                        <Card className="rounded-3xl border border-white/60 bg-white shadow-sm">
                                                                <CardContent className="space-y-3 p-6 sm:p-8">
                                                                        <h2 className="text-2xl font-semibold text-slate-900">
                                                                                Material Specification
                                                                        </h2>
                                                                        <p className="whitespace-pre-line text-slate-600">
                                                                                {product.materialSpecification}
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                )}
                                                {product.description && (
                                                        <Card className="rounded-3xl border border-white/60 bg-white shadow-sm">
                                                                <CardContent className="space-y-3 p-6 sm:p-8">
                                                                        <h2 className="text-2xl font-semibold text-slate-900">
                                                                                Product Short Description
                                                                        </h2>
                                                                        <p className="whitespace-pre-line text-slate-600">
                                                                                {product.description}
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                )}
                                                {product.longDescription && (
                                                        <Card className="rounded-3xl border border-white/60 bg-white shadow-sm">
                                                                <CardContent className="space-y-3 p-6 sm:p-8">
                                                                        <h2 className="text-2xl font-semibold text-slate-900">
                                                                                Description
                                                                        </h2>
                                                                        <p className="whitespace-pre-line text-slate-600">
                                                                                {product.longDescription}
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                )}
                                        </div>
                                )}

                                {/* Product Features */}
                                {product.features && product.features.length > 0 && (
                                        <motion.div
                                                className="mb-12"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.5 }}
                                        >
                                                <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-sm sm:p-8">
                                                        <h2 className="mb-8 text-2xl font-semibold text-slate-900">
                                                                Product Features
                                                        </h2>
                                                        <div className="grid gap-6 md:grid-cols-2">
                                                                {product.features.map((feature, index) => (
                                                                        <div
                                                                                key={index}
                                                                                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6"
                                                                        >
                                                                                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                                                                        {feature.title}
                                                                                </h3>
                                                                                <p className="text-slate-600">{feature.description}</p>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                        {product.longDescription && (
                                                                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                                                                        <h2 className="mb-3 text-xl font-semibold text-slate-900">
                                                                                Product Description
                                                                        </h2>
                                                                        <p className="leading-relaxed text-slate-600">
                                                                                {product.longDescription}
                                                                        </p>
                                                                </div>
                                                        )}
                                                </div>
                                        </motion.div>
                                )}

				{/* Related Products */}
                                {relatedProducts.length > 0 && (
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.7 }}
                                                className="mb-12"
                                        >
                                                <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-sm sm:p-8">
                                                        <h2 className="mb-8 text-2xl font-semibold text-slate-900">Related Products</h2>
                                                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                                {relatedProducts.map((relatedProduct) => (
                                                                        <ProductCard key={relatedProduct.id} product={relatedProduct} />
                                                                ))}
                                                        </div>
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
                                        <div className="grid gap-8">
                                                <Card className="rounded-3xl border border-white/60 bg-white shadow-sm">
                                                        <CardContent className="space-y-6 p-6 sm:p-8">
                                                                <div className="flex items-center justify-between gap-4">
                                                                        <h2 className="text-xl font-semibold text-slate-900">
                                                                                Store Benefits
                                                                        </h2>
                                                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                                                                Why shop with us
                                                                        </span>
                                                                </div>
                                                                <div className="grid gap-4 sm:grid-cols-2">
                                                                        {storeBenefits.map((benefit) => {
                                                                                const Icon = benefit.icon;

                                                                                return (
                                                                                        <div
                                                                                                key={benefit.title}
                                                                                                className="group flex items-start gap-4 rounded-2xl border border-emerald-100/80 bg-emerald-50/60 p-4 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                                                                                        >
                                                                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-inner">
                                                                                                        <Icon className="h-5 w-5" />
                                                                                                </div>
                                                                                                <div className="space-y-1">
                                                                                                        <p className="text-sm font-semibold text-emerald-900">
                                                                                                                {benefit.title}
                                                                                                        </p>
                                                                                                        <p className="text-sm leading-snug text-slate-600">
                                                                                                                {benefit.description}
                                                                                                        </p>
                                                                                                </div>
                                                                                        </div>
                                                                                );
                                                                        })}
                                                                </div>
                                                        </CardContent>
                                                </Card>
                                        </div>
                                </motion.div>

                                <ParentCategoriesScroll />
                        </div>
                </div>
        );
}
