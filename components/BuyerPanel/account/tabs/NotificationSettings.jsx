"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
        Bell,
        Mail,
        MessageSquare,
        Smartphone,
        ShoppingCart,
        CreditCard,
        Plus,
        Trash2,
} from "lucide-react";

const cardVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: (i) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.1,
			duration: 0.5,
		},
	}),
};

const initialCategories = [
	{
		title: "Order Updates",
		description: "Get notified about your order status",
		icon: ShoppingCart,
		settings: [
			{
				id: "order-placed",
				label: "Order Placed",
				email: true,
				push: true,
				sms: false,
			},
			{
				id: "order-shipped",
				label: "Order Shipped",
				email: true,
				push: true,
				sms: true,
			},
			{
				id: "order-delivered",
				label: "Order Delivered",
				email: true,
				push: true,
				sms: false,
			},
		],
	},
	{
		title: "Payment & Billing",
		description: "Payment confirmations and billing updates",
		icon: CreditCard,
		settings: [
			{
				id: "payment-success",
				label: "Payment Successful",
				email: true,
				push: true,
				sms: false,
			},
			{
				id: "payment-failed",
				label: "Payment Failed",
				email: true,
				push: true,
				sms: true,
			},
			{
				id: "refund-processed",
				label: "Refund Processed",
				email: true,
				push: false,
				sms: false,
			},
		],
	},
	{
		title: "Marketing & Promotions",
		description: "Deals, offers, and promotional content",
		icon: Bell,
		settings: [
			{
				id: "weekly-deals",
				label: "Weekly Deals",
				email: false,
				push: false,
				sms: false,
			},
			{
				id: "flash-sales",
				label: "Flash Sales",
				email: true,
				push: true,
				sms: false,
			},
			{
				id: "personalized-offers",
				label: "Personalized Offers",
				email: true,
				push: false,
				sms: false,
			},
		],
	},
];

export function NotificationSettings() {
        const [categories, setCategories] = useState(initialCategories);
        const [addingIndex, setAddingIndex] = useState(null);
        const [newSetting, setNewSetting] = useState({ label: "", email: false, push: false, sms: false });

        const handleToggle = (catIdx, setIdx, field) => {
                const updated = [...categories];
                updated[catIdx].settings[setIdx][field] = !updated[catIdx].settings[setIdx][field];
                setCategories(updated);
        };

        const handleLabelChange = (catIdx, setIdx, value) => {
                const updated = [...categories];
                updated[catIdx].settings[setIdx].label = value;
                setCategories(updated);
        };

        const handleDelete = (catIdx, setIdx) => {
                const updated = [...categories];
                updated[catIdx].settings.splice(setIdx, 1);
                setCategories(updated);
        };

        const handleAddSetting = (catIdx) => {
                if (!newSetting.label) return;
                const updated = [...categories];
                updated[catIdx].settings.push({ id: Date.now().toString(), ...newSetting });
                setCategories(updated);
                setNewSetting({ label: "", email: false, push: false, sms: false });
                setAddingIndex(null);
        };

        return (
                <div className="space-y-6">
			{/* Notification Channels */}
			<motion.div
				custom={0}
				initial="hidden"
				animate="visible"
				variants={cardVariants}
			>
				<Card>
					<CardHeader>
						<CardTitle>Notification Channels</CardTitle>
						<CardDescription>
							Choose how you want to receive notifications
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Mail className="h-5 w-5 text-muted-foreground" />
									<div>
										<Label className="text-base">Email Notifications</Label>
										<div className="text-sm text-muted-foreground">
											john.doe@example.com
										</div>
									</div>
								</div>
								<Switch defaultChecked />
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Smartphone className="h-5 w-5 text-muted-foreground" />
									<div>
										<Label className="text-base">Push Notifications</Label>
										<div className="text-sm text-muted-foreground">
											Browser and mobile app notifications
										</div>
									</div>
								</div>
								<Switch defaultChecked />
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<MessageSquare className="h-5 w-5 text-muted-foreground" />
									<div>
										<Label className="text-base">SMS Notifications</Label>
										<div className="text-sm text-muted-foreground">
											+1 (555) 123-4567
										</div>
									</div>
								</div>
								<Switch />
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Notification Categories */}
                        {categories.map((category, categoryIndex) => (
				<motion.div
					key={category.title}
					custom={categoryIndex + 1}
					initial="hidden"
					animate="visible"
					variants={cardVariants}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<category.icon className="h-5 w-5" />
								{category.title}
							</CardTitle>
                                                        <CardDescription>{category.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
									<div>Notification Type</div>
									<div className="text-center">Email</div>
									<div className="text-center">Push</div>
									<div className="text-center">SMS</div>
								</div>

                                                                {category.settings.map((setting, setIdx) => (
                                                                        <div
                                                                                key={setting.id}
                                                                                className="grid grid-cols-5 gap-4 items-center"
                                                                        >
                                                                                <Input
                                                                                        value={setting.label}
                                                                                        onChange={(e) =>
                                                                                                handleLabelChange(categoryIndex, setIdx, e.target.value)
                                                                                        }
                                                                                />
                                                                                <div className="flex justify-center">
                                                                                        <Switch
                                                                                                checked={setting.email}
                                                                                                onCheckedChange={() =>
                                                                                                        handleToggle(categoryIndex, setIdx, "email")
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                                <div className="flex justify-center">
                                                                                        <Switch
                                                                                                checked={setting.push}
                                                                                                onCheckedChange={() =>
                                                                                                        handleToggle(categoryIndex, setIdx, "push")
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                                <div className="flex justify-center">
                                                                                        <Switch
                                                                                                checked={setting.sms}
                                                                                                onCheckedChange={() =>
                                                                                                        handleToggle(categoryIndex, setIdx, "sms")
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                                <div className="flex justify-end">
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() => handleDelete(categoryIndex, setIdx)}
                                                                                        >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </div>
                                                                ))}
                                                                {addingIndex === categoryIndex && (
                                                                        <div className="grid grid-cols-5 gap-4 items-center">
                                                                                <Input
                                                                                        value={newSetting.label}
                                                                                        onChange={(e) =>
                                                                                                setNewSetting({ ...newSetting, label: e.target.value })
                                                                                        }
                                                                                />
                                                                                <div className="flex justify-center">
                                                                                        <Switch
                                                                                                checked={newSetting.email}
                                                                                                onCheckedChange={() =>
                                                                                                        setNewSetting({ ...newSetting, email: !newSetting.email })
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                                <div className="flex justify-center">
                                                                                        <Switch
                                                                                                checked={newSetting.push}
                                                                                                onCheckedChange={() =>
                                                                                                        setNewSetting({ ...newSetting, push: !newSetting.push })
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                                <div className="flex justify-center">
                                                                                        <Switch
                                                                                                checked={newSetting.sms}
                                                                                                onCheckedChange={() =>
                                                                                                        setNewSetting({ ...newSetting, sms: !newSetting.sms })
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                                <div className="flex justify-end gap-2">
                                                                                        <Button
                                                                                                variant="outline"
                                                                                                size="sm"
                                                                                                onClick={() => {
                                                                                                        setAddingIndex(null);
                                                                                                        setNewSetting({ label: "", email: false, push: false, sms: false });
                                                                                                }}
                                                                                        >
                                                                                                Cancel
                                                                                        </Button>
                                                                                        <Button size="sm" onClick={() => handleAddSetting(categoryIndex)}>
                                                                                                Save
                                                                                        </Button>
                                                                                </div>
                                                                        </div>
                                                                )}
                                                                <div className="flex justify-end pt-2">
                                                                        <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => setAddingIndex(categoryIndex)}
                                                                        >
                                                                                <Plus className="h-4 w-4 mr-2" /> Add Setting
                                                                        </Button>
                                                                </div>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                </motion.div>
                        ))}

                        {/* Save Button */}
                        <motion.div
                                custom={categories.length + 1}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                                className="flex justify-end"
                        >
                                <Button size="lg">Save Notification Settings</Button>
                        </motion.div>
                </div>
        );
}
