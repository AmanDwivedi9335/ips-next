"use client";

import { motion } from "framer-motion";
import { Truck, Headphones, Shield } from "lucide-react";

export default function ServiceGuarantees() {
        const services = [
                {
                        icon: Truck,
                        title: "Free and fast delivery",
                        description: "Nationwide logistics for every order",
                },
                {
                        icon: Headphones,
                        title: "24/7 customer success",
                        description: "Dedicated specialists when you need them",
                },
                {
                        icon: Shield,
                        title: "Money-back assurance",
                        description: "30-day hassle-free returns on eligible items",
                },
        ];

        return (
                <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 gap-6 md:grid-cols-3"
                >
                        {services.map((service, index) => {
                                const IconComponent = service.icon;
                                return (
                                        <div
                                                key={service.title}
                                                className="group rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-white shadow-[0_35px_70px_-50px_rgba(15,23,42,0.9)] backdrop-blur"
                                        >
                                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-900 transition-transform duration-300 group-hover:scale-105">
                                                        <IconComponent className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-base font-semibold uppercase tracking-wider">
                                                        {service.title}
                                                </h3>
                                                <p className="mt-2 text-sm text-indigo-100/80">
                                                        {service.description}
                                                </p>
                                        </div>
                                );
                        })}
                </motion.div>
        );
}
