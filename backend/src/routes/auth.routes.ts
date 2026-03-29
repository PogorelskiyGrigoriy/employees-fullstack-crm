import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ServiceFactory } from '../services/service.factory.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new AuthController(ServiceFactory.getAuthService());

router.post('/login', controller.login);
router.get('/me', protect, controller.getMe);
router.post('/logout', protect, controller.logout);

export default router;