"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Loader2, MessageSquare, Palette, RefreshCw, ShoppingCart } from "lucide-react";

const STORAGE_KEY = "admin-notifications-last-seen-at";

const typeMeta = {
	order: {
		icon: ShoppingCart,
		iconClassName: "text-emerald-600 bg-emerald-50",
		label: "Orders",
	},
	logo: {
		icon: Palette,
		iconClassName: "text-violet-600 bg-violet-50",
		label: "Artwork",
	},
	contact: {
		icon: MessageSquare,
		iconClassName: "text-blue-600 bg-blue-50",
		label: "Messages",
	},
};

function formatRelativeTime(value) {
	if (!value) return "Just now";

	const timestamp = new Date(value).getTime();
	if (Number.isNaN(timestamp)) return "Just now";

	const diffMs = timestamp - Date.now();
	const minutes = Math.round(diffMs / (1000 * 60));
	const hours = Math.round(diffMs / (1000 * 60 * 60));
	const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
	const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

	if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
	if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
	return formatter.format(days, "day");
}

export function NotificationDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState("");
	const [notifications, setNotifications] = useState([]);
	const [summary, setSummary] = useState({
		pendingOrders: 0,
		submittedLogos: 0,
		newMessages: 0,
		total: 0,
	});
	const [lastSeenAt, setLastSeenAt] = useState(null);
	const [hasHydrated, setHasHydrated] = useState(false);

	const fetchNotifications = useCallback(async ({ silent = false } = {}) => {
		if (silent) {
			setRefreshing(true);
		} else {
			setLoading(true);
		}
		setError("");

		try {
			const response = await fetch("/api/admin/notifications", { cache: "no-store" });
			const result = await response.json();

			if (!response.ok || !result.success) {
				throw new Error(result.message || "Failed to load notifications");
			}

			setNotifications(result.data?.notifications || []);
			setSummary(
				result.data?.summary || {
					pendingOrders: 0,
					submittedLogos: 0,
					newMessages: 0,
					total: 0,
				}
			);
		} catch (fetchError) {
			console.error(fetchError);
			setError(fetchError.message || "Failed to load notifications");
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		const savedValue = window.localStorage.getItem(STORAGE_KEY);
		setLastSeenAt(savedValue ? new Date(savedValue).toISOString() : null);
		setHasHydrated(true);
		fetchNotifications();
	}, [fetchNotifications]);

	useEffect(() => {
		const intervalId = window.setInterval(() => {
			fetchNotifications({ silent: true });
		}, 60000);

		return () => window.clearInterval(intervalId);
	}, [fetchNotifications]);

	const unreadCount = useMemo(() => {
		if (!hasHydrated) return 0;

		return notifications.filter((notification) => {
			if (!lastSeenAt) return true;
			return new Date(notification.createdAt).getTime() > new Date(lastSeenAt).getTime();
		}).length;
	}, [hasHydrated, lastSeenAt, notifications]);

	const handleOpenChange = (open) => {
		setIsOpen(open);

		if (open) {
			const now = new Date().toISOString();
			setLastSeenAt(now);
			window.localStorage.setItem(STORAGE_KEY, now);
		}
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-4 w-4" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px]"
						>
							{unreadCount > 9 ? "9+" : unreadCount}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[24rem] p-0" align="end">
				<div className="flex items-center justify-between border-b p-4">
					<div>
						<h3 className="font-semibold text-gray-900">Notifications</h3>
						<p className="text-xs text-muted-foreground">
							{summary.total ? `${summary.total} recent updates` : "No pending admin updates"}
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => fetchNotifications({ silent: true })}
						disabled={refreshing}
					>
						{refreshing ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<RefreshCw className="h-4 w-4" />
						)}
					</Button>
				</div>

				<div className="flex flex-wrap gap-2 border-b px-4 py-3">
					<Badge variant="secondary">Orders: {summary.pendingOrders}</Badge>
					<Badge variant="secondary">Artwork: {summary.submittedLogos}</Badge>
					<Badge variant="secondary">Messages: {summary.newMessages}</Badge>
				</div>

				<div className="max-h-96 overflow-y-auto">
					{loading ? (
						<div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
							<Loader2 className="h-4 w-4 animate-spin" />
							Loading notifications...
						</div>
					) : error ? (
						<div className="space-y-3 p-4 text-sm">
							<p className="text-red-600">{error}</p>
							<Button variant="outline" size="sm" onClick={() => fetchNotifications()}>
								Try again
							</Button>
						</div>
					) : notifications.length ? (
						notifications.map((notification, index) => {
							const meta = typeMeta[notification.type] || typeMeta.contact;
							const Icon = meta.icon;
							const isUnread = !lastSeenAt || new Date(notification.createdAt) > new Date(lastSeenAt);

							return (
								<motion.div
									key={notification.id}
									initial={{ opacity: 0, x: -12 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.03 }}
								>
									<Link
										href={notification.href}
										className="flex items-start gap-3 border-b px-4 py-3 transition-colors hover:bg-gray-50"
									>
										<div
											className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.iconClassName}`}
										>
											<Icon className="h-4 w-4" />
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-start justify-between gap-3">
												<div className="min-w-0">
													<p className="truncate text-sm font-medium text-gray-900">
														{notification.title}
													</p>
													<p className="mt-1 line-clamp-2 text-sm text-gray-500">
														{notification.description}
													</p>
												</div>
												<div className="flex shrink-0 items-center gap-2">
													<span className="text-xs text-gray-400">
														{formatRelativeTime(notification.createdAt)}
													</span>
													{isUnread && <span className="h-2 w-2 rounded-full bg-blue-500" />}
												</div>
											</div>
											<div className="mt-2 flex items-center gap-2">
												<Badge variant="outline" className="text-[11px]">
													{meta.label}
												</Badge>
												<span className="truncate text-xs text-muted-foreground">
													{notification.meta}
												</span>
											</div>
										</div>
									</Link>
								</motion.div>
							);
						})
					) : (
						<div className="p-6 text-center text-sm text-muted-foreground">
							All caught up. There are no new admin notifications right now.
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
