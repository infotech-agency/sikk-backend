/**
 * Wraps an async controller so rejected promises flow into next(err)
 * without requiring a manual try/catch in every handler.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
