import { Router } from 'express';
import authMiddleware from '../app/middleware/auth.middleware';
import { commentPost, deleteComment, editComment } from '../app/controllers';

export const commentRoutes = Router();
commentRoutes.post('/', authMiddleware.checkIfAuthenticated, commentPost);
commentRoutes.put('/:postId/:commentId', authMiddleware.checkIfAuthenticated, editComment);
commentRoutes.delete('/:postId/:commentId', authMiddleware.checkIfAuthenticated, deleteComment);