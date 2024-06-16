import { Router } from 'express';
import userRoutes from './userRoutes';
import fraudDetectionRoutes from './fraudDetectionRoutes';
import crowdfundingRoutes from './crowdfundingRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/frauds', fraudDetectionRoutes);
router.use('/projects', crowdfundingRoutes);

export default router;
