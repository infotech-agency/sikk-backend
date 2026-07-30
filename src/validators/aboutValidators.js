import { body } from "express-validator";
import { stringArrayRule } from "./index.js";

export const updateAboutRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("mission").trim().notEmpty().withMessage("Mission is required"),
  body("vision").trim().notEmpty().withMessage("Vision is required"),
  stringArrayRule("values"),
];
