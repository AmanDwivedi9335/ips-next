"use client";

import { create } from "zustand";
import { toast } from "sonner";

export const useAdminLanguageStore = create((set, get) => ({
        languages: [],
        isLoading: false,
        error: null,

        fetchLanguages: async () => {
                set({ isLoading: true, error: null });
                try {
                        const res = await fetch("/api/languages");
                        const data = await res.json();
                        set({ languages: data.languages || [], isLoading: false });
                } catch (e) {
                        set({ error: "Failed to fetch languages", isLoading: false });
                }
        },

        addLanguage: async (lang) => {
                try {
                        const res = await fetch("/api/languages", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(lang),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Language added");
                                get().fetchLanguages();
                                return true;
                        }
                        toast.error(data.message || "Failed to add language");
                        return false;
                } catch (e) {
                        toast.error("Failed to add language");
                        return false;
                }
        },

        updateLanguage: async (id, update) => {
                try {
                        const res = await fetch("/api/languages", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id, ...update }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Language updated");
                                get().fetchLanguages();
                                return true;
                        }
                        toast.error(data.message || "Failed to update language");
                        return false;
                } catch (e) {
                        toast.error("Failed to update language");
                        return false;
                }
        },

        deleteLanguage: async (id) => {
                try {
                        const res = await fetch("/api/languages", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id }),
                        });
                        const data = await res.json();
                        if (data.success) {
                                toast.success("Language deleted");
                                get().fetchLanguages();
                                return true;
                        }
                        toast.error(data.message || "Failed to delete language");
                        return false;
                } catch (e) {
                        toast.error("Failed to delete language");
                        return false;
                }
        },
}));
