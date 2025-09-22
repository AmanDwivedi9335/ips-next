"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import { useAdminCategoryStore } from "@/store/adminCategoryStore.js";
import { useAdminProductFamilyStore } from "@/store/adminProductFamilyStore.js";
import { ImageUpload } from "@/components/AdminPanel/ImageUpload.jsx";

export function UpdateCategoryPopup({ open, onOpenChange, category }) {
        const { updateCategory, categories } = useAdminCategoryStore();
        const { productFamilies = [], fetchProductFamilies } =
                useAdminProductFamilyStore();

        const [isSubmitting, setIsSubmitting] = useState(false);

        const [formData, setFormData] = useState({
                name: "",
                description: "",
                icon: "",
                published: true,
                sortOrder: 0,
                parent: "",
                productFamily: "",
        });

        useEffect(() => {
                fetchProductFamilies();
        }, [fetchProductFamilies]);

        useEffect(() => {
                if (open && category) {
                        setFormData({
                                name: category.name || "",
                                description: category.description || "",
                                icon: category.icon || "",
                                published:
                                        category.published !== undefined
                                                ? category.published
                                                : true,
                                sortOrder: category.sortOrder || 0,
                                parent: category.parent ? category.parent.toString() : "",
                                productFamily: category.productFamily?.toString() || "",
                        });
                }
        }, [open, category]);

        const handleSubmit = async (e) => {
                e.preventDefault();
                if (!category) return;

                setIsSubmitting(true);

                const success = await updateCategory(category._id, {
                        ...formData,
                        parent: formData.parent || null,
                });
                if (success) {
                        onOpenChange(false);
                }
                setIsSubmitting(false);
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent className="w-[95vw] max-w-3xl overflow-hidden p-0">
                                <motion.form
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        onSubmit={handleSubmit}
                                        className="flex max-h-[85vh] flex-col"
                                >
                                        <DialogHeader className="px-6 pt-6">
                                                <DialogTitle className="text-xl font-semibold">
                                                        Update Category
                                                </DialogTitle>
                                                <DialogDescription className="text-sm text-muted-foreground">
                                                        Update your category and necessary information from here.
                                                </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex-1 overflow-y-auto px-6 pb-6">
                                                <div className="space-y-8">
                                                        <section className="space-y-4">
                                                                <div>
                                                                        <h3 className="text-sm font-semibold text-foreground">
                                                                                Basic details
                                                                        </h3>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Give your category a clear name, description and image.
                                                                        </p>
                                                                </div>

                                                                <div className="grid gap-4 md:grid-cols-2">
                                                                        <div className="space-y-2 md:col-span-2">
                                                                                <Label htmlFor="name">Category Name *</Label>
                                                                                <Input
                                                                                        id="name"
                                                                                        placeholder="Enter category name"
                                                                                        value={formData.name}
                                                                                        onChange={(e) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        name: e.target.value,
                                                                                                })
                                                                                        }
                                                                                        required
                                                                                />
                                                                        </div>

                                                                        <div className="space-y-2 md:col-span-2">
                                                                                <Label htmlFor="description">Description *</Label>
                                                                                <Textarea
                                                                                        id="description"
                                                                                        placeholder="Describe this category"
                                                                                        value={formData.description}
                                                                                        onChange={(e) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        description: e.target.value,
                                                                                                })
                                                                                        }
                                                                                        rows={4}
                                                                                        required
                                                                                />
                                                                        </div>

                                                                        <div className="md:col-span-2">
                                                                                <ImageUpload
                                                                                        images={formData.icon ? [formData.icon] : []}
                                                                                        onImagesChange={(images) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        icon: images[0] || "",
                                                                                                })
                                                                                        }
                                                                                        maxImages={1}
                                                                                        label="Category Icon"
                                                                                        required={false}
                                                                                />
                                                                        </div>
                                                                </div>
                                                        </section>

                                                        <section className="space-y-4">
                                                                <div>
                                                                        <h3 className="text-sm font-semibold text-foreground">
                                                                                Organisation
                                                                        </h3>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Decide where this category lives in your catalogue.
                                                                        </p>
                                                                </div>

                                                                <div className="grid gap-4 md:grid-cols-2">
                                                                        <div className="space-y-2">
                                                                                <Label>Product Family *</Label>
                                                                                <Select
                                                                                        value={formData.productFamily}
                                                                                        onValueChange={(value) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        productFamily: value,
                                                                                                })
                                                                                        }
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Select product family" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {productFamilies.map((family) => (
                                                                                                        <SelectItem key={family._id} value={family._id}>
                                                                                                                {family.name}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                                <Label>Parent Category</Label>
                                                                                <Select
                                                                                        value={formData.parent}
                                                                                        onValueChange={(value) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        parent: value === "none" ? "" : value,
                                                                                                })
                                                                                        }
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="None" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="none">None</SelectItem>
                                                                                                {categories
                                                                                                        .filter((c) => c && c._id && c._id !== category?._id)
                                                                                                        .map((cat) => (
                                                                                                                <SelectItem key={cat._id} value={cat._id}>
                                                                                                                        {cat.name}
                                                                                                                </SelectItem>
                                                                                                        ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                                <Label htmlFor="sortOrder">Sort Order</Label>
                                                                                <Input
                                                                                        id="sortOrder"
                                                                                        type="number"
                                                                                        placeholder="0"
                                                                                        value={formData.sortOrder}
                                                                                        onChange={(e) =>
                                                                                                setFormData({
                                                                                                        ...formData,
                                                                                                        sortOrder:
                                                                                                                Number.parseInt(e.target.value) || 0,
                                                                                                })
                                                                                        }
                                                                                />
                                                                                <p className="text-xs text-muted-foreground">
                                                                                        Lower numbers appear first
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        </section>

                                                        <section className="space-y-4">
                                                                <div>
                                                                        <h3 className="text-sm font-semibold text-foreground">
                                                                                Visibility
                                                                        </h3>
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Control whether shoppers can see this category.
                                                                        </p>
                                                                </div>

                                                                <div className="flex items-start justify-between gap-4 rounded-xl border bg-muted/30 p-4">
                                                                        <div className="space-y-1">
                                                                                <Label>Publish Category</Label>
                                                                                <p className="text-sm text-muted-foreground">
                                                                                        Make this category visible to customers.
                                                                                </p>
                                                                        </div>
                                                                        <Switch
                                                                                checked={formData.published}
                                                                                onCheckedChange={(checked) =>
                                                                                        setFormData({
                                                                                                ...formData,
                                                                                                published: checked,
                                                                                        })
                                                                                }
                                                                        />
                                                                </div>
                                                        </section>
                                                </div>
                                        </div>

                                        <DialogFooter className="gap-3 border-t bg-muted/20 px-6 py-4 sm:space-x-3">
                                                <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => onOpenChange(false)}
                                                >
                                                        Cancel
                                                </Button>
                                                <Button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="bg-orange-500 hover:bg-orange-600"
                                                >
                                                        {isSubmitting ? "Updating..." : "Update Category"}
                                                </Button>
                                        </DialogFooter>
                                </motion.form>
                        </DialogContent>
                </Dialog>
        );
}
