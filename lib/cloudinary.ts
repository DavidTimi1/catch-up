import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(filePath: string, folder: string = "math-pace"): Promise<{ url: string; publicId: string }> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are not defined. Please set them in your environment variables.");
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      assets_folder: folder,
      timeout: 120000, // 2 minutes timeout for large base64 strings
      resource_type: "image",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(
      "Cloudinary upload error!:",
      JSON.stringify(error, null, 2)
    );
    throw new Error("Failed to upload image to Cloudinary.");
  }
}
