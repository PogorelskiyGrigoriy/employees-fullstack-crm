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

const app = express();
const employeesService = new InMemoryEmployeesService();

app.use(cors());
app.use(express.json());

// Сидируем данные при старте (например, 10 сотрудников)
const seedData = generateMockEmployees(10);
seedData.forEach(emp => employeesService.addEmployee(emp));

// Роуты
app.get('/api/employees', async (req, res, next) => {
  try {
    const filters = employeeFilterSchema.parse(req.query);
    const data = await employeesService.getAll(filters);
    res.json(data);
  } catch (e) { next(e); } // Передаем ошибку в глобальный обработчик
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