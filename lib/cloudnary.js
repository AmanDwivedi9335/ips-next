import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMultipleImagesToCloudinary = async (images = [], folder) => {
        const uploads = images.map((image) =>
                cloudinary.uploader
                        .upload(image, folder ? { folder } : undefined)
                        .then((res) => res.secure_url)
        );

        return Promise.all(uploads);
};

export default cloudinary;
