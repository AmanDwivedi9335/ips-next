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
import { Switch } from "@/components/ui/switch";
import {
        ArrowLeft,
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
import ProductCard from "@/components/BuyerPanel/products/ProductCard.jsx";
import { toast } from "react-hot-toast";
import Image from "next/image";

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
        const [availableLayouts, setAvailableLayouts] = useState(
                product.layouts || [],
        );
        const [availableSizes, setAvailableSizes] = useState(
                product.sizes || [],
        );
        const [availableMaterials, setAvailableMaterials] = useState(
                product.materials || [],
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
        const [hasQr, setHasQr] = useState(false);
        const [hasQrOption, setHasQrOption] = useState(false);
        const [calculatedPrice, setCalculatedPrice] = useState(0);
        const router = useRouter();
        const { addItem, isLoading } = useCartStore();
        const { addItem: addWishlistItem } = useWishlistStore();

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
                                        setAvailableLayouts(Array.from(layoutSet));
                                        setAvailableSizes(Array.from(sizeSet));
                                        setAvailableMaterials(Array.from(materialSet));
                                        if (layoutSet.size > 0)
                                                setSelectedLayout(
                                                        Array.from(layoutSet)[0]
                                                );
                                        if (sizeSet.size > 0)
                                                setSelectedSize(
                                                        Array.from(sizeSet)[0]
                                                );
                                        if (materialSet.size > 0)
                                                setSelectedMaterial(
                                                        Array.from(materialSet)[0]
                                                );
                                }
                        } catch (e) {
                                // ignore
                        }
                };
                checkQrOption();
        }, [product]);

        useEffect(() => {
                const fetchPrice = async () => {
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
                                if (data.prices && data.prices.length > 0) {
                                        setCalculatedPrice(data.prices[0].price);
                                }
                        } catch (e) {
                                // ignore
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

                // Use the unified addItem function
                await addItem({
			id: product.id || product._id,
			name: product.title,
			description: product.description,
                        price: calculatedPrice,
                        originalPrice: calculatedPrice,
                        image:
                                languageImage ||
                                englishImage ||
                                product.images?.[0] ||
                                product.image,
                });
        };

        const handleAddToWishlist = (e) => {
                e.stopPropagation();

                addWishlistItem({
                        id: product.id || product._id,
                        name: product.title,
                        description: product.description,
                        price: calculatedPrice,
                        originalPrice: calculatedPrice,
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

                                                                        Product Code: {productCode}

                                                                </p>
                                                        )}

                                                        {/* Product rating */}
                                                        <div className="flex items-center mb-2">
                                                                <span className="flex items-center gap-2 bg-green-600 text-white px-2 py-1 rounded-lg">
                                                                        {averageRating.toFixed(1)}
                                                                        <Star className="w-4 h-4 fill-white text-white" />
                                                                </span>
								<span className="ml-2 text-gray-600 font-semibold">
									({reviews.length} Reviews)
								</span>
							</div>

                                        {/* Product price */}
                                        <p className="text-xl lg:text-2xl font-semibold text-black mb-2">
                                                ₹ {calculatedPrice.toLocaleString()} (Sale Price)
                                        </p>
                                        {hasQrOption && (
                                                <div className="mt-4 flex items-center space-x-2">
                                                        <Switch checked={hasQr} onCheckedChange={setHasQr} />
                                                        <span>QR Code</span>
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
                                                                        disabled={isLoading}
                                                                        className="flex-1 bg-black text-white hover:bg-gray-800"
                                                                        size="lg"
                                                                >
									<ShoppingCart className="h-5 w-5 mr-2" />
									Add to Cart
								</Button>
                                                                <Button
                                                                        onClick={handleBuyNow}
                                                                        className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                                                        size="lg"
                                                                >
									Buy Now
								</Button>
                                                                <Button
                                                                        variant="outline"
                                                                        size="lg"
                                                                        onClick={handleAddToWishlist}
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
