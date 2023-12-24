import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface InvalidTokenInterface {
    token: String
}
const invalidTokenSchema = new Schema<InvalidTokenInterface>(
    {
        token: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const InvalidToken = mongoose.model('invalid_token', invalidTokenSchema);