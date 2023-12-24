import { Request, Response } from 'express';
import Jwt from '../helpers/jwt.helper';
import { Post } from '../models';

export async function indexPost(req: Request, res: Response) {
    const posts = await Post.find();
    res.json(posts);
}
export async function findPost(req: Request, res: Response) {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404).json({ status: false, message: 'Ressource not found' });
    } else res.json(post);
}
export async function storePost(req: Request, res: Response) {
    try {
        const data = req.body;
        if (!data.title) {
            res.status(422).json({ errors: { title: ['Field title is required'] } });
        }
        if (!data.content) {
            res.status(422).json({ errors: { content: ['Field content is required'] } });
        }
        const userId = Jwt.getAuthUserId(req.headers.authorization);

        const postItem = await Post.create({
            title: data.title,
            content: data.content,
            createdBy: userId
        })

        res.json({ status: true, post: postItem });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
export async function editPost(req: Request, res: Response) {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.json({ status: 404, message: 'Ressource not found' });
    } else {
        const postUpdated = await Post.findByIdAndUpdate(post, req.body, {
            new: true
        });
        res.json({ status: true, post: postUpdated });
    }
}
export async function destroyPost(req: Request, res: Response) {
    const post = await Post.findById(req.params.id);
    if (!post) {
        res.status(404).json({ status: false, message: 'Ressource not found' });
    } else {
        const resource = await Post.deleteOne({ _id: post._id });
        if (resource) {
            res.json({ status: true })
        } else res.status(400).json({ status: false, 'message': 'error' })
    }
}
export async function likePost(req: Request, res: Response) {
    try {
        const userId = Jwt.getAuthUserId(req.headers.authorization);
        await Post.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: userId }
        }, { new: true });
        res.json({ status: true });
    } catch (error) {
        res.status(500).json(error);
    }
}
export async function dislikePost(req: Request, res: Response) {
    try {
        const userId = Jwt.getAuthUserId(req.headers.authorization);
        await Post.findByIdAndUpdate(req.params.id, {
            $pull: { likes: userId }
        }, { new: true });
        res.json({ status: true });
    } catch (error) {
        res.status(500).json({ status: false, message: error });
    }
}