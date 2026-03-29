import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { ServiceFactory } from '../services/service.factory.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = Router();
const controller = new UserController(ServiceFactory.getUsersService());

/**
 * All user management routes are protected and restricted to ADMINS.
 */
router.use(protect, authorize('ADMIN'));

router.get('/', controller.getUsers);
router.get('/:id', controller.getUserById);
router.post('/', controller.createUser);
router.patch('/:id', controller.updateUser);
router.delete('/:id', controller.deleteUser);

export default router;