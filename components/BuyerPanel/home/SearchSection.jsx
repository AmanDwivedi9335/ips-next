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
                <section className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 px-6 py-12 text-white shadow-[0_30px_90px_rgba(14,165,233,0.25)] backdrop-blur-xl sm:px-12">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.4),_transparent_60%)]" />
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.35),_transparent_55%)]" />

                        <motion.h2
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.7 }}
                                className="text-3xl font-semibold sm:text-4xl"
                        >
                                Ready to print what your team needs next?
                        </motion.h2>

                        <motion.p
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="mt-3 max-w-2xl text-base text-slate-200/75"
                        >
                                Search across our catalog of posters, wall graphics, digital training aids and more. Every result is tailored for industrial safety communication.
                        </motion.p>

                        <motion.form
                                initial={{ opacity: 0, y: 28 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                onSubmit={handleSearch}
                                className="mt-8 flex flex-col gap-4 sm:flex-row"
                        >
                                <div className="relative flex-1">
                                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-200/70" />
                                        <Input
                                                placeholder="Search products, categories or keywords..."
                                                className="h-14 w-full rounded-full border-white/10 bg-white/10 pl-12 pr-6 text-white placeholder:text-slate-200/60 focus:border-sky-300 focus:ring-0"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                </div>
                                <Button
                                        type="submit"
                                        className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-sky-400 px-8 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_15px_40px_rgba(76,29,149,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
                                >
                                        Search
                                </Button>
                        </motion.form>
                </section>
        );
}
