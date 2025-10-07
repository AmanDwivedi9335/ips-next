import { dbConnect } from "@/lib/dbConnect.js";
import Category from "@/model/Category.js";

export async function GET(request) {
        await dbConnect();

        try {
                const { searchParams } = new URL(request.url);
                const limit = Number.parseInt(searchParams.get("limit") || "9");
                const topLevelOnly = searchParams.get("topLevelOnly") !== "false";
                const sort = searchParams.get("sort") || "sortOrder";
                const orderParam = searchParams.get("order");
                const order = orderParam ? (orderParam === "asc" ? 1 : -1) : 1;

                const query = { published: true };

                if (topLevelOnly) {
                        query.$or = [
                                { parent: { $exists: false } },
                                { parent: null },
                                { parent: "" },
                        ];
                }

                const sortObj = { [sort]: order };
                if (sort !== "createdAt") {
                        sortObj.createdAt = -1;
                }

                const categories = await Category.find(query)
                        .sort(sortObj)
                        .limit(limit)
                        .select("name slug icon description parent sortOrder createdAt")
                        .lean();

                return Response.json({
                        success: true,
                        categories,
                });
        } catch (error) {
                console.error("Public categories fetch error:", error);
                return Response.json(
                        { success: false, message: "Failed to fetch categories" },
                        { status: 500 }
                );
        }
}
