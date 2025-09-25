"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useGlobalLoaderStore = create(
        devtools((set) => ({
                pendingRequests: 0,
                isVisible: false,
                startRequest: () =>
                        set((state) => ({
                                pendingRequests: state.pendingRequests + 1,
                                isVisible: true,
                        })),
                endRequest: () =>
                        set((state) => {
                                const pending = Math.max(0, state.pendingRequests - 1);
                                return {
                                        pendingRequests: pending,
                                        isVisible: pending > 0,
                                };
                        }),
                reset: () => set({ pendingRequests: 0, isVisible: false }),
        }))
);
