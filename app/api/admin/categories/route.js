import { dbConnect } from "@/lib/dbConnect.js";
import Category from "@/model/Category.js";
import Product from "@/model/Product.js";
import ProductFamily from "@/model/ProductFamily.js";
import { DEFAULT_PRODUCT_FAMILIES } from "@/constants/productFamilies.js";
import mongoose from "mongoose";


function escapeRegex(value) {
        return value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

function slugify(value) {
        return value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/gi, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
}

async function resolveProductFamilyId(productFamilyInput, { createIfMissing = false } = {}) {
        if (!productFamilyInput) {
                return null;
        }

        if (mongoose.isValidObjectId(productFamilyInput)) {
                const existingFamily = await ProductFamily.exists({ _id: productFamilyInput });
                if (existingFamily) {
                        return productFamilyInput;
                }
                return null;
        }

        if (typeof productFamilyInput !== "string") {
                return null;
        }

        const trimmedInput = productFamilyInput.trim();

        if (!trimmedInput) {
                return null;
        }

        const derivedSlug = slugify(trimmedInput);

        const matchedFamily = await ProductFamily.findOne({
                $or: [
                        { slug: trimmedInput },
                        { slug: derivedSlug },
                        { name: { $regex: `^${escapeRegex(trimmedInput)}$`, $options: "i" } },
                ],
        }).select("_id");

        if (matchedFamily) {
                return matchedFamily._id;
        }

        if (!createIfMissing) {
                return null;
        }

        const normalizedInput = trimmedInput.toLowerCase();
        const defaultFamily = DEFAULT_PRODUCT_FAMILIES.find((family) => {
                const slug = family.slug?.toLowerCase();
                const id = typeof family._id === "string" ? family._id.toLowerCase() : null;
                const name = family.name?.toLowerCase();
                return (
                        slug === normalizedInput ||
                        slug === derivedSlug ||
                        id === normalizedInput ||
                        name === normalizedInput
                );
        });

        if (!defaultFamily) {
                return null;
        }

        const existingDefault = await ProductFamily.findOne({ slug: defaultFamily.slug })
                .select("_id");

        if (existingDefault) {
                return existingDefault._id;
        }

        const createdFamily = await ProductFamily.create({
                name: defaultFamily.name,
                description: defaultFamily.description || "",
        });

        return createdFamily._id;
}


export async function GET(request) {
        await dbConnect();

        try {
		const { searchParams } = new URL(request.url);

		const search = searchParams.get("search");
                const published = searchParams.get("published");
                const productFamily = searchParams.get("productFamily");

		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "10");
		const sort = searchParams.get("sort") || "createdAt";
		const order = searchParams.get("order") || "desc";

		// Build query
		const query = {};

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			];
		}

                if (published !== null && published !== undefined) {
                        query.published = published === "true";
                }

                if (productFamily) {
                        const productFamilyId = await resolveProductFamilyId(productFamily);

                        if (!productFamilyId) {
                                return Response.json(
                                        { success: false, message: "Invalid product family" },
                                        { status: 400 }
                                );
                        }

                        query.productFamily = productFamilyId;
                }

		// Build sort object
		const sortObj = {};
		sortObj[sort] = order === "desc" ? -1 : 1;

		// Execute query with pagination
		const skip = (page - 1) * limit;
		const categories = await Category.find(query)
			.sort(sortObj)
			.skip(skip)
			.limit(limit)
			.lean();

		// Update product counts for each category
		for (const category of categories) {
			const productCount = await Product.countDocuments({
				category: category.slug,
				published: true,
			});
			await Category.findByIdAndUpdate(category._id, { productCount });
			category.productCount = productCount;
		}

		const total = await Category.countDocuments(query);
		const totalPages = Math.ceil(total / limit);

		return Response.json({
			success: true,
			categories,
			pagination: {
				currentPage: page,
				totalPages,
				totalCategories: total,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
				limit,
			},
		});
	} catch (error) {
		console.error("Categories fetch error:", error);
		return Response.json(
			{ success: false, message: "Failed to fetch categories" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	await dbConnect();

	try {

                const { name, description, icon, published, sortOrder, parent, productFamily } =
                        await request.json();

                if (!name || !description || !productFamily) {
                        return Response.json(
                                { success: false, message: "Name, description and product family are required" },

                                { status: 400 }
                        );
                }


                const productFamilyId = await resolveProductFamilyId(productFamily, { createIfMissing: true });

                if (!productFamilyId) {
                        return Response.json(
                                { success: false, message: "Invalid product family" },
                                { status: 400 }
                        );

                }

                const category = new Category({
                        name,
                        description,
                        icon: icon || "",
                        published: published !== undefined ? published : true,
                        sortOrder: sortOrder || 0,
                        parent: parent || null,
                        productFamily: new mongoose.Types.ObjectId(productFamilyId),
                });

		await category.save();

		return Response.json({
			success: true,
			message: "Category created successfully",
			category,
		});
	} catch (error) {
		if (error.code === 11000) {
			return Response.json(
				{ success: false, message: "Category name already exists" },
				{ status: 400 }
			);
		}
		console.error("Create category error:", error);
		return Response.json(
			{ success: false, message: "Failed to create category" },
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
        await dbConnect();

        try {
                const { categoryId, ...updateData } = await request.json();

                if (!categoryId) {
                        return Response.json(
                                { success: false, message: "Category ID is required" },
                                { status: 400 }
                        );
                }

                if (Object.prototype.hasOwnProperty.call(updateData, "productFamily")) {
                        if (!updateData.productFamily) {
                                return Response.json(
                                        { success: false, message: "Product family is required" },
                                        { status: 400 }
                                );
                        }

                        const resolvedProductFamilyId = await resolveProductFamilyId(
                                updateData.productFamily,
                                { createIfMissing: true }
                        );

                        if (!resolvedProductFamilyId) {
                                return Response.json(
                                        { success: false, message: "Invalid product family" },
                                        { status: 400 }
                                );
                        }

                        updateData.productFamily = new mongoose.Types.ObjectId(resolvedProductFamilyId);
                }

                const category = await Category.findByIdAndUpdate(categoryId, updateData, {
                        new: true,
                        runValidators: true,
                });

		if (!category) {
			return Response.json(
				{ success: false, message: "Category not found" },
				{ status: 404 }
			);
		}

		return Response.json({
			success: true,
			message: "Category updated successfully",
			category,
		});
	} catch (error) {
		console.error("Update category error:", error);
		return Response.json(
			{ success: false, message: "Failed to update category" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request) {
	await dbConnect();

	try {
		const { categoryId, categoryIds } = await request.json();

		if (categoryIds && Array.isArray(categoryIds)) {
			// Bulk delete
			const result = await Category.deleteMany({ _id: { $in: categoryIds } });
			return Response.json({
				success: true,
				message: `${result.deletedCount} categories deleted successfully`,
				deletedCount: result.deletedCount,
			});
		} else if (categoryId) {
			// Single delete
			const category = await Category.findByIdAndDelete(categoryId);
			if (!category) {
				return Response.json(
					{ success: false, message: "Category not found" },
					{ status: 404 }
				);
			}
			return Response.json({
				success: true,
				message: "Category deleted successfully",
			});
		} else {
			return Response.json(
				{ success: false, message: "Category ID(s) required" },
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("Delete category error:", error);
		return Response.json(
			{ success: false, message: "Failed to delete category" },
			{ status: 500 }
		);
	}
}
