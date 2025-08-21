"use client";

import { useState } from "react";
import { useBannerStore } from "@/store/bannerStore.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BannerSettings() {
        const { banners, addBanner, updateBanner, removeBanner } = useBannerStore();
        const [newBanner, setNewBanner] = useState({ image: null, link: "" });

        const handleAdd = () => {
                if (!newBanner.image) return;
                addBanner({ image: newBanner.image, link: newBanner.link });
                setNewBanner({ image: null, link: "" });
        };

        const handleNewImage = (file) => {
                if (file) {
                        const url = URL.createObjectURL(file);
                        setNewBanner((prev) => ({ ...prev, image: url }));
                }
        };

        const handleImageChange = (id, file) => {
                if (file) {
                        const url = URL.createObjectURL(file);
                        updateBanner(id, { image: url });
                }
        };

        return (
                <Card>
                        <CardHeader>
                                <CardTitle>Home Banners</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                                {banners.map((banner) => (
                                        <div key={banner.id} className="flex items-center gap-4">
                                                <img
                                                        src={banner.image}
                                                        alt="banner"
                                                        className="w-32 h-16 object-cover rounded"
                                                />
                                                <Input
                                                        value={banner.link}
                                                        onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                                                        placeholder="Banner Link"
                                                />
                                                <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                                handleImageChange(banner.id, e.target.files?.[0])
                                                        }
                                                />
                                                <Button
                                                        variant="destructive"
                                                        onClick={() => removeBanner(banner.id)}
                                                >
                                                        Delete
                                                </Button>
                                        </div>
                                ))}

                                <div className="pt-4 border-t space-y-2">
                                        {newBanner.image && (
                                                <img
                                                        src={newBanner.image}
                                                        alt="new banner preview"
                                                        className="w-32 h-16 object-cover rounded"
                                                />
                                        )}
                                        <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleNewImage(e.target.files?.[0])}
                                        />
                                        <Input
                                                placeholder="Banner Link"
                                                value={newBanner.link}
                                                onChange={(e) =>
                                                        setNewBanner((prev) => ({ ...prev, link: e.target.value }))
                                                }
                                        />
                                        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
                                                Add Banner
                                        </Button>
                                </div>
                        </CardContent>
                </Card>
        );
}
