// multer.middleware.js - FIX
import multer from "multer";

const storage = multer.memoryStorage(); // ✅ Use memory, not disk

export const upload = multer({ storage });