import { body } from "express-validator";
import { idParamRule, paginationRules, stringArrayRule } from "./index.js";

export const createProjectRules = [
  body("projectTitle").trim().notEmpty().withMessage("Project title is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("clientName").trim().notEmpty().withMessage("Client name is required"),
  body("projectValue").trim().notEmpty().withMessage("Project value is required"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Infrastructure", "Government", "Industrial", "Residential", "Commercial"])
    .withMessage("Category must be Infrastructure, Government, Industrial, Residential, or Commercial"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Ongoing", "Completed"])
    .withMessage("Status must be Ongoing or Completed"),
  body("projectDescription")
    .trim()
    .notEmpty()
    .withMessage("Project description is required")
    .isLength({ min: 10 }),
  body("featured").optional().isBoolean().withMessage("featured must be a boolean"),
];

export const updateProjectRules = [
  body("projectTitle").optional().trim().notEmpty(),
  body("location").optional().trim().notEmpty(),
  body("clientName").optional().trim().notEmpty(),
  body("projectValue").optional().trim().notEmpty(),
  body("category")
    .optional()
    .trim()
    .isIn(["Infrastructure", "Government", "Industrial", "Residential", "Commercial"])
    .withMessage("Category must be Infrastructure, Government, Industrial, Residential, or Commercial"),
  body("status").optional().trim().isIn(["Ongoing", "Completed"]).withMessage("Status must be Ongoing or Completed"),
  body("projectDescription").optional().trim().isLength({ min: 10 }),
  body("featured").optional().isBoolean(),
];

export { idParamRule, paginationRules };
