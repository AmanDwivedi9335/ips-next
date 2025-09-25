"use client";

import { useEffect, useState } from "react";
import { useGlobalLoaderStore } from "@/store/globalLoaderStore";
import { setupGlobalFetchInterceptor } from "@/lib/setupGlobalFetchInterceptor";
import PrintLoader from "@/components/Shared/PrintLoader.jsx";

const MIN_VISIBLE_DURATION = 400;

export default function GlobalLoaderProvider({ children }) {
        const isVisible = useGlobalLoaderStore((state) => state.isVisible);
        const pendingRequests = useGlobalLoaderStore((state) => state.pendingRequests);
        const [shouldRenderLoader, setShouldRenderLoader] = useState(isVisible);
        const [lastShownAt, setLastShownAt] = useState(null);

        useEffect(() => {
                setupGlobalFetchInterceptor();
        }, []);

        useEffect(() => {
                if (isVisible) {
                        setLastShownAt(Date.now());
                        setShouldRenderLoader(true);
                        return;
                }

                if (!isVisible && lastShownAt) {
                        const elapsed = Date.now() - lastShownAt;
                        const remaining = Math.max(MIN_VISIBLE_DURATION - elapsed, 0);
                        const timeout = setTimeout(() => {
                                setShouldRenderLoader(false);
                        }, remaining);

                        return () => clearTimeout(timeout);
                }

                setShouldRenderLoader(false);
        }, [isVisible, lastShownAt]);

        return (
                <>
                        {children}
                        <PrintLoader
                                isVisible={shouldRenderLoader || pendingRequests > 0}
                                message={pendingRequests > 1 ? "Multiple requests in queue" : undefined}
                        />
                </>
        );
}
