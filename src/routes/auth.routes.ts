import { Router } from 'express';
import { login, logout, register } from '../app/controllers';

export const authRoutes = Router();
authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.post('/logout', logout);

