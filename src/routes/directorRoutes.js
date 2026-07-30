import { Router } from "express";
import {
  createDirector,
  getDirectors,
  getDirectorById,
  updateDirector,
  deleteDirector,
} from "../controllers/directorController.js";

import { uploadImage } from "../config/multer.js";

const router = Router();

router
  .route("/")
  .post(uploadImage.single("image"), createDirector)
  .get(getDirectors);

router
  .route("/:id")
  .get(getDirectorById)
  .put(uploadImage.single("image"), updateDirector)
  .delete(deleteDirector);

export default router;