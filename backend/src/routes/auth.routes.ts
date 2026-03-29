import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ServiceFactory } from '../services/service.factory.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * We fetch both singletons from the Factory.
 */
const authService = ServiceFactory.getAuthService();
const auditService = ServiceFactory.getAuditService();

// Injecting both services into the controller
const controller = new AuthController(authService, auditService);

router.post('/login', controller.login);
router.get('/me', protect, controller.getMe);
router.post('/logout', protect, controller.logout);

export default router;