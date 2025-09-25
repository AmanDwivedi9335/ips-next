"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useGlobalLoaderStore } from "@/store/globalLoaderStore";
import { setupGlobalFetchInterceptor } from "@/lib/setupGlobalFetchInterceptor";
import PrintLoader from "@/components/Shared/PrintLoader.jsx";

const MIN_VISIBLE_DURATION = 400;
const FULL_LOADER_ROUTES = new Set(["/", "/home", "/products"]);

export default function GlobalLoaderProvider({ children }) {
        const isVisible = useGlobalLoaderStore((state) => state.isVisible);
        const pendingRequests = useGlobalLoaderStore((state) => state.pendingRequests);
        const isFullLoaderEnabled = useGlobalLoaderStore((state) => state.isFullLoaderEnabled);
        const setFullLoaderEnabled = useGlobalLoaderStore((state) => state.setFullLoaderEnabled);
        const [shouldRenderLoader, setShouldRenderLoader] = useState(isVisible);
        const [lastShownAt, setLastShownAt] = useState(null);
        const pathname = usePathname();

        const shouldEnableFullLoader = useMemo(() => {
                if (!pathname) {
                        return false;
                }

                const normalizedPath = pathname.split("?")[0];

                if (FULL_LOADER_ROUTES.has(normalizedPath)) {
                        return true;
                }

                return normalizedPath.startsWith("/products/");
        }, [pathname]);

        useEffect(() => {
                setupGlobalFetchInterceptor();
        }, []);

        useEffect(() => {
                setFullLoaderEnabled(shouldEnableFullLoader);
        }, [setFullLoaderEnabled, shouldEnableFullLoader]);

        useEffect(() => {
                if (!isFullLoaderEnabled) {
                        setShouldRenderLoader(false);
                        setLastShownAt(null);
                        return;
                }

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
        }, [isVisible, lastShownAt, isFullLoaderEnabled]);

        return (
                <>
                        {children}
                        <PrintLoader
                                isVisible={
                                        isFullLoaderEnabled && (shouldRenderLoader || pendingRequests > 0)
                                }
                                message={pendingRequests > 1 ? "Multiple requests in queue" : undefined}
                        />
                </>
        );
}
