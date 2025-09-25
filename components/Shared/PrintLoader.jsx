"use client";

import { clsx } from "clsx";

export default function PrintLoader({ isVisible = true, message }) {
        if (!isVisible) {
                return null;
        }

        return (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[radial-gradient(circle_at_top,_#ffffff,_#f5f5f5)]">
                        <div className="flex flex-col items-center text-center gap-6 px-6">
                                <div className="relative">
                                        <div className="w-52 h-40 rounded-3xl bg-white shadow-2xl border border-gray-200 flex items-center justify-center overflow-hidden">
                                                <div className="absolute top-0 inset-x-12 h-24 overflow-hidden">
                                                        <div className="paper-sheet mx-auto" />
                                                </div>
                                                <div className="absolute bottom-3 inset-x-8 h-5 rounded-full bg-gray-100" />
                                                <div className="absolute -bottom-4 inset-x-14 h-3 bg-gray-300 rounded-full blur-sm" />
                                        </div>
                                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-60 h-24 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-3xl border-2 border-gray-300 shadow-xl flex flex-col items-center justify-center">
                                                <div className="w-44 h-10 bg-white rounded-full shadow-inner border border-gray-200 flex items-center justify-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full bg-[#f87171] animate-print-light" />
                                                        <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] animate-print-light" style={{ animationDelay: "0.2s" }} />
                                                        <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] animate-print-light" style={{ animationDelay: "0.4s" }} />
                                                </div>
                                                <div className="mt-3 w-32 h-1.5 rounded-full bg-gray-200" />
                                        </div>
                                        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-gray-400 font-semibold">
                                                Printing Magic
                                        </div>
                                </div>

                                <div className="space-y-2">
                                        <p className="text-lg font-semibold text-gray-700">
                                                Preparing your premium safety prints
                                        </p>
                                        <p className="text-sm text-gray-500 animate-print-dots">
                                                Aligning rollers • Mixing inks • Calibrating presses
                                        </p>
                                        {message && (
                                                <p className={clsx("text-xs text-gray-400 uppercase tracking-[0.3em]", "animate-print-pulse")}>{message}</p>
                                        )}
                                </div>
                        </div>
                </div>
        );
}
