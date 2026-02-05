import { Router } from 'express';
import { LicenseController } from '../controllers/licenseController';

const router = Router();

router.post('/validate', LicenseController.validate);
router.post('/licenses', LicenseController.create);
router.get('/licenses', LicenseController.getAll);
router.patch('/licenses/:key/status', LicenseController.updateStatus);
router.delete('/licenses/:key', LicenseController.delete);

export default router;
