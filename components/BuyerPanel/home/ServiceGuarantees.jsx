"use client";

import { motion } from "framer-motion";
import { Truck, Headphones, Shield } from "lucide-react";

export default function ServiceGuarantees() {
        const services = [
                {
                        icon: Truck,
                        title: "FREE AND FAST DELIVERY",
			description: "Free delivery for all orders",
		},
		{
			icon: Headphones,
			title: "24/7 CUSTOMER SERVICE",
			description: "Friendly 24/7 customer support",
		},
		{
			icon: Shield,
			title: "MONEY BACK GUARANTEE",
			description: "We return money within 30 days",
		},
	];

        return (
                <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        className="grid grid-cols-1 gap-6 text-white md:grid-cols-3"
                >
                        {services.map((service, index) => {
                                const IconComponent = service.icon;
                                return (
                                        <motion.div
                                                key={service.title}
                                                initial={{ opacity: 0, y: 32 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, amount: 0.3 }}
                                                transition={{ delay: index * 0.08, duration: 0.6 }}
                                                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 hover:border-sky-200/60 hover:shadow-[0_18px_50px_rgba(56,189,248,0.35)]"
                                        >
                                                <div className="absolute -top-16 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-violet-500/25 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-400 shadow-[0_12px_30px_rgba(76,29,149,0.35)]">
                                                        <IconComponent className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-100">
                                                        {service.title}
                                                </h3>
                                                <p className="mt-3 text-sm text-slate-200/80">
                                                        {service.description}
                                                </p>
                                        </motion.div>
                                );
                        })}
                </motion.div>
        );
}
