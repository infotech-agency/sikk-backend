import { body } from "express-validator";
import { idParamRule, paginationRules, stringArrayRule } from "./index.js";

export const createServiceRules = [
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ min: 3, max: 150 }),
  body("description").trim().notEmpty().withMessage("Description is required").isLength({ min: 10 }),
  stringArrayRule("keyCapabilities"),
];

export const updateServiceRules = [
  body("title").optional().trim().isLength({ min: 3, max: 150 }),
  body("description").optional().trim().isLength({ min: 10 }),
  stringArrayRule("keyCapabilities"),
];

export { idParamRule, paginationRules };
