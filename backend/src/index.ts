import express from 'express';
import cors from 'cors';
import { InMemoryEmployeesService } from './services/implementations/in-memory-employees.service.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { generateMockEmployees } from './utils/seeder.js';
import { 
  employeeFilterSchema, 
  newEmployeeSchema, 
  employeeUpdateSchema 
} from '@crm/shared/schemas/employee.schema.js';
import { loginSchema } from "@crm/shared/schemas/auth.schema.js";

const authService = new InMemoryAuthService();

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const userData = await authService.login(credentials);
    res.json(userData);
  } catch (e) {
    // errorMiddleware will return 400 for Zod errors or 401 for bad credentials
    next(e);
  }
});

const app = express();
const employeesService = new InMemoryEmployeesService();

app.use(cors());
app.use(express.json());

// Сидируем данные при старте (например, 10 сотрудников)
const seedData = generateMockEmployees(10);
seedData.forEach(emp => employeesService.addEmployee(emp));

// Роуты
app.get('/api/employees/stats', async (req, res, next) => {
  try {
    const stats = await employeesService.getStatistics();
    res.json(stats);
  } catch (e) { next(e); }
});

app.post('/api/employees', async (req, res, next) => {
  try {
    const validated = newEmployeeSchema.parse(req.body);
    const result = await employeesService.addEmployee(validated);
    res.status(201).json(result);
  } catch (e) { next(e); }
});

app.patch('/api/employees/:id', async (req, res, next) => {
  try {
    // Собираем payload для валидации из параметров и тела
    const payload = employeeUpdateSchema.parse({ 
        id: req.params.id, 
        changes: req.body 
    });
    const result = await employeesService.updateEmployee(payload);
    res.json(result);
  } catch (e) { next(e); }
});

app.delete('/api/employees/:id', async (req, res, next) => {
  try {
    const result = await employeesService.deleteEmployee(req.params.id);
    res.json(result);
  } catch (e) { next(e); }
});

// ПОДКЛЮЧАЕМ МИДЛВАРУ ОШИБОК В САМОМ КОНЦЕ
app.use(errorMiddleware);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`📊 Seeded ${seedData.length} employees`);
});