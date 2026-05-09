import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 🔹 Upload file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("❌ No file path provided");
      return null;
    }

    // 🔥 CONFIGURE CLOUDINARY HERE - INSIDE THE FUNCTION
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("📤 Attempting upload:", localFilePath);
    console.log("🔧 Using cloud_name:", process.env.CLOUDINARY_CLOUD_NAME);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("✅ Upload successful:", response.url);

    // remove local file after upload
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);
    
    // remove local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

// 🔹 Delete video from Cloudinary
const deleteVideoFromCloudinary = async (publicId) => {
  try {
    // 🔥 CONFIGURE HERE TOO
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    console.log("Video deleted:", result);
    return result;
  } catch (err) {
    console.error("Error deleting video:", err);
    throw err;
  }
};

export {
  uploadOnCloudinary,
  deleteVideoFromCloudinary,
};