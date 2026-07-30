import express from "express";
import {
  getCounters,
  getCounter,
  createCounter,
  updateCounter,
  deleteCounter,
} from "../controllers/counterController.js";

const router = express.Router();

router.get("/", getCounters);
router.get("/:id", getCounter);
router.post("/", createCounter);
router.put("/:id", updateCounter);
router.delete("/:id", deleteCounter);

export default router;