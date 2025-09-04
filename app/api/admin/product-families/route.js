import { dbConnect } from "@/lib/dbConnect.js";
import ProductFamily from "@/model/ProductFamily.js";

export async function GET() {
        await dbConnect();
        try {
                const productFamilies = await ProductFamily.find().sort({ createdAt: -1 }).lean();
                return Response.json({ success: true, productFamilies });
        } catch (error) {
                console.error("Product families fetch error:", error);
                return Response.json(
                        { success: false, message: "Failed to fetch product families" },
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
                const productFamily = new ProductFamily({ name, description });
                await productFamily.save();
                return Response.json({
                        success: true,
                        message: "Product family created successfully",
                        productFamily,
                });
        } catch (error) {
                if (error.code === 11000) {
                        return Response.json(
                                { success: false, message: "Product family name already exists" },
                                { status: 400 }
                        );
                }
                console.error("Create product family error:", error);
                return Response.json(
                        { success: false, message: "Failed to create product family" },
                        { status: 500 }
                );
        }
}

export async function PUT(request) {
        await dbConnect();
        try {
                const { productFamilyId, ...updateData } = await request.json();
                if (!productFamilyId) {
                        return Response.json(
                                { success: false, message: "Product family ID is required" },
                                { status: 400 }
                        );
                }
                const productFamily = await ProductFamily.findByIdAndUpdate(
                        productFamilyId,
                        updateData,
                        { new: true }
                );
                if (!productFamily) {
                        return Response.json(
                                { success: false, message: "Product family not found" },
                                { status: 404 }
                        );
                }
                return Response.json({
                        success: true,
                        message: "Product family updated successfully",
                        productFamily,
                });
        } catch (error) {
                console.error("Update product family error:", error);
                return Response.json(
                        { success: false, message: "Failed to update product family" },
                        { status: 500 }
                );
        }
}

export async function DELETE(request) {
        await dbConnect();
        try {
                const { productFamilyId, productFamilyIds } = await request.json();
                if (productFamilyIds && Array.isArray(productFamilyIds)) {
                        const result = await ProductFamily.deleteMany({ _id: { $in: productFamilyIds } });
                        return Response.json({
                                success: true,
                                message: `${result.deletedCount} product families deleted successfully`,
                                deletedCount: result.deletedCount,
                        });
                } else if (productFamilyId) {
                        const productFamily = await ProductFamily.findByIdAndDelete(productFamilyId);
                        if (!productFamily) {
                                return Response.json(
                                        { success: false, message: "Product family not found" },
                                        { status: 404 }
                                );
                        }
                        return Response.json({
                                success: true,
                                message: "Product family deleted successfully",
                        });
                } else {
                        return Response.json(
                                { success: false, message: "Product family ID(s) required" },
                                { status: 400 }
                        );
                }
        } catch (error) {
                console.error("Delete product family error:", error);
                return Response.json(
                        { success: false, message: "Failed to delete product family" },
                        { status: 500 }
                );
        }
}
