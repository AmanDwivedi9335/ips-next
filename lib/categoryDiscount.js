import Category from "@/model/Category.js";

const clampPercentage = (value) => {
        const numeric = Number.parseFloat(value);

        if (!Number.isFinite(numeric) || Number.isNaN(numeric)) {
                return 0;
        }

        if (numeric < 0) {
                return 0;
        }

        if (numeric > 100) {
                return 100;
        }

        return numeric;
};

export async function attachCategoryDiscount(products) {
        const isArrayInput = Array.isArray(products);
        const productList = isArrayInput ? products : [products];
        const validEntries = productList
                .map((product, index) => {
                        if (!product) {
                                return null;
                        }

                        const plain =
                                typeof product.toObject === "function"
                                        ? product.toObject({ virtuals: true })
                                        : product;

                        return { index, plain };
                })
                .filter(Boolean);

        if (validEntries.length === 0) {
                return isArrayInput ? [] : null;
        }

        const categorySlugs = new Set();
        const subcategorySlugs = new Set();

        for (const entry of validEntries) {
                if (entry.plain?.category) {
                        categorySlugs.add(entry.plain.category);
                }
                if (entry.plain?.subcategory) {
                        subcategorySlugs.add(entry.plain.subcategory);
                }
        }

        const slugSet = new Set([...categorySlugs, ...subcategorySlugs]);

        const slugLookup = new Map();
        const parentIds = new Set();

        if (slugSet.size > 0) {
                const categories = await Category.find({
                        slug: { $in: Array.from(slugSet) },
                })
                        .select("slug discount parent")
                        .lean();

                for (const category of categories) {
                        slugLookup.set(category.slug, category);
                        if (category.parent) {
                                parentIds.add(category.parent.toString());
                        }
                }
        }

        const parentDiscountLookup = new Map();

        if (parentIds.size > 0) {
                const parentCategories = await Category.find({
                        _id: { $in: Array.from(parentIds) },
                })
                        .select("discount _id slug")
                        .lean();

                for (const parent of parentCategories) {
                        parentDiscountLookup.set(parent._id.toString(), clampPercentage(parent.discount));
                }
        }

        const resolveDiscountForSlug = (slug) => {
                if (!slug) {
                        return 0;
                }

                const category = slugLookup.get(slug);
                if (!category) {
                        return 0;
                }

                const directDiscount = clampPercentage(category.discount);
                if (directDiscount > 0) {
                        return directDiscount;
                }

                if (category.parent) {
                        const parentDiscount = parentDiscountLookup.get(
                                category.parent.toString()
                        );

                        if (parentDiscount !== undefined) {
                                return parentDiscount;
                        }
                }

                return 0;
        };

        const enrichedProducts = new Array(productList.length).fill(null);

        for (const entry of validEntries) {
                const categoryDiscount = Math.max(
                        resolveDiscountForSlug(entry.plain?.category),
                        resolveDiscountForSlug(entry.plain?.subcategory)
                );

                enrichedProducts[entry.index] = {
                        ...entry.plain,
                        categoryDiscount,
                };
        }

        for (let index = 0; index < enrichedProducts.length; index += 1) {
                if (enrichedProducts[index] !== null) {
                        continue;
                }

                const original = productList[index];
                if (!original) {
                        enrichedProducts[index] = original;
                        continue;
                }

                const plain =
                        typeof original.toObject === "function"
                                ? original.toObject({ virtuals: true })
                                : original;

                enrichedProducts[index] = {
                        ...plain,
                        categoryDiscount: 0,
                };
        }

        return isArrayInput ? enrichedProducts : enrichedProducts[0] ?? null;
}

export { clampPercentage };
