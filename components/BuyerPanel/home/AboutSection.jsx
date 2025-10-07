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
    <section className="relative isolate">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.12),_transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(76,29,149,0.25),rgba(14,165,233,0.15))]" />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-sky-200/80 backdrop-blur">
            Story
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Built in factories. Crafted for factory teams.
          </h2>
          <p className="mt-3 text-base text-slate-200/75">
            The IPS promise is rooted in real shopfloor experience. Our mission, vision and values are all laser-focused on making safety communication effortless for every industrial team.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {aboutItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 32, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 hover:border-sky-200/70 hover:shadow-[0_20px_70px_rgba(56,189,248,0.35)]"
              >
                <div className="absolute -top-20 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-400 shadow-[0_15px_35px_rgba(76,29,149,0.35)]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-sky-200">
                  {item.tagline}
                </p>
                <p className="mt-4 text-sm text-slate-100/80">
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

