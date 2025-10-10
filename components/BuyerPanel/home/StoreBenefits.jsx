"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Boxes, Recycle, Lightbulb } from "lucide-react";

const benefits = [
        {
                icon: ShieldCheck,
                title: "Certified safety compliance",
                description:
                        "Every poster is developed with OSHA and IS standards in mind, reviewed by our in-house safety specialists.",
        },
        {
                icon: Boxes,
                title: "Prints that last on the shopfloor",
                description:
                        "High-visibility substrates with UV, moisture and abrasion resistance keep your instructions readable for years.",
        },
        {
                icon: Recycle,
                title: "Sustainable manufacturing",
                description:
                        "Responsibly sourced inks and recyclable materials make every order friendlier to your ESG goals.",
        },
        {
                icon: Lightbulb,
                title: "Design support on demand",
                description:
                        "Need a custom workflow or bilingual signage? Collaborate with our creative team at no extra brief cost.",
        },
];

const stats = [
        { label: "Factories guided", value: "450+" },
        { label: "SKUs ready to dispatch", value: "2.5k" },
        { label: "Avg. delivery time", value: "4.2 days" },
];

export default function StoreBenefits() {
        return (
                <section className="relative overflow-hidden py-24">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1026] via-[#141b3a] to-[#020510]" />
                        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#5b7cff]/20 blur-3xl" />
                        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#f0abfc]/10 blur-3xl" />

                        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                                        <motion.div
                                                initial={{ opacity: 0, y: 24 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                className="space-y-8 text-white"
                                        >
                                                <div className="space-y-4">
                                                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]">
                                                                Why IPS store
                                                        </span>
                                                        <h2 className="text-3xl font-semibold sm:text-4xl lg:text-5xl">
                                                                Built for demanding shopfloors
                                                        </h2>
                                                        <p className="max-w-xl text-sm text-white/70 sm:text-base">
                                                                Move from browsing to compliance faster with a partner that understands industrial realities—tight timelines, stringent audits and the need for zero downtime.
                                                        </p>
                                                </div>

                                                <div className="grid gap-6 sm:grid-cols-2">
                                                        {benefits.map((benefit, index) => {
                                                                const Icon = benefit.icon;
                                                                return (
                                                                        <motion.div
                                                                                key={benefit.title}
                                                                                initial={{ opacity: 0, y: 16 }}
                                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                                viewport={{ once: true }}
                                                                                transition={{ delay: index * 0.08 }}
                                                                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                                                                        >
                                                                                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                                                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10" />
                                                                                </div>
                                                                                <div className="relative flex flex-col gap-4">
                                                                                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                                                                                                <Icon className="h-5 w-5" />
                                                                                        </span>
                                                                                        <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                                                                                        <p className="text-sm leading-relaxed text-white/70">{benefit.description}</p>
                                                                                </div>
                                                                        </motion.div>
                                                                );
                                                        })}
                                                </div>
                                        </motion.div>

                                        <motion.div
                                                initial={{ opacity: 0, y: 28 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.2 }}
                                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 text-white shadow-[0_35px_60px_-40px_rgba(15,23,42,0.65)] backdrop-blur"
                                        >
                                                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#5b7cff]/30 blur-3xl" />
                                                <div className="absolute -bottom-10 left-6 h-28 w-28 rounded-full bg-[#f0abfc]/20 blur-2xl" />
                                                <div className="relative space-y-6">
                                                        <p className="text-sm uppercase tracking-[0.35em] text-white/60">Numbers that matter</p>
                                                        <h3 className="text-2xl font-semibold sm:text-3xl">Operational advantages on day one</h3>
                                                        <div className="grid gap-5 sm:grid-cols-3">
                                                                {stats.map((stat) => (
                                                                        <div key={stat.label} className="rounded-2xl bg-white/5 p-4 text-center">
                                                                                <p className="text-2xl font-semibold sm:text-3xl">{stat.value}</p>
                                                                                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
                                                                                        {stat.label}
                                                                                </p>
                                                                        </div>
                                                                ))}
                                                        </div>
                                                        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
                                                                <p>
                                                                        "IPS transformed our audit readiness. Posters arrived coded, catalogued and ready for installation."
                                                                </p>
                                                                <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/50">
                                                                        EHS Lead, Automotive OEM
                                                                </p>
                                                        </div>
                                                </div>
                                        </motion.div>
                                </div>
                        </div>
                </section>
        );
}
