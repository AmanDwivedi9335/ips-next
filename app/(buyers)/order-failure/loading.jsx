import { Loader2 } from "lucide-react";

export default function Loading() {
        return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                        <div className="max-w-md w-full space-y-6 text-center">
                                <div className="p-6 bg-white rounded-2xl shadow-sm border border-blue-100 flex items-center justify-center gap-3">
                                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                        <p className="text-sm font-medium text-blue-700">
                                                We are confirming your payment, please do not close this page.
                                        </p>
                                </div>
                        </div>
                </div>
        );
}
