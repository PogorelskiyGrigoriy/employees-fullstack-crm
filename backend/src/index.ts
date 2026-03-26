import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';

// Routers
import employeeRouter from './routes/employees.routes.js';
import authRouter from './routes/auth.routes.js';

// Middlewares
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRouter);           // All auth logic is here now
app.use('/api/employees', employeeRouter);   // All employee logic is here now

// Error Handler
app.use(errorMiddleware);

app.listen(ENV.PORT, () => {
  console.log(`🚀 CRM Backend ready at http://localhost:${ENV.PORT}`);
});