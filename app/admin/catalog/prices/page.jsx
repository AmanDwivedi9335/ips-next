"use client";

import { useState, useEffect } from "react";
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

export default function PricesPage() {
        const { prices, fetchPrices, addPrice, updatePrice, deletePrice } =
                useAdminPriceStore();
        const { layouts, fetchLayouts } = useAdminLayoutStore();
        const { materials, fetchMaterials } = useAdminMaterialStore();
        const { sizes, fetchSizes } = useAdminSizeStore();
        const [form, setForm] = useState({
                layout: "",
                size: "",
                material: "",
                qr: false,
                price: "",
        });

        useEffect(() => {
                fetchPrices();
                fetchLayouts();
                fetchMaterials();
                fetchSizes();
        }, [fetchPrices, fetchLayouts, fetchMaterials, fetchSizes]);

        const handleAdd = async () => {
                const payload = { ...form, price: Number(form.price) };
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
                                                                        setForm((f) => ({ ...f, qr: v }))
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
                                        <ul className="space-y-2">
                                                {prices.map((p) => (
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
                                                                                updatePrice(p._id, { qr: v })
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
                                        </ul>
                                </CardContent>
                        </Card>
                </div>
        );
}
