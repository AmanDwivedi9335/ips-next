"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XCircle, AlertTriangle, RefreshCcw, Headset, Home, Loader2 } from "lucide-react";
import Link from "next/link";

const DEFAULT_FAILURE_MESSAGE = "Something went wrong while processing your payment.";

export default function OrderFailurePage() {
        const searchParams = useSearchParams();
        const [failureDetails, setFailureDetails] = useState(null);
        const [isConfirming, setIsConfirming] = useState(true);

        useEffect(() => {
                const reason = searchParams.get("reason") || "payment_failed";
                const message =
                        searchParams.get("message") || DEFAULT_FAILURE_MESSAGE;

                setIsConfirming(true);
                setFailureDetails({ reason, message });

                const timer = setTimeout(() => {
                        setIsConfirming(false);
                }, 2500);

                return () => {
                        clearTimeout(timer);
                };
        }, [searchParams]);

        if (!failureDetails) {
                return (
                        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                                <div className="max-w-md w-full space-y-6 text-center">
                                        <div className="p-6 bg-white rounded-2xl shadow-sm border border-blue-100">
                                                <div className="flex items-center justify-center gap-3">
                                                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                                        <p className="text-sm font-medium text-blue-700">
                                                                We are confirming your payment, please do not close this page.
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </div>
                );
        }

        const { reason, message } = failureDetails;

        return (
                <div className="min-h-screen bg-gray-50 py-8">
                        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                                <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-center space-y-8"
                                >
                                        {isConfirming && (
                                                <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700">
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                        <span className="text-sm font-medium">
                                                                We are confirming your payment, please do not close this page.
                                                        </span>
                                                </div>
                                        )}

                                        <div className="flex justify-center">
                                                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                                        <XCircle className="w-12 h-12 text-red-600" />
                                                </div>
                                        </div>

                                        <div>
                                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                                        We couldn&apos;t confirm your payment
                                                </h1>
                                                <p className="text-gray-600 max-w-xl mx-auto">
                                                        {message}
                                                </p>
                                        </div>

                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>What happened?</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                                <span className="text-gray-600">Reason code:</span>
                                                                <Badge variant="destructive" className="font-mono uppercase">
                                                                        {reason}
                                                                </Badge>
                                                        </div>
                                                        <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-left">
                                                                <div className="flex items-start gap-3">
                                                                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                                                                        <div className="text-sm text-red-700 text-left">
                                                                                Our team was unable to verify the payment associated with your order.
                                                                                If the amount has been deducted from your account, it will be
                                                                                automatically refunded within 5-7 business days.
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>

                                        <Card>
                                                <CardHeader>
                                                        <CardTitle>What you can do</CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3 text-sm text-left text-gray-600">
                                                        <ul className="list-disc list-inside space-y-2">
                                                                <li>
                                                                        Review your payment details and ensure they are correct before retrying.
                                                                </li>
                                                                <li>
                                                                        Check with your bank or payment provider to confirm the transaction status.
                                                                </li>
                                                                <li>
                                                                        Contact our support team if you need any assistance or have questions.
                                                                </li>
                                                        </ul>
                                                </CardContent>
                                        </Card>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                                <Button asChild className="flex-1 bg-red-600 hover:bg-red-700">
                                                        <Link href="/checkout">
                                                                <RefreshCcw className="w-4 h-4 mr-2" />
                                                                Try Again
                                                        </Link>
                                                </Button>
                                                <Button variant="outline" asChild className="flex-1 bg-transparent">
                                                        <Link href="/contact">
                                                                <Headset className="w-4 h-4 mr-2" />
                                                                Contact Support
                                                        </Link>
                                                </Button>
                                                <Button variant="outline" asChild className="flex-1 bg-transparent">
                                                        <Link href="/products">
                                                                <Home className="w-4 h-4 mr-2" />
                                                                Browse Products
                                                        </Link>
                                                </Button>
                                        </div>
                                </motion.div>
                        </div>
                </div>
        );
}
