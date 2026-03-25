import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.message}`);

  // Если ошибка от Zod (валидация)
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',

      details: err.issues.map(e => ({ path: e.path, message: e.message }))
    });
  }

  // Если мы сами выбросили ошибку "Not found"
  if (err.message.includes('not found')) {
    return res.status(404).json({ error: err.message });
  }

  // Дефолтная ошибка сервера
  res.status(500).json({ error: 'Internal Server Error' });
};