import { Router } from "express";
import {
  uploadImageController,
  getImages,
  deleteImage,
} from "../controllers/imageController.js";
import { uploadImage } from "../config/multer.js";

const router = Router();

// router.post("/", uploadImage.single("image"), uploadImageController);
router.post("/", uploadImage.single("image"), uploadImageController);

router.get("/", getImages);

router.delete("/:id", deleteImage);

export default router;