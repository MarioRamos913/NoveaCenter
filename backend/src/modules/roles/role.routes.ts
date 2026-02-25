import { Router } from 'express';
import { RoleController } from './role.controller';

const router = Router();

router.get('/', RoleController.getAll);
router.get('/:id', RoleController.getById);
router.post('/', RoleController.create);
router.put('/:id', RoleController.update);
router.delete('/:id', RoleController.delete);
router.put('/:id/resources', RoleController.assignResources);

export default router;
