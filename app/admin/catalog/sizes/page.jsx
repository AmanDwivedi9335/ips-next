"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminSizeStore } from "@/store/adminSizeStore.js";

export default function SizesPage() {
        const { sizes, fetchSizes, addSize, updateSize, deleteSize } =
                useAdminSizeStore();
        const [name, setName] = useState("");

        useEffect(() => {
                fetchSizes();
        }, [fetchSizes]);

        const handleAdd = async () => {
                if (!name.trim()) return;
                const success = await addSize({ name });
                if (success) setName("");
        };

        return (
                <div className="space-y-4">
                        <Card>
                                <CardHeader>
                                        <h1 className="text-2xl font-bold">Sizes</h1>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                                <Input
                                                        placeholder="New size"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                />
                                                <Button onClick={handleAdd}>Add</Button>
                                        </div>
                                        <ul className="space-y-2">
                                                {sizes.map((s) => (
                                                        <li key={s._id} className="flex gap-2">
                                                                <Input
                                                                        value={s.name}
                                                                        onChange={(e) =>
                                                                                updateSize(s._id, {
                                                                                        name: e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <Button
                                                                        variant="destructive"
                                                                        onClick={() => deleteSize(s._id)}
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
