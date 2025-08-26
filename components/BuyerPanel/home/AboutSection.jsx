"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, CalendarClock, Headphones } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Cost Effective Solution",
    description:
      "We provide best customize solutions to our customers as per their unique requirements.",
  },
  {
    icon: Users,
    title: "Professional Team",
    description:
      "Our extremely competent team will discuss with you and analyse the root cause in order to offer tailored solutions for you.",
  },
  {
    icon: CalendarClock,
    title: "Years of Experience",
    description:
      "With more than 23+ years of experience in the consulting and service industries, we have optimised results to overcome the market.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Trained and experienced staff are assigned to support you concerning any hurdles in business growth.",
  },
];

export default function AboutSection() {
  return (
    <section className="relative bg-black py-16 text-white">
      <div className="px-10">
        <div className="mb-12 max-w-xl">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Sharing Expertise,
            <br />
            Creating Excellence
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg bg-neutral-900 p-6 h-full"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-500/10 mb-4">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="absolute left-0 bottom-0 hidden md:block border-y-[60px] border-y-transparent border-r-[120px] border-r-red-600"></div>
    </section>
  );
}

