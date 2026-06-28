import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', protect, getCurrentUser);
authRouter.post('/logout', protect, logout);

export default authRouter;