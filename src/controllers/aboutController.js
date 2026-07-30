import About from "../models/About.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * @swagger
 * tags:
 *   name: About
 *   description: Singleton About Us record
 */

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Get the About Us record (creates one if none exists)
 *     tags: [About]
 *     responses:
 *       200: { description: About Us record }
 */
export const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        title: "Building India's Future",
        description: "Engineering and infrastructure excellence.",
        mission: "Deliver world-class infrastructure.",
        vision: "Transform India's future.",
        values: ["Integrity", "Innovation", "Quality"],
      });
    }
    return ApiResponse(res, 200, "About record fetched successfully", about);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /api/about:
 *   put:
 *     summary: Update the About Us record (creates one if none exists)
 *     tags: [About]
 *     responses:
 *       200: { description: About Us updated }
 */
export const updateAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About(req.body);
    } else {
      const updatable = ["title", "description", "mission", "vision", "values"];
      console.log(updatable)
      for (const f of updatable) {
        if (req.body[f] !== undefined) about[f] = req.body[f];
      }
    }
    await about.save();
    return ApiResponse(res, 200, "About record updated successfully", about);
  } catch (err) {
    next(err);
  }
};

export default { getAbout, updateAbout };
