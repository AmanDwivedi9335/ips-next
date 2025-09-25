"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAdminCustomerStore } from "@/store/adminCustomerStore.js";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Truck } from "lucide-react";

export function UpdateCustomerPopup({ open, onOpenChange, customer }) {
	const { updateCustomer, loading } = useAdminCustomerStore();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		mobile: "",
		address: "",
		status: "active",
	});

	useEffect(() => {
		if (customer) {
			setFormData({
				firstName: customer.firstName || "",
				lastName: customer.lastName || "",
				email: customer.email || "",
				mobile: customer.mobile || "",
				address: customer.address || "",
				status: customer.status || "active",
			});
		}
	}, [customer]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (customer) {
			const success = await updateCustomer(customer._id, formData);
			if (success) {
				onOpenChange(false);
			}
		}
	};

        const billingAddress = customer?.addresses?.find((addr) => addr.tag === "billing");
        const shippingAddresses = customer?.addresses?.filter((addr) => addr.tag === "shipping") || [];

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<motion.div
					initial={{ scale: 0.95, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.2 }}
				>
					<DialogHeader>
						<div className="flex items-center justify-between">
							<div>
								<DialogTitle className="text-lg font-semibold">
									Update Customer
								</DialogTitle>
								<DialogDescription className="text-gray-600">
									Update customer information
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<form onSubmit={handleSubmit} className="space-y-4 mt-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									placeholder="First Name"
									value={formData.firstName}
									onChange={(e) =>
										setFormData({ ...formData, firstName: e.target.value })
									}
									className="mt-1"
									required
								/>
							</div>
							<div>
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									placeholder="Last Name"
									value={formData.lastName}
									onChange={(e) =>
										setFormData({ ...formData, lastName: e.target.value })
									}
									className="mt-1"
									required
								/>
							</div>
						</div>

						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="customer@example.com"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className="mt-1"
								required
							/>
						</div>

						<div>
							<Label htmlFor="mobile">Mobile</Label>
							<Input
								id="mobile"
								placeholder="Phone Number"
								value={formData.mobile}
								onChange={(e) =>
									setFormData({ ...formData, mobile: e.target.value })
								}
								className="mt-1"
								required
							/>
						</div>

                                                <div>
                                                        <Label htmlFor="address">Address</Label>
                                                        <Textarea
                                                                id="address"
                                                                placeholder="Customer Address"
                                                                value={formData.address}
                                                                onChange={(e) =>
                                                                        setFormData({ ...formData, address: e.target.value })
                                                                }
                                                                className="mt-1"
                                                                rows={3}
                                                        />
                                                </div>

                                                <div className="space-y-3">
                                                        <h4 className="text-sm font-semibold text-muted-foreground">
                                                                Saved Addresses
                                                        </h4>
                                                        {billingAddress ? (
                                                                <div className="border rounded-md p-3 bg-gray-50 flex gap-3">
                                                                        <CreditCard className="h-4 w-4 text-primary mt-0.5" />
                                                                        <div className="space-y-1">
                                                                                <div className="flex items-center gap-2">
                                                                                        <span className="font-medium">Billing Address</span>
                                                                                        <Badge variant="secondary">Bill To</Badge>
                                                                                </div>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                        {billingAddress.name}
                                                                                        <br />
                                                                                        {billingAddress.street}, {billingAddress.city}, {billingAddress.state} - {billingAddress.zipCode}
                                                                                </p>
                                                                        </div>
                                                                </div>
                                                        ) : (
                                                                <p className="text-xs text-muted-foreground">No billing address saved.</p>
                                                        )}

                                                        {shippingAddresses.length > 0 ? (
                                                                <div className="space-y-2">
                                                                        {shippingAddresses.map((addr) => (
                                                                                <div
                                                                                        key={addr._id || `${addr.street}-${addr.zipCode}`}
                                                                                        className="border rounded-md p-3 flex gap-3"
                                                                                >
                                                                                        <Truck className="h-4 w-4 text-primary mt-0.5" />
                                                                                        <div className="space-y-1">
                                                                                                <div className="flex items-center gap-2">
                                                                                                        <span className="font-medium">Shipping Address</span>
                                                                                                        {addr.isDefault && <Badge>Default</Badge>}
                                                                                                </div>
                                                                                                <p className="text-xs text-muted-foreground">
                                                                                                        {addr.name}
                                                                                                        <br />
                                                                                                        {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}
                                                                                                </p>
                                                                                        </div>
                                                                                </div>
                                                                        ))}
                                                                </div>
                                                        ) : (
                                                                <p className="text-xs text-muted-foreground">No shipping addresses saved.</p>
                                                        )}
                                                </div>

						<div>
							<Label htmlFor="status">Status</Label>
							<Select
								value={formData.status}
								onValueChange={(value) =>
									setFormData({ ...formData, status: value })
								}
							>
								<SelectTrigger className="mt-1">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
									<SelectItem value="suspended">Suspended</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<DialogFooter className="flex gap-3 mt-6">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="flex-1"
								disabled={loading}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="flex-1 bg-orange-500 hover:bg-orange-600"
								disabled={loading}
							>
								{loading ? "Updating..." : "Update Customer"}
							</Button>
						</DialogFooter>
					</form>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
