import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import logger from './utils/pino-logger.js';

// Routers
import employeeRouter from './routes/employees.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

// Middlewares
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

/**
 * Global Middlewares
 */
app.use(cors());
app.use(express.json());

/**
 * Mount API Routes
 * Note: Order matters. More specific routes should usually come first.
 */
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);       // New: User management for Admins
app.use('/api/employees', employeeRouter);

/**
 * Global Error Handling Middleware
 * CRITICAL: This MUST be the last middleware in the chain 
 * to catch all 'throw' statements from routes and services.
 */
app.use(errorMiddleware);

/**
 * Server Startup
 */
app.listen(ENV.PORT, () => {
  logger.info(
    { port: ENV.PORT, env: ENV.NODE_ENV, db: ENV.DB_TYPE },
    `🚀 CRM Backend is up and running`
  );
});