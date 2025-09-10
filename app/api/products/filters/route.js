import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";
import Price from "@/model/Price.js";

const categories = [
        "personal-safety",
        "road-safety",
        "signage",
        "industrial-safety",
        "queue-management",
        "fire-safety",
        "first-aid",
        "water-safety",
        "emergency-kit",
];

export async function GET(request) {
        await dbConnect();

        try {
                const { searchParams } = new URL(request.url);
                const categoryParam = searchParams.get("category");

                const matchStage = { published: true };
                if (categoryParam && categoryParam !== "all") {
                        matchStage.category = categoryParam;
                }

                // Get price range
                const priceStats = await Product.aggregate([
                        { $match: matchStage },
                        {
                                $group: {
                                        _id: null,
                                        minPrice: {
                                                $min: {
                                                        $cond: [{ $gt: ["$salePrice", 0] }, "$salePrice", "$price"],
                                                },
                                        },
                                        maxPrice: { $max: "$price" },
                                },
                        },
                ]);

                const { minPrice = 0, maxPrice = 10000 } = priceStats[0] || {};

                let categoryList = [];

                if (categoryParam && categoryParam !== "all") {
                        const subcategoryCounts = await Product.aggregate([
                                { $match: matchStage },
                                { $group: { _id: "$subcategory", count: { $sum: 1 } } },
                        ]);

                        categoryList = subcategoryCounts
                                .filter((item) => item._id)
                                .map((item) => ({
                                        id: item._id,
                                        label: item._id
                                                .split("-")
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" "),
                                        count: item.count,
                                }));
                } else {
                        // Get category counts
                        const categoryCounts = await Product.aggregate([
                                { $match: matchStage },
                                { $group: { _id: "$category", count: { $sum: 1 } } },
                        ]);

                        const categoryMap = categoryCounts.reduce((acc, item) => {
                                acc[item._id] = item.count;
                                return acc;
                        }, {});

                        categoryList = categories.map((cat) => ({
                                id: cat,
                                label: cat
                                        .split("-")
                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" "),
                                count: categoryMap[cat] || 0,
                        }));
                }

                // Get discount range
                const discountStats = await Product.aggregate([
                        {
                                $match: {
                                        ...matchStage,
                                        $or: [{ discount: { $gt: 0 } }, { salePrice: { $gt: 0 } }],
                                },
                        },
                        {
                                $addFields: {
                                        calculatedDiscount: {
                                                $cond: [
                                                        { $gt: ["$salePrice", 0] },
                                                        {
                                                                $multiply: [
                                                                        {
                                                                                $divide: [
                                                                                        { $subtract: ["$price", "$salePrice"] },
                                                                                        "$price",
                                                                                ],
                                                                        },
                                                                        100,
                                                                ],
                                                        },
                                                        "$discount",
                                                ],
                                        },
                                },
                        },
                        {
                                $group: {
                                        _id: null,
                                        minDiscount: { $min: "$calculatedDiscount" },
                                        maxDiscount: { $max: "$calculatedDiscount" },
                                },
                        },
                ]);

                const { minDiscount = 0, maxDiscount = 100 } = discountStats[0] || {};

                // Get available types
                const types = await Product.distinct("type", matchStage);

                // Get languages and materials
                const languages = (
                        await Product.distinct("languages", matchStage)
                ).filter(Boolean);
                const materials = (
                        await Product.distinct("materials", matchStage)
                ).filter(Boolean);

                // Get QR options
                const productIds = await Product.distinct("_id", matchStage);
                const qrDistinct = await Price.distinct("qr", {
                        product: { $in: productIds },
                });
                const qr = [];
                if (qrDistinct.includes(true)) {
                        qr.push({ id: "true", label: "With QR" });
                }
                if (qrDistinct.includes(false)) {
                        qr.push({ id: "false", label: "Without QR" });
                }

                return Response.json({
                        success: true,
                        filters: {
                                priceRange: {
                                        min: Math.floor(minPrice),
                                        max: Math.ceil(maxPrice),
                                },
                                categories: categoryList,
                                discount: {
                                        min: Math.floor(minDiscount),
                                        max: Math.ceil(maxDiscount),
                                },
                                types: types.map((type) => ({
                                        id: type,
                                        label: type
                                                .split("-")
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(" "),
                                })),
                                languages,
                                materials,
                                qr,
                        },
                });
        } catch (error) {
                console.error("Filters fetch error:", error);
                return Response.json(
                        { success: false, message: "Failed to fetch filters" },
                        { status: 500 }
                );
        }
}
