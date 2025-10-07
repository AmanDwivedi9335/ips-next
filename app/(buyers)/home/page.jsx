import Home from "@/components/BuyerPanel/home/Home.jsx";
import { dbConnect } from "@/lib/dbConnect.js";
import Settings from "@/model/Settings.js";

export const dynamic = "force-dynamic";

async function getHeroBanners() {
        try {
                await dbConnect();
                const settings = await Settings.findOne({}, { banners: 1 }).lean();
                const banners = settings?.banners ?? [];

                return banners.map((banner, index) => ({
                        _id: banner?._id ? banner._id.toString() : `banner-${index}`,
                        image: banner?.image ?? "",
                        link: banner?.link ?? "",
                        title: banner?.title ?? "",
                        description: banner?.description ?? "",
                        ctaLabel: banner?.ctaLabel ?? "",
                }));
        } catch (error) {
                console.error("Failed to load hero banners", error);
                return [];
        }
}

export default async function HomePage() {
        const initialBanners = await getHeroBanners();

        return <Home initialBanners={initialBanners} />;
}
