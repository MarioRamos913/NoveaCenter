import { Router } from 'express';
import { ResourceController } from './resource.controller';

const router = Router();

router.get('/', ResourceController.getAll);
router.get('/:id', ResourceController.getById);
router.post('/', ResourceController.create);
router.put('/:id', ResourceController.update);
router.delete('/:id', ResourceController.delete);

export default router;
