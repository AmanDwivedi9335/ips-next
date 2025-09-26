"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
        Select,
        SelectTrigger,
        SelectContent,
        SelectItem,
        SelectValue,
} from "@/components/ui/select";
import { useAdminPriceStore } from "@/store/adminPriceStore";
import { useAdminLayoutStore } from "@/store/adminLayoutStore.js";
import { useAdminMaterialStore } from "@/store/adminMaterialStore.js";
import { useAdminSizeStore } from "@/store/adminSizeStore.js";
import { useShallow } from "zustand/react/shallow";

export default function PricesPage() {
        const fetchPrices = useAdminPriceStore((state) => state.fetchPrices);
        const { prices, addPrice, updatePrice, deletePrice } =
                useAdminPriceStore(
                        useShallow((state) => ({
                                prices: state.prices,
                                addPrice: state.addPrice,
                                updatePrice: state.updatePrice,
                                deletePrice: state.deletePrice,
                        }))
                );

        const fetchLayouts = useAdminLayoutStore((state) => state.fetchLayouts);
        const layouts = useAdminLayoutStore((state) => state.layouts);

        const fetchMaterials = useAdminMaterialStore(
                (state) => state.fetchMaterials
        );
        const materials = useAdminMaterialStore((state) => state.materials);

        const fetchSizes = useAdminSizeStore((state) => state.fetchSizes);
        const sizes = useAdminSizeStore((state) => state.sizes);
        const [form, setForm] = useState({
                layout: "",
                size: "",
                material: "",
                qr: false,
                price: "",
        });
        const [searchTerm, setSearchTerm] = useState("");
        const [pageSize, setPageSize] = useState(25);
        const [currentPage, setCurrentPage] = useState(1);

        useEffect(() => {
                fetchPrices();
                fetchLayouts();
                fetchMaterials();
                fetchSizes();
        }, [fetchPrices, fetchLayouts, fetchMaterials, fetchSizes]);

        useEffect(() => {
                setCurrentPage(1);
        }, [searchTerm, pageSize, prices.length]);

        const filteredPrices = useMemo(() => {
                const query = searchTerm.trim().toLowerCase();
                if (!query) {
                        return prices;
                }

                return prices.filter((price) => {
                        const fields = [
                                price.product?.title,
                                price.layout,
                                price.size,
                                price.material,
                        ];

                        return fields.some((field) =>
                                typeof field === "string"
                                        ? field.toLowerCase().includes(query)
                                        : false
                        );
                });
        }, [prices, searchTerm]);

        const totalPages = Math.max(
                1,
                Math.ceil(filteredPrices.length / pageSize) || 1
        );

        useEffect(() => {
                if (currentPage > totalPages) {
                        setCurrentPage(totalPages);
                }
        }, [currentPage, totalPages]);

        const safePage = Math.min(currentPage, totalPages);
        const startIndex = (safePage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, filteredPrices.length);

        const paginatedPrices = useMemo(
                () => filteredPrices.slice(startIndex, endIndex),
                [filteredPrices, startIndex, endIndex]
        );

        const displayStart =
                filteredPrices.length === 0 || paginatedPrices.length === 0
                        ? 0
                        : startIndex + 1;
        const displayEnd =
                filteredPrices.length === 0 || paginatedPrices.length === 0
                        ? 0
                        : startIndex + paginatedPrices.length;

        const handleAdd = async () => {
                if (!form.size || !form.material || !form.price) {
                        return;
                }

                const payload = {
                        ...form,
                        qr: form.qr === true,
                        price: Number(form.price),
                };
                const success = await addPrice(payload);
                if (success) {
                        setForm({
                                layout: "",
                                size: "",
                                material: "",
                                qr: false,
                                price: "",
                        });
                }
        };

        return (
                <div className="space-y-4">
                        <Card>
                                <CardHeader>
                                        <h1 className="text-2xl font-bold">Pricing</h1>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div className="grid grid-cols-6 gap-2 items-end">
                                                <Select
                                                        value={form.layout}
                                                        onValueChange={(v) =>
                                                                setForm((f) => ({ ...f, layout: v }))
                                                        }
                                                >
                                                        <SelectTrigger>
                                                                <SelectValue placeholder="Layout" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {layouts.map((l) => (
                                                                        <SelectItem key={l._id} value={l.name}>
                                                                                {l.name}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                                <Select
                                                        value={form.size}
                                                        onValueChange={(v) =>
                                                                setForm((f) => ({ ...f, size: v }))
                                                        }
                                                >
                                                        <SelectTrigger>
                                                                <SelectValue placeholder="Size" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {sizes.map((s) => (
                                                                        <SelectItem key={s._id} value={s.name}>
                                                                                {s.name}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                                <Select
                                                        value={form.material}
                                                        onValueChange={(v) =>
                                                                setForm((f) => ({ ...f, material: v }))
                                                        }
                                                >
                                                        <SelectTrigger>
                                                                <SelectValue placeholder="Material" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {materials.map((m) => (
                                                                        <SelectItem key={m._id} value={m.name}>
                                                                                {m.name}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                                <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                                checked={form.qr}
                                                                onCheckedChange={(v) =>
                                                                        setForm((f) => ({
                                                                                ...f,
                                                                                qr: v === true,
                                                                        }))
                                                                }
                                                        />
                                                        <span className="text-sm">QR</span>
                                                </div>
                                                <Input
                                                        placeholder="Price"
                                                        type="number"
                                                        value={form.price}
                                                        onChange={(e) =>
                                                                setForm((f) => ({ ...f, price: e.target.value }))
                                                        }
                                                />
                                                <Button className="col-span-6" onClick={handleAdd}>
                                                        Add
                                                </Button>
                                        </div>
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <Input
                                                        value={searchTerm}
                                                        onChange={(event) =>
                                                                setSearchTerm(event.target.value)
                                                        }
                                                        placeholder="Search by product, layout, size or material"
                                                        className="w-full md:max-w-sm"
                                                />
                                                <div className="flex items-center gap-2">
                                                        <span className="text-sm text-muted-foreground">
                                                                Rows per page
                                                        </span>
                                                        <Select
                                                                value={String(pageSize)}
                                                                onValueChange={(value) => {
                                                                        setPageSize(Number(value));
                                                                        setCurrentPage(1);
                                                                }}
                                                        >
                                                                <SelectTrigger className="w-[120px]">
                                                                        <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        {[10, 25, 50, 100].map((sizeOption) => (
                                                                                <SelectItem
                                                                                        key={sizeOption}
                                                                                        value={String(sizeOption)}
                                                                                >
                                                                                        {sizeOption}
                                                                                </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                        </Select>
                                                </div>
                                        </div>
                                        <ul className="space-y-2">
                                                {paginatedPrices.map((p) => (
                                                        <li
                                                                key={p._id}
                                                                className="grid grid-cols-7 gap-2 items-center"
                                                        >
                                                                <span>{p.product?.title || ""}</span>
                                                                <Select
                                                                        value={p.layout}
                                                                        onValueChange={(v) =>
                                                                                updatePrice(p._id, {
                                                                                        layout: v,
                                                                                })
                                                                        }
                                                                >
                                                                        <SelectTrigger>
                                                                                <SelectValue placeholder="Layout" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                {layouts.map((l) => (
                                                                                        <SelectItem key={l._id} value={l.name}>
                                                                                                {l.name}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                                <Select
                                                                        value={p.size}
                                                                        onValueChange={(v) =>
                                                                                updatePrice(p._id, { size: v })
                                                                        }
                                                                >
                                                                        <SelectTrigger>
                                                                                <SelectValue placeholder="Size" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                {sizes.map((s) => (
                                                                                        <SelectItem key={s._id} value={s.name}>
                                                                                                {s.name}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                                <Select
                                                                        value={p.material}
                                                                        onValueChange={(v) =>
                                                                                updatePrice(p._id, { material: v })
                                                                        }
                                                                >
                                                                        <SelectTrigger>
                                                                                <SelectValue placeholder="Material" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                {materials.map((m) => (
                                                                                        <SelectItem key={m._id} value={m.name}>
                                                                                                {m.name}
                                                                                        </SelectItem>
                                                                                ))}
                                                                        </SelectContent>
                                                                </Select>
                                                                <Checkbox
                                                                        checked={p.qr}
                                                                        onCheckedChange={(v) =>
                                                                                updatePrice(p._id, {
                                                                                        qr: v === true,
                                                                                })
                                                                        }
                                                                />
                                                                <Input
                                                                        value={p.price}
                                                                        type="number"
                                                                        onChange={(e) =>
                                                                                updatePrice(p._id, {
                                                                                        price: Number(
                                                                                                e.target.value
                                                                                        ),
                                                                                })
                                                                        }
                                                                />
                                                                <Button
                                                                        variant="destructive"
                                                                        onClick={() => deletePrice(p._id)}
                                                                >
                                                                        Delete
                                                                </Button>
                                                        </li>
                                                ))}
                                                {filteredPrices.length === 0 && (
                                                        <li className="text-sm text-muted-foreground">
                                                                No prices found for the selected filters.
                                                        </li>
                                                )}
                                        </ul>
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                        {filteredPrices.length === 0
                                                                ? "No results"
                                                                : `Showing ${displayStart}-${displayEnd} of ${
                                                                          filteredPrices.length
                                                                  }`}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                        <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                        setCurrentPage((page) =>
                                                                                Math.max(page - 1, 1)
                                                                        )
                                                                }
                                                                disabled={currentPage <= 1}
                                                        >
                                                                Previous
                                                        </Button>
                                                        <span className="text-sm text-muted-foreground">
                                                                Page {currentPage} of {totalPages}
                                                        </span>
                                                        <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                        setCurrentPage((page) =>
                                                                                Math.min(page + 1, totalPages)
                                                                        )
                                                                }
                                                                disabled={currentPage >= totalPages}
                                                        >
                                                                Next
                                                        </Button>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        );
}
