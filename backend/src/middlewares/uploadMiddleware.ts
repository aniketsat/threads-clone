import {v2 as cloudinary} from 'cloudinary';
import multer from 'multer';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} from "../config/secrets";

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const avatarStorage = new CloudinaryStorage({
    // @ts-ignore
    folder: "avatars",
    allowedFormats: ["jpg", "png"],
    transformation: [{
        width: 500,
        height: 500,
        crop: "limit"
    }],
    cloudinary: cloudinary
});

const postStorage = new CloudinaryStorage({
    // @ts-ignore
    folder: "posts",
    allowedFormats: ["jpg", "png"],
    transformation: [{
        width: 500,
        height: 500,
        crop: "limit"
    }],
    cloudinary: cloudinary
});


export const avatarParser = multer({storage: avatarStorage});

export const postParser = multer({storage: postStorage});