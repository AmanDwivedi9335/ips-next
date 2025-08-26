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
    <section className="py-8 md:py-16 bg-white">
      <div className="px-10">
        {/* tst */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {aboutItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-6 flex flex-col items-center text-center bg-white shadow-sm"
              >
                <div className="w-12 h-12 mb-4 bg-black rounded-full flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">{item.title}</h3>
                <p className="text-yellow-500 font-medium mb-2">
                  {item.tagline}
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

