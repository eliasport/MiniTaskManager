import express from 'express';
import { register, login, logout, currentUser, getAllUsers } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', protect, currentUser);
authRouter.post('/logout', protect, logout);

// EndPoint de test solamente para poder probar modificar datos de usuarios
console.log("entra a buscar el endpoint de usuarios"); 
authRouter.get('/all', getAllUsers); 

export default authRouter;