import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { isEmail } from 'validator';
import * as bcrypt from 'bcrypt';

export interface UserInterface {
    username: String,
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    bio?: String,
    followers?: Array<String>,
    followings?: Array<String>,
    likes?: Array<String>,
    picture?: String,
    online?: Boolean
}
const userSchema = new Schema<UserInterface>(
    {
        username: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
            unique: true,
            trim: true
        },
        lastname: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
        },
        firstname: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 55,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [isEmail],
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            maxLength: 1024,
            minLength: 8
        },
        bio: {
            type: String,
            maxLength: 1024
        },
        followers: {
            type: [String],
        },
        followings: {
            type: [String],
        },
        likes: {
            type: [String],
        },
        picture: {
            type: String,
        },
        online: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.pre('save', async function (next) {
    this.picture = `${process.env.PICTURE_BASE_URL}+${this.lastname}+${this.firstname}`;
    next();
});
export const User = mongoose.model('user', userSchema);