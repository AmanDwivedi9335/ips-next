"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAdminLanguageStore } from "@/store/adminLanguageStore.js";

export default function LanguagesPage() {
        const {
                languages,
                fetchLanguages,
                addLanguage,
                updateLanguage,
                deleteLanguage,
        } = useAdminLanguageStore();
        const [name, setName] = useState("");
        const [code, setCode] = useState("");

        useEffect(() => {
                fetchLanguages();
        }, [fetchLanguages]);

        const handleAdd = async () => {
                if (!name.trim() || !code.trim()) return;
                const success = await addLanguage({ name, code });
                if (success) {
                        setName("");
                        setCode("");
                }
        };

        return (
                <div className="space-y-4">
                        <Card>
                                <CardHeader>
                                        <h1 className="text-2xl font-bold">Languages</h1>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        <div className="flex flex-col md:flex-row gap-2">
                                                <Input
                                                        placeholder="Language name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                />
                                                <Input
                                                        placeholder="ISO code"
                                                        value={code}
                                                        onChange={(e) => setCode(e.target.value)}
                                                />
                                                <Button onClick={handleAdd}>Add</Button>
                                        </div>
                                        <ul className="space-y-2">
                                                {languages.map((lang) => (
                                                        <li key={lang._id} className="flex gap-2">
                                                                <Input
                                                                        value={lang.name}
                                                                        onChange={(e) =>
                                                                                updateLanguage(lang._id, {
                                                                                        name: e.target.value,
                                                                                        code: lang.code,
                                                                                })
                                                                        }
                                                                />
                                                                <Input
                                                                        value={lang.code}
                                                                        onChange={(e) =>
                                                                                updateLanguage(lang._id, {
                                                                                        name: lang.name,
                                                                                        code: e.target.value,
                                                                                })
                                                                        }
                                                                />
                                                                <Button
                                                                        variant="destructive"
                                                                        onClick={() => deleteLanguage(lang._id)}
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

