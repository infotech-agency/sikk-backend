import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

/**
 * Runs after express-validator rules. Collects any validation errors into a
 * single 422 response with a clear, structured `errors` array so the frontend
 * can map messages to specific fields.
 */
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map((e) => ({
    field: e.path || e.param,
    message: e.msg,
  }));

  return next(
    new ApiError(422, "Validation failed", formatted)
  );
};

export default validateRequest;
