// controllers/media.controller.ts
import { Request, Response } from "express";
import { uploadImageToS3AndSaveDoc, deleteImageFromS3AndDb } from "../services/mediaService";

export async function uploadImageController(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Field name must be 'image'." });
    }

    const { propertyId, alt } = req.body as { propertyId?: string; alt?: string };

    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }

    // With exactOptionalPropertyTypes, omit `alt` if it's undefined/empty.
    const args: Parameters<typeof uploadImageToS3AndSaveDoc>[0] = {
      propertyId,
      file: req.file, // <-- Express.Multer.File
      ...(typeof alt === "string" && alt.trim() !== "" ? { alt } : {}),
    };

    const image = await uploadImageToS3AndSaveDoc(args);

    return res.status(201).json({
      message: "Image uploaded",
      data: {
        _id: image._id,
        propertyId: image.propertyId,
        url: image.url,
        key: image.key,
        alt: image.alt,
        size: image.size,
        createdAt: image.createdAt,
      },
    });
  } catch (err: any) {
    if (err?.name === "MulterError") {
      return res.status(400).json({ message: err.message });
    }
    if (err?.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ message: "Image too large (max 5MB)." });
    }
    return res.status(500).json({ message: "Upload failed", error: err?.message });
  }
}

export async function deleteImageController(req: Request, res: Response) {
  try {
    const  id  = req.params.id;

       if (!id) {
      return res.status(400).json({ message: "Missing image id" });
    }
    
    const ok = await deleteImageFromS3AndDb(id);
    if (!ok) return res.status(404).json({ message: "Image not found" });
    return res.json({ message: "Image deleted" });
  } catch (err: any) {
    return res.status(500).json({ message: "Delete failed", error: err?.message });
  }
}
