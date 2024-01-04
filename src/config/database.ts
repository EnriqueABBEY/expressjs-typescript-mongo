import * as mongoose from 'mongoose';
import logger from '../app/helpers/logger';

export const connectdb = async () => {
    try {
        mongoose.set('strictQuery', false);
        console.log('Connecting to database ....');
        await mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log('Connected to database')
        });
    } catch (error) {
        console.log('Unable to connect to database');
        setTimeout(() => {
            connectdb();
        }, 5000);
        
        logger.info(error.message);
        // process.exit();
    }
}