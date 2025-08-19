"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
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
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
} from "@/components/ui/table";
import { Eye, Download, Plus, Edit, Trash2 } from "lucide-react";

const initialOrders = [
        {
                id: "#5302002",
                product: "Helmet",
                color: "yellow",
                qty: 2,
                date: "June 2, 2025",
                price: "$253.82",
                status: "Delivered",
        },
        {
                id: "#5302003",
                product: "Gloves",
                color: "black",
                qty: 3,
                date: "June 5, 2025",
                price: "$45.99",
                status: "In Transit",
        },
];

const getStatusColor = (status) => {
	const colors = {
		Delivered: "bg-green-100 text-green-800",
		"In Transit": "bg-blue-100 text-blue-800",
		Pending: "bg-yellow-100 text-yellow-800",
		Returned: "bg-red-100 text-red-800",
		Cancelled: "bg-gray-100 text-gray-800",
	};
	return colors[status] || "bg-gray-100 text-gray-800";
};

const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
        },
};

const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
};

export function OrderHistory() {
        const [orders, setOrders] = useState(initialOrders);
        const [showForm, setShowForm] = useState(false);
        const [editingIndex, setEditingIndex] = useState(null);
        const [formData, setFormData] = useState({
                id: "",
                product: "",
                color: "",
                qty: 1,
                date: "",
                price: "",
                status: "Pending",
        });

        const handleChange = (e) => {
                setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const resetForm = () => {
                setFormData({
                        id: "",
                        product: "",
                        color: "",
                        qty: 1,
                        date: "",
                        price: "",
                        status: "Pending",
                });
                setEditingIndex(null);
                setShowForm(false);
        };

        const handleSave = () => {
                if (!formData.id || !formData.product) return;
                if (editingIndex !== null) {
                        const updated = [...orders];
                        updated[editingIndex] = formData;
                        setOrders(updated);
                } else {
                        setOrders([...orders, formData]);
                }
                resetForm();
        };

        const handleEdit = (idx) => {
                setFormData(orders[idx]);
                setEditingIndex(idx);
                setShowForm(true);
        };

        const handleDelete = (idx) => {
                setOrders(orders.filter((_, i) => i !== idx));
        };

        return (
                <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                        <CardTitle>Orders History</CardTitle>
                                        <CardDescription>View and manage your order history</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-2" />
                                                Export
                                        </Button>
                                        <Button
                                                size="sm"
                                                onClick={() => {
                                                        resetForm();
                                                        setShowForm(true);
                                                }}
                                        >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Order
                                        </Button>
                                </div>
                        </CardHeader>
                        <CardContent>
                                <motion.div variants={tableVariants} initial="hidden" animate="visible">
                                        <Table>
                                                <TableHeader>
                                                        <TableRow>
                                                                <TableHead>Order ID</TableHead>
                                                                <TableHead>Products</TableHead>
                                                                <TableHead>Qty</TableHead>
                                                                <TableHead>Order Date</TableHead>
                                                                <TableHead>Price</TableHead>
                                                                <TableHead>Status</TableHead>
                                                                <TableHead>Actions</TableHead>
                                                        </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                        {orders.map((order, index) => (
                                                                <motion.tr
                                                                        key={order.id}
                                                                        variants={rowVariants}
                                                                        className="hover:bg-muted/50 transition-colors"
                                                                >
                                                                        <TableCell className="font-medium">{order.id}</TableCell>
                                                                        <TableCell>
                                                                                <div>
                                                                                        <div className="font-medium">{order.product}</div>
                                                                                        <div className="text-sm text-muted-foreground">
                                                                                                {order.color}
                                                                                        </div>
                                                                                </div>
                                                                        </TableCell>
                                                                        <TableCell>{order.qty}</TableCell>
                                                                        <TableCell>{order.date}</TableCell>
                                                                        <TableCell className="font-medium">{order.price}</TableCell>
                                                                        <TableCell>
                                                                                <Badge className={getStatusColor(order.status)}>
                                                                                        {order.status}
                                                                                </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="flex gap-2">
                                                                                <Button variant="ghost" size="sm">
                                                                                        <Eye className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => handleEdit(index)}
                                                                                >
                                                                                        <Edit className="h-4 w-4" />
                                                                                </Button>
                                                                                <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => handleDelete(index)}
                                                                                >
                                                                                        <Trash2 className="h-4 w-4" />
                                                                                </Button>
                                                                        </TableCell>
                                                                </motion.tr>
                                                        ))}
                                                </TableBody>
                                        </Table>
                                </motion.div>
                                {showForm && (
                                        <div className="mt-6 border rounded-lg p-4 space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                                <Label htmlFor="id">Order ID</Label>
                                                                <Input
                                                                        name="id"
                                                                        value={formData.id}
                                                                        onChange={handleChange}
                                                                />
                                                        </div>
                                                        <div className="space-y-1">
                                                                <Label htmlFor="product">Product</Label>
                                                                <Input
                                                                        name="product"
                                                                        value={formData.product}
                                                                        onChange={handleChange}
                                                                />
                                                        </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                        <div className="space-y-1">
                                                                <Label htmlFor="color">Color</Label>
                                                                <Input
                                                                        name="color"
                                                                        value={formData.color}
                                                                        onChange={handleChange}
                                                                />
                                                        </div>
                                                        <div className="space-y-1">
                                                                <Label htmlFor="qty">Qty</Label>
                                                                <Input
                                                                        name="qty"
                                                                        type="number"
                                                                        value={formData.qty}
                                                                        onChange={handleChange}
                                                                />
                                                        </div>
                                                        <div className="space-y-1">
                                                                <Label htmlFor="date">Date</Label>
                                                                <Input
                                                                        name="date"
                                                                        value={formData.date}
                                                                        onChange={handleChange}
                                                                />
                                                        </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                                <Label htmlFor="price">Price</Label>
                                                                <Input
                                                                        name="price"
                                                                        value={formData.price}
                                                                        onChange={handleChange}
                                                                />
                                                        </div>
                                                        <div className="space-y-1">
                                                                <Label htmlFor="status">Status</Label>
                                                                <Input
                                                                        name="status"
                                                                        value={formData.status}
                                                                        onChange={handleChange}
                                                                />
                                                        </div>
                                                </div>
                                                <div className="flex justify-end gap-2 pt-2">
                                                        <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={resetForm}
                                                        >
                                                                Cancel
                                                        </Button>
                                                        <Button size="sm" onClick={handleSave}>
                                                                {editingIndex !== null ? "Update" : "Add"} Order
                                                        </Button>
                                                </div>
                                        </div>
                                )}
                        </CardContent>
                </Card>
        );
}
