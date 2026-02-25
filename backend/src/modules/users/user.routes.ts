import { Router } from 'express';
import { UserController } from './user.controller';

const router = Router();

// Rutas protegidas por middleware en app.ts (authenticate + authorize(['admin']))
router.get('/', UserController.getAll);
router.post('/', UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);
router.put('/:id/roles', UserController.assignRoles);

export default router;
