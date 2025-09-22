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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";
import { useAdminProductStore } from "@/store/adminProductStore.js";
import { useAdminLanguageStore } from "@/store/adminLanguageStore.js";
import { useAdminMaterialStore } from "@/store/adminMaterialStore.js";
import { useAdminSizeStore } from "@/store/adminSizeStore.js";
import { useAdminCategoryStore } from "@/store/adminCategoryStore.js";
import { useAdminLayoutStore } from "@/store/adminLayoutStore.js";

import { useAdminProductFamilyStore } from "@/store/adminProductFamilyStore.js";

import { ImageUpload } from "@/components/AdminPanel/ImageUpload.jsx";
const productTags = [
  { value: "featured", label: "Featured" },
  { value: "top-selling", label: "Top Selling" },
  { value: "best-selling", label: "Best Selling" },
  { value: "discounted", label: "Discounted" },
];

export function AddProductPopup({ open, onOpenChange }) {
  const { addProduct } = useAdminProductStore();
  const { languages, fetchLanguages } = useAdminLanguageStore();
  const { materials, fetchMaterials } = useAdminMaterialStore();
  const { sizes, fetchSizes } = useAdminSizeStore();
  const { allCategories: categoryList, fetchAllCategories } =
    useAdminCategoryStore();
  const { layouts, fetchLayouts } = useAdminLayoutStore();

  const { productFamilies, fetchProductFamilies } = useAdminProductFamilyStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState([{ title: "", description: "" }]);
  const [selectedLanguages, setSelectedLanguages] = useState(["English"]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedLayouts, setSelectedLayouts] = useState([]);
  const [languageImages, setLanguageImages] = useState([
    { language: "English", image: "" },
  ]);
  const [prices, setPrices] = useState([
    { layout: "", material: "", size: "", qr: false, price: "" },
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    productCode: "",
    category: "",
    subcategory: "",
    discount: "",
    type: "featured",
    productFamily: "",
    published: true,
  });

  const showLayout = ["safety-signs", "identification-signs"].includes(
    formData.productFamily,
  );

  const showQR = [
    "safety-posters",
    "iso-compliance-series",
    "industrial-safety-packs",
  ].includes(formData.productFamily);

  const showBasicFields = ![
    "monthly-poster-subscription",
    "iso-wall-kraft",
  ].includes(formData.productFamily);

  const sizeOptions =
    formData.productFamily === "industrial-safety-packs"
      ? [
          { _id: "compact", name: "Compact" },
          { _id: "classic", name: "Classic" },
          { _id: "standard", name: "Standard" },
          { _id: "wide", name: "Wide" },
        ]
      : sizes;

  const parentCategories = categoryList.filter((cat) => !cat.parent);
  const subCategories = selectedCategoryId
    ? categoryList.filter((cat) => cat.parent === selectedCategoryId)

    : [];

  useEffect(() => {
    fetchLanguages();
    fetchMaterials();
    fetchSizes();
    fetchAllCategories();
    fetchLayouts();
    fetchProductFamilies();
  }, [
    fetchLanguages,
    fetchMaterials,
    fetchSizes,
    fetchAllCategories,
    fetchLayouts,
    fetchProductFamilies,
  ]);

  useEffect(() => {
    if (open) {
      fetchAllCategories();
    }
  }, [open, fetchAllCategories]);

  useEffect(() => {
    if (productFamilies.length) {
      setFormData((prev) => ({
        ...prev,
        productFamily: prev.productFamily || productFamilies[0].slug,
      }));
    }
  }, [productFamilies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const languageImagesData = languageImages.filter(
        (li) => li.language && li.image,
      );
      const allLanguages = showBasicFields
        ? Array.from(
            new Set([
              ...selectedLanguages,
              ...languageImagesData.map((li) => li.language),
            ]),
          )
        : [];

      // Prepare product data with proper types
      const requiresLayout = ["safety-signs", "identification-signs"].includes(
        formData.productFamily,
      );

      const priceData = prices
        .filter(
          (p) =>
            p.material &&
            p.size &&
            (!requiresLayout || p.layout) &&
            p.price !== "",
        )
        .map((p) => ({
          ...p,
          price: parseFloat(p.price),
        }));

      const productData = {
        title: formData.title,
        productCode: formData.productCode,
        description: formData.description,
        longDescription: formData.longDescription || formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        type: formData.type,
        published: formData.published,
        features: features.filter((f) => f.title && f.description),
        languageImages: languageImagesData,
        languages: allLanguages,
        materials: showBasicFields ? selectedMaterials : [],
        sizes: showBasicFields ? selectedSizes : [],
        layouts: showLayout ? selectedLayouts : [],

        productFamily: formData.productFamily,

        pricing: priceData,
      };

      console.log("Product Data:", productData);

      // Use the store method which handles FormData internally
      const success = await addProduct(productData);

      if (success) {
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Error submitting product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      productCode: "",
      category: "",
      subcategory: "",
      discount: "",
      type: "featured",

      productFamily: productFamilies[0]?.slug || "",

      published: true,
    });
    setFeatures([{ title: "", description: "" }]);
    setSelectedLanguages(["English"]);
    setSelectedMaterials([]);
    setSelectedSizes([]);
    setSelectedLayouts([]);
    setLanguageImages([{ language: "English", image: "" }]);
    setPrices([{ layout: "", material: "", size: "", qr: false, price: "" }]);
    setSelectedCategoryId(null);
  };

  const addFeature = () => {
    setFeatures([...features, { title: "", description: "" }]);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index, field, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][field] = value;
    setFeatures(updatedFeatures);
  };

  const addLanguageImage = () => {
    setLanguageImages([...languageImages, { language: "", image: "" }]);
  };

  const removeLanguageImage = (index) => {
    setLanguageImages(languageImages.filter((_, i) => i !== index));
  };

  const updateLanguageImage = (index, field, value) => {
    const updated = [...languageImages];
    updated[index][field] = value;
    setLanguageImages(updated);
  };

  const addPriceRow = () => {
    setPrices([
      ...prices,
      { layout: "", material: "", size: "", qr: false, price: "" },
    ]);
  };

  const removePriceRow = (index) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  const updatePriceRow = (index, field, value) => {
    const updated = [...prices];
    updated[index][field] = value;
    setPrices(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Add New Product
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Add your product and necessary information from here
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Product Family *</Label>
                <Select
                  value={formData.productFamily}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      productFamily: value,
                      category: "",
                      subcategory: "",
                    });
                    setSelectedCategoryId(null);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select family" />
                  </SelectTrigger>
                  <SelectContent>
                    {productFamilies.map((family) => (
                      <SelectItem key={family._id} value={family.slug}>
                        {family.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter product title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="productCode">Product Code</Label>
                <Input
                  id="productCode"
                  placeholder="Enter product code"
                  value={formData.productCode}
                  onChange={(e) =>
                    setFormData({ ...formData, productCode: e.target.value })
                  }
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief product description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1"
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="longDescription">Detailed Description</Label>
                <Textarea
                  id="longDescription"
                  placeholder="Detailed product description"
                  value={formData.longDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      longDescription: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={4}
                />
              </div>

              {showBasicFields && (
                <div className="md:col-span-2">
                  <Label>Language Specific Images</Label>
                  {languageImages.map((li, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row md:items-end gap-4 mt-2"
                    >
                      <div className="md:w-40">
                        <Select
                          value={li.language}
                          onValueChange={(value) =>
                            updateLanguageImage(index, "language", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang._id} value={lang.name}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <ImageUpload
                          images={li.image ? [li.image] : []}
                          onImagesChange={(images) =>
                            updateLanguageImage(index, "image", images[0] || "")
                          }
                          maxImages={1}
                          label="Image"
                          required={true}
                        />
                      </div>
                      {languageImages.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeLanguageImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={addLanguageImage}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Language Image
                  </Button>
                </div>
              )}

              {showBasicFields && (
                <>
                  <div>
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => {
                        const selected = parentCategories.find(
                          (cat) => cat.slug === value,
                        );
                        setSelectedCategoryId(selected?._id || null);
                        setFormData({
                          ...formData,
                          category: value,
                          subcategory: "",
                        });
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {parentCategories.map((category) => (
                          <SelectItem key={category._id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {subCategories.length > 0 && (
                    <div>
                      <Label>Subcategory</Label>
                      <Select
                        value={formData.subcategory}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            subcategory: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {subCategories.map((sub) => (
                            <SelectItem key={sub._id} value={sub.slug}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              )}

              <div>
                <Label>Product Tag</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTags.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  placeholder="0"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  className="mt-1"
                  type="number"
                  max="100"
                />
              </div>
            </div>
            {showBasicFields && (
              <div className="mt-4">
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map((lang) => (
                    <div key={lang._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang._id}`}
                        checked={selectedLanguages.includes(lang.name)}
                        onCheckedChange={(checked) => {
                          setSelectedLanguages(
                            checked
                              ? [...selectedLanguages, lang.name]
                              : selectedLanguages.filter(
                                  (l) => l !== lang.name,
                                ),
                          );
                        }}
                      />
                      <Label htmlFor={`lang-${lang._id}`}>{lang.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showBasicFields && (
              <div className="mt-4">
                <Label>Materials</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {materials.map((mat) => (
                    <div key={mat._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mat-${mat._id}`}
                        checked={selectedMaterials.includes(mat.name)}
                        onCheckedChange={(checked) => {
                          setSelectedMaterials(
                            checked
                              ? [...selectedMaterials, mat.name]
                              : selectedMaterials.filter((m) => m !== mat.name),
                          );
                        }}
                      />
                      <Label htmlFor={`mat-${mat._id}`}>{mat.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showBasicFields && (
              <div className="mt-4">
                <Label>Sizes</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizeOptions.map((s) => (
                    <div key={s._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${s._id}`}
                        checked={selectedSizes.includes(s.name)}
                        onCheckedChange={(checked) => {
                          setSelectedSizes(
                            checked
                              ? [...selectedSizes, s.name]
                              : selectedSizes.filter((sz) => sz !== s.name),
                          );
                        }}
                      />
                      <Label htmlFor={`size-${s._id}`}>{s.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showLayout && (
              <div className="mt-4">
                <Label>Layouts</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {layouts.map((lay) => (
                    <div key={lay._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`layout-${lay._id}`}
                        checked={selectedLayouts.includes(lay.name)}
                        onCheckedChange={(checked) => {
                          setSelectedLayouts(
                            checked
                              ? [...selectedLayouts, lay.name]
                              : selectedLayouts.filter((l) => l !== lay.name)
                          );
                        }}
                      />
                      <Label htmlFor={`layout-${lay._id}`}>
                        {lay.name}
                        {lay.aspectRatio ? ` (${lay.aspectRatio})` : ""}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showBasicFields && (
              <div className="mt-6">
                <Label>Pricing</Label>
                {prices.map((p, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-2 items-center mt-2"
                  >
                    <Select
                      value={p.material}
                      onValueChange={(value) =>
                        updatePriceRow(index, "material", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Material" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedMaterials.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={p.size}
                      onValueChange={(value) =>
                        updatePriceRow(index, "size", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSizes.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showLayout && (
                      <Select
                        value={p.layout}
                        onValueChange={(value) =>
                          updatePriceRow(index, "layout", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Layout" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedLayouts.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {showQR && (
                      <Select
                        value={p.qr ? "true" : "false"}
                        onValueChange={(value) =>
                          updatePriceRow(index, "qr", value === "true")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="QR" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="false">Without QR</SelectItem>
                          <SelectItem value="true">With QR</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Price"
                        value={p.price}
                        onChange={(e) =>
                          updatePriceRow(index, "price", e.target.value)
                        }
                        className="min-w-[160px]"
                      />
                      {prices.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removePriceRow(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={addPriceRow}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Price
                </Button>
              </div>
            )}

            {/* Features Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <Label>Product Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <Input
                      placeholder="Feature title"
                      value={feature.title}
                      onChange={(e) =>
                        updateFeature(index, "title", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Feature description"
                      value={feature.description}
                      onChange={(e) =>
                        updateFeature(index, "description", e.target.value)
                      }
                      className="flex-1"
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Publish Product</Label>
                <p className="text-sm text-gray-500">
                  Make this product visible to customers
                </p>
              </div>
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
            </div>

            <DialogFooter className="flex gap-3">
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
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
