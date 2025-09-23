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
