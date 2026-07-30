import { body, param, query } from "express-validator";

/**
 * Reusable field rules referenced from individual validator files.
 */
export const emailRule = () =>
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail();

export const phoneRule = (field = "phone") =>
  body(field)
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("Please provide a valid phone number")
    .trim();

export const stringArrayRule = (field) =>
  body(field)
    .optional()
    .isArray({ min: 0 })
    .withMessage(`${field} must be an array`)
    .custom((arr) => arr.every((s) => typeof s === "string" && s.trim().length > 0))
    .withMessage(`${field} must be an array of non-empty strings`);

export const idParamRule = (field = "id") =>
  param(field)
    .isMongoId()
    .withMessage(`Invalid ${field}: must be a valid MongoDB ObjectId`);

export const paginationRules = [
  query("page").optional().isInt({ min: 1 }).toInt().withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt().withMessage("limit must be 1-100"),
  query("search").optional().isString().trim(),
  query("status").optional().isString().trim(),
  query("category").optional().isString().trim(),
  query("employmentType").optional().isString().trim(),
  query("featured").optional().isIn(["true", "false", "1", "0"]),
];
