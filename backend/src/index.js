import "./env.js";

import connectDB from "./db/index.js";
import { app } from "./app.js";

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
  api_key: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        "Server is running on port",
        process.env.PORT || 5000
      );
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection error:", err);
  });