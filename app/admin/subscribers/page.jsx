"use client";

import { useEffect, useMemo, useState } from "react";
import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import { Loader2, MailPlus, RefreshCw, Search } from "lucide-react";

const PAGE_SIZE = 10;

const statusOptions = [
        { label: "All statuses", value: "all" },
        { label: "Subscribed", value: "subscribed" },
        { label: "Unsubscribed", value: "unsubscribed" },
];

const statusStyles = {
        subscribed: "bg-emerald-100 text-emerald-700",
        unsubscribed: "bg-amber-100 text-amber-700",
};

function formatDate(value) {
        if (!value) return "—";

        try {
                return new Date(value).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                });
        } catch (error) {
                return "—";
        }
}

export default function AdminSubscribersPage() {
        const [subscribers, setSubscribers] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [page, setPage] = useState(1);
        const [searchInput, setSearchInput] = useState("");
        const [searchTerm, setSearchTerm] = useState("");
        const [statusFilter, setStatusFilter] = useState("all");
        const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: PAGE_SIZE });

        const fetchSubscribers = async ({
                page: requestedPage = 1,
                search = searchTerm,
                status = statusFilter,
        } = {}) => {
                setLoading(true);
                setError("");

                try {
                        const params = new URLSearchParams({
                                page: requestedPage.toString(),
                                limit: PAGE_SIZE.toString(),
                        });

                        if (status && status !== "all") {
                                params.set("status", status);
                        }

                        if (search) {
                                params.set("search", search);
                        }

                        const response = await fetch(`/api/subscribers?${params.toString()}`, {
                                cache: "no-store",
                        });
                        const data = await response.json();

                        if (!response.ok || !data.success) {
                                throw new Error(data?.error || "Failed to fetch subscribers.");
                        }

                        setSubscribers(data.data || []);

                        const nextPage = data.pagination?.page ?? requestedPage;
                        const nextLimit = data.pagination?.limit ?? PAGE_SIZE;
                        const nextTotal = data.pagination?.total ?? data.data?.length ?? 0;
                        const nextPages = data.pagination?.pages ?? Math.max(1, Math.ceil(nextTotal / nextLimit));

                        setPagination({
                                page: nextPage,
                                pages: nextPages,
                                total: nextTotal,
                                limit: nextLimit,
                        });

                        if (nextPage !== page) {
                                setPage(nextPage);
                        }
                } catch (fetchError) {
                        setError(fetchError.message || "Failed to fetch subscribers.");
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                fetchSubscribers({ page: 1, search: "", status: "all" });
                // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const handleSearchSubmit = (event) => {
                event.preventDefault();

                const trimmed = searchInput.trim().toLowerCase();
                setSearchTerm(trimmed);
                setPage(1);
                fetchSubscribers({ page: 1, search: trimmed, status: statusFilter });
        };

        const handleResetFilters = () => {
                setSearchInput("");
                setSearchTerm("");
                setStatusFilter("all");
                setPage(1);
                fetchSubscribers({ page: 1, search: "", status: "all" });
        };

        const handleStatusChange = (value) => {
                setStatusFilter(value);
                setPage(1);
                fetchSubscribers({ page: 1, search: searchTerm, status: value });
        };

        const handleRefresh = () => {
                fetchSubscribers({ page, search: searchTerm, status: statusFilter });
        };

        const handlePageChange = (direction) => {
                const nextPage = direction === "next" ? page + 1 : page - 1;

                if (nextPage < 1 || nextPage > pagination.pages) {
                        return;
                }

                setPage(nextPage);
                fetchSubscribers({ page: nextPage, search: searchTerm, status: statusFilter });
        };

        const range = useMemo(() => {
                if (!pagination.total) {
                        return { start: 0, end: 0 };
                }

                const start = (pagination.page - 1) * pagination.limit + 1;
                const end = Math.min(pagination.page * pagination.limit, pagination.total);

                return { start, end };
        }, [pagination]);

        return (
                <div className="space-y-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-amber-100 p-2">
                                                <MailPlus className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <div>
                                                <h1 className="text-3xl font-bold text-gray-900">Subscribers</h1>
                                                <p className="text-gray-600">
                                                        Track newsletter sign-ups and footer subscriptions in one place.
                                                </p>
                                        </div>
                                </div>
                        </div>

                        <Card>
                                <CardHeader className="space-y-4">
                                        <CardTitle className="text-xl font-semibold text-gray-900">
                                                Newsletter subscribers
                                        </CardTitle>
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                                <form
                                                        onSubmit={handleSearchSubmit}
                                                        className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:max-w-xl"
                                                >
                                                        <div className="relative w-full">
                                                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                                <Input
                                                                        value={searchInput}
                                                                        onChange={(event) => setSearchInput(event.target.value)}
                                                                        placeholder="Search by email"
                                                                        className="pl-9"
                                                                        disabled={loading && !searchInput && !subscribers.length}
                                                                />
                                                        </div>
                                                        <div className="flex gap-2 sm:w-auto">
                                                                <Button type="submit" disabled={loading && !subscribers.length}>
                                                                        Search
                                                                </Button>
                                                                <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        onClick={handleResetFilters}
                                                                        disabled={
                                                                                loading ||
                                                                                (!searchTerm && statusFilter === "all" && !searchInput)
                                                                        }
                                                                >
                                                                        Reset
                                                                </Button>
                                                        </div>
                                                </form>
                                                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                                        <Select
                                                                value={statusFilter}
                                                                onValueChange={handleStatusChange}
                                                                disabled={loading && !subscribers.length}
                                                        >
                                                                <SelectTrigger className="w-full sm:w-44">
                                                                        <SelectValue placeholder="Filter by status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                        {statusOptions.map((option) => (
                                                                                <SelectItem key={option.value} value={option.value}>
                                                                                        {option.label}
                                                                                </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                        </Select>
                                                        <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={handleRefresh}
                                                                disabled={loading}
                                                                className="sm:w-auto"
                                                        >
                                                                {loading ? (
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                ) : (
                                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                                )}
                                                                Refresh
                                                        </Button>
                                                </div>
                                        </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                        {error && (
                                                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                                        {error}
                                                </div>
                                        )}

                                        <div className="overflow-x-auto">
                                                <Table>
                                                        <TableHeader>
                                                                <TableRow>
                                                                        <TableHead className="min-w-[220px]">Email</TableHead>
                                                                        <TableHead className="w-[140px]">Status</TableHead>
                                                                        <TableHead className="w-[160px]">Source</TableHead>
                                                                        <TableHead className="w-[200px]">Subscribed on</TableHead>
                                                                        <TableHead className="w-[200px]">Last updated</TableHead>
                                                                </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                                {loading ? (
                                                                        <TableRow>
                                                                                <TableCell colSpan={5} className="py-12">
                                                                                        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                                                                                                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                                                                                                Loading subscribers…
                                                                                        </div>
                                                                                </TableCell>
                                                                        </TableRow>
                                                                ) : subscribers.length === 0 ? (
                                                                        <TableRow>
                                                                                <TableCell colSpan={5} className="py-12 text-center text-sm text-gray-500">
                                                                                        {searchTerm || statusFilter !== "all"
                                                                                                ? "No subscribers match your filters yet."
                                                                                                : "You haven't collected any subscribers yet."}
                                                                                </TableCell>
                                                                        </TableRow>
                                                                ) : (
                                                                        subscribers.map((subscriber) => (
                                                                                <TableRow key={subscriber._id || subscriber.id}>
                                                                                        <TableCell className="font-medium text-gray-900">
                                                                                                {subscriber.email}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <Badge
                                                                                                        className={
                                                                                                                statusStyles[subscriber.status] ||
                                                                                                                "bg-gray-100 text-gray-700"
                                                                                                        }
                                                                                                >
                                                                                                        {subscriber.status}
                                                                                                </Badge>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                {subscriber.source ? (
                                                                                                        <Badge variant="outline" className="bg-white/60">
                                                                                                                {subscriber.source}
                                                                                                        </Badge>
                                                                                                ) : (
                                                                                                        <span className="text-gray-400">—</span>
                                                                                                )}
                                                                                        </TableCell>
                                                                                        <TableCell>{formatDate(subscriber.createdAt)}</TableCell>
                                                                                        <TableCell>{formatDate(subscriber.updatedAt)}</TableCell>
                                                                                </TableRow>
                                                                        ))
                                                                )}
                                                        </TableBody>
                                                </Table>
                                        </div>

                                        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                                                <p>
                                                        Showing
                                                        <span className="mx-1 font-semibold text-gray-900">
                                                                {range.start}-{range.end}
                                                        </span>
                                                        of
                                                        <span className="ml-1 font-semibold text-gray-900">{pagination.total}</span>
                                                        subscribers
                                                </p>
                                                <div className="flex items-center gap-3">
                                                        <span className="text-xs uppercase tracking-wide text-gray-400">
                                                                Page {pagination.page} of {pagination.pages}
                                                        </span>
                                                        <div className="flex gap-2">
                                                                <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handlePageChange("previous")}
                                                                        disabled={loading || pagination.page <= 1}
                                                                >
                                                                        Previous
                                                                </Button>
                                                                <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handlePageChange("next")}
                                                                        disabled={loading || pagination.page >= pagination.pages}
                                                                >
                                                                        Next
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>
                </div>
        );
}
