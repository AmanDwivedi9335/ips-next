import { dbConnect } from "@/lib/dbConnect.js";
import Product from "@/model/Product.js";

export async function GET() {
        await dbConnect();

        try {
                const products = await Product.find({ parentProduct: null })
                        .select("_id title productCode code")
                        .sort({ title: 1 })
                        .lean();

                const options = products.map((product) => ({
                        _id: product._id.toString(),
                        title: product.title,
                        productCode: product.productCode || product.code || "",
                }));

                return Response.json({ success: true, products: options });
        } catch (error) {
                console.error("Failed to load parent product options", error);
                return Response.json(
                        {
                                success: false,
                                message: "Failed to load parent product options",
                        },
                        { status: 500 }
                );
        }
}
