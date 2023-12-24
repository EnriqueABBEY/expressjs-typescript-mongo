import { Router } from 'express';
import authMiddleware from '../app/middleware/auth.middleware';
import { editUser, findUser, indexUsers } from '../app/controllers';

export const userRoutes = Router();
userRoutes.get("/", authMiddleware.checkIfAuthenticated, indexUsers)
userRoutes.get("/:id", authMiddleware.checkIfAuthenticated, findUser)
userRoutes.put('/:id', authMiddleware.checkIfAuthenticated, editUser);