import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface PostInterface {
    _id: String,
    title: String,
    content: String,
    cover?: String,
    files?: Array<String>,
    createdBy: String,
    likes: Array<String>,
    comments: Array<{
        _id: String,
        userId: String,
        message: String,
        timestamp: String
    }>
}
const postSchema = new Schema<PostInterface>(
    {
        title: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
        },
        content: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
        },
        cover: {
            type: String,
        },
        files: {
            type: [String],
        },
        createdBy: {
            type: String,
            ref: 'User'
        },
        likes: {
            type: [String],
        },
        comments: {
            type: [{
                userId: String,
                message: String,
                timestamp: String
            }],
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Post = mongoose.model('post', postSchema);