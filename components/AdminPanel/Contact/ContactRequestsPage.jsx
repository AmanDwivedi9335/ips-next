"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
        Calendar,
        Eye,
        Filter,
        Loader2,
        Mail,
        Phone,
        RefreshCw,
        RotateCcw,
        Search,
        User,
} from "lucide-react";

import { useAdminContactStore } from "@/store/adminContactStore";

const statusOptions = [
        { value: "all", label: "All statuses" },
        { value: "new", label: "New" },
        { value: "in_progress", label: "In progress" },
        { value: "resolved", label: "Resolved" },
];

const emailStatusOptions = [
        { value: "all", label: "All email states" },
        { value: "sent", label: "Email sent" },
        { value: "pending", label: "Email pending" },
        { value: "failed", label: "Email failed" },
];

const statusVariants = {
        new: "bg-blue-100 text-blue-700",
        in_progress: "bg-amber-100 text-amber-700",
        resolved: "bg-green-100 text-green-700",
};

const emailStatusVariants = {
        sent: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        failed: "bg-red-100 text-red-700",
};

function formatDate(value) {
        if (!value) return "-";
        try {
                return new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                }).format(new Date(value));
        } catch (error) {
                return new Date(value).toLocaleString();
        }
}

export default function ContactRequestsPage() {
        const [searchValue, setSearchValue] = useState("");
        const [selectedMessage, setSelectedMessage] = useState(null);
        const [notes, setNotes] = useState("");
        const [isDialogOpen, setIsDialogOpen] = useState(false);

        const {
                messages,
                loading,
                error,
                pagination,
                filters,
                stats,
                setFilters,
                resetFilters,
                fetchMessages,
                updateMessage,
        } = useAdminContactStore();

        useEffect(() => {
                fetchMessages();
        }, [fetchMessages, filters]);

        useEffect(() => {
                setNotes(selectedMessage?.adminNotes || "");
        }, [selectedMessage]);

        useEffect(() => {
                setSearchValue(filters.search || "");
        }, [filters.search]);

        const visibleColumns = useMemo(
                () => [
                        { key: "fullName", label: "Name" },
                        { key: "email", label: "Email" },
                        { key: "phone", label: "Phone" },
                        { key: "subject", label: "Subject" },
                        { key: "createdAt", label: "Submitted" },
                        { key: "status", label: "Status" },
                        { key: "emailStatus", label: "Email" },
                        { key: "actions", label: "Actions" },
                ],
                []
        );

        const handleSearchSubmit = () => {
                setFilters({ search: searchValue.trim(), page: 1 });
        };

        const handleStatusFilterChange = (value) => {
                setFilters({ status: value, page: 1 });
        };

        const handleEmailStatusFilterChange = (value) => {
                setFilters({ emailStatus: value, page: 1 });
        };

        const handlePageChange = (page) => {
                setFilters({ page });
        };

        const handleStatusUpdate = async (message, value) => {
                if (value === message.status) return;

                const result = await updateMessage(message._id, { status: value });

                if (result.success) {
                        toast.success("Status updated successfully");
                        if (selectedMessage && selectedMessage._id === message._id) {
                                setSelectedMessage(result.data);
                        }
                } else {
                        toast.error(result.message);
                }
        };

        const handleDialogSave = async () => {
                if (!selectedMessage) return;

                const payload = { adminNotes: notes.trim() };

                const result = await updateMessage(selectedMessage._id, payload);

                if (result.success) {
                        toast.success("Notes updated successfully");
                        setSelectedMessage(result.data);
                        setIsDialogOpen(false);
                } else {
                        toast.error(result.message);
                }
        };

        const handleResetFilters = () => {
                setSearchValue("");
                resetFilters();
        };

        const openMessageDialog = (message) => {
                setSelectedMessage(message);
                setIsDialogOpen(true);
        };

        const closeDialog = () => {
                setIsDialogOpen(false);
                setSelectedMessage(null);
        };

        return (
                <div className="space-y-6">
                        <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-2"
                        >
                                <h1 className="text-3xl font-bold text-gray-900">
                                        Contact Requests
                                </h1>
                                <p className="text-gray-600">
                                        Review messages submitted through the contact form and keep track of follow-ups.
                                </p>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                        <CardContent className="p-6">
                                                <p className="text-sm font-medium text-gray-500">
                                                        Total messages
                                                </p>
                                                <p className="mt-2 text-3xl font-semibold text-gray-900">
                                                        {stats.totalMessages}
                                                </p>
                                        </CardContent>
                                </Card>
                                <Card>
                                        <CardContent className="p-6">
                                                <p className="text-sm font-medium text-gray-500">New</p>
                                                <p className="mt-2 text-3xl font-semibold text-blue-600">
                                                        {stats.status.new}
                                                </p>
                                        </CardContent>
                                </Card>
                                <Card>
                                        <CardContent className="p-6">
                                                <p className="text-sm font-medium text-gray-500">
                                                        In progress
                                                </p>
                                                <p className="mt-2 text-3xl font-semibold text-amber-600">
                                                        {stats.status.in_progress}
                                                </p>
                                        </CardContent>
                                </Card>
                                <Card>
                                        <CardContent className="p-6">
                                                <p className="text-sm font-medium text-gray-500">Resolved</p>
                                                <p className="mt-2 text-3xl font-semibold text-green-600">
                                                        {stats.status.resolved}
                                                </p>
                                        </CardContent>
                                </Card>
                        </div>

                        <Card>
                                <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                        <Filter className="h-5 w-5" />
                                                        <span>Filters</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                        <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={handleResetFilters}
                                                                className="gap-2"
                                                        >
                                                                <RotateCcw className="h-4 w-4" /> Reset
                                                        </Button>
                                                </div>
                                        </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                                                <div className="lg:col-span-2">
                                                        <div className="relative">
                                                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                                                <Input
                                                                        value={searchValue}
                                                                        onChange={(event) => setSearchValue(event.target.value)}
                                                                        onKeyDown={(event) => {
                                                                                if (event.key === "Enter") {
                                                                                        handleSearchSubmit();
                                                                                }
                                                                        }}
                                                                        placeholder="Search by name, email, subject or phone"
                                                                        className="pl-9"
                                                                />
                                                        </div>
                                                </div>
                                                <Select
                                                        value={filters.status}
                                                        onValueChange={handleStatusFilterChange}
                                                >
                                                        <SelectTrigger>
                                                                <SelectValue placeholder="Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {statusOptions.map((option) => (
                                                                        <SelectItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                                <Select
                                                        value={filters.emailStatus}
                                                        onValueChange={handleEmailStatusFilterChange}
                                                >
                                                        <SelectTrigger>
                                                                <SelectValue placeholder="Email status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                                {emailStatusOptions.map((option) => (
                                                                        <SelectItem key={option.value} value={option.value}>
                                                                                {option.label}
                                                                        </SelectItem>
                                                                ))}
                                                        </SelectContent>
                                                </Select>
                                        </div>
                                        <div className="flex justify-end">
                                                <Button onClick={handleSearchSubmit} className="gap-2">
                                                        <Search className="h-4 w-4" /> Apply filters
                                                </Button>
                                        </div>
                                </CardContent>
                        </Card>

                        <Card>
                                <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="flex items-center gap-2 text-gray-700">
                                                <Mail className="h-5 w-5" />
                                                Recent submissions
                                        </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                        {loading ? (
                                                <div className="flex items-center justify-center py-16">
                                                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                                                </div>
                                        ) : error ? (
                                                <div className="flex flex-col items-center justify-center gap-4 py-16">
                                                        <p className="text-sm text-red-600">{error}</p>
                                                        <Button variant="outline" onClick={fetchMessages} className="gap-2">
                                                                <RefreshCw className="h-4 w-4" /> Try again
                                                        </Button>
                                                </div>
                                        ) : messages.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-gray-500">
                                                        <Mail className="h-10 w-10" />
                                                        <p className="text-sm">No contact requests found.</p>
                                                </div>
                                        ) : (
                                                <div className="overflow-x-auto">
                                                        <Table>
                                                                <TableHeader>
                                                                        <TableRow>
                                                                                {visibleColumns.map((column) => (
                                                                                        <TableHead key={column.key}>{column.label}</TableHead>
                                                                                ))}
                                                                        </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                        {messages.map((message) => (
                                                                                <TableRow key={message._id} className="align-top">
                                                                                        <TableCell className="font-medium text-gray-900">
                                                                                                {message.fullName}
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <div className="flex items-center gap-2 text-gray-700">
                                                                                                        <Mail className="h-4 w-4" />
                                                                                                        {message.email}
                                                                                                </div>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                {message.phone ? (
                                                                                                        <div className="flex items-center gap-2 text-gray-700">
                                                                                                                <Phone className="h-4 w-4" />
                                                                                                                {message.phone}
                                                                                                        </div>
                                                                                                ) : (
                                                                                                        <span className="text-gray-400">Not provided</span>
                                                                                                )}
                                                                                        </TableCell>
                                                                                        <TableCell className="max-w-xs">
                                                                                                <p className="truncate font-medium text-gray-800">
                                                                                                        {message.subject}
                                                                                                </p>
                                                                                                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                                                                                        {message.message}
                                                                                                </p>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <div className="flex items-center gap-2 text-gray-600">
                                                                                                        <Calendar className="h-4 w-4" />
                                                                                                        {formatDate(message.createdAt)}
                                                                                                </div>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <Select
                                                                                                        value={message.status}
                                                                                                        onValueChange={(value) =>
                                                                                                                handleStatusUpdate(
                                                                                                                        message,
                                                                                                                        value
                                                                                                                )
                                                                                                        }
                                                                                                >
                                                                                                        <SelectTrigger className="w-[150px]">
                                                                                                                <SelectValue />
                                                                                                        </SelectTrigger>
                                                                                                        <SelectContent>
                                                                                                                {statusOptions
                                                                                                                        .filter((option) => option.value !== "all")
                                                                                                                        .map((option) => (
                                                                                                                                <SelectItem
                                                                                                                                        key={option.value}
                                                                                                                                        value={option.value}
                                                                                                                                >
                                                                                                                                        {option.label}
                                                                                                                                </SelectItem>
                                                                                                                        ))}
                                                                                                        </SelectContent>
                                                                                                </Select>
                                                                                                <Badge className={`${statusVariants[message.status]} mt-2 w-fit text-xs font-medium`}>
                                                                                                        {message.status.replace("_", " ")}
                                                                                                </Badge>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <Badge className={`${emailStatusVariants[message.emailStatus]} w-fit text-xs font-medium`}>
                                                                                                        {message.emailStatus}
                                                                                                </Badge>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                                <Button
                                                                                                        variant="outline"
                                                                                                        size="icon"
                                                                                                        className="gap-2"
                                                                                                        onClick={() => openMessageDialog(message)}
                                                                                                >
                                                                                                        <Eye className="h-4 w-4" />
                                                                                                </Button>
                                                                                        </TableCell>
                                                                                </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                        </Table>

                                                        <div className="flex flex-col gap-4 border-t border-gray-100 p-4 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
                                                                <p>
                                                                        Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to {" "}
                                                                        {Math.min(
                                                                                pagination.currentPage * pagination.pageSize,
                                                                                pagination.totalItems
                                                                        )}{" "}
                                                                        of {pagination.totalItems} submissions
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                disabled={!pagination.hasPrev}
                                                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                                        >
                                                                                Previous
                                                                        </Button>
                                                                        {Array.from(
                                                                                { length: Math.min(5, pagination.totalPages) },
                                                                                (_, index) => {
                                                                                        const pageNumber = index + 1;
                                                                                        return (
                                                                                                <Button
                                                                                                        key={pageNumber}
                                                                                                        variant={
                                                                                                                pagination.currentPage === pageNumber
                                                                                                                        ? "default"
                                                                                                                        : "outline"
                                                                                                        }
                                                                                                        size="sm"
                                                                                                        onClick={() => handlePageChange(pageNumber)}
                                                                                                >
                                                                                                        {pageNumber}
                                                                                                </Button>
                                                                                        );
                                                                                }
                                                                        )}
                                                                        <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                disabled={!pagination.hasNext}
                                                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                                        >
                                                                                Next
                                                                        </Button>
                                                                </div>
                                                        </div>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>

                        <Dialog
                                open={isDialogOpen}
                                onOpenChange={(open) => {
                                        setIsDialogOpen(open);
                                        if (!open) {
                                                setSelectedMessage(null);
                                        }
                                }}
                        >
                                <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                                                        <User className="h-5 w-5" />
                                                        {selectedMessage?.fullName}
                                                </DialogTitle>
                                                <DialogDescription>
                                                        Submitted on {formatDate(selectedMessage?.createdAt)}
                                                </DialogDescription>
                                        </DialogHeader>
                                        {selectedMessage && (
                                                <div className="space-y-6">
                                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                                <div className="space-y-2">
                                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                                        <p className="font-medium text-gray-900">{selectedMessage.email}</p>
                                                                </div>
                                                                <div className="space-y-2">
                                                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                                                        <p className="font-medium text-gray-900">
                                                                                {selectedMessage.phone || "Not provided"}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                                <p className="text-sm font-medium text-gray-500">Subject</p>
                                                                <p className="font-semibold text-gray-900">
                                                                        {selectedMessage.subject}
                                                                </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                                <p className="text-sm font-medium text-gray-500">Message</p>
                                                                <p className="rounded-md border border-gray-100 bg-gray-50 p-4 text-gray-800">
                                                                        {selectedMessage.message}
                                                                </p>
                                                        </div>
                                                        <div className="space-y-2">
                                                                <p className="text-sm font-medium text-gray-500">Status</p>
                                                                <div className="flex items-center gap-4">
                                                                        <Select
                                                                                value={selectedMessage.status}
                                                                                onValueChange={async (value) => {
                                                                                        const result = await updateMessage(
                                                                                                selectedMessage._id,
                                                                                                { status: value }
                                                                                        );

                                                                                        if (result.success) {
                                                                                                setSelectedMessage(result.data);
                                                                                                toast.success("Status updated");
                                                                                        } else {
                                                                                                toast.error(result.message);
                                                                                        }
                                                                                }}
                                                                        >
                                                                                <SelectTrigger className="w-[200px]">
                                                                                        <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                        {statusOptions
                                                                                                .filter((option) => option.value !== "all")
                                                                                                .map((option) => (
                                                                                                        <SelectItem key={option.value} value={option.value}>
                                                                                                                {option.label}
                                                                                                        </SelectItem>
                                                                                                ))}
                                                                                </SelectContent>
                                                                        </Select>
                                                                        <Badge className={`${statusVariants[selectedMessage.status]} w-fit text-xs font-medium`}>
                                                                                {selectedMessage.status.replace("_", " ")}
                                                                        </Badge>
                                                                </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                                <p className="text-sm font-medium text-gray-500">Internal notes</p>
                                                                <Textarea
                                                                        value={notes}
                                                                        onChange={(event) => setNotes(event.target.value)}
                                                                        placeholder="Add any follow-up details or reminders for the team"
                                                                />
                                                        </div>
                                                        <div className="flex items-center justify-end gap-3">
                                                                <Button variant="ghost" onClick={closeDialog}>
                                                                        Cancel
                                                                </Button>
                                                                <Button onClick={handleDialogSave}>Save changes</Button>
                                                        </div>
                                                </div>
                                        )}
                                </DialogContent>
                        </Dialog>
                </div>
        );
}
