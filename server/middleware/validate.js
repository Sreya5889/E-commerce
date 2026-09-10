import { AppError } from './errorHandler.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (err) {
      const issues = err.issues || err.errors || [];
      if (issues.length > 0 || err.name === 'ZodError') {
        const formattedErrors = issues.map(e => ({
          field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
          message: e.message
        }));
        return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', formattedErrors));
      }
      next(err);
    }
  };
};
