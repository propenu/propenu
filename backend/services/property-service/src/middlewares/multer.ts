import multer from "multer";
import { Request } from "express";
import { IMAGE_MIME_TYPES, VIDEO_MIME_TYPES } from "../utils/mime";

const memory = multer.memoryStorage();

function fileFilterImages(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (IMAGE_MIME_TYPES.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid image type"));
}

function fileFilterVideos(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (VIDEO_MIME_TYPES.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid video type"));
}

export const uploadImage = multer({
  storage: memory,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilterImages,
});

export const uploadVideo = multer({
  storage: memory,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB (consider presigned for bigger)
  fileFilter: fileFilterVideos,
});
