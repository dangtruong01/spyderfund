import { Router } from 'express';
import * as UserController from '../controllers/userController';

const router = Router();

// Route to get a nonce for the user to sign
router.post('/nonce', UserController.getNonceForSignature);

// Route to verify the signature and authenticate the user
router.post('/authenticate', UserController.verifyNonceAndAuthenticate);

export default router;
