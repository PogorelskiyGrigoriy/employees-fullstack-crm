import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { ServiceFactory } from '../services/service.factory.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * Initialize controller with all required dependencies from the Factory.
 * We inject both UserService (Data) and AuditService (Accounting).
 */
const userService = ServiceFactory.getUsersService();
const auditService = ServiceFactory.getAuditService();
const controller = new UserController(userService, auditService);

/**
 * RBAC Protection:
 * All user management routes are protected and strictly restricted to ADMINS.
 */
router.use(protect, authorize('ADMIN'));

/**
 * 1. Audit Trail (Accounting)
 * NOTE: This must come BEFORE /:id to avoid route collision.
 */
router.get('/logs', controller.getAuditLogs);

/**
 * 2. User Management CRUD
 */
router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);
router.post('/', controller.createUser);
router.patch('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

export default router;