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
import { useAdminProductTypeStore } from "@/store/adminProductTypeStore.js";

export function UpdateProductTypePopup({ open, onOpenChange, productType }) {
  const { updateProductType } = useAdminProductTypeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (productType) {
      setFormData({
        name: productType.name || "",
        description: productType.description || "",
      });
    }
  }, [productType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productType) return;
    setIsSubmitting(true);
    const success = await updateProductType(productType._id, formData);
    if (success) {
      onOpenChange(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Update Product Type</DialogTitle>
            <DialogDescription className="text-gray-600">
              Modify details for this product type
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter product type name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <DialogFooter className="flex gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
