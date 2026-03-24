import express from 'express';
import logger from './utils/pino-logger.js';
import { emailSchema } from '@crm/shared/schemas/common.js';

const app = express();
app.use(express.json());

// Тестовый маршрут для проверки Zod из shared
app.post('/test-shared', (req, res) => {
  const result = emailSchema.safeParse(req.body.email);
  
  if (!result.success) {
    logger.error('Validation failed in shared schema');
    return res.status(400).json({ error: result.error.format() });
  }

  logger.info('Shared schema validation passed!');
  res.json({ message: 'Email is valid' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Backend is running on http://localhost:${PORT}`);
});