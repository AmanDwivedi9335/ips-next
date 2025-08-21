/** @type {import('next').NextConfig} */
const nextConfig = {
        images: {
                domains: ["res.cloudinary.com", "buysafetyposters.com"],
        },
        eslint: {
                ignoreDuringBuilds: true,
        },
};

export default nextConfig;
