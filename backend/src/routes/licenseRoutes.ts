import { Router } from 'express';
import { LicenseController } from '../controllers/licenseController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.post('/validate', LicenseController.validate);
// GetAll: Authenticated users can see their own, Admin sees all.
router.get('/', authenticate, LicenseController.getAll);

// Protected Admin Routes
router.post('/', authenticate, authorize(['admin']), LicenseController.create);
router.patch('/:key/status', authenticate, authorize(['admin']), LicenseController.updateStatus);
router.delete('/:key', authenticate, authorize(['admin']), LicenseController.delete);

export default router;
