import * as mongoose from 'mongoose';

export const connectdb = async () => {
    try {
        mongoose.set('strictQuery', false);
        console.log('Connecting to database ....');
        mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log('Connected to database')
        });
    } catch (error) {
        console.log(error);
        process.exit();
    }
}