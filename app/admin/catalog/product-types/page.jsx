"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useAdminProductTypeStore } from "@/store/adminProductTypeStore.js";
import { DeletePopup } from "@/components/AdminPanel/Popups/DeletePopup.jsx";
import { AddProductTypePopup } from "@/components/AdminPanel/Popups/AddProductTypePopup.jsx";
import { UpdateProductTypePopup } from "@/components/AdminPanel/Popups/UpdateProductTypePopup.jsx";

export default function AdminProductTypesPage() {
  const {
    productTypes,
    isLoading,
    error,
    fetchProductTypes,
    deleteProductType,
    deleteMultipleProductTypes,
  } = useAdminProductTypeStore();

  const [selected, setSelected] = useState([]);
  const [popups, setPopups] = useState({
    delete: { open: false, productType: null },
    add: false,
    update: { open: false, productType: null },
  });

  useEffect(() => {
    fetchProductTypes();
  }, [fetchProductTypes]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(productTypes.map((p) => p._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleDelete = (productType) => {
    setPopups((prev) => ({ ...prev, delete: { open: true, productType } }));
  };

  const confirmDelete = async () => {
    if (popups.delete.productType) {
      await deleteProductType(popups.delete.productType._id);
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length > 0) {
      await deleteMultipleProductTypes(selected);
      setSelected([]);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchProductTypes}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Product Types</h1>
          <p className="text-gray-600 mt-1">
            Manage different product types for independent catalogs
          </p>
        </motion.div>

        <div className="flex justify-between items-center">
          {selected.length > 0 ? (
            <Button variant="destructive" onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Selected ({selected.length})
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={() => setPopups((prev) => ({ ...prev, add: true }))}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product Type
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selected.length === productTypes.length && productTypes.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productTypes.map((type) => (
                <TableRow key={type._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(type._id)}
                      onCheckedChange={() => handleSelect(type._id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>{type.slug}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setPopups((prev) => ({ ...prev, update: { open: true, productType: type } }))
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(type)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && productTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No product types found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddProductTypePopup
        open={popups.add}
        onOpenChange={(open) => setPopups((prev) => ({ ...prev, add: open }))}
      />
      <UpdateProductTypePopup
        open={popups.update.open}
        onOpenChange={(open) => setPopups((prev) => ({ ...prev, update: { open, productType: null } }))}
        productType={popups.update.productType}
      />
      <DeletePopup
        open={popups.delete.open}
        onOpenChange={(open) => setPopups((prev) => ({ ...prev, delete: { open, productType: null } }))}
        onConfirm={confirmDelete}
        title="Delete Product Type"
        description="Are you sure you want to delete this product type?"
      />
    </>
  );
}
