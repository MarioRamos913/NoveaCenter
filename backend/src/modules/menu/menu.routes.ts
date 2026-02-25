import { Router } from 'express';
import { MenuController } from './menu.controller';

const router = Router();

// Solo requiere autenticación — cualquier usuario autenticado puede ver su menú
router.get('/', MenuController.getMenu);

export default router;
