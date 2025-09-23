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
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
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

const createPriceRow = (price = {}, overrides = {}) => ({
  _id: price?._id,
  layout: price?.layout || "",
  material: price?.material || "",
  size: price?.size || "",
  qr: typeof price?.qr === "boolean" ? price.qr : !!price?.qr,
  price:
    price?.price === undefined || price?.price === null
      ? ""
      : price.price.toString(),
  isEditing: false,
  isNew: false,
  ...overrides,
});

export function UpdateProductPopup({ open, onOpenChange, product }) {
  const { updateProduct } = useAdminProductStore();
  const { languages, fetchLanguages } = useAdminLanguageStore();
  const { materials, fetchMaterials } = useAdminMaterialStore();
  const { sizes, fetchSizes } = useAdminSizeStore();
  const { allCategories: categoryList, fetchAllCategories } =
    useAdminCategoryStore();
  const { layouts, fetchLayouts } = useAdminLayoutStore();

  const { productFamilies, fetchProductFamilies } = useAdminProductFamilyStore();

  const sortLanguageImages = (images) =>
    [...images].sort((a, b) =>
      a.language === "English" ? -1 : b.language === "English" ? 1 : 0,
    );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [features, setFeatures] = useState(
    product?.features?.length ? product.features : [{ title: "", description: "" }],
  );
  const [selectedLanguages, setSelectedLanguages] = useState(
    product?.languages?.length ? product.languages : ["English"],
  );
  const [selectedMaterials, setSelectedMaterials] = useState(
    product?.materials || [],
  );
  const [selectedSizes, setSelectedSizes] = useState(product?.sizes || []);
  const [selectedLayouts, setSelectedLayouts] = useState(
    product?.layouts || [],
  );
  const [languageImages, setLanguageImages] = useState(
    product?.languageImages?.length
      ? sortLanguageImages(product.languageImages)
      : [{ language: "English", image: "" }],
  );
  const [prices, setPrices] = useState(
    product?.pricing?.length
      ? product.pricing.map((p) => createPriceRow(p))
      : [createPriceRow({}, { isEditing: true, isNew: true })],
  );
  const [priceError, setPriceError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    longDescription: product?.longDescription || "",
    productCode: product?.productCode || product?.code || "",
    category: product?.category || "",
    subcategory: product?.subcategory || "",
    discount: product?.discount?.toString() || "",
    type: product?.type || "featured",
    productFamily: product?.productFamily || "",
    published:
      product?.published !== undefined ? product.published : true,
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

  const hasExistingPricing =
    Array.isArray(product?.pricing) && product.pricing.length > 0;

  const materialOptionsForPricing = Array.from(
    new Set([
      ...selectedMaterials.filter(Boolean),
      ...prices.map((price) => price.material).filter(Boolean),
    ]),
  );

  const sizeOptionsForPricing = Array.from(
    new Set([
      ...selectedSizes.filter(Boolean),
      ...prices.map((price) => price.size).filter(Boolean),
    ]),
  );

  const layoutOptionsForPricing = Array.from(
    new Set([
      ...selectedLayouts.filter(Boolean),
      ...prices.map((price) => price.layout).filter(Boolean),
    ]),
  );


  const pricingColumnCount = 4 + (showLayout ? 1 : 0) + (showQR ? 1 : 0);

  const shouldShowPricing = showBasicFields || hasExistingPricing;

  const parsedDiscount = Number.parseFloat(formData.discount);
  const normalizedDiscount =
    Number.isFinite(parsedDiscount) && parsedDiscount > 0
      ? Math.min(parsedDiscount, 100)
      : 0;
  const hasActiveDiscount =
    formData.type === "discounted" && normalizedDiscount > 0;
  const formattedDiscount = hasActiveDiscount
    ? normalizedDiscount % 1 === 0
      ? normalizedDiscount.toFixed(0)
      : normalizedDiscount.toFixed(2)
    : "0";

  const renderReadOnlyValue = (value, fallback = "Not set") =>
    value ? (
      <span>{value}</span>
    ) : (
      <span className="text-gray-400 italic">{fallback}</span>
    );


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

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        longDescription: product.longDescription || "",
        productCode: product.productCode || product.code || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        discount: product.discount?.toString() || "",
        type: product.type || "featured",
        productFamily: product.productFamily || "",
        published:
          product.published !== undefined ? product.published : true,
      });
      setFeatures(
        product.features?.length
          ? product.features
          : [{ title: "", description: "" }],
      );
      setSelectedLanguages(
        product.languages?.length ? product.languages : ["English"],
      );
      setSelectedMaterials(product.materials || []);
      setSelectedSizes(product.sizes || []);
      setSelectedLayouts(product.layouts || []);
      setLanguageImages(
        product.languageImages?.length
          ? sortLanguageImages(product.languageImages)
          : [{ language: "English", image: "" }],
      );
      setPrices(
        product.pricing?.length
          ? product.pricing.map((p) => createPriceRow(p))
          : [createPriceRow({}, { isEditing: true, isNew: true })],
      );
      setPriceError("");
      if (categoryList.length) {
        const selected = categoryList.find(
          (cat) => cat.slug === product.category,
        );
        setSelectedCategoryId(selected?._id || null);
      }
    }
  }, [product, categoryList]);

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
        .map(({ _id, layout, material, size, qr, price }) => ({
          ...(_id ? { _id } : {}),
          layout,
          material,
          size,
          qr,
          price: parseFloat(price),
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
      const success = await updateProduct(product._id, productData);

      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Error submitting product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
    setPrices((prev) => [
      ...prev,
      createPriceRow({}, { isEditing: true, isNew: true }),
    ]);
    setPriceError("");
  };

  const removePriceRow = (index) => {
    setPrices((prev) => prev.filter((_, i) => i !== index));
    setPriceError("");
  };

  const updatePriceRow = (index, field, value) => {
    setPrices((prev) => {
      const updated = [...prev];
      if (!updated[index]) {
        return prev;
      }

      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setPriceError("");
  };

  const startEditingPriceRow = (index) => {
    setPrices((prev) =>
      prev.map((price, i) => {
        if (i !== index) {
          return price;
        }

        if (price.isEditing) {
          return price;
        }

        return {
          ...price,
          isEditing: true,
          draft: {
            _id: price._id,
            layout: price.layout,
            material: price.material,
            size: price.size,
            qr: price.qr,
            price: price.price,
          },
        };
      }),
    );
    setPriceError("");
  };

  const savePriceRow = (index) => {
    setPrices((prev) => {
      const updated = [...prev];
      const price = updated[index];

      if (!price) {
        return prev;
      }

      const requiresLayoutForRow = showLayout;
      const hasMaterial = !!price.material;
      const hasSize = !!price.size;
      const hasLayout = !requiresLayoutForRow || !!price.layout;
      const hasPrice = price.price !== "";

      if (!hasMaterial || !hasSize || !hasLayout || !hasPrice) {
        setPriceError("Please complete all required fields before saving.");
        return prev;
      }

      const cleanedPrice = { ...price, isEditing: false, isNew: false };
      delete cleanedPrice.draft;
      updated[index] = cleanedPrice;
      setPriceError("");

      return updated;
    });
  };

  const cancelPriceRow = (index) => {
    setPrices((prev) => {
      const updated = [...prev];
      const price = updated[index];

      if (!price) {
        return prev;
      }

      if (price.isNew) {
        updated.splice(index, 1);
        setPriceError("");
        return updated;
      }

      if (price.draft) {
        updated[index] = {
          ...price.draft,
          isEditing: false,
          isNew: false,
        };
      } else {
        updated[index] = { ...price, isEditing: false, isNew: false };
      }

      delete updated[index].draft;
      setPriceError("");

      return updated;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-y-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Update Product
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Update your product and necessary information from here
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

            {shouldShowPricing && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Pricing (MRP)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPriceRow}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Price
                  </Button>
                </div>

                <p className="text-sm text-gray-500">
                  Enter MRPs for each combination.{" "}
                  {hasActiveDiscount
                    ? `A discount of ${formattedDiscount}% will be applied automatically when prices are shown to buyers.`
                    : "These prices will be shown to buyers as entered."}
                </p>

                {priceError && (
                  <p className="text-sm text-red-500">{priceError}</p>
                )}

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                          Material
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                          Size
                        </th>
                        {showLayout && (
                          <th className="px-4 py-3 text-left font-medium text-gray-600">
                            Layout
                          </th>
                        )}
                        {showQR && (
                          <th className="px-4 py-3 text-left font-medium text-gray-600">
                            QR
                          </th>
                        )}
                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                          MRP (₹)
                        </th>
                        <th className="px-3 py-3 text-center font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">

                      {prices.length === 0 ? (
                        <tr>
                          <td
                            colSpan={pricingColumnCount}
                            className="px-4 py-6 text-center text-sm text-gray-500"
                          >
                            No pricing entries added yet. Click "Add Price" to
                            create one.
                          </td>
                        </tr>
                      ) : (
                        prices.map((price, index) => (
                          <tr
                            key={index}
                            className={price.isEditing ? "bg-orange-50" : "bg-white"}
                          >
                            <td className="px-3 py-3 align-top">
                              {price.isEditing ? (
                                <Select
                                  value={price.material}
                                  onValueChange={(value) =>
                                    updatePriceRow(index, "material", value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Material" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {materialOptionsForPricing.map((m) => (
                                      <SelectItem key={m} value={m}>
                                        {m}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className="min-h-[38px] flex items-center text-gray-700">
                                  {renderReadOnlyValue(price.material)}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-3 align-top">
                              {price.isEditing ? (
                                <Select
                                  value={price.size}
                                  onValueChange={(value) =>
                                    updatePriceRow(index, "size", value)
                                  }
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Size" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sizeOptionsForPricing.map((s) => (
                                      <SelectItem key={s} value={s}>
                                        {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className="min-h-[38px] flex items-center text-gray-700">
                                  {renderReadOnlyValue(price.size)}
                                </div>
                              )}
                            </td>
                            {showLayout && (
                              <td className="px-3 py-3 align-top">
                                {price.isEditing ? (
                                  <Select
                                    value={price.layout}
                                    onValueChange={(value) =>
                                      updatePriceRow(index, "layout", value)
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Layout" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {layoutOptionsForPricing.map((l) => (
                                        <SelectItem key={l} value={l}>
                                          {l}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="min-h-[38px] flex items-center text-gray-700">
                                    {renderReadOnlyValue(price.layout)}
                                  </div>
                                )}
                              </td>
                            )}
                            {showQR && (
                              <td className="px-3 py-3 align-top">
                                {price.isEditing ? (
                                  <Select
                                    value={price.qr ? "true" : "false"}
                                    onValueChange={(value) =>
                                      updatePriceRow(index, "qr", value === "true")
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="QR" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="false">Without QR</SelectItem>
                                      <SelectItem value="true">With QR</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="min-h-[38px] flex items-center text-gray-700">
                                    <span>{price.qr ? "With QR" : "Without QR"}</span>
                                  </div>
                                )}
                              </td>
                            )}
                            <td className="px-3 py-3 align-top">
                              {price.isEditing ? (
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="MRP (₹)"
                                  value={price.price}
                                  onChange={(e) =>
                                    updatePriceRow(index, "price", e.target.value)
                                  }
                                />
                              ) : (
                                <div className="min-h-[38px] flex items-center text-gray-700">
                                  {renderReadOnlyValue(price.price, "Not set")}
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-3 align-top">
                              {price.isEditing ? (
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="bg-orange-500 text-white hover:bg-orange-600"
                                    onClick={() => savePriceRow(index)}
                                  >
                                    <Check className="mr-1 h-4 w-4" />
                                    Save
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => cancelPriceRow(index)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => removePriceRow(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1"
                                    onClick={() => startEditingPriceRow(index)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1 text-red-500 hover:text-red-600"
                                    onClick={() => removePriceRow(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}

                    </tbody>
                  </table>
                </div>
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
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
