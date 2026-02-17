import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

// Routes will be protected by middleware in the main app or added here later
router.get('/', UserController.getAll);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;
