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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2 } from "lucide-react";

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
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "+1 (555) 123-4567",
                bio: "",
        });
        const [addresses, setAddresses] = useState([
                {
                        tag: "home",
                        name: "Home Address",
                        street: "123 Main Street, Apt 4B",
                        city: "New York",
                        state: "NY",
                        zipCode: "10001",
                        country: "United States",
                },
        ]);
        const [addressForm, setAddressForm] = useState({
                tag: "home",
                name: "",
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "United States",
        });
        const [showAddressForm, setShowAddressForm] = useState(false);
        const [editingIndex, setEditingIndex] = useState(null);

        const handleProfileChange = (e) => {
                setProfile({ ...profile, [e.target.id]: e.target.value });
        };

        const handleSaveProfile = () => {
                console.log("Profile saved", profile);
        };

        const handleAddressChange = (e) => {
                setAddressForm({ ...addressForm, [e.target.id]: e.target.value });
        };

        const resetAddressForm = () => {
                setAddressForm({
                        tag: "home",
                        name: "",
                        street: "",
                        city: "",
                        state: "",
                        zipCode: "",
                        country: "United States",
                });
                setEditingIndex(null);
                setShowAddressForm(false);
        };

        const handleAddOrUpdateAddress = () => {
                if (
                        !addressForm.name ||
                        !addressForm.street ||
                        !addressForm.city ||
                        !addressForm.state ||
                        !addressForm.zipCode
                )
                        return;

                if (editingIndex !== null) {
                        const updated = [...addresses];
                        updated[editingIndex] = addressForm;
                        setAddresses(updated);
                } else {
                        setAddresses([...addresses, addressForm]);
                }
                resetAddressForm();
        };

        const handleEditAddress = (idx) => {
                setAddressForm(addresses[idx]);
                setEditingIndex(idx);
                setShowAddressForm(true);
        };

        const handleDeleteAddress = (idx) => {
                setAddresses(addresses.filter((_, i) => i !== idx));
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
                                                <Button
                                                        size="sm"
                                                        onClick={() => {
                                                                resetAddressForm();
                                                                setShowAddressForm(true);
                                                        }}
                                                >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Address
                                                </Button>
                                        </CardHeader>
                                        <CardContent>
                                                <div className="space-y-4">
                                                        {addresses.map((addr, idx) => (
                                                                <div key={idx} className="border rounded-lg p-4">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                                <div className="font-medium">
                                                                                        {addr.tag} Address
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() => handleEditAddress(idx)}
                                                                                        >
                                                                                                <Edit className="h-4 w-4" />
                                                                                        </Button>
                                                                                        <Button
                                                                                                variant="ghost"
                                                                                                size="sm"
                                                                                                onClick={() => handleDeleteAddress(idx)}
                                                                                        >
                                                                                                <Trash2 className="h-4 w-4" />
                                                                                        </Button>
                                                                                </div>
                                                                        </div>
                                                                        <div className="text-sm text-muted-foreground">
                                                                                {addr.street}
                                                                                <br />
                                                                                {addr.city}, {addr.state} {addr.zipCode}
                                                                                <br />
                                                                                {addr.country}
                                                                        </div>
                                                                </div>
                                                        ))}
                                                        {showAddressForm && (
                                                                <div className="border rounded-lg p-4 space-y-2">
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                                <div className="space-y-1">
                                                                                        <Label htmlFor="tag">Tag</Label>
                                                                                        <Input
                                                                                                id="tag"
                                                                                                value={addressForm.tag}
                                                                                                onChange={handleAddressChange}
                                                                                        />
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
                                                                                        {editingIndex !== null ? "Update" : "Add"}
                                                                                        Address
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                        )}
                                                </div>
                                        </CardContent>
                                </Card>
                        </motion.div>

                        {/* Language & Region */}
                        <motion.div
                                custom={2}
                                initial="hidden"
                                animate="visible"
                                variants={cardVariants}
                        >
                                <Card>
                                        <CardHeader>
                                                <CardTitle>Language & Region</CardTitle>
                                                <CardDescription>
                                                        Set your preferred language and region settings
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                                <Label htmlFor="language">Language</Label>
                                                                <Select defaultValue="en">
                                                                        <SelectTrigger>
                                                                                <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                <SelectItem value="en">English</SelectItem>
                                                                                <SelectItem value="es">Spanish</SelectItem>
                                                                                <SelectItem value="fr">French</SelectItem>
                                                                                <SelectItem value="de">German</SelectItem>
                                                                        </SelectContent>
                                                                </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                                <Label htmlFor="timezone">Timezone</Label>
                                                                <Select defaultValue="est">
                                                                        <SelectTrigger>
                                                                                <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                                <SelectItem value="est">Eastern Time</SelectItem>
                                                                                <SelectItem value="pst">Pacific Time</SelectItem>
                                                                                <SelectItem value="cst">Central Time</SelectItem>
                                                                                <SelectItem value="mst">Mountain Time</SelectItem>
                                                                        </SelectContent>
                                                                </Select>
                                                        </div>
                                                </div>
                                                <Button>Save Preferences</Button>
                                        </CardContent>
                                </Card>
                        </motion.div>
                </div>
        );
}
