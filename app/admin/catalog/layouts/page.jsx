"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminLayoutStore } from "@/store/adminLayoutStore.js";

export default function LayoutsPage() {
        const {
                layouts,
                fetchLayouts,
                addLayout,
                updateLayout,
                deleteLayout,
        } = useAdminLayoutStore();
        const [form, setForm] = useState({ name: "", aspectRatio: "" });

        useEffect(() => {
                fetchLayouts();
        }, [fetchLayouts]);

        const handleAdd = async () => {
                if (!form.name.trim() || !form.aspectRatio.trim()) return;
                const success = await addLayout(form);
                if (success) setForm({ name: "", aspectRatio: "" });
        };

        return (
                <div className="space-y-4">
                        <Card>
                                <CardHeader>
                                        <h1 className="text-2xl font-bold">Layouts</h1>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                                <Input
                                                        placeholder="Layout name"
                                                        value={form.name}
                                                        onChange={(e) =>
                                                                setForm((f) => ({
                                                                        ...f,
                                                                        name: e.target.value,
                                                                }))
                                                        }
                                                />
                                                <Input
                                                        placeholder="Aspect ratio e.g. 1:1"
                                                        value={form.aspectRatio}
                                                        onChange={(e) =>
                                                                setForm((f) => ({
                                                                        ...f,
                                                                        aspectRatio: e.target.value,
                                                                }))
                                                        }
                                                />
                                                <Button onClick={handleAdd}>Add</Button>
                                        </div>
                                        <ul className="space-y-2">
                                                {layouts.map((lay) => (
                                                        <li key={lay._id} className="flex gap-2">
                                                                <Input
                                                                        value={lay.name}
                                                                        onChange={(e) =>
                                                                                updateLayout(lay._id, {
                                                                                        name: e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <Input
                                                                        value={lay.aspectRatio}
                                                                        onChange={(e) =>
                                                                                updateLayout(lay._id, {
                                                                                        aspectRatio:
                                                                                                e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <Button
                                                                        variant="destructive"
                                                                        onClick={() => deleteLayout(lay._id)}
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
