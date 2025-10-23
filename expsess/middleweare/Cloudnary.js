import { v2 as cloudinary } from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import multer from 'multer';

export default cloudinary.config({
    cloud_name: process.env.my_cloud_name,
    api_key: process.env.my_key,
    api_secret: process.env.my_secret
});


console.log(cloudinary.config);

const storage = new CloudinaryStorage(
    {
        cloudinary: cloudinary,
        params: {
            folder: 'Owmo_folder',
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
            public_id: (req, file) => file.originalname + "_" + Date.now(),
        },
    }
)


export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});