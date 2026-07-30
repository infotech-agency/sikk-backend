import { Router } from "express";
import { getAbout, updateAbout } from "../controllers/aboutController.js";
import validateRequest from "../middlewares/validateRequest.js";
import { updateAboutRules } from "../validators/aboutValidators.js";

const router = Router();

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Get About Us record
 *     tags: [About]
 *     responses:
 *       200: { description: About Us record }
 */
router.route("/").get(getAbout).put(updateAboutRules, validateRequest, updateAbout);

export default router;
