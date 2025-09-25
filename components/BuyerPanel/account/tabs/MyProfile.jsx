"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, CreditCard, Truck } from "lucide-react";
import { toast } from "react-hot-toast";

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

export function MyProfile() {
        const [profile, setProfile] = useState({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                bio: "",
        });
        const [addresses, setAddresses] = useState([]);
        const [addressForm, setAddressForm] = useState({
                tag: "shipping",
                name: "",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "India",
                isDefault: false,
        });
        const [showAddressForm, setShowAddressForm] = useState(false);
        const [editingAddressId, setEditingAddressId] = useState(null);
        const [languages, setLanguages] = useState([]);
        const [selectedLanguage, setSelectedLanguage] = useState("");


        useEffect(() => {
                const fetchData = async () => {
                        try {
                                const [profileRes, addressRes] = await Promise.all([
                                        fetch("/api/auth/me"),
                                        fetch("/api/user/addresses"),
                                ]);

                                if (profileRes.ok) {
                                        const { user } = await profileRes.json();
                                        setProfile({
                                                firstName: user?.firstName || "",
                                                lastName: user?.lastName || "",
                                                email: user?.email || "",
                                                phone: user?.mobile || "",
                                                bio: user?.bio || "",
                                        });
                                }

                                if (addressRes.ok) {
                                        const data = await addressRes.json();
                                        setAddresses(data.addresses || []);
                                }

                        } catch (err) {
                                console.error("Error loading profile data", err);
                        }
                };

                fetchData();
        }, []);

        const handleProfileChange = (e) => {
                setProfile({ ...profile, [e.target.id]: e.target.value });
        };

        const handleSaveProfile = () => {
                console.log("Profile saved", profile);
        };

        const handleAddressChange = (e) => {
                setAddressForm({ ...addressForm, [e.target.id]: e.target.value });
        };

        const hasBillingAddress = addresses.some((addr) => addr.tag === "billing");

        const resetAddressForm = (shouldClose = true) => {
                setAddressForm({
                        tag: hasBillingAddress ? "shipping" : "billing",
                        name: "",
                        street: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        country: "India",
                        isDefault: hasBillingAddress ? false : true,
                });
                setEditingAddressId(null);
                if (shouldClose) {
                        setShowAddressForm(false);
                }
        };

        const handleAddOrUpdateAddress = async () => {
                if (
                        !addressForm.name ||
                        !addressForm.street ||
                        !addressForm.city ||
                        !addressForm.state ||
                        !addressForm.zipCode
                )
                        return;

                try {
                        const payload = {
                                ...addressForm,
                                country: addressForm.country || "United States",
                        };

                        let response;

                        if (editingAddressId) {
                                response = await fetch("/api/user/addresses", {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ addressId: editingAddressId, ...payload }),
                                });
                        } else {
                                response = await fetch("/api/user/addresses", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(payload),
                                });
                        }

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                                throw new Error(data.message || "Failed to save address");
                        }

                        setAddresses(data.addresses || []);
                        toast.success(
                                editingAddressId
                                        ? "Address updated successfully"
                                        : "Address added successfully"
                        );
                        resetAddressForm();
                } catch (err) {
                        console.error("Failed to save address", err);
                        toast.error(err.message || "Failed to save address");
                }
        };

        const handleEditAddress = (address) => {
                setAddressForm({
                        tag: address.tag,
                        name: address.name,
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                        country: address.country || "India",
                        isDefault: address.isDefault,
                });
                setEditingAddressId(address._id);
                setShowAddressForm(true);
        };

        const handleDeleteAddress = async (addressId) => {
                try {
                        const response = await fetch("/api/user/addresses", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ addressId }),
                        });

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                                throw new Error(data.message || "Failed to delete address");
                        }

                        setAddresses(data.addresses || []);
                        toast.success("Address deleted successfully");
                } catch (error) {
                        console.error("Failed to delete address", error);
                        toast.error(error.message || "Failed to delete address");
                }
        };

        const billingAddress = addresses.find((addr) => addr.tag === "billing");
        const shippingAddresses = addresses.filter((addr) => addr.tag === "shipping");
        const isEditingBilling = editingAddressId && addressForm.tag === "billing";

        const handleAddAddressClick = () => {
                resetAddressForm(false);
                setShowAddressForm(true);
        };

        return (
                <div className="space-y-6">
                        {/* Personal Information */}
                        <motion.div
                                custom={0}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                        >
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Personal Information</CardTitle>
                                                <CardDescription>
                                                        Update your personal details and information
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                                <Label htmlFor="firstName">First Name</Label>
                                                                <Input
                                                                        id="firstName"
                                                                        value={profile.firstName}
                                                                        onChange={handleProfileChange}
                                                                />
                                                        </div>
                                                        <div className="space-y-2">
                                                                <Label htmlFor="lastName">Last Name</Label>
                                                                <Input
                                                                        id="lastName"
                                                                        value={profile.lastName}
                                                                        onChange={handleProfileChange}
                                                                />
                                                        </div>
                                                </div>
                                                <div className="space-y-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                                id="email"
                                                                type="email"
                                                                value={profile.email}
                                                                onChange={handleProfileChange}
                                                        />
                                                </div>
                                                <div className="space-y-2">
                                                        <Label htmlFor="phone">Phone Number</Label>
                                                        <Input
                                                                id="phone"
                                                                value={profile.phone}
                                                                onChange={handleProfileChange}
                                                        />
                                                </div>
                                                <div className="space-y-2">
                                                        <Label htmlFor="bio">Bio</Label>
                                                        <Textarea
                                                                id="bio"
                                                                value={profile.bio}
                                                                onChange={handleProfileChange}
                                                                placeholder="Tell us about yourself..."
                                                                className="min-h-[100px]"
                                                        />
                                                </div>
                                                <Button onClick={handleSaveProfile}>Save Changes</Button>
                                        </CardContent>
                                </Card>
                        </motion.div>

                        {/* Addresses */}
                        <motion.div
                                custom={1}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                        >
                                <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                                <div>
                                                        <CardTitle>Addresses</CardTitle>
                                                        <CardDescription>
                                                                Manage your shipping and billing addresses
                                                        </CardDescription>
                                                </div>
                                                <Button size="sm" onClick={handleAddAddressClick}>
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Address
                                                </Button>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-6">
                                                        <div className="space-y-3">
                                                                <h4 className="text-sm font-semibold text-muted-foreground">
                                                                        Billing Address
                                                                </h4>
                                                                {billingAddress ? (
                                                                        <div className="border rounded-lg p-4 bg-gray-50">
                                                                                <div className="flex items-center justify-between">
                                                                                        <div className="flex items-center gap-2">
                                                                                                <CreditCard className="h-4 w-4 text-primary" />
                                                                                                <span className="font-medium">Bill To</span>
                                                                                                <Badge variant="default">Default</Badge>
                                                                                        </div>
                                                                                        <div className="flex gap-2">
                                                                                                <Button
                                                                                                        variant="ghost"
                                                                                                        size="sm"
                                                                                                        onClick={() => handleEditAddress(billingAddress)}
                                                                                                >
                                                                                                        <Edit className="h-4 w-4" />
                                                                                                </Button>
                                                                                                <Button
                                                                                                        variant="ghost"
                                                                                                        size="sm"
                                                                                                        onClick={() => handleDeleteAddress(billingAddress._id)}
                                                                                                        disabled={shippingAddresses.length === 0}
                                                                                                >
                                                                                                        <Trash2 className="h-4 w-4" />
                                                                                                </Button>
                                                                                        </div>
                                                                                </div>
                                                                                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                                                                        <p className="font-medium text-foreground">{billingAddress.name}</p>
                                                                                        <p>
                                                                                                {billingAddress.street}
                                                                                                <br />
                                                                                                {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
                                                                                                <br />
                                                                                                {billingAddress.country}
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                ) : (
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Add a billing address to speed up checkout.
                                                                        </p>
                                                                )}
                                                        </div>

                                                        <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                        <h4 className="text-sm font-semibold text-muted-foreground">
                                                                                Shipping Addresses
                                                                        </h4>
                                                                        <Badge variant="outline">Ship To</Badge>
                                                                </div>
                                                                {shippingAddresses.length > 0 ? (
                                                                        <div className="space-y-3">
                                                                                {shippingAddresses.map((addr) => (
                                                                                        <div key={addr._id} className="border rounded-lg p-4">
                                                                                                <div className="flex items-center justify-between">
                                                                                                        <div className="flex items-center gap-2">
                                                                                                                <Truck className="h-4 w-4 text-primary" />
                                                                                                                <span className="font-medium">Ship To</span>
                                                                                                                {addr.isDefault && (
                                                                                                                        <Badge variant="default">Default</Badge>
                                                                                                                )}
                                                                                                        </div>
                                                                                                        <div className="flex gap-2">
                                                                                                                <Button
                                                                                                                        variant="ghost"
                                                                                                                        size="sm"
                                                                                                                        onClick={() => handleEditAddress(addr)}
                                                                                                                >
                                                                                                                        <Edit className="h-4 w-4" />
                                                                                                                </Button>
                                                                                                                <Button
                                                                                                                        variant="ghost"
                                                                                                                        size="sm"
                                                                                                                        onClick={() => handleDeleteAddress(addr._id)}
                                                                                                                >
                                                                                                                        <Trash2 className="h-4 w-4" />
                                                                                                                </Button>
                                                                                                        </div>
                                                                                                </div>
                                                                                                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                                                                                        <p className="font-medium text-foreground">{addr.name}</p>
                                                                                                        <p>
                                                                                                                {addr.street}
                                                                                                                <br />
                                                                                                                {addr.city}, {addr.state} {addr.zipCode}
                                                                                                                <br />
                                                                                                                {addr.country}
                                                                                                        </p>
                                                                                                </div>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                ) : (
                                                                        <p className="text-sm text-muted-foreground">
                                                                                Add shipping addresses for different delivery locations.
                                                                        </p>
                                                                )}
                                                        </div>

                                                        {showAddressForm && (
                                                                <div className="border rounded-lg p-4 space-y-2">
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="tag">Tag</Label>
                                                                                        <Select
                                                                                                value={addressForm.tag}
                                                                                                onValueChange={(value) =>
                                                                                                        setAddressForm({ ...addressForm, tag: value })
                                                                                                }
                                                                                        >
                                                                                                <SelectTrigger>
                                                                                                        <SelectValue placeholder="Select address type" />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                        <SelectItem value="shipping">Ship To</SelectItem>
                                                                                                        <SelectItem
                                                                                                                value="billing"
                                                                                                                disabled={hasBillingAddress && !isEditingBilling}
                                                                                                        >
                                                                                                                Bill To
                                                                                                        </SelectItem>
                                                                                                </SelectContent>
                                                                                        </Select>
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="name">Name</Label>
                                                                                        <Input
                                                                                                id="name"
                                                                                                value={addressForm.name}
                                                                                                onChange={handleAddressChange}
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                                <Label htmlFor="street">Street</Label>
                                                                                <Input
                                                                                        id="street"
                                                                                        value={addressForm.street}
                                                                                        onChange={handleAddressChange}
                                                                                />
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="city">City</Label>
                                                                                        <Input
                                                                                                id="city"
                                                                                                value={addressForm.city}
                                                                                                onChange={handleAddressChange}
                                                                                        />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="state">State</Label>
                                                                                        <Input
                                                                                                id="state"
                                                                                                value={addressForm.state}
                                                                                                onChange={handleAddressChange}
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="zipCode">Zip Code</Label>
                                                                                        <Input
                                                                                                id="zipCode"
                                                                                                value={addressForm.zipCode}
                                                                                                onChange={handleAddressChange}
                                                                                        />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="country">Country</Label>
                                                                                        <Input
                                                                                                id="country"
                                                                                                value={addressForm.country}
                                                                                                onChange={handleAddressChange}
                                                                                        />
                                                                                </div>
                                                                        </div>
                                                                        {addressForm.tag === "shipping" && (
                                                                                <div className="flex items-center space-x-2 pt-2">
                                                                                        <Checkbox
                                                                                                id="isDefault"
                                                                                                checked={addressForm.isDefault}
                                                                                                onCheckedChange={(checked) =>
                                                                                                        setAddressForm({
                                                                                                                ...addressForm,
                                                                                                                isDefault: checked === true,
                                                                                                        })
                                                                                                }
                                                                                        />
                                                                                        <Label htmlFor="isDefault" className="text-sm">
                                                                                                Set as default shipping address
                                                                                        </Label>
                                                                                </div>
                                                                        )}
                                                                        <div className="flex justify-end gap-2 pt-2">
                                                                                <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={resetAddressForm}
                                                                                >
                                                                                        Cancel
                                                                                </Button>
                                                                                <Button
                                                                                        size="sm"
                                                                                        onClick={handleAddOrUpdateAddress}
                                                                                >
                                                                                        {editingAddressId ? "Update" : "Add"}
                                                                                        Address
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
