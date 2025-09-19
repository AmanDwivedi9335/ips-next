import { create } from "zustand";

const defaultFilters = {
        search: "",
        status: "all",
        emailStatus: "all",
        page: 1,
        limit: 10,
};

const defaultStats = {
        totalMessages: 0,
        status: {
                new: 0,
                in_progress: 0,
                resolved: 0,
        },
        emailStatus: {
                pending: 0,
                sent: 0,
                failed: 0,
        },
};

export const useAdminContactStore = create((set, get) => ({
        messages: [],
        loading: false,
        error: null,
        pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: 0,
                pageSize: defaultFilters.limit,
                hasNext: false,
                hasPrev: false,
        },
        filters: { ...defaultFilters },
        stats: { ...defaultStats },

        setFilters: (updates) =>
                set((state) => ({
                        filters: {
                                ...state.filters,
                                ...updates,
                        },
                })),
        resetFilters: () =>
                set({
                        filters: { ...defaultFilters },
                }),

        fetchMessages: async () => {
                const { filters } = get();
                set({ loading: true, error: null });

                try {
                        const params = new URLSearchParams();

                        params.set("page", String(filters.page));
                        params.set("limit", String(filters.limit));

                        if (filters.search) {
                                params.set("search", filters.search);
                        }

                        if (filters.status && filters.status !== "all") {
                                params.set("status", filters.status);
                        }

                        if (filters.emailStatus && filters.emailStatus !== "all") {
                                params.set("emailStatus", filters.emailStatus);
                        }

                        const response = await fetch(`/api/contact?${params.toString()}`);
                        const data = await response.json();

                        if (!response.ok || !data.success) {
                                throw new Error(
                                        data?.error || "Failed to fetch contact messages."
                                );
                        }

                        set({
                                messages: data.data,
                                pagination: data.pagination,
                                stats: data.stats,
                                loading: false,
                        });
                } catch (error) {
                        set({
                                error: error.message || "Failed to fetch contact messages.",
                                loading: false,
                        });
                }
        },

        updateMessage: async (id, updates) => {
                try {
                        const response = await fetch(`/api/contact/${id}`, {
                                method: "PATCH",
                                headers: {
                                        "Content-Type": "application/json",
                                },
                                body: JSON.stringify(updates),
                        });

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                                throw new Error(
                                        data?.error || "Failed to update contact message."
                                );
                        }

                        set((state) => {
                                const updatedMessages = state.messages.map((message) =>
                                        message._id === id ? data.data : message
                                );

                                const previousMessage = state.messages.find(
                                        (message) => message._id === id
                                );

                                if (!previousMessage) {
                                        return { messages: updatedMessages };
                                }

                                const updatedStats = {
                                        ...state.stats,
                                        status: { ...state.stats.status },
                                        emailStatus: { ...state.stats.emailStatus },
                                };

                                if (previousMessage.status !== data.data.status) {
                                        if (previousMessage.status in updatedStats.status) {
                                                updatedStats.status[previousMessage.status] = Math.max(
                                                        0,
                                                        (updatedStats.status[previousMessage.status] || 0) - 1
                                                );
                                        }

                                        if (data.data.status in updatedStats.status) {
                                                updatedStats.status[data.data.status] =
                                                        (updatedStats.status[data.data.status] || 0) + 1;
                                        }
                                }

                                if (previousMessage.emailStatus !== data.data.emailStatus) {
                                        if (previousMessage.emailStatus in updatedStats.emailStatus) {
                                                updatedStats.emailStatus[previousMessage.emailStatus] = Math.max(
                                                        0,
                                                        (updatedStats.emailStatus[previousMessage.emailStatus] || 0) - 1
                                                );
                                        }

                                        if (data.data.emailStatus in updatedStats.emailStatus) {
                                                updatedStats.emailStatus[data.data.emailStatus] =
                                                        (updatedStats.emailStatus[data.data.emailStatus] || 0) + 1;
                                        }
                                }

                                return {
                                        messages: updatedMessages,
                                        stats: updatedStats,
                                };
                        });

                        return { success: true, data: data.data };
                } catch (error) {
                        return {
                                success: false,
                                message:
                                        error.message ||
                                        "Unable to update contact message. Please try again later.",
                        };
                }
        },
}));
