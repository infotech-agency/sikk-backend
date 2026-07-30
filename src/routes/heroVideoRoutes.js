// import express from "express";
// import {
//   getHeroVideo,
//   updateHeroVideo,
// } from "../controllers/heroVideoController.js";

// const router = express.Router();

// router.get("/", getHeroVideo);
// router.put("/", updateHeroVideo);

// export default router;

import express from "express";
import multer from "multer";
import {
  getHeroVideo,
  updateHeroVideo,
} from "../controllers/heroVideoController.js";
import { uploadVideo } from "../config/multer.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/", getHeroVideo);

router.put(
  "/",
  uploadVideo.single("video"),
  updateHeroVideo
);

export default router;