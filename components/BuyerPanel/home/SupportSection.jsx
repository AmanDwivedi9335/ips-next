"use client";

import { motion } from "framer-motion";
import { Truck, Headphones, Heart, Shield } from "lucide-react";

export default function SupportSection() {
        const supportItems = [
                {
                        icon: Truck,
                        title: "Fast, reliable dispatch",
                        description: "Pan-India fulfilment in record time",
                },
                {
                        icon: Headphones,
                        title: "Talk to a safety expert",
                        description: "+91 99368 14137 (9AM – 7PM IST)",
                },
                {
                        icon: Heart,
                        title: "Dedicated relationship team",
                        description: "info@industrialprintsolutions.com",
                },
                {
                        icon: Shield,
                        title: "Nationwide trust",
                        description: "Serving 250+ manufacturing hubs",
                },
        ];

        return (
                <section className="relative py-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f3ff] via-white to-[#e7f3ff]" />
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/70 to-transparent" />
                        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                <motion.div
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="mx-auto mb-12 max-w-2xl text-center"
                                >
                                        <span className="inline-flex items-center rounded-full bg-black px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                                                Support
                                        </span>
                                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                                A dedicated team behind every delivery
                                        </h2>
                                        <p className="mt-3 text-sm text-slate-600 sm:text-base">
                                                From urgent dispatches to ongoing safety audits, IPS support is just a call
                                                away.
                                        </p>
                                </motion.div>

                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        {supportItems.map((item, index) => {
                                                const IconComponent = item.icon;
                                                return (
                                                        <motion.div
                                                                key={item.title}
                                                                initial={{ opacity: 0, y: 30 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 text-left shadow-[0_30px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur"
                                                        >
                                                                <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#301b70]/10 transition-transform duration-500 group-hover:scale-150" />
                                                                <div className="relative flex flex-col gap-4">
                                                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#301b70] text-white shadow-lg">
                                                                                <IconComponent className="h-6 w-6" />
                                                                        </div>
                                                                        <h3 className="text-lg font-semibold text-slate-900">
                                                                                {item.title}
                                                                        </h3>
                                                                        <p className="text-sm text-slate-600">
                                                                                {item.description}
                                                                        </p>
                                                                </div>
                                                        </motion.div>
                                                );
                                        })}
                                </div>
                        </div>
                </section>
        );
}
