import { body } from "express-validator";
import { emailRule, idParamRule, paginationRules } from "./index.js";

export const applyCareerRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ min: 2 }),
  emailRule(),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("positionAppliedFor").trim().notEmpty().withMessage("Position applied for is required"),
  body("yearsOfExperience").trim().notEmpty().withMessage("Years of experience is required"),
  body("coverLetter").optional().trim(),
];

export { idParamRule, paginationRules };
