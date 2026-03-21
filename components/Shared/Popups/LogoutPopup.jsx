"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export function LogoutPopup({ open, onOpenChange }) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const clearUser = useAuthStore((state) => state.clearUser);

	const handleLogout = async () => {
		setIsLoggingOut(true);

		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
			});

			if (!response.ok) {
				throw new Error("Logout failed");
			}

			clearUser();
			onOpenChange(false);

			const shouldRedirectToLogin =
				pathname?.startsWith("/admin") ||
				pathname?.startsWith("/account") ||
				pathname?.startsWith("/dashboard");

			if (shouldRedirectToLogin) {
				router.replace("/login");
			} else {
				router.replace("/");
			}
			router.refresh();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<DialogHeader className="text-center">
						<div className="mx-auto mb-4 w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
							<div className="text-4xl">👋</div>
						</div>
						<DialogTitle className="text-xl font-semibold">
							Are you sure you want to log out?
						</DialogTitle>
						<DialogDescription className="text-gray-600">
							You will need to sign in again to access your account.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex gap-3 mt-6">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1"
							disabled={isLoggingOut}
						>
							Cancel
						</Button>
						<Button
							onClick={handleLogout}
							className="flex-1 bg-orange-500 hover:bg-orange-600"
							disabled={isLoggingOut}
						>
							{isLoggingOut ? "Logging out..." : "Yes, log out"}
						</Button>
					</DialogFooter>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
