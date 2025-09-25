"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
        Accordion,
        AccordionContent,
        AccordionItem,
        AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, Mail, FileText, ExternalLink } from "lucide-react";
import { useLoggedInUser } from "@/store/authStore";

const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
                opacity: 1,
                y: 0,
                transition: {
                        delay: i * 0.1,
                        duration: 0.5,
                },
        }),
};

const faqs = [
        {
                question: "How do I track my order?",
                answer:
                        "You can track your order by going to the Order History section and clicking on the order you want to track. You'll see real-time updates on your order status.",
        },
        {
                question: "What is your return policy?",
                answer:
                        "We offer a 30-day return policy for most items. Items must be in original condition with tags attached. Some restrictions apply for certain product categories.",
        },
        {
                question: "How do I change my shipping address?",
                answer:
                        "You can update your shipping address in the My Profile section under Addresses. Make sure to save your changes before placing your next order.",
        },
        {
                question: "How do I cancel my order?",
                answer:
                        "Orders can be cancelled within 1 hour of placement if they haven't been processed yet. Go to Order History and click the cancel button next to your order.",
        },
        {
                question: "What payment methods do you accept?",
                answer:
                        "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and various UPI methods. You can manage your payment methods in the Payment Options section.",
        },
];

const contactMethods = [
        {
                icon: Phone,
                title: "Phone Support",
                description: "Call us for immediate assistance",
                action: "Call +91 99368 14137",
                available: "Mon-Fri 10:00–18:00 IST",
                href: "tel:+919936814137",
        },
        {
                icon: Mail,
                title: "Email Support",
                description: "Send us a detailed message",
                action: "Email info@industrialprintsolutions.com",
                available: "Response within 24 hours",
                href: "mailto:info@industrialprintsolutions.com",
        },
];

const quickLinks = [
        { title: "Terms of Service", href: "/terms" },
        { title: "Privacy Policy", href: "/privacy-policy" },
        { title: "Shipping Information", href: "/shipping-delivery-policy" },
        { title: "Return & Refund Policy", href: "/cancellation-refund-policy" },
];

function getUserFullName(user) {
        if (!user) {
                return "";
        }

        const parts = [user.firstName, user.lastName]
                .map((value) => (typeof value === "string" ? value.trim() : ""))
                .filter(Boolean);

        if (parts.length > 0) {
                return parts.join(" ");
        }

        if (typeof user.name === "string") {
                return user.name.trim();
        }

        return "";
}

function validateForm({ subject, category, message }) {
        const errors = {};

        const trimmedSubject = subject.trim();
        const trimmedCategory = category.trim();
        const trimmedMessage = message.trim();

        if (!trimmedSubject) {
                errors.subject = "Subject is required.";
        }

        if (!trimmedCategory) {
                errors.category = "Please tell us which area you need help with.";
        }

        if (!trimmedMessage) {
                errors.message = "Message cannot be empty.";
        } else if (trimmedMessage.length < 20) {
                errors.message = "Please provide at least 20 characters so our team can assist.";
        }

        return errors;
}

export function HelpCenter() {
        const user = useLoggedInUser();
        const fullName = useMemo(() => getUserFullName(user), [user]);
        const email = useMemo(
                () => (typeof user?.email === "string" ? user.email.trim() : ""),
                [user]
        );
        const phone = useMemo(
                () => (typeof user?.mobile === "string" ? user.mobile.trim() : ""),
                [user]
        );

        const [formValues, setFormValues] = useState({
                subject: "",
                category: "",
                message: "",
        });
        const [formErrors, setFormErrors] = useState({});
        const [formStatus, setFormStatus] = useState(null);
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleInputChange = (field) => (event) => {
                const value = event.target.value;
                setFormValues((previous) => ({
                        ...previous,
                        [field]: value,
                }));
        };

        const handleSubmit = async (event) => {
                event.preventDefault();

                if (!fullName || !email) {
                        setFormStatus({
                                type: "error",
                                message:
                                        "We couldn't find your saved contact details. Please update your profile and try again.",
                        });
                        return;
                }

                const validationErrors = validateForm(formValues);
                if (Object.keys(validationErrors).length > 0) {
                        setFormErrors(validationErrors);
                        setFormStatus({
                                type: "error",
                                message: "Please review the highlighted fields and try again.",
                        });
                        return;
                }

                setFormErrors({});
                setFormStatus(null);
                setIsSubmitting(true);

                try {
                        const response = await fetch("/api/contact", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                        fullName,
                                        email,
                                        phone,
                                        subject: formValues.subject.trim(),
                                        category: formValues.category.trim(),
                                        message: formValues.message.trim(),
                                        source: "account-help-center",
                                }),
                        });

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                                throw new Error(
                                        data?.error ||
                                                "We couldn't send your message right now. Please try again later."
                                );
                        }

                        setFormStatus({
                                type: "success",
                                message:
                                        "Thank you! Your message has been sent to our support team. We'll respond shortly.",
                        });
                        setFormValues({ subject: "", category: "", message: "" });
                } catch (error) {
                        console.error("Help center message submission failed", error);
                        setFormStatus({
                                type: "error",
                                message: error.message || "Something went wrong. Please try again.",
                        });
                } finally {
                        setIsSubmitting(false);
                }
        };

        return (
                <div className="space-y-6">
                        {/* Contact Methods */}
                        <motion.div
                                custom={0}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                        >
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Contact Support</CardTitle>
                                                <CardDescription>
                                                        Get in touch with our support team
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        {contactMethods.map((method) => (
                                                                <div
                                                                        key={method.title}
                                                                        className="border rounded-lg p-4 text-center"
                                                                >
                                                                        <method.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                                                                        <h3 className="font-medium mb-1">{method.title}</h3>
                                                                        <p className="text-sm text-muted-foreground mb-2">
                                                                                {method.description}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground mb-3">
                                                                                {method.available}
                                                                        </p>
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="w-full"
                                                                                asChild
                                                                        >
                                                                                <a
                                                                                        href={method.href}
                                                                                        className="inline-flex w-full items-center justify-center gap-2"
                                                                                >
                                                                                        {method.action}
                                                                                </a>
                                                                        </Button>
                                                                </div>
                                                        ))}
                                                </div>
                                        </CardContent>
                                </Card>
                        </motion.div>

                        {/* FAQ Section */}
                        <motion.div
                                custom={1}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                        >
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Frequently Asked Questions</CardTitle>
                                                <CardDescription>Find answers to common questions</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <Accordion type="single" collapsible className="w-full">
                                                        {faqs.map((faq, index) => (
                                                                <AccordionItem key={index} value={`item-${index}`}>
                                                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                                                        <AccordionContent>{faq.answer}</AccordionContent>
                                                                </AccordionItem>
                                                        ))}
                                                </Accordion>
                                        </CardContent>
                                </Card>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                                custom={2}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                        >
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Send us a Message</CardTitle>
                                                <CardDescription>
                                                        Can't find what you're looking for? Send us a detailed message
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                                {formStatus && (
                                                        <div
                                                                className={`rounded-md border px-3 py-2 text-sm ${
                                                                        formStatus.type === "success"
                                                                                ? "border-green-200 bg-green-50 text-green-800"
                                                                                : "border-red-200 bg-red-50 text-red-700"
                                                                }`}
                                                        >
                                                                {formStatus.message}
                                                        </div>
                                                )}
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="subject">Subject</Label>
                                                                        <Input
                                                                                id="subject"
                                                                                name="subject"
                                                                                placeholder="What's this about?"
                                                                                value={formValues.subject}
                                                                                onChange={handleInputChange("subject")}
                                                                                aria-invalid={formErrors.subject ? "true" : "false"}
                                                                                aria-describedby={
                                                                                        formErrors.subject
                                                                                                ? "account-help-subject-error"
                                                                                                : undefined
                                                                                }
                                                                        />
                                                                        {formErrors.subject && (
                                                                                <p
                                                                                        id="account-help-subject-error"
                                                                                        className="text-xs text-red-600"
                                                                                >
                                                                                        {formErrors.subject}
                                                                                </p>
                                                                        )}
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <Label htmlFor="category">Category</Label>
                                                                        <Input
                                                                                id="category"
                                                                                name="category"
                                                                                placeholder="Orders, Payments, Account..."
                                                                                value={formValues.category}
                                                                                onChange={handleInputChange("category")}
                                                                                aria-invalid={formErrors.category ? "true" : "false"}
                                                                                aria-describedby={
                                                                                        formErrors.category
                                                                                                ? "account-help-category-error"
                                                                                                : undefined
                                                                                }
                                                                        />
                                                                        {formErrors.category && (
                                                                                <p
                                                                                        id="account-help-category-error"
                                                                                        className="text-xs text-red-600"
                                                                                >
                                                                                        {formErrors.category}
                                                                                </p>
                                                                        )}
                                                                </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                                <Label htmlFor="message">Message</Label>
                                                                <Textarea
                                                                        id="message"
                                                                        name="message"
                                                                        placeholder="Describe your issue or question in detail..."
                                                                        className="min-h-[160px]"
                                                                        value={formValues.message}
                                                                        onChange={handleInputChange("message")}
                                                                        aria-invalid={formErrors.message ? "true" : "false"}
                                                                        aria-describedby={
                                                                                formErrors.message
                                                                                        ? "account-help-message-error"
                                                                                        : undefined
                                                                        }
                                                                />
                                                                {formErrors.message && (
                                                                        <p
                                                                                id="account-help-message-error"
                                                                                className="text-xs text-red-600"
                                                                        >
                                                                                {formErrors.message}
                                                                        </p>
                                                                )}
                                                        </div>
                                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                                                {isSubmitting ? "Sending..." : "Send Message"}
                                                        </Button>
                                                </form>
                                        </CardContent>
                                </Card>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div
                                custom={3}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                        >
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Quick Links</CardTitle>
                                                <CardDescription>
                                                        Helpful resources and documentation
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        {quickLinks.map((link) => (
                                                                <Button
                                                                        key={link.title}
                                                                        variant="outline"
                                                                        className="justify-start"
                                                                        asChild
                                                                >
                                                                        <Link href={link.href} className="flex w-full items-center">
                                                                                <FileText className="h-4 w-4 mr-2" />
                                                                                <span className="flex-1 text-left">{link.title}</span>
                                                                                <ExternalLink className="h-4 w-4 ml-auto" />
                                                                        </Link>
                                                                </Button>
                                                        ))}
                                                </div>
                                        </CardContent>
                                </Card>
                        </motion.div>
                </div>
        );
}
