import multer from "multer";

/**
 * Multer uses memory storage so files are streamed directly to Cloudinary
 * (no local disk usage). A runtime MIME filter allows images or documents
 * depending on the endpoint.
 */
const storage = multer.memoryStorage();

/**
 * Builds a file filter that accepts a configurable list of MIME types.
 * Pass an array of allowed MIME prefixes like ["image/", "application/pdf"].
 */
export const buildFileFilter = (allowedMimes = ["image/"]) => (req, file, cb) => {
  const allowed = allowedMimes.some(
    (m) => file.mimetype === m || file.mimetype.startsWith(m)
  );
  if (allowed) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `File type not allowed: ${file.mimetype}. Allowed: ${allowedMimes.join(", ")}`
      ),
      false
    );
  }
};

/**
 * Multer uploaders for the different file kinds used across the API.
 * Each enforces a strict size limit and MIME type filter.
 */
export const uploadImage = multer({
  storage,
  fileFilter: buildFileFilter(["image/jpeg", "image/png", "image/webp", "image/jpg"]),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export const uploadImages = multer({
  storage,
  fileFilter: buildFileFilter(["image/jpeg", "image/png", "image/webp", "image/jpg"]),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 }, // up to 10 images @ 5MB
});

export const uploadResume = multer({
  storage,
  fileFilter: buildFileFilter([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export const uploadVideo = multer({
  storage,
  fileFilter: buildFileFilter([
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime", // mov
  ]),
  limits: {
    fileSize: 100 * 1024 * 1024, //100MB
  },
});


export default { uploadImage, uploadImages, uploadResume,  uploadVideo, };
