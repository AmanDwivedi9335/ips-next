"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminLayoutStore } from "@/store/adminLayoutStore.js";
import { useAdminSizeStore } from "@/store/adminSizeStore.js";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function LayoutsPage() {
        const {
                layouts,
                fetchLayouts,
                addLayout,
                updateLayout,
                deleteLayout,
        } = useAdminLayoutStore();
        const { sizes, fetchSizes } = useAdminSizeStore();
        const [form, setForm] = useState({ name: "", aspectRatio: "", sizes: [] });

        useEffect(() => {
                fetchLayouts();
        }, [fetchLayouts]);

        useEffect(() => {
                fetchSizes();
        }, [fetchSizes]);

        const handleAdd = async () => {
                if (!form.name.trim() || !form.aspectRatio.trim()) return;
                const success = await addLayout(form);
                if (success) setForm({ name: "", aspectRatio: "", sizes: [] });
        };

        const toggleFormSize = (sizeName) => {
                setForm((prev) => {
                        const hasSize = prev.sizes.includes(sizeName);
                        const nextSizes = hasSize
                                ? prev.sizes.filter((size) => size !== sizeName)
                                : [...prev.sizes, sizeName];

                        return { ...prev, sizes: nextSizes };
                });
        };

        const toggleLayoutSize = (layoutId, currentSizes = [], sizeName) => {
                const hasSize = currentSizes.includes(sizeName);
                const nextSizes = hasSize
                        ? currentSizes.filter((size) => size !== sizeName)
                        : [...currentSizes, sizeName];
                updateLayout(layoutId, { sizes: nextSizes });
        };

        return (
                <div className="space-y-4">
                        <Card>
                                <CardHeader>
                                        <h1 className="text-2xl font-bold">Layouts</h1>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                                <Input
                                                        placeholder="Layout name"
                                                        value={form.name}
                                                        onChange={(e) =>
                                                                setForm((f) => ({
                                                                        ...f,
                                                                        name: e.target.value,
                                                                }))
                                                        }
                                                />
                                                <Input
                                                        placeholder="Aspect ratio e.g. 1:1"
                                                        value={form.aspectRatio}
                                                        onChange={(e) =>
                                                                setForm((f) => ({
                                                                        ...f,
                                                                        aspectRatio: e.target.value,
                                                                }))
                                                        }
                                                />
                                                <Button onClick={handleAdd}>Add</Button>
                                        </div>
                                        {sizes.length > 0 && (
                                                <div className="flex flex-wrap gap-4">
                                                        {sizes.map((size) => {
                                                                const id = `new-layout-size-${size._id}`;
                                                                const isChecked = form.sizes.includes(size.name);
                                                                return (
                                                                        <div
                                                                                key={size._id}
                                                                                className="flex items-center gap-2"
                                                                        >
                                                                                <Checkbox
                                                                                        id={id}
                                                                                        checked={isChecked}
                                                                                        onCheckedChange={() =>
                                                                                                toggleFormSize(
                                                                                                        size.name,
                                                                                                )
                                                                                        }
                                                                                />
                                                                                <Label htmlFor={id}>{size.name}</Label>
                                                                        </div>
                                                                );
                                                        })}
                                                </div>
                                        )}
                                        <ul className="space-y-4">
                                                {layouts.map((lay) => (
                                                        <li key={lay._id} className="space-y-3">
                                                                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                                                        <Input
                                                                                value={lay.name}
                                                                                onChange={(e) =>
                                                                                        updateLayout(lay._id, {
                                                                                                name: e.target.value,
                                                                                        })
                                                                                }
                                                                        />
                                                                        <Input
                                                                                value={lay.aspectRatio}
                                                                                onChange={(e) =>
                                                                                        updateLayout(lay._id, {
                                                                                                aspectRatio:
                                                                                                        e.target.value,
                                                                                        })
                                                                                }
                                                                        />
                                                                        <Button
                                                                                variant="destructive"
                                                                                onClick={() => deleteLayout(lay._id)}
                                                                        >
                                                                                Delete
                                                                        </Button>
                                                                </div>
                                                                {sizes.length > 0 && (
                                                                        <div className="flex flex-wrap gap-4">
                                                                                {sizes.map((size) => {
                                                                                        const id = `${lay._id}-size-${size._id}`;
                                                                                        const layoutSizes = lay.sizes || [];
                                                                                        const isChecked = layoutSizes.includes(size.name);
                                                                                        return (
                                                                                                <div
                                                                                                        key={size._id}
                                                                                                        className="flex items-center gap-2"
                                                                                                >
                                                                                                        <Checkbox
                                                                                                                id={id}
                                                                                                                checked={isChecked}
                                                                                                                onCheckedChange={() =>
                                                                                                                        toggleLayoutSize(
                                                                                                                                lay._id,
                                                                                                                                layoutSizes,
                                                                                                                                size.name,
                                                                                                                        )
                                                                                                                }
                                                                                                        />
                                                                                                        <Label htmlFor={id}>
                                                                                                                {size.name}
                                                                                                        </Label>
                                                                                                </div>
                                                                                        );
                                                                                })}
                                                                        </div>
                                                                )}
                                                        </li>
                                                ))}
                                        </ul>
                                </CardContent>
                        </Card>
                </div>
        );
}
