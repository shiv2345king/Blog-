import { v2 as cloudinary } from "cloudinary";

// Configure ONCE (not inside functions)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔥 Upload from BUFFER (not file path)
const uploadOnCloudinary = async (fileBuffer) => {
  try {
    if (!fileBuffer) {
      throw new Error("No file buffer provided");
    }

    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "blog",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    return null;
  }
};

// 🔥 Delete unchanged (OK)
const deleteVideoFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
  } catch (err) {
    console.error("Error deleting video:", err);
    throw err;
  }
};

export { uploadOnCloudinary, deleteVideoFromCloudinary };