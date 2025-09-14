"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import WishlistItem from "./WishlistItem";

export default function WishlistPage() {
        const router = useRouter();
        const { items, clear } = useWishlistStore();

        const handleClear = () => {
                if (window.confirm("Are you sure you want to clear your wishlist?")) {
                        clear();
                }
        };

        const handleGoBack = () => {
                router.back();
        };

        return (
                <div className="min-h-screen bg-gray-50">
                        <div className="container mx-auto px-4 py-8">
                                <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                                <Button variant="outline" size="icon" onClick={handleGoBack}>
                                                        <ArrowLeft className="h-4 w-4" />
                                                </Button>
                                                <div>
                                                        <h1 className="text-3xl font-bold">Wishlist</h1>
                                                        <p className="text-gray-600">
                                                                {items.length === 0
                                                                        ? "Your wishlist is empty"
                                                                        : `${items.length} item${items.length > 1 ? "s" : ""} in your wishlist`}
                                                        </p>
                                                </div>
                                        </div>
                                        {items.length > 0 && (
                                                <Button
                                                        variant="outline"
                                                        onClick={handleClear}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                                >
                                                        <Trash2 className="h-4 w-4 mr-2" /> Clear Wishlist
                                                </Button>
                                        )}
                                </div>
                                {items.length === 0 ? (
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center py-16"
                                        >
                                                <Card className="max-w-md mx-auto">
                                                        <CardContent className="p-8">
                                                                <div className="text-gray-400 mb-6">
                                                                        <Heart className="h-24 w-24 mx-auto" />
                                                                </div>
                                                                <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
                                                                <p className="text-gray-600 mb-6">
                                                                        Looks like you haven't added any items to your wishlist yet.
                                                                </p>
                                                                <Button
                                                                        onClick={() => router.push("/products")}
                                                                        className="w-full bg-black text-white hover:bg-gray-800"
                                                                        size="lg"
                                                                >
                                                                        Start Shopping
                                                                </Button>
                                                        </CardContent>
                                                </Card>
                                        </motion.div>
                                ) : (
                                        <div className="space-y-4">
                                                <AnimatePresence mode="popLayout">
                                                        {items.map((item) => (
                                                                <WishlistItem key={item.id} item={item} />
                                                        ))}
                                                </AnimatePresence>
                                        </div>
                                )}
                        </div>
                </div>
        );
}
