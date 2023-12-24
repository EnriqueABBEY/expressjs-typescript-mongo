import { Router } from 'express';
import { destroyPost, dislikePost, editPost, findPost, indexPost, likePost, storePost } from '../app/controllers';
import authMiddleware from '../app/middleware/auth.middleware';

export const postRoutes = Router();
postRoutes.get("/", authMiddleware.checkIfAuthenticated, indexPost)
postRoutes.get("/:id", authMiddleware.checkIfAuthenticated, findPost)
postRoutes.post('/like/:id', authMiddleware.checkIfAuthenticated, likePost);
postRoutes.post('/dislike/:id', authMiddleware.checkIfAuthenticated, dislikePost);
postRoutes.post('/', authMiddleware.checkIfAuthenticated, storePost);
postRoutes.put('/:id', authMiddleware.checkIfAuthenticated, editPost);
postRoutes.delete('/:id', authMiddleware.checkIfAuthenticated, destroyPost);