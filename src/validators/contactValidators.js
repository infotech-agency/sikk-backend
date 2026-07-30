import { body } from "express-validator";
import { emailRule, idParamRule, paginationRules, phoneRule } from "./index.js";

export const createContactRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2 }),
  emailRule(),
  phoneRule("phone"),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ min: 3 }),
  body("message").trim().notEmpty().withMessage("Message is required").isLength({ min: 10 }),
];

export { idParamRule, paginationRules };
