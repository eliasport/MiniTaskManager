import dotenv from 'dotenv';

dotenv.config();

// Las variables de entorno se definen en el archivo .env y se acceden a través de process.env
// Si alguna variable de entorno no está definida, en producción el programa debe de fallar y no permitir acceder al servicio
// console.log(process.env.VITE_MONGO_URL); 
const env = {
    PORT: process.env.PORT || 5000, 
    JWT_SECRET: process.env.JWT_SECRET || 'some_secret_key', 
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    // MONGO_DB_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
    MONGO_DB_URL: process.env.MONGO_URL,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'task_manager'
}
// console.log(env.MONGO_DB_URL); 

export default env;
