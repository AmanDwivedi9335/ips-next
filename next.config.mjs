/** @type {import('next').NextConfig} */
const nextConfig = {
        images: {
                domains: ["res.cloudinary.com", "www.buysafetyposters.com", "buysafetyposters.com"],
        },
        eslint: {
                ignoreDuringBuilds: true,
        },
};

export default nextConfig;
