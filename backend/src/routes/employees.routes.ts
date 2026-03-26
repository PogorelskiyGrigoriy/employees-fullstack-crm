import { Router } from 'express';
import { EmployeesController } from '../controllers/employees.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { InMemoryEmployeesService } from '../services/implementations/employees-in-memory.service.js';

const router = Router();
// Инстанс сервиса обычно передается через DI или импортируется как синглтон
const employeesService = new InMemoryEmployeesService(); 
const controller = new EmployeesController(employeesService);

// Public or Protected for all users
router.get('/stats', protect, controller.getStats);
router.get('/', protect, controller.getAll);

// Admin only routes
router.post('/', protect, authorize('ADMIN'), controller.create);
router.patch('/:id', protect, authorize('ADMIN'), controller.update);
router.delete('/:id', protect, authorize('ADMIN'), controller.delete);

export default router;