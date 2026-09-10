export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  // Handle Zod Validation Error directly if caught
  if (err.name === 'ZodError' || err.issues) {
    const issues = err.issues || err.errors || [];
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errorCode: 'VALIDATION_ERROR',
      details: issues.map(e => ({
        field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
        message: e.message
      }))
    });
  }

  // Handle Database Connection Errors gracefully
  if (
    err.code === 'ECONNREFUSED' ||
    err.message?.includes('ECONNREFUSED') ||
    (Array.isArray(err.errors) && err.errors.some(e => e.code === 'ECONNREFUSED'))
  ) {
    return res.status(503).json({
      success: false,
      message: 'Database connection currently unavailable. Please verify PostgreSQL / Supabase server.',
      errorCode: 'DATABASE_UNAVAILABLE'
    });
  }

  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let message = err.isOperational ? err.message : 'An unexpected error occurred';
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An unexpected internal server error occurred';
  }

  if (process.env.NODE_ENV !== 'production' && !err.isOperational) {
    console.error('Unhandled Server Error:', err.message || err);
  } else if (!err.isOperational) {
    console.error(`[Error ${statusCode}] ${errorCode}:`, err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    ...(err.details ? { details: err.details } : {})
  });
};
