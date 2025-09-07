"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useAdminPriceStore } from "@/store/adminPriceStore";
import { useAdminLayoutStore } from "@/store/adminLayoutStore.js";

export default function PricesPage() {
        const { prices, fetchPrices, addPrice, updatePrice, deletePrice } =
                useAdminPriceStore();
        const { layouts, fetchLayouts } = useAdminLayoutStore();
        const [form, setForm] = useState({
                productType: "poster",
                layout: "",
                size: "",
                material: "",
                qr: false,
                price: "",
        });

        useEffect(() => {
                fetchPrices();
                fetchLayouts();
        }, [fetchPrices, fetchLayouts]);

        const handleAdd = async () => {
                const payload = { ...form, price: Number(form.price) };
                const success = await addPrice(payload);
                if (success) {
                        setForm({
                                productType: "poster",
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
                                                        value={form.productType}
                                                        onValueChange={(v) =>
                                                                setForm((f) => ({ ...f, productType: v }))
                                                        }
                                                >
                                                        <SelectTrigger>
                                                                <SelectValue placeholder="Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                <SelectItem value="poster">Poster</SelectItem>
                                                                <SelectItem value="sign">Sign</SelectItem>
                                                        </SelectContent>
                                                </Select>
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
                                                <Input
                                                        placeholder="Size"
                                                        value={form.size}
                                                        onChange={(e) =>
                                                                setForm((f) => ({ ...f, size: e.target.value }))
                                                        }
                                                />
                                                <Input
                                                        placeholder="Material"
                                                        value={form.material}
                                                        onChange={(e) =>
                                                                setForm((f) => ({ ...f, material: e.target.value }))
                                                        }
                                                />
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
                                                                <span>{p.productType}</span>
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
                                                                <Input
                                                                        value={p.size}
                                                                        onChange={(e) =>
                                                                                updatePrice(p._id, {
                                                                                        size: e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <Input
                                                                        value={p.material}
                                                                        onChange={(e) =>
                                                                                updatePrice(p._id, {
                                                                                        material: e.target.value,
                                                                                })
                                                                        }
                                                                />
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
