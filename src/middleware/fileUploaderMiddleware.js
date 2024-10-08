const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const multer = require("multer");
require("dotenv").config(); // Load environment variables from a .env file into process.env


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.API_SECRET,
});

// Directory where files will be uploaded
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Set up storage for uploaded files locally
const localDiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Set up multer with local storage
const upload = multer({
  storage: localDiskStorage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const mimetype = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
  },
}).single("file");



const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      fs.unlinkSync(localFilePath);
      return null;
    }

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "/uploads/profile-images",
    });

    if (!response) {
      fs.unlinkSync(localFilePath);
      return null;
    }
    // remove the local file
    fs.unlinkSync(localFilePath);
    return { public_id: response.public_id, publicUrl: response.secure_url };
  } catch (error) {
    // remove the local file in case of error
    fs.unlinkSync(localFilePath);
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Error uploading to Cloudinary ", error.message);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      return null;
    }

    // delete the file from cloudinary
    const response = await cloudinary.uploader.destroy(publicId);

    if (!response) {
      return null;
    }
    return response;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return null;
  }
};


module.exports = {
  upload,
  uploadOnCloudinary,
  deleteFromCloudinary,
};