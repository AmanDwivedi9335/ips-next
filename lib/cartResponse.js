import { deriveProductPricing } from "@/lib/pricing.js";
import { attachSubcategoryDiscount } from "@/lib/categoryDiscount.js";

export const CART_PRODUCT_SELECTION =
        "title description images price salePrice discount mrp type category subcategory productCode code";

export async function buildCartResponse(cartDoc) {
        if (!cartDoc) {
                return null;
        }

        const plainCart = cartDoc.toObject();
        const productDocs = cartDoc.products.map((item) => item?.product || null);

        const enrichedProducts = await attachSubcategoryDiscount(productDocs);

        let totalPrice = 0;
        const products = cartDoc.products.map((item, index) => {
                const plainItem = item.toObject();
                const productData = enrichedProducts[index] || plainItem.product || {};
                const pricing = deriveProductPricing(productData);

                totalPrice += pricing.finalPrice * (plainItem.quantity || 0);

                return {
                        ...plainItem,
                        product: productData,
                };
        });

        return {
                ...plainCart,
                products,
                totalPrice,
        };
}
