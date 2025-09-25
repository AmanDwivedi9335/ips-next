import { useGlobalLoaderStore } from "@/store/globalLoaderStore";

let isFetchPatched = false;

export const setupGlobalFetchInterceptor = () => {
        if (typeof window === "undefined" || isFetchPatched) {
                return;
        }

        const originalFetch = window.fetch.bind(window);

        const patchedFetch = async (...args) => {
                const { startRequest, endRequest } = useGlobalLoaderStore.getState();
                startRequest();

                try {
                        const response = await originalFetch(...args);
                        return response;
                } catch (error) {
                        throw error;
                } finally {
                        endRequest();
                }
        };

        window.fetch = patchedFetch;
        globalThis.fetch = patchedFetch;

        isFetchPatched = true;
};
