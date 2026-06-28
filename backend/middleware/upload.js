import multer from "multer"

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error(`Expected an image, got ${file.mimetype}`), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})