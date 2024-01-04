import { Request, Response } from 'express';
import Jwt from '../helpers/jwt.helper';
import { Post } from '../models';
import * as mongoose from 'mongoose';
import utils from '../helpers/utils';
import fileUpload from '../helpers/fileUpload';
const ObjectId = mongoose.Types.ObjectId;

export async function indexPost(req: Request, res: Response) {
    const posts = await Post.find().select(['-password', '-comments']);
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
        // const uploadFiles = fileUpload.fields([{ name: 'cover', maxCount: 1 }, { name: 'files', maxCount: 5 }]);
        // uploadFiles(req, res, async function (error) {
        //     if (error) {
        //         return res.status(400).send({ status: false, message: error.message });
        //     } else {
        //         const coverPath = req.files['cover'][0].path;
        //         let files = [];
        //         if (req.files['files']) {
        //             req.files['files'].forEach((file, index) => {
        //                 files.push(file.path);
        //             });
        //             const data = req.body;
        //             if (!data.title) {
        //                 res.status(422).json({ errors: { title: ['Field title is required'] } });
        //             }
        //             if (!data.content) {
        //                 res.status(422).json({ errors: { content: ['Field content is required'] } });
        //             }
        //             const userId = Jwt.getAuthUserId(req.headers.authorization);

        //             const postItem = await Post.create({
        //                 title: data.title,
        //                 content: data.content,
        //                 createdBy: userId,
        //                 files: files,
        //                 cover: coverPath
        //             })
        //             res.json({ status: true, post: postItem });
        //         }
        //     }
        // })
        const data = req.body;
        if (!data.title) {
            res.status(422).json({ errors: { title: ['Field title is required'] } });
        }
        if (!data.content) {
            res.status(422).json({ errors: { content: ['Field content is required'] } });
        }
        const userId = Jwt.getAuthUserId(req.headers.authorization);

        if (req.files['cover']) {
            const coverPath = req.files['cover'][0].location;

            let files = [];
            if (req.files['files']) {
                req.files['files'].forEach((file: any) => {
                    files.push(file.location);
                })
            };
            const postItem = await Post.create({
                title: data.title,
                content: data.content,
                createdBy: userId,
                files: files,
                cover: coverPath
            })
            res.json({ status: true, post: postItem });
        } else {
            res.status(422).json({ errors: { cover: ['Field cover is required'] } });
        }

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
export async function commentPost(req: Request, res: Response) {
    try {
        const { postId, message } = req.body;

        if (!ObjectId.isValid(postId)) {
            res.status(400).json({ status: false, message: 'Invalid id provided' });
        } else {
            const post = await Post.findById(postId);
            if (!post) {
                res.status(404).json({ status: false, message: 'Ressource not found' });
            } else {
                const userId = Jwt.getAuthUserId(req.headers.authorization);
                await Post.findByIdAndUpdate(postId, {
                    $push: {
                        comments: {
                            userId: userId,
                            message: message,
                            timestamp: new Date().toISOString()
                        }
                    }
                }, { new: true });
                res.json({ status: true });
            }
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
export async function editComment(req: Request, res: Response) {
    try {
        const { message } = req.body;
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId)) {
            res.status(400).json({ status: false, message: 'Invalid id provided' });
        } else {
            const userId = Jwt.getAuthUserId(req.headers.authorization);

            const post = await Post.findOneAndUpdate({
                '_id': postId,
                comments: {
                    $elemMatch: {
                        _id: commentId,
                        userId: userId
                    }
                },
            }, {
                $set: {
                    'comments.$.message': message
                }
            }, { returnOriginal: false });

            if (!post) {
                res.status(404).json({ status: false, message: 'Ressource not found' });
            } else {
                res.json({ status: true, post: post });
            }

        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}
export async function deleteComment(req: Request, res: Response) {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;

        if (!ObjectId.isValid(postId) || !ObjectId.isValid(commentId)) {
            res.status(400).json({ status: false, message: 'Invalid id provided' });
        } else {
            const userId = Jwt.getAuthUserId(req.headers.authorization);

            const post = await Post.findOneAndUpdate({ _id: postId }, {
                $pull: {
                    comments: {
                        _id: commentId,
                        userId: userId
                    }
                }
            }, { returnOriginal: false });

            if (!post) {
                res.status(404).json({ status: false, message: 'Ressource not found' });
            } else {
                res.json({ status: true });
            }

        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}