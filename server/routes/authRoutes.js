import express from 'express';
import { googleAuth, logout, registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);

export default router;
