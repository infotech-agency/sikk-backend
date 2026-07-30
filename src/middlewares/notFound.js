import ApiError from "../utils/ApiError.js";

/**
 * Fallback for unmatched routes — returns a 404 JSON instead of the default
 * HTML "Cannot GET /" response.
 */
// eslint-disable-next-line no-unused-vars
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFound;
