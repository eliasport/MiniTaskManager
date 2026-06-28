import env from './env.js';
import mongoose from 'mongoose';

export async function connectDB() {
    try {
        await mongoose.connect(`${env.MONGO_DB_URL}/${env.MONGO_DB_NAME}`)
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB: ', error);
        process.exit(1);
    }
}