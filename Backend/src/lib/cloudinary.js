import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUIDNAERY_CLOUD_NAME,
  api_key: process.env.CLOUIDNAERY_API_KEY,
  api_secret: process.env.CLOUIDNAERY_API_SECRET,
});
export default cloudinary;
