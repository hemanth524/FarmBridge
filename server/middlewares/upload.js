// middleware/upload.js
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'FarmBridgeusers', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 300, height: 300, crop: 'limit' }],
  },
});

// Multer middleware with cloudinary storage
const upload = multer({ storage });

export default upload;
