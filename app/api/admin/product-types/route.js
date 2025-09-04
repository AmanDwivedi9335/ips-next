import { dbConnect } from "@/lib/dbConnect.js";
import ProductType from "@/model/ProductType.js";

export async function GET() {
        await dbConnect();
        try {
                const productTypes = await ProductType.find().sort({ createdAt: -1 }).lean();
                return Response.json({ success: true, productTypes });
        } catch (error) {
                console.error("Product types fetch error:", error);
                return Response.json(
                        { success: false, message: "Failed to fetch product types" },
                        { status: 500 }
                );
        }
}

export async function POST(request) {
        await dbConnect();
        try {
                const { name, description } = await request.json();
                if (!name) {
                        return Response.json(
                                { success: false, message: "Name is required" },
                                { status: 400 }
                        );
                }
                const productType = new ProductType({ name, description });
                await productType.save();
                return Response.json({
                        success: true,
                        message: "Product type created successfully",
                        productType,
                });
        } catch (error) {
                if (error.code === 11000) {
                        return Response.json(
                                { success: false, message: "Product type name already exists" },
                                { status: 400 }
                        );
                }
                console.error("Create product type error:", error);
                return Response.json(
                        { success: false, message: "Failed to create product type" },
                        { status: 500 }
                );
        }
}

export async function PUT(request) {
        await dbConnect();
        try {
                const { productTypeId, ...updateData } = await request.json();
                if (!productTypeId) {
                        return Response.json(
                                { success: false, message: "Product type ID is required" },
                                { status: 400 }
                        );
                }
                const productType = await ProductType.findByIdAndUpdate(
                        productTypeId,
                        updateData,
                        { new: true }
                );
                if (!productType) {
                        return Response.json(
                                { success: false, message: "Product type not found" },
                                { status: 404 }
                        );
                }
                return Response.json({
                        success: true,
                        message: "Product type updated successfully",
                        productType,
                });
        } catch (error) {
                console.error("Update product type error:", error);
                return Response.json(
                        { success: false, message: "Failed to update product type" },
                        { status: 500 }
                );
        }
}

export async function DELETE(request) {
        await dbConnect();
        try {
                const { productTypeId, productTypeIds } = await request.json();
                if (productTypeIds && Array.isArray(productTypeIds)) {
                        const result = await ProductType.deleteMany({ _id: { $in: productTypeIds } });
                        return Response.json({
                                success: true,
                                message: `${result.deletedCount} product types deleted successfully`,
                                deletedCount: result.deletedCount,
                        });
                } else if (productTypeId) {
                        const productType = await ProductType.findByIdAndDelete(productTypeId);
                        if (!productType) {
                                return Response.json(
                                        { success: false, message: "Product type not found" },
                                        { status: 404 }
                                );
                        }
                        return Response.json({
                                success: true,
                                message: "Product type deleted successfully",
                        });
                } else {
                        return Response.json(
                                { success: false, message: "Product type ID(s) required" },
                                { status: 400 }
                        );
                }
        } catch (error) {
                console.error("Delete product type error:", error);
                return Response.json(
                        { success: false, message: "Failed to delete product type" },
                        { status: 500 }
                );
        }
}
