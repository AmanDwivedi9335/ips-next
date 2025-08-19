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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
        CreditCard,
        Wallet,
        Smartphone,
        Plus,
        Edit,
        Trash2,
        Star,
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

const initialCards = [
        {
                id: 1,
                name: "Visa ending in 4242",
                details: "Expires 12/25",
                isDefault: true,
        },
];

const initialWallets = [
        {
                id: 1,
                name: "PayPal",
                email: "john.doe@example.com",
                isConnected: true,
        },
];

const initialUpi = [
        {
                id: 1,
                upiId: "john.doe@paytm",
                isVerified: true,
        },
];

export function PaymentOptions() {
        const [paymentMethods, setPaymentMethods] = useState(initialCards);
        const [wallets, setWallets] = useState(initialWallets);
        const [upiMethods, setUpiMethods] = useState(initialUpi);

        const [cardForm, setCardForm] = useState({ name: "", details: "", isDefault: false });
        const [editingCard, setEditingCard] = useState(null);
        const [showCardForm, setShowCardForm] = useState(false);

        const [walletForm, setWalletForm] = useState({ name: "", email: "" });
        const [editingWallet, setEditingWallet] = useState(null);
        const [showWalletForm, setShowWalletForm] = useState(false);

        const [upiForm, setUpiForm] = useState({ upiId: "" });
        const [editingUpi, setEditingUpi] = useState(null);
        const [showUpiForm, setShowUpiForm] = useState(false);

        const handleCardSave = () => {
                if (!cardForm.name || !cardForm.details) return;
                if (editingCard !== null) {
                        const updated = [...paymentMethods];
                        updated[editingCard] = { id: updated[editingCard].id, ...cardForm };
                        setPaymentMethods(updated);
                } else {
                        setPaymentMethods([
                                ...paymentMethods,
                                { id: Date.now(), ...cardForm },
                        ]);
                }
                setCardForm({ name: "", details: "", isDefault: false });
                setEditingCard(null);
                setShowCardForm(false);
        };

        const handleWalletSave = () => {
                if (!walletForm.name) return;
                if (editingWallet !== null) {
                        const updated = [...wallets];
                        updated[editingWallet] = {
                                id: updated[editingWallet].id,
                                ...walletForm,
                                isConnected: true,
                        };
                        setWallets(updated);
                } else {
                        setWallets([
                                ...wallets,
                                { id: Date.now(), ...walletForm, isConnected: true },
                        ]);
                }
                setWalletForm({ name: "", email: "" });
                setEditingWallet(null);
                setShowWalletForm(false);
        };

        const handleUpiSave = () => {
                if (!upiForm.upiId) return;
                if (editingUpi !== null) {
                        const updated = [...upiMethods];
                        updated[editingUpi] = {
                                id: updated[editingUpi].id,
                                upiId: upiForm.upiId,
                                isVerified: true,
                        };
                        setUpiMethods(updated);
                } else {
                        setUpiMethods([
                                ...upiMethods,
                                { id: Date.now(), upiId: upiForm.upiId, isVerified: true },
                        ]);
                }
                setUpiForm({ upiId: "" });
                setEditingUpi(null);
                setShowUpiForm(false);
        };

        return (
                <div className="space-y-6">
			{/* Credit/Debit Cards */}
			<motion.div
				custom={0}
				initial="hidden"
				animate="visible"
				variants={cardVariants}
			>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="h-5 w-5" />
								Credit & Debit Cards
							</CardTitle>
							<CardDescription>Manage your saved payment cards</CardDescription>
						</div>
                                                <Button
                                                        size="sm"
                                                        onClick={() => {
                                                                setCardForm({ name: "", details: "", isDefault: false });
                                                                setEditingCard(null);
                                                                setShowCardForm(true);
                                                        }}
                                                >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Card
                                                </Button>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-4">
                                                        {paymentMethods.map((method, idx) => (
                                                                <div key={method.id} className="border rounded-lg p-4">
                                                                        <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                                                                                        <div>
                                                                                                <div className="font-medium flex items-center gap-2">
                                                                                                        {method.name}
                                                                                                        {method.isDefault && (
                                                                                                                <Badge variant="secondary" className="text-xs">
                                                                                                                        <Star className="h-3 w-3 mr-1" />
                                                                                                                        Default
                                                                                                                </Badge>
                                                                                                        )}
                                                                                                </div>
                                                                                                <div className="text-sm text-muted-foreground">
                                                                                                        {method.details}
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() => {
                                                                                                        setCardForm(method);
                                                                                                        setEditingCard(idx);
                                                                                                        setShowCardForm(true);
                                                                                                }}
                                                                                        >
                                                                                                <Edit className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() =>
                                                                                                        setPaymentMethods(paymentMethods.filter((_, i) => i !== idx))
                                                                                                }
                                                                                        >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                        {showCardForm && (
                                                                <div className="border rounded-lg p-4 space-y-2">
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="cardName">Name</Label>
                                                                                        <Input
                                                                                                id="cardName"
                                                                                                value={cardForm.name}
                                                                                                onChange={(e) =>
                                                                                                        setCardForm({
                                                                                                                ...cardForm,
                                                                                                                name: e.target.value,
                                                                                                        })
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="cardDetails">Details</Label>
                                                                                        <Input
                                                                                                id="cardDetails"
                                                                                                value={cardForm.details}
                                                                                                onChange={(e) =>
                                                                                                        setCardForm({
                                                                                                                ...cardForm,
                                                                                                                details: e.target.value,
                                                                                                        })
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex justify-end gap-2 pt-2">
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => setShowCardForm(false)}
                                                                                >
                                                                                        Cancel
                                                                                </Button>
                                                                                <Button size="sm" onClick={handleCardSave}>
                                                                                        {editingCard !== null ? "Update" : "Add"} Card
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                        )}
                                                </div>
                                        </CardContent>
                                </Card>
                        </motion.div>

			{/* Digital Wallets */}
			<motion.div
				custom={1}
				initial="hidden"
				animate="visible"
				variants={cardVariants}
			>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Wallet className="h-5 w-5" />
								Digital Wallets
							</CardTitle>
							<CardDescription>
								Connect your digital wallet accounts
							</CardDescription>
						</div>
                                                <Button
                                                        size="sm"
                                                        onClick={() => {
                                                                setWalletForm({ name: "", email: "" });
                                                                setEditingWallet(null);
                                                                setShowWalletForm(true);
                                                        }}
                                                >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Connect Wallet
                                                </Button>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-4">
                                                        {wallets.map((wallet, idx) => (
                                                                <div key={wallet.id} className="border rounded-lg p-4">
                                                                        <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                        <Wallet className="h-5 w-5 text-muted-foreground" />
                                                                                        <div>
                                                                                                <div className="font-medium">{wallet.name}</div>
                                                                                                <div className="text-sm text-muted-foreground">
                                                                                                        {wallet.email}
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                        <Badge variant="outline" className="text-green-600">
                                                                                                Connected
                                                                                        </Badge>
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() => {
                                                                                                        setWalletForm(wallet);
                                                                                                        setEditingWallet(idx);
                                                                                                        setShowWalletForm(true);
                                                                                                }}
                                                                                        >
                                                                                                <Edit className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() =>
                                                                                                        setWallets(wallets.filter((_, i) => i !== idx))
                                                                                                }
                                                                                        >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                        {showWalletForm && (
                                                                <div className="border rounded-lg p-4 space-y-2">
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="walletName">Name</Label>
                                                                                        <Input
                                                                                                id="walletName"
                                                                                                value={walletForm.name}
                                                                                                onChange={(e) =>
                                                                                                        setWalletForm({
                                                                                                                ...walletForm,
                                                                                                                name: e.target.value,
                                                                                                        })
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="walletEmail">Email</Label>
                                                                                        <Input
                                                                                                id="walletEmail"
                                                                                                value={walletForm.email}
                                                                                                onChange={(e) =>
                                                                                                        setWalletForm({
                                                                                                                ...walletForm,
                                                                                                                email: e.target.value,
                                                                                                        })
                                                                                                }
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                        <div className="flex justify-end gap-2 pt-2">
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => setShowWalletForm(false)}
                                                                                >
                                                                                        Cancel
                                                                                </Button>
                                                                                <Button size="sm" onClick={handleWalletSave}>
                                                                                        {editingWallet !== null ? "Update" : "Add"} Wallet
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                        )}
                                                </div>
                                        </CardContent>
                                </Card>
                        </motion.div>

			{/* UPI Methods */}
			<motion.div
				custom={2}
				initial="hidden"
				animate="visible"
				variants={cardVariants}
			>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Smartphone className="h-5 w-5" />
								UPI Methods
							</CardTitle>
							<CardDescription>Manage your UPI payment methods</CardDescription>
						</div>
                                                <Button
                                                        size="sm"
                                                        onClick={() => {
                                                                setUpiForm({ upiId: "" });
                                                                setEditingUpi(null);
                                                                setShowUpiForm(true);
                                                        }}
                                                >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add UPI
                                                </Button>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-4">
                                                        {upiMethods.map((upi, idx) => (
                                                                <div key={upi.id} className="border rounded-lg p-4">
                                                                        <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-3">
                                                                                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                                                                                        <div>
                                                                                                <div className="font-medium">{upi.upiId}</div>
                                                                                                <div className="text-sm text-muted-foreground">
                                                                                                        UPI ID
                                                                                                </div>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-2">
                                                                                        <Badge variant="outline" className="text-green-600">
                                                                                                Verified
                                                                                        </Badge>
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() => {
                                                                                                        setUpiForm({ upiId: upi.upiId });
                                                                                                        setEditingUpi(idx);
                                                                                                        setShowUpiForm(true);
                                                                                                }}
                                                                                        >
                                                                                                <Edit className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() =>
                                                                                                        setUpiMethods(upiMethods.filter((_, i) => i !== idx))
                                                                                                }
                                                                                        >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        ))}
                                                        {showUpiForm && (
                                                                <div className="border rounded-lg p-4 space-y-2">
                                                                        <div className="space-y-1">
                                                                                <Label htmlFor="upiId">UPI ID</Label>
                                                                                <Input
                                                                                        id="upiId"
                                                                                        value={upiForm.upiId}
                                                                                        onChange={(e) =>
                                                                                                setUpiForm({
                                                                                                        upiId: e.target.value,
                                                                                                })
                                                                                        }
                                                                                />
                                                                        </div>
                                                                        <div className="flex justify-end gap-2 pt-2">
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => setShowUpiForm(false)}
                                                                                >
                                                                                        Cancel
                                                                                </Button>
                                                                                <Button size="sm" onClick={handleUpiSave}>
                                                                                        {editingUpi !== null ? "Update" : "Add"} UPI
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                        )}
                                                </div>
                                        </CardContent>
                                </Card>
                        </motion.div>
		</div>
	);
}
