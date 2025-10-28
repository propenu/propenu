import express from 'express';
import { uploadImage } from "../middlewares/multer";
import { deleteImageController, uploadImageController } from "../controller/mediaController";

const mediaRoute = express.Router();


mediaRoute.post("/images", uploadImage.single("image"), uploadImageController);
mediaRoute.delete("/images/:id", deleteImageController);

export default mediaRoute;
