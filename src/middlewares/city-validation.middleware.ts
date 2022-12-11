import type { Request, Response, NextFunction } from 'express';

export const cityValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const city = req.query.city;

  if (!city) {
    return res.status(403).json({
      error: "'city' query param is required",
    });
  }
  next();
};
