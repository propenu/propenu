// server/src/models/Media.ts
import { Schema, model, Types } from "mongoose";

const imageSchema = new Schema({
  propertyId: { type: Types.ObjectId, ref: "Property", index: true },
  url: { type: String, required: true },
  key: { type: String, required: true }, 
  alt: String,
  size: Number,
}, { timestamps: true });

const videoSchema = new Schema({
  propertyId: { type: Types.ObjectId, ref: "Property", index: true },
  key: { type: String, required: true }, 
  url: { type: String, required: true },
  alt: String,
  size: Number,
}, { timestamps: true });

export const Image = model("Image", imageSchema);
export const Video = model("Video", videoSchema);
