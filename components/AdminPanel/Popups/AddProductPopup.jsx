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
import { ImageUpload } from "@/components/AdminPanel/ImageUpload.jsx";

const categories = [
	{ value: "personal-safety", label: "Personal Safety" },
	{ value: "road-safety", label: "Road Safety" },
	{ value: "signage", label: "Signage" },
	{ value: "industrial-safety", label: "Industrial Safety" },
	{ value: "queue-management", label: "Queue Management" },
	{ value: "fire-safety", label: "Fire Safety" },
	{ value: "first-aid", label: "First Aid" },
	{ value: "water-safety", label: "Water Safety" },
	{ value: "emergency-kit", label: "Emergency Kit" },
];

const productTypes = [
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
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [features, setFeatures] = useState([{ title: "", description: "" }]);
        const [selectedLanguages, setSelectedLanguages] = useState([]);
        const [selectedMaterials, setSelectedMaterials] = useState([]);
        const [selectedSizes, setSelectedSizes] = useState([]);
        const [selectedLayouts, setSelectedLayouts] = useState([]);
        const [layoutInput, setLayoutInput] = useState("");
        const [languageImages, setLanguageImages] = useState([
                { language: "", image: "" },
        ]);
        const [prices, setPrices] = useState([
                { layout: "", material: "", size: "", qr: false, price: "" },
        ]);

        useEffect(() => {
                fetchLanguages();
                fetchMaterials();
                fetchSizes();
        }, [fetchLanguages, fetchMaterials, fetchSizes]);

	const [formData, setFormData] = useState({
		title: "",
		description: "",
		longDescription: "",
		category: "",
		price: "",
		salePrice: "",
		stocks: "",
		discount: "",
                type: "featured",
                productType: "poster",
                published: true,
                images: [],
        });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
                        const languageImagesData = languageImages.filter(
                                (li) => li.language && li.image
                        );
                        const allLanguages = Array.from(
                                new Set([
                                        ...selectedLanguages,
                                        ...languageImagesData.map((li) => li.language),
                                ])
                        );

                        // Prepare product data with proper types
                        const priceData = prices
                                .filter(
                                        (p) =>
                                                p.layout &&
                                                p.material &&
                                                p.size &&
                                                p.price !== ""
                                )
                                .map((p) => ({
                                        ...p,
                                        price: parseFloat(p.price),
                                }));

                        const productData = {
                                title: formData.title,
                                description: formData.description,
                                longDescription:
                                        formData.longDescription || formData.description,
                                category: formData.category,
                                price: parseFloat(formData.price),
                                salePrice: formData.salePrice
                                        ? parseFloat(formData.salePrice)
                                        : 0,
                                stocks: parseInt(formData.stocks),
                                discount: formData.discount
                                        ? parseFloat(formData.discount)
                                        : 0,
                                type: formData.type,
                                published: formData.published,
                                features: features.filter((f) => f.title && f.description),
                                images: formData.images,
                                languageImages: languageImagesData,
                                languages: allLanguages,
                                materials: selectedMaterials,
                                sizes: selectedSizes,
                                layouts: selectedLayouts,
                                productType: formData.productType,

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
                        category: "",
                        price: "",
                        salePrice: "",
                        stocks: "",
                        discount: "",
                        type: "featured",
                        published: true,
                        images: [],
                });
                setFeatures([{ title: "", description: "" }]);
                setSelectedLanguages([]);
                setSelectedMaterials([]);
                setSelectedSizes([]);
                setSelectedLayouts([]);
                setLanguageImages([{ language: "", image: "" }]);
                setPrices([{ layout: "", material: "", size: "", qr: false, price: "" }]);
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
                setLanguageImages([
                        ...languageImages,
                        { language: "", image: "" },
                ]);
        };

        const removeLanguageImage = (index) => {
                setLanguageImages(languageImages.filter((_, i) => i !== index));
        };

        const updateLanguageImage = (index, field, value) => {
                const updated = [...languageImages];
                updated[index][field] = value;
                setLanguageImages(updated);
        };

        const addLayout = () => {
                if (layoutInput.trim()) {
                        setSelectedLayouts([...selectedLayouts, layoutInput.trim()]);
                        setLayoutInput("");
                }
        };

        const removeLayout = (layout) => {
                setSelectedLayouts(selectedLayouts.filter((l) => l !== layout));
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

                                                        <div className="md:col-span-2">
                                                                <ImageUpload
                                                                        images={formData.images}
                                                                        onImagesChange={(images) =>
                                                                                setFormData({ ...formData, images })
                                                                        }
                                                                        maxImages={5}
                                                                        label="Product Images"
                                                                        required={true}
                                                                />
                                                        </div>

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
                                                                                                                <SelectItem
                                                                                                                        key={lang._id}
                                                                                                                        value={lang.name}
                                                                                                                >
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

							<div>
								<Label>Category *</Label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										setFormData({ ...formData, category: value })
									}
								>
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category.value} value={category.value}>
												{category.label}
											</SelectItem>
										))}
									</SelectContent>
                                                                </Select>
                                                        </div>

                                                        <div>
                                                                <Label>Product Kind *</Label>
                                                                <Select
                                                                        value={formData.productType}
                                                                        onValueChange={(value) =>
                                                                                setFormData({
                                                                                        ...formData,
                                                                                        productType: value,
                                                                                })
                                                                        }
                                                                >
                                                                        <SelectTrigger className="mt-1">
                                                                                <SelectValue placeholder="Select kind" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                <SelectItem value="poster">Poster</SelectItem>
                                                                                <SelectItem value="sign">Sign</SelectItem>
                                                                        </SelectContent>
                                                                </Select>
                                                        </div>

                                                        <div>
                                                                <Label>Product Type</Label>
								<Select
									value={formData.type}
									onValueChange={(value) =>
										setFormData({ ...formData, type: value })
									}
								>
									<SelectTrigger className="mt-1">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										{productTypes.map((type) => (
											<SelectItem key={type.value} value={type.value}>
												{type.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="price">Regular Price *</Label>
								<Input
									id="price"
									placeholder="0.00"
									value={formData.price}
									onChange={(e) =>
										setFormData({ ...formData, price: e.target.value })
									}
									className="mt-1"
									type="number"
									step="0.01"
									required
								/>
							</div>

							<div>
								<Label htmlFor="salePrice">Sale Price</Label>
								<Input
									id="salePrice"
									placeholder="0.00"
									value={formData.salePrice}
									onChange={(e) =>
										setFormData({ ...formData, salePrice: e.target.value })
									}
									className="mt-1"
									type="number"
									step="0.01"
								/>
							</div>

							<div>
								<Label htmlFor="stocks">Stock Quantity *</Label>
								<Input
									id="stocks"
									placeholder="0"
									value={formData.stocks}
									onChange={(e) =>
										setFormData({ ...formData, stocks: e.target.value })
									}
									className="mt-1"
									type="number"
									required
								/>
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
                                                {/* Languages */}
                                                <div className="mt-4">
                                                        <Label>Languages</Label>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                {languages.map((lang) => (
                                                                        <div
                                                                                key={lang._id}
                                                                                className="flex items-center space-x-2"
                                                                        >
                                                                                <Checkbox
                                                                                        id={`lang-${lang._id}`}
                                                                                        checked={selectedLanguages.includes(
                                                                                                lang.name
                                                                                        )}
                                                                                        onCheckedChange={(checked) => {
                                                                                                setSelectedLanguages(
                                                                                                        checked
                                                                                                                ? [
                                                                                                                          ...selectedLanguages,
                                                                                                                          lang.name,
                                                                                                                  ]
                                                                                                                : selectedLanguages.filter(
                                                                                                                          (l) =>
                                                                                                                                  l !==
                                                                                                                                  lang.name
                                                                                                                  )
                                                                                                );
                                                                                        }}
                                                                                />
                                                                                <Label htmlFor={`lang-${lang._id}`}>
                                                                                        {lang.name}
                                                                                </Label>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Materials */}
                                                <div className="mt-4">
                                                        <Label>Materials</Label>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                {materials.map((mat) => (
                                                                        <div
                                                                                key={mat._id}
                                                                                className="flex items-center space-x-2"
                                                                        >
                                                                                <Checkbox
                                                                                        id={`mat-${mat._id}`}
                                                                                        checked={selectedMaterials.includes(
                                                                                                mat.name
                                                                                        )}
                                                                                        onCheckedChange={(checked) => {
                                                                                                setSelectedMaterials(
                                                                                                        checked
                                                                                                                ? [
                                                                                                                          ...selectedMaterials,
                                                                                                                          mat.name,
                                                                                                                  ]
                                                                                                                : selectedMaterials.filter(
                                                                                                                          (m) =>
                                                                                                                                  m !==
                                                                                                                                  mat.name
                                                                                                                  )
                                                                                                );
                                                                                        }}
                                                                                />
                                                                                <Label htmlFor={`mat-${mat._id}`}>
                                                                                        {mat.name}
                                                                                </Label>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                
                                                {/* Sizes */}
                                                <div className="mt-4">
                                                        <Label>Sizes</Label>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                {sizes.map((s) => (
                                                                        <div
                                                                                key={s._id}
                                                                                className="flex items-center space-x-2"
                                                                        >
                                                                                <Checkbox
                                                                                        id={`size-${s._id}`}
                                                                                        checked={selectedSizes.includes(s.name)}
                                                                                        onCheckedChange={(checked) => {
                                                                                                setSelectedSizes(
                                                                                                        checked
                                                                                                                ? [
                                                                                                                          ...selectedSizes,
                                                                                                                          s.name,
                                                                                                                  ]
                                                                                                                : selectedSizes.filter(
                                                                                                                          (sz) =>
                                                                                                                                  sz !==
                                                                                                                                  s.name
                                                                                                                  )
                                                                                                );
                                                                                        }}
                                                                                />
                                                                                <Label htmlFor={`size-${s._id}`}>
                                                                                        {s.name}
                                                                                </Label>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                                {/* Layouts */}
                                                <div className="mt-4">
                                                        <Label>Layouts</Label>
                                                        <div className="flex space-x-2 mt-2">
                                                                <Input
                                                                        placeholder="Add layout"
                                                                        value={layoutInput}
                                                                        onChange={(e) => setLayoutInput(e.target.value)}
                                                                />
                                                                <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={addLayout}
                                                                >
                                                                        <Plus className="h-4 w-4 mr-2" /> Add Layout
                                                                </Button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                {selectedLayouts.map((layout) => (
                                                                        <div
                                                                                key={layout}
                                                                                className="flex items-center space-x-1 bg-gray-200 rounded px-2 py-1 text-sm"
                                                                        >
                                                                                <span>{layout}</span>
                                                                                <X
                                                                                        className="h-3 w-3 cursor-pointer"
                                                                                        onClick={() => removeLayout(layout)}
                                                                                />
                                                                        </div>
                                                                ))}
                                                        </div>
                                                </div>

                                                {formData.productType === "poster" && (
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
                                                                                                updatePriceRow(
                                                                                                        index,
                                                                                                        "material",
                                                                                                        value
                                                                                                )
                                                                                        }
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Material" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {selectedMaterials.map((m) => (
                                                                                                        <SelectItem
                                                                                                                key={m}
                                                                                                                value={m}
                                                                                                        >
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
                                                                                                        <SelectItem
                                                                                                                key={s}
                                                                                                                value={s}
                                                                                                        >
                                                                                                                {s}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <Select
                                                                                        value={p.layout}
                                                                                        onValueChange={(value) =>
                                                                                                updatePriceRow(
                                                                                                        index,
                                                                                                        "layout",
                                                                                                        value
                                                                                                )
                                                                                        }
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="Layout" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                {selectedLayouts.map((l) => (
                                                                                                        <SelectItem
                                                                                                                key={l}
                                                                                                                value={l}
                                                                                                        >
                                                                                                                {l}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <Select
                                                                                        value={p.qr ? "true" : "false"}
                                                                                        onValueChange={(value) =>
                                                                                                updatePriceRow(
                                                                                                        index,
                                                                                                        "qr",
                                                                                                        value === "true"
                                                                                                )
                                                                                        }
                                                                                >
                                                                                        <SelectTrigger>
                                                                                                <SelectValue placeholder="QR" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                                <SelectItem value="false">
                                                                                                        Without QR
                                                                                                </SelectItem>
                                                                                                <SelectItem value="true">
                                                                                                        With QR
                                                                                                </SelectItem>
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <div className="flex items-center gap-2">
                                                                                        <Input
                                                                                                type="number"
                                                                                                placeholder="Price"
                                                                                                value={p.price}
                                                                                                onChange={(e) =>
                                                                                                        updatePriceRow(
                                                                                                                index,
                                                                                                                "price",
                                                                                                                e.target.value
                                                                                                        )
                                                                                                }
                                                                                        />
                                                                                        {prices.length > 1 && (
                                                                                                <Button
                                                                                                        type="button"
                                                                                                        variant="ghost"
                                                                                                        onClick={() =>
                                                                                                                removePriceRow(index)
                                                                                                        }
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
                                                                                                updateFeature(
                                                                                                        index,
                                                                                                        "title",
                                                                                                        e.target.value
                                                                                                )
                                                                                        }
                                                                                        className="flex-1"
                                                                                />
                                                                                <Input
                                                                                        placeholder="Feature description"
                                                                                        value={feature.description}
                                                                                        onChange={(e) =>
                                                                                                updateFeature(
                                                                                                        index,
                                                                                                        "description",
                                                                                                        e.target.value
                                                                                                )
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
