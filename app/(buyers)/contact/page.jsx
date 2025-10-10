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
        Mail,
        Phone,
        Clock,
        Send,
        ShieldCheck,
        Loader2,
        Navigation,
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
                                icon: Phone,
                                title: "Order Related Query",
                                primary: (
                                        <a href="tel:+919936814137" className="text-base font-semibold text-blue-700">
                                                +91 99368 14137
                                        </a>
                                ),
                                description: "Call us Monday to Saturday, 10:00 AM – 6:00 PM",
                        },
                        {
                                icon: ShieldCheck,
                                title: "After Sales Service",
                                primary: (
                                        <a
                                                href="tel:+918052585504"
                                                className="text-base font-semibold text-blue-700"
                                        >
                                                +91 80525 85504
                                        </a>
                                ),
                                description: "Quick resolutions for installations and maintenance",
                        },
                        {
                                icon: Mail,
                                title: "Email Support",
                                primary: (
                                        <a
                                                href="mailto:support@industrialprintsolutions.com"
                                                className="text-base font-semibold text-blue-700"
                                        >
                                                support@industrialprintsolutions.com
                                        </a>
                                ),
                                description: "Share requirements or bulk orders anytime",
                        },
                ],
                []
        );

        const officeInformation = useMemo(
                () => [
                        {
                                icon: Navigation,
                                label: "Office Address",
                                value: (
                                        <span className="text-sm text-gray-600">
                                                Industrial Print Solutions
                                                <br />127/196, U-Block, Niralanagar, Kanpur (UP)
                                                <br />208014, India
                                        </span>
                                ),
                        },
                        {
                                icon: Clock,
                                label: "Working Hours",
                                value: <span className="text-sm text-gray-600">Monday – Saturday, 10:00 AM – 6:00 PM</span>,
                        },
                        {
                                icon: ShieldCheck,
                                label: "Customer Care",
                                value: (
                                        <a href="mailto:info@industrialprintsolutions.com" className="text-sm font-medium text-blue-700">
                                                info@industrialprintsolutions.com
                                        </a>
                                ),
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
                        <section className="py-16 sm:py-20">
                                <div className="mx-auto max-w-6xl px-6 text-center md:text-left">
                                        <Badge className="mx-auto mb-4 w-fit md:mx-0" variant="secondary">
                                                We're here to help
                                        </Badge>
                                        <div className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:items-center">
                                                <div>
                                                        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                                                Let us know how we can support your safety goals
                                                        </h1>
                                                        <p className="mt-4 text-sm text-gray-600 sm:text-base">
                                                                Reach Industrial Print Solutions for order assistance, after-sales support, or compliance
                                                                consultations. Choose a contact method below or send an enquiry — our team responds within a
                                                                business day.
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </section>

                        <section className="bg-white py-10 sm:py-12">
                                <div className="mx-auto max-w-6xl px-6">
                                        <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="grid gap-6 md:grid-cols-3"
                                        >
                                                {contactHighlights.map((item) => (
                                                        <div
                                                                key={item.title}
                                                                className="flex h-full flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/40 p-6 shadow-sm"
                                                        >
                                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-700">
                                                                        <item.icon className="h-6 w-6" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <p className="text-lg font-semibold text-gray-900">{item.title}</p>
                                                                        <div className="text-sm text-gray-600">{item.primary}</div>
                                                                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700/70">
                                                                                {item.description}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                ))}
                                        </motion.div>
                                </div>
                        </section>

                        <section className="py-14">
                                <div className="mx-auto max-w-6xl px-6">
                                        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                                                <div className="space-y-6">
                                                        <Card className="border-blue-100 shadow-sm">
                                                                <CardHeader className="space-y-2 pb-3">
                                                                        <CardTitle className="text-2xl font-semibold text-gray-900">
                                                                                Visit or reach our office
                                                                        </CardTitle>
                                                                        <p className="text-sm text-gray-500">
                                                                                Walk in with a prior appointment for tailored signage consultations or connect remotely using the
                                                                                details below.
                                                                        </p>
                                                                </CardHeader>
                                                                <CardContent className="space-y-4">
                                                                        {officeInformation.map((info) => (
                                                                                <div key={info.label} className="flex items-start gap-3">
                                                                                        <info.icon className="mt-1 h-5 w-5 text-blue-600" />
                                                                                        <div>
                                                                                                <p className="text-sm font-semibold text-gray-800">{info.label}</p>
                                                                                                <div className="mt-1">{info.value}</div>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </CardContent>
                                                        </Card>

                                                        <div className="overflow-hidden rounded-3xl border border-blue-100 shadow-lg">
                                                                <iframe
                                                                        title="Industrial Print Solutions on Google Maps"
                                                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3395.599662362024!2d80.3103163!3d26.444222099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c47f11b9bc73b%3A0x4352d2ed59d2705a!2sIndustrial%20Print%20Solutions!5e1!3m2!1sen!2sin!4v1760083368875!5m2!1sen!2sin"
                                                                        className="h-80 w-full border-0"
                                                                        allowFullScreen=""
                                                                        loading="lazy"
                                                                        referrerPolicy="no-referrer-when-downgrade"
                                                                />
                                                        </div>
                                                </div>

                                                <Card className="border-blue-100 shadow-xl">
                                                        <CardHeader className="space-y-3 pb-0">
                                                                <CardTitle className="text-2xl font-semibold text-gray-900">
                                                                        Send your enquiry
                                                                </CardTitle>
                                                                <p className="text-sm text-gray-500">
                                                                        Fill in a few details and our specialists will reply with customised suggestions and pricing within
                                                                        one business day.
                                                                </p>
                                                        </CardHeader>
                                                        <CardContent className="pt-6">
                                                                <form onSubmit={handleSubmit} className="space-y-5">
                                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                                                                                <div>
                                                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
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
                                                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
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
                                                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Phone (optional)</label>
                                                                                        <Input
                                                                                                name="phone"
                                                                                                value={formValues.phone}
                                                                                                onChange={handleChange}
                                                                                                placeholder="Include country code"
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
                                                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Subject</label>
                                                                                        <Input
                                                                                                name="subject"
                                                                                                value={formValues.subject}
                                                                                                onChange={handleChange}
                                                                                                placeholder="How can we help?"
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
                                                                                <label className="mb-1 block text-sm font-medium text-gray-700">Message</label>
                                                                                <Textarea
                                                                                        name="message"
                                                                                        value={formValues.message}
                                                                                        onChange={handleChange}
                                                                                        placeholder="Describe your requirement in detail so we can assist effectively."
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
                                                                        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                                                                <p className="text-xs text-gray-500">
                                                                                        We respect your privacy — your contact details stay with us.
                                                                                </p>
                                                                                <Button
                                                                                        type="submit"
                                                                                        className="min-w-[150px] bg-blue-600 hover:bg-blue-700"
                                                                                        disabled={isSubmitting}
                                                                                >
                                                                                        {isSubmitting ? (
                                                                                                <>
                                                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                                        Sending
                                                                                                </>
                                                                                        ) : (
                                                                                                <>
                                                                                                        Send enquiry
                                                                                                        <Send className="ml-2 h-4 w-4" />
                                                                                                </>
                                                                                        )}
                                                                                </Button>
                                                                        </div>
                                                                </form>
                                                        </CardContent>
                                                </Card>
                                        </div>
                                </div>
                        </section>

                        <Toaster position="top-center" />
                </div>
        );
}
