/**
 * @module EmployeeRoutes
 * Defines API endpoints for employee management.
 * decoupled from specific DB implementations via ServiceFactory.
 */
import { Router } from 'express';
import { EmployeesController } from '../controllers/employees.controller.js';
import { ServiceFactory } from '../services/service.factory.js'; // Импортируем фабрику
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Dependency Injection:
 * We ask the factory for the current implementation of EmployeesService.
 * It could be In-Memory, Prisma (SQL), or MongoDB depending on ENV.DB_TYPE.
 */
const employeesService = ServiceFactory.getEmployeesService();
const controller = new EmployeesController(employeesService);

// --- ROUTES ---

// Statistics (Protected, available for all roles)
router.get('/stats', protect, controller.getStats);

// List/Filter employees (Protected)
router.get('/', protect, controller.getAll);

// Management (Admin only)
router.post('/', protect, authorize('ADMIN'), controller.create);
router.patch('/:id', protect, authorize('ADMIN'), controller.update);
router.delete('/:id', protect, authorize('ADMIN'), controller.delete);

export default router;