"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchSection({ searchQuery, setSearchQuery }) {
        const handleSearch = (e) => {
                e.preventDefault();
        };

        return (
                <section className="relative overflow-hidden py-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f4f0ff] via-white to-[#eaf8ff]" />
                        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                                <div className="rounded-3xl border border-white/80 bg-white/90 p-10 text-center shadow-[0_30px_90px_-45px_rgba(15,23,42,0.3)] backdrop-blur">
                                        <motion.h2
                                                initial={{ opacity: 0, y: 24 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
                                        >
                                                Looking for something specific?
                                        </motion.h2>
                                        <motion.p
                                                initial={{ opacity: 0, y: 24 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 }}
                                                className="mt-3 text-sm text-slate-600 sm:text-base"
                                        >
                                                Search our catalogue of posters, floor graphics and compliance-ready visual
                                                aids designed for Indian manufacturing floors.
                                        </motion.p>
                                        <motion.form
                                                initial={{ opacity: 0, y: 24 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.2 }}
                                                onSubmit={handleSearch}
                                                className="relative mx-auto mt-8 max-w-2xl"
                                        >
                                                <Input
                                                        placeholder="Try “lockout tagout poster” or “floor marking tape”"
                                                        className="h-14 rounded-full border border-slate-200 bg-slate-50/70 pl-12 pr-24 text-base shadow-inner focus:border-[#301b70] focus:bg-white"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#301b70]" />
                                                <Button
                                                        type="submit"
                                                        className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-full bg-[#301b70] px-6 text-sm font-semibold text-white shadow-lg hover:bg-[#2a1660]"
                                                >
                                                        Search
                                                </Button>
                                        </motion.form>
                                </div>
                        </div>
                </section>
        );
}
