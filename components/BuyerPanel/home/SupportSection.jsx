"use client";

import { motion } from "framer-motion";
import { Truck, Headphones, Heart, Shield } from "lucide-react";

export default function SupportSection() {
        const supportItems = [
                {
                        icon: Truck,
                        title: "FAST SHIPPING",
                        description: "All Over India",
                },
                {
                        icon: Headphones,
                        title: "Give Us A Call",
                        description: "+919936814137",
                },
                {
                        icon: Heart,
                        title: "Email Us",
                        description: "info@industrialprintsolutions.com",
                },
                {
                        icon: Shield,
                        title: "Locations",
                        description: "Pan India Delivery",
                },
        ];

        return (
                <section className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-8 text-white shadow-[0_20px_60px_rgba(30,58,138,0.35)] backdrop-blur-xl sm:p-12">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(129,140,248,0.4),_transparent_60%)]" />
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.35),_transparent_55%)]" />

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {supportItems.map((item, index) => {
                                        const IconComponent = item.icon;
                                        return (
                                                <motion.div
                                                        key={item.title}
                                                        initial={{ opacity: 0, y: 28 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, amount: 0.3 }}
                                                        transition={{ delay: index * 0.08, duration: 0.6 }}
                                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-sky-200/60 hover:shadow-[0_16px_50px_rgba(56,189,248,0.35)]"
                                                >
                                                        <div className="absolute -top-16 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-violet-400/30 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                                        <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-400 shadow-[0_10px_30px_rgba(76,29,149,0.35)]">
                                                                <IconComponent className="h-6 w-6" />
                                                        </div>
                                                        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-100">
                                                                {item.title}
                                                        </h3>
                                                        <p className="mt-3 text-sm text-slate-200/80">
                                                                {item.description}
                                                        </p>
                                                </motion.div>
                                        );
                                })}
                        </div>
                </section>
        );
}
