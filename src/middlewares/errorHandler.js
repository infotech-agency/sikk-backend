import { MulterError } from "multer";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

/**
 * Centralised error handler — last middleware on the stack.
 * Translates operational ApiErrors, Multer errors, Mongoose errors and
 * cast/validation errors into the standardised JSON envelope.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let details = err.details || undefined;

  // Multer file size / unexpected file
  if (err instanceof MulterError) {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large. Max size is 5 MB.";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      message = "Too many files uploaded.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      message = err.message || "Unexpected file field or file type.";
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Cast error (bad ObjectId etc.)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for "${err.path}": ${err.value}`;
  }

  // Duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Duplicate value for field "${field}".`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("🔥 Error:", err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { errors: details } : {}),
  });
};

export default errorHandler;
