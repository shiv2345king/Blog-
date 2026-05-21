import multer from "multer";

// 🚀 Use memory storage (CRITICAL FIX for production)
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
});