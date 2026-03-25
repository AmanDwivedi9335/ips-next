"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

const INITIAL_FORM = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};

export function ProfileSettingsPopup({ open, onOpenChange }) {
	const [formData, setFormData] = useState(INITIAL_FORM);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (event) => {
		const { id, value } = event.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const closeAndReset = () => {
		onOpenChange(false);
		setFormData(INITIAL_FORM);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
			toast.error("All password fields are required");
			return;
		}

		if (formData.newPassword.length < 6) {
			toast.error("New password must be at least 6 characters");
			return;
		}

		if (formData.newPassword !== formData.confirmPassword) {
			toast.error("New password and confirm password do not match");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await fetch("/api/admin/profile/password", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					currentPassword: formData.currentPassword,
					newPassword: formData.newPassword,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to update password");
			}

			toast.success("Password changed successfully");
			closeAndReset();
		} catch (error) {
			toast.error(error.message || "Failed to update password");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) {
					setFormData(INITIAL_FORM);
				}
				onOpenChange(nextOpen);
			}}
		>
			<DialogContent className="sm:max-w-md">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold">Profile Settings</DialogTitle>
						<DialogDescription className="text-gray-600">
							Change your password
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4 mt-4">
						<div>
							<Label htmlFor="currentPassword">Current Password</Label>
							<Input
								id="currentPassword"
								type="password"
								placeholder="Enter current password"
								value={formData.currentPassword}
								onChange={handleInputChange}
								className="mt-1"
								autoComplete="current-password"
							/>
						</div>

						<div>
							<Label htmlFor="newPassword">New Password</Label>
							<Input
								id="newPassword"
								type="password"
								placeholder="Enter new password"
								value={formData.newPassword}
								onChange={handleInputChange}
								className="mt-1"
								autoComplete="new-password"
							/>
						</div>

						<div>
							<Label htmlFor="confirmPassword">Confirm New Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Re-enter new password"
								value={formData.confirmPassword}
								onChange={handleInputChange}
								className="mt-1"
								autoComplete="new-password"
							/>
						</div>

						<Button
							type="submit"
							className="w-full bg-green-600 hover:bg-green-700"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Updating..." : "Update Password"}
						</Button>
					</form>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
