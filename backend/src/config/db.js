import env from './env.js';
import mongoose from 'mongoose';

export async function connectDB() {
    try {
        await mongoose.connect(`${env.MONGO_DB_URL}/${env.MONGO_DB_NAME}`)
        // const mongoUrl = env.MONGO_DB_URL.replace(/\/+$/, '');    
        // const dbName = env.MONGO_DB_NAME.replace(/\/+$/, '');
        // await mongoose.connect(`${mongoUrl}/${dbName}`);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB: ', error);
        process.exit(1);
    }
}
