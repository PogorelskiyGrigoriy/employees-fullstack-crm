import express from 'express';
import cors from 'cors';

// 1. Services
import { InMemoryEmployeesService } from './services/implementations/in-memory-employees.service.js';
import { InMemoryAuthService } from './services/implementations/in-memory-auth-service.js';

// 2. Middlewares
import { errorMiddleware } from './middlewares/error.middleware.js';
import { protect, authorize } from "./middlewares/auth.middleware.js";

// 3. Utils
import { generateMockEmployees } from './utils/seeder.js';

// 4. Shared Schemas
import { 
  employeeFilterSchema, 
  newEmployeeSchema, 
  employeeUpdateSchema 
} from '@crm/shared/schemas/employee.schema.js';
import { loginSchema } from "@crm/shared/schemas/auth.schema.js";
import { sortParamsSchema } from "@crm/shared/schemas/common.js";

// --- APP INITIALIZATION ---
const app = express();
const PORT = 3000;

// Initialize Services
const employeesService = new InMemoryEmployeesService();
const authService = new InMemoryAuthService();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Seeding data on startup
const seedData = generateMockEmployees(10);
seedData.forEach(emp => employeesService.addEmployee(emp));

// --- ROUTES ---

/**
 * AUTH ROUTES
 */
app.post('/api/employees', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const userData = await authService.login(credentials);
    res.json(userData);
  } catch (e) {
    next(e);
  }
});

/**
 * EMPLOYEE ROUTES
 */

// GET all with filters and sorting
app.get('/api/employees', protect, async (req, res, next) => {
  try {
    const filters = employeeFilterSchema.parse(req.query);
    const sortParams = sortParamsSchema.parse(req.query);

    const data = await employeesService.getAll(filters, sortParams);
    res.json(data);
  } catch (e) { next(e); }
});

// GET stats
app.get('/api/employees/stats', async (req, res, next) => {
  try {
    const stats = await employeesService.getStatistics();
    res.json(stats);
  } catch (e) { next(e); }
});

// CREATE
app.post('/api/employees', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const validated = newEmployeeSchema.parse(req.body);
    const result = await employeesService.addEmployee(validated);
    res.status(201).json(result);
  } catch (e) { next(e); }
});

// UPDATE
app.patch('/api/employees/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const payload = employeeUpdateSchema.parse({ 
        id: req.params.id, 
        changes: req.body 
    });
    const result = await employeesService.updateEmployee(payload);
    res.json(result);
  } catch (e) { next(e); }
});

// DELETE
app.delete('/api/employees/:id', protect, authorize('ADMIN'), async (req, res, next) => {
  try {
    const result = await employeesService.deleteEmployee(req.params.id);
    res.json(result);
  } catch (e) { next(e); }
});

// --- ERROR HANDLING ---
// Error middleware MUST be the last one attached to the app
app.use(errorMiddleware);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`📊 Seeded ${seedData.length} employees`);
});

export default app;