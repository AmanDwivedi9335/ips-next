"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";

export default function WishlistItem({ item }) {
        const { removeItem } = useWishlistStore();
        const { addItem, isLoading } = useCartStore();

        const handleRemove = () => {
                removeItem(item.id);
        };

        const handleAddToCart = async () => {
                await addItem(item);
                removeItem(item.id);
                toast.success("Moved to cart");
        };

        return (
                <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                >
                        <Card className="overflow-hidden">
                                <CardContent className="p-6">
                                        <div className="flex gap-4">
                                                <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image
                                                                src={
                                                                        item.image ||
                                                                        "https://res.cloudinary.com/drjt9guif/image/upload/v1755524911/ipsfallback_alsvmv.png"
                                                                }
                                                                alt={item.name}
                                                                fill
                                                                className="object-contain p-2"
                                                        />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-2">
                                                                <div className="flex-1 min-w-0 pr-4">
                                                                        <h3 className="font-semibold text-lg line-clamp-2 mb-1">{item.name}</h3>
                                                                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
                                                                        <div className="flex items-center gap-2">
                                                                                <p className="text-xl font-bold">
                                                                                        ₹{item.price?.toLocaleString()}
                                                                                </p>
                                                                                {item.originalPrice &&
                                                                                item.originalPrice > item.price && (
                                                                                        <p className="text-sm text-gray-500 line-through">
                                                                                                ₹{item.originalPrice.toLocaleString()}
                                                                                        </p>
                                                                                )}
                                                                        </div>
                                                                </div>
                                                                <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-gray-400 hover:text-red-600 flex-shrink-0"
                                                                        onClick={handleRemove}
                                                                >
                                                                        <X className="h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                        <Button
                                                                onClick={handleAddToCart}
                                                                disabled={isLoading}
                                                                className="mt-4"
                                                        >
                                                                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                                                        </Button>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </motion.div>
        );
}
