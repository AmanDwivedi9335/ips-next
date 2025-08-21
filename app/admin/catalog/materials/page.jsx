"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminMaterialStore } from "@/store/adminMaterialStore.js";

export default function MaterialsPage() {
        const {
                materials,
                fetchMaterials,
                addMaterial,
                updateMaterial,
                deleteMaterial,
        } = useAdminMaterialStore();
        const [name, setName] = useState("");

        useEffect(() => {
                fetchMaterials();
        }, [fetchMaterials]);

        const handleAdd = async () => {
                if (!name.trim()) return;
                const success = await addMaterial({ name });
                if (success) setName("");
        };

        return (
                <div className="space-y-4">
                        <Card>
                                <CardHeader>
                                        <h1 className="text-2xl font-bold">Materials</h1>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                                <Input
                                                        placeholder="New material"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                />
                                                <Button onClick={handleAdd}>Add</Button>
                                        </div>
                                        <ul className="space-y-2">
                                                {materials.map((mat) => (
                                                        <li key={mat._id} className="flex gap-2">
                                                                <Input
                                                                        value={mat.name}
                                                                        onChange={(e) =>
                                                                                updateMaterial(mat._id, {
                                                                                        name: e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <Button
                                                                        variant="destructive"
                                                                        onClick={() => deleteMaterial(mat._id)}
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
