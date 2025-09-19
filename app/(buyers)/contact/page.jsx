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
                                        <a href="mailto:info@industrialprintsolutions.com" className="text-blue-600">
                                                info@industrialprintsolutions.com
                                        </a>
                                ),
                                helper: "Reach us anytime – we reply within 24 hours.",
                        },
                        {
                                icon: Phone,
                                title: "Phone",
                                content: (
                                        <a href="tel:+919936814137" className="text-blue-600">
                                                +91 99368 14137
                                        </a>
                                ),
                                helper: "Available 10:00–18:00 IST, Monday to Saturday.",
                        },
                        {
                                icon: MapPin,
                                title: "Visit our studio",
                                content: (
                                        <span>
                                                Industrial Print Solutions, SCO 10, Sector 65, Mohali, Punjab – 160062
                                        </span>
                                ),
                                helper: "Drop by for design consultations and print reviews (by appointment).",
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
                        <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 py-16 text-white">
                                <div className="pointer-events-none absolute inset-0 opacity-20">
                                        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-white blur-3xl" />
                                        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-400 blur-3xl" />
                                </div>
                                <div className="relative mx-auto max-w-5xl px-6 text-center">
                                        <Badge variant="secondary" className="mb-4 bg-white/20 text-white">
                                                We're here to help
                                        </Badge>
                                        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                                                Let's build a safer workspace together
                                        </h1>
                                        <p className="mx-auto mt-4 max-w-3xl text-base text-blue-100 sm:text-lg">
                                                Share your requirements for safety posters, compliance signage, or onboarding kits – our
                                                specialists will guide you with tailored recommendations and transparent pricing.
                                        </p>
                                </div>
                        </section>

                        <section className="mx-auto max-w-6xl px-6 pb-16">
                                <div className="-mt-20 grid grid-cols-1 gap-6 lg:grid-cols-[1fr,1.3fr]">
                                        <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                        >
                                                <Card className="shadow-xl">
                                                        <CardHeader>
                                                                <CardTitle className="text-2xl font-semibold text-gray-900">
                                                                        Tell us about your requirement
                                                                </CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                                <form onSubmit={handleSubmit} className="space-y-5">
                                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                                                        By submitting this form you agree to be contacted regarding Industrial Print Solutions
                                                                                        services.
                                                                                </p>
                                                                                <Button
                                                                                        type="submit"
                                                                                        className="gap-2"
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
                                        </motion.div>

                                        <motion.div
                                                initial={{ opacity: 0, y: 40 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.1 }}
                                                className="space-y-6"
                                        >
                                                <Card className="h-full border-blue-100 bg-white">
                                                        <CardHeader>
                                                                <CardTitle className="text-xl font-semibold text-gray-900">
                                                                        Connect with our team
                                                                </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-6">
                                                                {contactDetails.map((detail) => (
                                                                        <div key={detail.title} className="flex gap-4 rounded-lg border border-blue-50 p-4">
                                                                                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                                                                        <detail.icon className="h-5 w-5" />
                                                                                </div>
                                                                                <div>
                                                                                        <h3 className="text-base font-semibold text-gray-900">
                                                                                                {detail.title}
                                                                                        </h3>
                                                                                        <p className="mt-1 text-sm text-gray-700">{detail.content}</p>
                                                                                        <p className="mt-1 text-xs text-gray-500">{detail.helper}</p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </CardContent>
                                                </Card>

                                                <Card className="border border-dashed border-blue-200 bg-blue-50/70">
                                                        <CardHeader>
                                                                <CardTitle className="text-lg font-semibold text-blue-900">
                                                                        Why teams choose IPS
                                                                </CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="space-y-4">
                                                                {contactHighlights.map((highlight) => (
                                                                        <div key={highlight.title} className="flex gap-3">
                                                                                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white text-blue-700 shadow">
                                                                                        <highlight.icon className="h-4 w-4" />
                                                                                </div>
                                                                                <div>
                                                                                        <p className="text-sm font-semibold text-blue-900">
                                                                                                {highlight.title}
                                                                                        </p>
                                                                                        <p className="text-xs text-blue-800/80">
                                                                                                {highlight.description}
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                        </CardContent>
                                                </Card>
                                        </motion.div>
                                </div>
                        </section>
                        <Toaster position="top-right" />
                </div>
        );
}
