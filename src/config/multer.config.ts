import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Always use project root for upload directory
const uploadDir = path.join(process.cwd(), "public", "uploads");

// ✅ Create folder if it doesn’t exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// ✅ Only accept images
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
