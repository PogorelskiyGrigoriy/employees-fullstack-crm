/**
 * @module AuthRoutes
 * Defines endpoints for authentication.
 */
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { InMemoryAuthService } from '../services/implementations/auth-in-memory.service.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();
const authService = new InMemoryAuthService();
const controller = new AuthController(authService);

// Public route for login
router.post('/login', controller.login);

// Protected route to get current user info (session persistence)
router.get('/me', protect, controller.getMe);

export default router;