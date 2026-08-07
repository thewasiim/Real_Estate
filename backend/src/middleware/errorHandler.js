/**
 * Global error handler middleware.
 * Returns consistent { success, error } shape.
 * Never leaks stack traces in production.
 */
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  // Log error for auditability (never log sensitive payloads)
  console.error(`[ERROR] ${req.method} ${req.originalUrl} →`, {
    status,
    message: err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });

  res.status(status).json({ success: false, error: message });
}
