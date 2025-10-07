"use client";

import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Handshake,
  Factory,
  FileText,
  QrCode,
} from "lucide-react";

const aboutItems = [
        {
                icon: Target,
                title: "Mission",
                tagline: "Simplifying Safety. Building Trust.",
                description:
                        "IPS exists to make factories safer, smarter and more self-reliant. From posters and signages to 3D boards, training, and safety consulting — we simplify safety, solve problems, and serve with purpose.",
        },
        {
                icon: Eye,
                title: "Vision",
                tagline: "Transforming Every Factory in India",
                description:
                        "We imagine a future where safety isn’t a formality — it’s a culture. Whether it’s a poster, a wallboard, or a full training session — IPS is here to build safer workplaces, one factory at a time.",
        },
        {
                icon: Handshake,
                title: "Core Values",
                tagline: "Think Like a Worker. Deliver Like a Partner.",
                description:
                        "Our values come from the shopfloor — not a boardroom. We respect time, solve problems quickly, and stand by our word. That’s why our customers treat us like their own team.",
        },
        {
                icon: Factory,
                title: "Built From the Floor",
                tagline: "We’ve Been in Your Shoes",
                description:
                        "IPS wasn’t born in a boardroom — it was built in the heat, dust, and deadlines of real factories. That’s why we understand your needs better than anyone else ever will.",
        },
        {
                icon: FileText,
                title: "Custom Posters for Real Problems.",
                tagline: "We Know the Pain. We Print the Cure.",
                description:
                        "You don’t have time to chase designs, translate content, or explain safety again and again. Just tell us what you need — we’ll create factory-ready posters that fit your people, your floor, your rules.",
        },
        {
                icon: QrCode,
                title: "Not Just Posters. A Safety System.",
                tagline: "QR Prints. Custom Designs. Monthly Delivery.",
                description:
                        "We solve your safety challenges with visuals that work — built for your floor, branded with your identity, and delivered every month without fail. IPS is more than printing — we’re your silent safety partner.",
        },
];

export default function AboutSection() {
        return (
                <section className="relative overflow-hidden py-20">
                        <div className="absolute inset-0 bg-slate-900" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(67,56,202,0.35),_transparent_55%)]" />
                        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                <motion.div
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="mx-auto mb-16 max-w-3xl text-center"
                                >
                                        <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                                                Who we are
                                        </span>
                                        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                                                Purpose-led, factory-tested expertise
                                        </h2>
                                        <p className="mt-4 text-sm text-slate-200 sm:text-base">
                                                Six pillars define the way IPS designs, produces and delivers industrial safety
                                                experiences that people remember and trust.
                                        </p>
                                </motion.div>

                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {aboutItems.map((item, index) => {
                                                const Icon = item.icon;
                                                return (
                                                        <motion.div
                                                                key={item.title}
                                                                initial={{ opacity: 0, y: 30 }}
                                                                whileInView={{ opacity: 1, y: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_25px_70px_-40px_rgba(15,23,42,0.9)] backdrop-blur"
                                                        >
                                                                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/5 transition-all duration-500 group-hover:scale-150" />
                                                                <div className="relative flex flex-col gap-4">
                                                                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-lg">
                                                                                <Icon className="h-6 w-6" />
                                                                        </span>
                                                                        <div>
                                                                                <h3 className="text-xl font-semibold text-white">
                                                                                        {item.title}
                                                                                </h3>
                                                                                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-indigo-200">
                                                                                        {item.tagline}
                                                                                </p>
                                                                        </div>
                                                                        <p className="text-sm leading-relaxed text-slate-200">
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

