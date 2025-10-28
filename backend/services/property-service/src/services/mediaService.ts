import s3 from "../config/s3";
import { Image } from "../models/properyMediaModel";
import { Types } from "mongoose";
import { v4 as uuid } from "uuid";

const { S3_BUCKET, CDN_URL, AWS_REGION } = process.env;

if (!S3_BUCKET) throw new Error("❌ Missing S3_BUCKET in .env");

function sanitizeFilename(name: string) {
  return (name || "image").toLowerCase().replace(/[^a-z0-9.\-_]+/g, "-");
}

function guessExt(mime: string) {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
    "image/gif": ".gif",
  };
  return map[mime] || "";
}

function buildPublicUrl(key: string) {
  if (CDN_URL) return `${CDN_URL}/${key}`;
  return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

export async function uploadImageToS3AndSaveDoc(params: {
  propertyId: string;
  file: Express.Multer.File;
  alt?: string;
}) {
  const { propertyId, file, alt } = params;

  if (!Types.ObjectId.isValid(propertyId)) {
    throw new Error("Invalid propertyId");
  }

  const original = sanitizeFilename(file.originalname);
  const ext = original.includes(".") ? "" : guessExt(file.mimetype);
  const key = `properties/${propertyId}/${uuid()}-${original}${ext}`;

  // 1) Upload to S3 (private by default)
  await s3
    .putObject({
      Bucket: S3_BUCKET!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: "public-read" // only if you really want public objects
    })
    .promise();

  // 2) Save Mongo doc
  const url = buildPublicUrl(key);
  const image = await Image.create({
    propertyId,
    key,
    url,
    alt: alt || null,
    size: file.size,
  });

  return image;
}

export async function deleteImageFromS3AndDb(id: string) {
  const doc = await Image.findById(id);
  if (!doc) return null;

  await s3
    .deleteObject({
      Bucket: S3_BUCKET!,
      Key: doc.key,
    })
    .promise();

  await doc.deleteOne();
  return true;
}
