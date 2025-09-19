"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
        MapPin,
        Mail,
        Phone,
        Clock,
        Send,
        ShieldCheck,
        Building,
        Lock,
        Loader2,
} from "lucide-react";

const initialFormState = {
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
};

function validateForm(values) {
        const errors = {};

        if (!values.fullName.trim()) {
                errors.fullName = "Please tell us who we should reach out to.";
        }

        const email = values.email.trim();
        if (!email) {
                errors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.email = "Please enter a valid email address.";
        }

        if (!values.subject.trim()) {
                errors.subject = "Let us know what this is about.";
        }

        const message = values.message.trim();
        if (!message) {
                errors.message = "Message cannot be empty.";
        } else if (message.length < 20) {
                errors.message = "Please provide at least 20 characters so we can assist better.";
        }

        if (values.phone.trim() && !/^\+?[0-9\s-]{6,20}$/.test(values.phone.trim())) {
                errors.phone = "Please enter a valid phone number.";
        }

        return errors;
}

export default function ContactPage() {
        const [formValues, setFormValues] = useState(initialFormState);
        const [errors, setErrors] = useState({});
        const [isSubmitting, setIsSubmitting] = useState(false);

        const contactHighlights = useMemo(
                () => [
                        {
                                icon: ShieldCheck,
                                title: "Expert safety guidance",
                                description:
                                        "Decades of experience in industrial signage and compliance support at your disposal.",
                        },
                        {
                                icon: Building,
                                title: "Custom enterprise solutions",
                                description:
                                        "From plant walkthroughs to multi-site deployments, our team can craft solutions that scale.",
                        },
                        {
                                icon: Clock,
                                title: "Rapid response",
                                description:
                                        "We typically respond within one business day so your operations keep moving.",
                        },
                ],
                []
        );

        const contactDetails = useMemo(
                () => [
                        {
                                icon: Mail,
                                title: "Email",
                                content: (
                                        <a
                                                href="mailto:info@industrialprintsolutions.com"
                                                className="font-semibold text-blue-600"
                                        >
                                                info@industrialprintsolutions.com
                                        </a>
                                ),
                                helper: "Response in under 24 hours",
                        },
                        {
                                icon: Phone,
                                title: "Phone",
                                content: (
                                        <a href="tel:+919936814137" className="font-semibold text-blue-600">
                                                +91 99368 14137
                                        </a>
                                ),
                                helper: "Call between 10:00–18:00 IST",
                        },
                        {
                                icon: MapPin,
                                title: "Visit our studio",
                                content: (
                                        <span className="font-medium text-gray-700">
                                                Industrial Print Solutions, SCO 10, Sector 65, Mohali, Punjab – 160062
                                        </span>
                                ),
                                helper: "Visits by prior appointment",
                        },
                ],
                []
        );

        const responseAssurances = useMemo(
                () => [
                        {
                                icon: Clock,
                                title: "Same-day acknowledgement",
                                description:
                                        "Requests submitted before 3:00 PM IST receive a callback or email within the day.",
                        },
                        {
                                icon: ShieldCheck,
                                title: "Specialists on every brief",
                                description:
                                        "Our compliance experts review each enquiry to recommend the right materials and signage mix.",
                        },
                        {
                                icon: Building,
                                title: "Enterprise-ready coordination",
                                description:
                                        "Rollouts across multiple facilities are handled by a dedicated IPS account lead for smooth execution.",
                        },
                ],
                []
        );

        const handleChange = (event) => {
                const { name, value } = event.target;
                setFormValues((prev) => ({
                        ...prev,
                        [name]: value,
                }));
        };

        const handleSubmit = async (event) => {
                event.preventDefault();

                const validationErrors = validateForm(formValues);
                if (Object.keys(validationErrors).length > 0) {
                        setErrors(validationErrors);
                        toast.error("Please review the highlighted fields and try again.");
                        return;
                }

                setErrors({});
                setIsSubmitting(true);

                try {
                        const response = await fetch("/api/contact", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(formValues),
                        });

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                                throw new Error(
                                        data?.error || "We couldn't send your request. Please try again later."
                                );
                        }

                        toast.success(
                                "Thanks for connecting with Industrial Print Solutions. Our team will reach out soon!"
                        );
                        setFormValues(initialFormState);
                } catch (error) {
                        console.error("Contact form submission failed", error);
                        toast.error(error.message || "Something went wrong. Please try again.");
                } finally {
                        setIsSubmitting(false);
                }
        };

        return (
                <div className="bg-gray-50">
                        <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 py-24 text-white sm:py-28">
                                <div className="pointer-events-none absolute inset-0 opacity-20">
                                        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-white blur-3xl" />
                                        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-400 blur-3xl" />
                                </div>
                                <div className="relative mx-auto max-w-6xl px-6 text-center">
                                        <Badge
                                                variant="secondary"
                                                className="mx-auto mb-6 w-fit rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white/90"
                                        >
                                                Contact Industrial Print Solutions
                                        </Badge>
                                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                                Let's build safer and more compliant workplaces together
                                        </h1>
                                        <p className="mx-auto mt-6 max-w-3xl text-base text-blue-100 sm:text-lg">
                                                Share your signage needs, compliance questions, or rollout plans. Our specialists reply
                                                with actionable guidance and transparent pricing within one business day.
                                        </p>
                                </div>
                        </section>

                        <section className="relative mx-auto -mt-24 max-w-6xl px-6 pb-24">
                                <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.45 }}
                                        className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_25px_70px_-20px_rgba(37,99,235,0.35)]"
                                >
                                        <div
                                                className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-blue-50 via-transparent to-transparent opacity-70"
                                                aria-hidden="true"
                                        />
                                        <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                                                <div className="space-y-10">
                                                        <div>
                                                                <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                                                        Talk to a specialist
                                                                </span>
                                                                <h2 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
                                                                        Reach us through the channel that works for you
                                                                </h2>
                                                                <p className="mt-3 max-w-2xl text-sm text-gray-600 sm:text-base">
                                                                        We pair industrial print expertise with quick, human support. Choose a direct line or submit the
                                                                        form — either way we’ll map the safest path for your workplaces.
                                                                </p>
                                                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                                        {contactDetails.map((detail) => (
                                                                                <div
                                                                                        key={detail.title}
                                                                                        className="group rounded-2xl border border-blue-100 bg-white/80 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
                                                                                >
                                                                                        <div className="flex items-start gap-3">
                                                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-700">
                                                                                                        <detail.icon className="h-5 w-5" />
                                                                                                </div>
                                                                                                <div>
                                                                                                        <p className="text-sm font-semibold text-gray-900">{detail.title}</p>
                                                                                                        <div className="mt-1 text-sm leading-relaxed text-gray-600 [&_a]:font-semibold [&_a]:text-blue-600 [&_a]:hover:text-blue-700">
                                                                                                                {detail.content}
                                                                                                        </div>
                                                                                                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-blue-700/70">
                                                                                                                {detail.helper}
                                                                                                        </p>
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        </div>

                                                        <div className="grid gap-4 lg:grid-cols-2">
                                                                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-6 shadow-inner">
                                                                        <h3 className="text-lg font-semibold text-blue-900">Why teams choose IPS</h3>
                                                                        <div className="mt-4 space-y-4">
                                                                                {contactHighlights.map((highlight) => (
                                                                                        <div
                                                                                                key={highlight.title}
                                                                                                className="flex gap-3 rounded-xl bg-white/70 p-4 shadow-sm ring-1 ring-blue-100/60"
                                                                                        >
                                                                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/10 text-blue-700">
                                                                                                        <highlight.icon className="h-4 w-4" />
                                                                                                </div>
                                                                                                <div>
                                                                                                        <p className="text-sm font-semibold text-blue-900">{highlight.title}</p>
                                                                                                        <p className="text-xs text-blue-900/70">{highlight.description}</p>
                                                                                                </div>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                </div>
                                                                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                                                                        <h3 className="text-lg font-semibold text-gray-900">Our response promise</h3>
                                                                        <ul className="mt-4 space-y-4 text-sm text-gray-600">
                                                                                {responseAssurances.map((assurance) => (
                                                                                        <li key={assurance.title} className="flex items-start gap-3">
                                                                                                <assurance.icon className="mt-0.5 h-5 w-5 text-blue-600" />
                                                                                                <div>
                                                                                                        <p className="font-semibold text-gray-800">{assurance.title}</p>
                                                                                                        <p className="mt-1 text-sm text-gray-600">{assurance.description}</p>
                                                                                                </div>
                                                                                        </li>
                                                                                ))}
                                                                        </ul>
                                                                </div>
                                                        </div>
                                                </div>

                                                <div className="space-y-6">
                                                        <Card className="h-full border-blue-100 shadow-xl ring-1 ring-blue-100/50">
                                                                <CardHeader className="space-y-3 pb-0">
                                                                        <CardTitle className="text-2xl font-semibold text-gray-900">
                                                                                Tell us about your requirement
                                                                        </CardTitle>
                                                                        <p className="text-sm text-gray-500">
                                                                                Share a few details so our specialists can prepare tailored signage and compliance
                                                                                recommendations for your facility.
                                                                        </p>
                                                                </CardHeader>
                                                                <CardContent className="pt-6">
                                                                        <form onSubmit={handleSubmit} className="space-y-5">
                                                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                                                                                        <div>
                                                                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                                                        Full name
                                                                                                </label>
                                                                                                <Input
                                                                                                        name="fullName"
                                                                                                        value={formValues.fullName}
                                                                                                        onChange={handleChange}
                                                                                                        placeholder="Enter your name"
                                                                                                        aria-invalid={errors.fullName ? "true" : "false"}
                                                                                                        aria-describedby={errors.fullName ? "contact-fullName-error" : undefined}
                                                                                                />
                                                                                                {errors.fullName && (
                                                                                                        <p
                                                                                                                id="contact-fullName-error"
                                                                                                                className="mt-1 text-xs text-red-600"
                                                                                                        >
                                                                                                                {errors.fullName}
                                                                                                        </p>
                                                                                                )}
                                                                                        </div>
                                                                                        <div>
                                                                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                                                        Email address
                                                                                                </label>
                                                                                                <Input
                                                                                                        name="email"
                                                                                                        type="email"
                                                                                                        value={formValues.email}
                                                                                                        onChange={handleChange}
                                                                                                        placeholder="you@company.com"
                                                                                                        aria-invalid={errors.email ? "true" : "false"}
                                                                                                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                                                                                                />
                                                                                                {errors.email && (
                                                                                                        <p
                                                                                                                id="contact-email-error"
                                                                                                                className="mt-1 text-xs text-red-600"
                                                                                                        >
                                                                                                                {errors.email}
                                                                                                        </p>
                                                                                                )}
                                                                                        </div>
                                                                                        <div>
                                                                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                                                        Phone (optional)
                                                                                                </label>
                                                                                                <Input
                                                                                                        name="phone"
                                                                                                        value={formValues.phone}
                                                                                                        onChange={handleChange}
                                                                                                        placeholder="+91 90000 00000"
                                                                                                        aria-invalid={errors.phone ? "true" : "false"}
                                                                                                        aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                                                                                                />
                                                                                                {errors.phone && (
                                                                                                        <p
                                                                                                                id="contact-phone-error"
                                                                                                                className="mt-1 text-xs text-red-600"
                                                                                                        >
                                                                                                                {errors.phone}
                                                                                                        </p>
                                                                                                )}
                                                                                        </div>
                                                                                        <div>
                                                                                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                                                        Subject
                                                                                                </label>
                                                                                                <Input
                                                                                                        name="subject"
                                                                                                        value={formValues.subject}
                                                                                                        onChange={handleChange}
                                                                                                        placeholder="Tell us how we can help"
                                                                                                        aria-invalid={errors.subject ? "true" : "false"}
                                                                                                        aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                                                                                                />
                                                                                                {errors.subject && (
                                                                                                        <p
                                                                                                                id="contact-subject-error"
                                                                                                                className="mt-1 text-xs text-red-600"
                                                                                                        >
                                                                                                                {errors.subject}
                                                                                                        </p>
                                                                                                )}
                                                                                        </div>
                                                                                </div>
                                                                                <div>
                                                                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                                                Message
                                                                                        </label>
                                                                                        <Textarea
                                                                                                name="message"
                                                                                                value={formValues.message}
                                                                                                onChange={handleChange}
                                                                                                placeholder="Share project details, quantities, compliance needs or timelines"
                                                                                                rows={6}
                                                                                                aria-invalid={errors.message ? "true" : "false"}
                                                                                                aria-describedby={errors.message ? "contact-message-error" : undefined}
                                                                                        />
                                                                                        {errors.message && (
                                                                                                <p
                                                                                                        id="contact-message-error"
                                                                                                        className="mt-1 text-xs text-red-600"
                                                                                                >
                                                                                                        {errors.message}
                                                                                                </p>
                                                                                        )}
                                                                                </div>
                                                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                                        <p className="text-sm text-gray-500">
                                                                                                By submitting this form you agree to be contacted regarding Industrial Print Solutions services.
                                                                                        </p>
                                                                                        <Button
                                                                                                type="submit"
                                                                                                className="min-w-[160px] justify-center gap-2"
                                                                                                disabled={isSubmitting}
                                                                                                aria-busy={isSubmitting}
                                                                                        >
                                                                                                {isSubmitting ? (
                                                                                                        <span className="flex items-center gap-2">
                                                                                                                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                                                                                                        </span>
                                                                                                ) : (
                                                                                                        <span className="flex items-center gap-2">
                                                                                                                <Send className="h-4 w-4" /> Submit inquiry
                                                                                                        </span>
                                                                                                )}
                                                                                        </Button>
                                                                                </div>
                                                                        </form>
                                                                </CardContent>
                                                        </Card>

                                                        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-blue-900 shadow-sm">
                                                                <Lock className="h-5 w-5" />
                                                                <span>
                                                                        Your project brief stays confidential — IPS signs NDAs and keeps your artwork protected.
                                                                </span>
                                                        </div>
                                                </div>
                                        </div>
                                </motion.div>
                        </section>
                        <Toaster position="top-right" />
                </div>
        );
}
