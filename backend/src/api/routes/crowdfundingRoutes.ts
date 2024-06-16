import { Router } from 'express';
import * as crowdfundingController from '../controllers/crowdfundingController';


const router = Router();
router.post('/create', crowdfundingController.createProject);

// Endpoint to contribute to a project
router.post('/contribute', crowdfundingController.contributeToProject);

// Endpoint to get all projects
router.get('/', crowdfundingController.getAllProjects);

export default router;
