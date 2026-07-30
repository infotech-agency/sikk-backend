/**
 * Centralised error class for operational errors that carry an HTTP status.
 * Throwing `new ApiError(404, "Not found")` is the canonical way to signal
 * an expected error inside controllers — the global error handler turns it
 * into a JSON response.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    if (details) this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
