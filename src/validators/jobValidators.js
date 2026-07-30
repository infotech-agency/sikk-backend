import { body } from "express-validator";
import { idParamRule, paginationRules, stringArrayRule } from "./index.js";

export const createJobRules = [
  body("designation").trim().notEmpty().withMessage("Designation is required"),
  body("jobTitle").trim().notEmpty().withMessage("Job title is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("employmentType")
    .trim()
    .notEmpty()
    .withMessage("Employment type is required")
    .isIn(["Full Time", "Part Time", "Internship"])
    .withMessage("Employment type must be Full Time, Part Time, or Internship"),
  body("jobDescription").trim().notEmpty().withMessage("Job description is required").isLength({ min: 10 }),
  stringArrayRule("requirements"),
];

export const updateJobRules = [
  body("designation").optional().trim().notEmpty(),
  body("jobTitle").optional().trim().notEmpty(),
  body("location").optional().trim().notEmpty(),
  body("employmentType")
    .optional()
    .trim()
    .isIn(["Full Time", "Part Time", "Internship"])
    .withMessage("Employment type must be Full Time, Part Time, or Internship"),
  body("jobDescription").optional().trim().isLength({ min: 10 }),
  stringArrayRule("requirements"),
];

export { idParamRule, paginationRules };
