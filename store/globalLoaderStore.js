"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useGlobalLoaderStore = create(
        devtools((set) => ({
                pendingRequests: 0,
                isVisible: false,
                isFullLoaderEnabled: false,
                startRequest: () =>
                        set((state) => ({
                                pendingRequests: state.pendingRequests + 1,
                                isVisible: state.isFullLoaderEnabled ? true : state.isVisible,
                        })),
                endRequest: () =>
                        set((state) => {
                                const pending = Math.max(0, state.pendingRequests - 1);
                                return {
                                        pendingRequests: pending,
                                        isVisible: state.isFullLoaderEnabled && pending > 0,
                                };
                        }),
                setFullLoaderEnabled: (enabled) =>
                        set((state) => ({
                                isFullLoaderEnabled: enabled,
                                isVisible: enabled && state.pendingRequests > 0,
                        })),
                reset: () => set({ pendingRequests: 0, isVisible: false, isFullLoaderEnabled: false }),
        }))
);
