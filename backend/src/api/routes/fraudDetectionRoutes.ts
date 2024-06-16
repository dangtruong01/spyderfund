import { Router } from 'express';
import * as fraudDetectionController from '../controllers/fraudDetectionController';

const router = Router();

router.post('/check-user', fraudDetectionController.checkUser);
router.get('/check-transaction', fraudDetectionController.checkTransaction);
router.post('/run-periodic-check', fraudDetectionController.doPeriodicCheck);

export default router;
