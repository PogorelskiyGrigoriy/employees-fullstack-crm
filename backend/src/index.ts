/**
 * @file index.ts
 * Entry point for the CRM Backend.
 */
import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';

// Services
import { InMemoryEmployeesService } from './services/implementations/in-memory-employees.service.js';
import { InMemoryAuthService } from './services/implementations/in-memory-auth-service.js';

// Middlewares
import { errorMiddleware } from './middlewares/error.middleware.js';
import { protect, authorize } from "./middlewares/auth.middleware.js";

// Utils & Schemas
import { generateMockEmployees } from './utils/seeder.js';
import { 
  employeeFilterSchema, 
  newEmployeeSchema, 
  employeeUpdateSchema 
} from '@crm/shared/schemas/employee.schema.js';
import { loginSchema } from "@crm/shared/schemas/auth.schema.js";
import { sortParamsSchema } from "@crm/shared/schemas/common.js";

const app = express();

// Initialize Services
const employeesService = new InMemoryEmployeesService();
const authService = new InMemoryAuthService();

app.use(cors());
app.use(express.json());

// Seed data
const seedData = generateMockEmployees(10);
seedData.forEach(emp => employeesService.addEmployee(emp));

// --- AUTH ROUTES ---

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const userData = await authService.login(credentials);
    res.json(userData);
  } catch (e) { next(e); }
});

// --- EMPLOYEE ROUTES ---

app.get('/api/employees/stats', protect, async (req, res, next) => {
  try {
    const stats = await employeesService.getStatistics();
    res.json(stats);
  } catch (e) { 
    next(e); 
  }
});

app.get('/api/employees', protect, async (req, res, next) => {
  try {
    const filters = employeeFilterSchema.parse(req.query);
    const sortParams = sortParamsSchema.parse(req.query);
    const data = await employeesService.getAll(filters, sortParams);
    res.json(data);
  } catch (e) { next(e); }
});

app.post('/api/employees', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const validated = newEmployeeSchema.parse(req.body);
    const result = await employeesService.addEmployee(validated);
    res.status(201).json(result);
  } catch (e) { next(e); }
});

app.patch('/api/employees/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Type Narrowing: ensures 'id' is a single string
    if (typeof id !== 'string') {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const payload = employeeUpdateSchema.parse({ 
      id, 
      changes: req.body 
    });
    const result = await employeesService.updateEmployee(payload);
    res.json(result);
  } catch (e) { next(e); }
});

app.delete('/api/employees/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Type Narrowing: ensures 'id' is a single string
    if (typeof id !== 'string') {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await employeesService.deleteEmployee(id);
    res.json(result);
  } catch (e) { next(e); }
});

app.use(errorMiddleware);

app.listen(ENV.PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${ENV.PORT}`);
  console.log(`📊 Auth seeded: admin@crm.com / user@crm.com`);
});

export default app;