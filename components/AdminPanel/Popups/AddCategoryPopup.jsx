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

export function AddCategoryPopup({ open, onOpenChange }) {
        const { addCategory, categories } = useAdminCategoryStore();
        const { productFamilies, fetchProductFamilies } =
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

                const success = await addCategory({
                        ...formData,
                        parent: formData.parent || null,
                });
		if (success) {
			onOpenChange(false);
			resetForm();
		}
		setIsSubmitting(false);
	};

	const resetForm = () => {
                setFormData({
                        name: "",
                        description: "",
                        icon: "",
                        published: true,
                        sortOrder: 0,
                        parent: "",
                        productFamily: "",
                });
        };

        useEffect(() => {

                fetchProductFamilies();
        }, [fetchProductFamilies]);


        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold">
							Add Category
						</DialogTitle>
						<DialogDescription className="text-gray-600">
							Add your category and necessary information from here
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4 mt-4">
						<div>
							<Label htmlFor="name">Category Name *</Label>
							<Input
								id="name"
								placeholder="Enter category name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className="mt-1"
								required
							/>
						</div>

						<div>
							<Label htmlFor="description">Description *</Label>
							<Textarea
								id="description"
								placeholder="Enter category description"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								className="mt-1"
								rows={3}
								required
							/>
						</div>

                                                <div>
                                                        <Label htmlFor="icon">Icon URL</Label>
                                                        <Input
								id="icon"
								placeholder="https://example.com/icon.png"
								value={formData.icon}
								onChange={(e) =>
									setFormData({ ...formData, icon: e.target.value })
								}
								className="mt-1"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Optional: URL to category icon image
							</p>
                                                </div>

                                                <div>

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
                                                                <SelectTrigger className="mt-1">
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

                                                <div>
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
                                                                                        Number.parseInt(
                                                                                                e.target.value
                                                                                        ) || 0,
                                                                        })
                                                                }
                                                                className="mt-1"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">
                                                                Lower numbers appear first
                                                        </p>
                                                </div>

                                                <div>
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
                                                                <SelectTrigger className="mt-1">
                                                                        <SelectValue placeholder="None" />
                                                                </SelectTrigger>
                                                               <SelectContent>
                                                                       <SelectItem value="none">
                                                                               None
                                                                       </SelectItem>
                                                                       {categories
                                                                               .filter((cat) => cat && cat._id)
                                                                               .map((cat) => (
                                                                                       <SelectItem
                                                                                               key={cat._id}
                                                                                               value={cat._id}
                                                                                       >
                                                                                               {cat.name}
                                                                                       </SelectItem>
                                                                               ))}
                                                               </SelectContent>
                                                      </Select>
                                               </div>

						<div className="flex items-center justify-between">
							<div>
								<Label>Publish Category</Label>
								<p className="text-sm text-gray-500">
									Make this category visible to customers
								</p>
							</div>
							<Switch
								checked={formData.published}
								onCheckedChange={(checked) =>
									setFormData({ ...formData, published: checked })
								}
							/>
						</div>

						<DialogFooter className="flex gap-3 mt-6">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="flex-1 bg-green-600 hover:bg-green-700"
							>
								{isSubmitting ? "Adding..." : "Add Category"}
							</Button>
						</DialogFooter>
					</form>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
