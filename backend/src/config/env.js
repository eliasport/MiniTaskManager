import dotenv from 'dotenv';

dotenv.config();

const env = {
    PORT: process.env.VITE_PORT || 5000, 
    JWT_SECRET: process.env.VITE_JWT_SECRET || 'some_secret_key', 
    JWT_EXPIRES_IN: process.env.VITE_JWT_EXPIRES_IN || '24h',
    MONGO_DB_URL: process.env.VITE_MONGO_URL || 'mongodb://localhost:27017/mini-task-manager', 
    MONGO_DB_NAME: process.env.VITE_MONGO_DB_NAME || 'task_manager'
}

export default env;