const toNumber = (value) => {
        if (value === null || value === undefined || value === "") {
                return null;
        }

        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
                return null;
        }

        return numericValue;
};

const clampDiscount = (discount) => {
        const numeric = toNumber(discount);

        if (numeric === null || Number.isNaN(numeric)) {
                return 0;
        }

        return Math.min(Math.max(numeric, 0), 100);
};

const normalizeMrp = (candidateMrp, fallbackPrice) => {
        const mrp = toNumber(candidateMrp);
        if (mrp !== null && mrp > 0) {
                return mrp;
        }

        const fallback = toNumber(fallbackPrice);
        return fallback !== null && fallback > 0 ? fallback : 0;
};

const normalizeSalePrice = (value) => {
        const sale = toNumber(value);
        return sale !== null && sale > 0 ? sale : null;
};

export const deriveProductPricing = (productLike = {}) => {
        const {
                mrp: mrpCandidate,
                price: priceCandidate,
                salePrice: salePriceCandidate,
                discount: discountCandidate,
                type: productType,
        } = productLike || {};

        const baseMrp = normalizeMrp(mrpCandidate, priceCandidate);
        const explicitSalePrice = normalizeSalePrice(salePriceCandidate);
        const shouldApplyDiscount = productType === "discounted";
        const normalizedDiscount = shouldApplyDiscount
                ? clampDiscount(discountCandidate)
                : 0;

        let finalPrice = baseMrp;
        let effectiveDiscount = 0;

        if (explicitSalePrice !== null) {
                finalPrice = explicitSalePrice;
                if (baseMrp > finalPrice && baseMrp > 0) {
                        effectiveDiscount = Math.round(
                                ((baseMrp - finalPrice) / baseMrp) * 100
                        );
                } else if (normalizedDiscount > 0) {
                        effectiveDiscount = normalizedDiscount;
                }
        } else if (normalizedDiscount > 0 && baseMrp > 0) {
                const discountedValue =
                        baseMrp - (baseMrp * normalizedDiscount) / 100;
                const rounded = Number.parseFloat(discountedValue.toFixed(2));
                finalPrice = Number.isFinite(rounded) && rounded > 0 ? rounded : 0;
                effectiveDiscount = normalizedDiscount;
        }

        const discountAmount = Math.max(baseMrp - finalPrice, 0);

        return {
                finalPrice,
                mrp: baseMrp,
                discountPercentage: effectiveDiscount,
                discountAmount,
        };
};

export const deriveVariantPricing = (
        variant = {},
        productContext = {}
) => {
        const variantMrp = normalizeMrp(variant.price, variant.price);
        return deriveProductPricing({
                mrp: variantMrp,
                price: variantMrp,
                salePrice: variant.salePrice,
                discount: productContext.discount,
                type: productContext.type,
        });
};

const collectNumericValues = (values = []) => {
        return values
                .map((value) => toNumber(value))
                .filter((value) => value !== null && Number.isFinite(value));
};

export const deriveProductPriceRange = (productLike = {}, variants = []) => {
        const basePricing = deriveProductPricing(productLike);

        const variantPricings = (variants || []).map((variant) =>
                deriveVariantPricing(variant, productLike)
        );

        const finalValues = collectNumericValues([
                basePricing.finalPrice,
                ...variantPricings.map((pricing) => pricing.finalPrice),
        ]);

        const mrpValues = collectNumericValues([
                basePricing.mrp,
                ...variantPricings.map((pricing) => pricing.mrp),
        ]);

        const minPrice =
                finalValues.length > 0 ? Math.min(...finalValues) : basePricing.finalPrice || 0;
        const maxPrice =
                finalValues.length > 0 ? Math.max(...finalValues) : basePricing.finalPrice || 0;

        const minMrp = mrpValues.length > 0 ? Math.min(...mrpValues) : basePricing.mrp || minPrice;
        const maxMrp = mrpValues.length > 0 ? Math.max(...mrpValues) : basePricing.mrp || maxPrice;

        return {
                min: Number.isFinite(minPrice) ? minPrice : 0,
                max: Number.isFinite(maxPrice) ? maxPrice : 0,
                mrpMin: Number.isFinite(minMrp) ? minMrp : Number.isFinite(minPrice) ? minPrice : 0,
                mrpMax: Number.isFinite(maxMrp) ? maxMrp : Number.isFinite(maxPrice) ? maxPrice : 0,
        };
};

export const normalizeDisplayPriceRange = (
        range = {},
        fallbackPricing = {}
) => {
        const ensureNumber = (value, fallback) => {
                const numeric = toNumber(value);
                if (numeric !== null && Number.isFinite(numeric)) {
                        return numeric;
                }

                const fallbackNumeric = toNumber(fallback);
                return fallbackNumeric !== null && Number.isFinite(fallbackNumeric)
                        ? fallbackNumeric
                        : 0;
        };

        const fallbackFinal =
                fallbackPricing.finalPrice ?? fallbackPricing.price ?? fallbackPricing.salePrice ?? 0;
        const fallbackMrp =
                fallbackPricing.mrp ?? fallbackPricing.originalPrice ?? fallbackFinal ?? 0;

        const min = ensureNumber(range?.min, fallbackFinal);
        const maxCandidate = ensureNumber(range?.max, min);
        const mrpMin = ensureNumber(range?.mrpMin, fallbackMrp);
        const mrpMaxCandidate = ensureNumber(range?.mrpMax, mrpMin);

        return {
                min,
                max: maxCandidate >= min ? maxCandidate : min,
                mrpMin,
                mrpMax: mrpMaxCandidate >= mrpMin ? mrpMaxCandidate : mrpMin,
        };
};

export const formatCurrency = (value) => {
        const numeric = toNumber(value);
        if (numeric === null) {
                return "0";
        }

        return numeric.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
        });
};

export { toNumber };
