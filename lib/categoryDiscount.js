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

export async function attachSubcategoryDiscount(products) {
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

        const subcategorySlugs = new Set();

        for (const entry of validEntries) {
                if (entry.plain?.subcategory) {
                        subcategorySlugs.add(entry.plain.subcategory);
                }
        }

        const discountLookup = new Map();

        if (subcategorySlugs.size > 0) {
                const subcategories = await Category.find({
                        slug: { $in: Array.from(subcategorySlugs) },
                })
                        .select("slug discount")
                        .lean();

                for (const subcategory of subcategories) {
                        discountLookup.set(
                                subcategory.slug,
                                clampPercentage(subcategory.discount)
                        );
                }
        }

        const enrichedProducts = new Array(productList.length).fill(null);

        for (const entry of validEntries) {
                const subcategoryDiscount = discountLookup.get(
                        entry.plain?.subcategory
                );

                const normalizedDiscount =
                        subcategoryDiscount !== undefined ? subcategoryDiscount : 0;

                enrichedProducts[entry.index] = {
                        ...entry.plain,
                        subcategoryDiscount: normalizedDiscount,
                        // Maintain legacy field for backward compatibility
                        categoryDiscount: normalizedDiscount,
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
                        subcategoryDiscount: 0,
                        categoryDiscount: 0,
                };
        }

        return isArrayInput ? enrichedProducts : enrichedProducts[0] ?? null;
}

const attachCategoryDiscount = attachSubcategoryDiscount;

export { clampPercentage, attachCategoryDiscount };
