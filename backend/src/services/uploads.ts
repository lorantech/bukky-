import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

const cloudinaryReady = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);

if (cloudinaryReady) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|webp|avif)$/.test(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest("Only JPEG, PNG, WebP or AVIF images are allowed"));
  },
});

export const uploadBufferToCloudinary = async (buffer: Buffer, folder = "bukky-collection"): Promise<string> => {
  if (!cloudinaryReady) throw ApiError.internal("Image uploads are not configured");
  const result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image" }, (err, res) =>
      err ? reject(err) : resolve(res ?? {})
    );
    stream.end(buffer);
  });
  if (!result.secure_url) throw ApiError.internal("Upload failed");
  return result.secure_url;
};

export const isUploadConfigured = (): boolean => cloudinaryReady;
