import env from './env.js';
import mongoose from 'mongoose';
// import mongodb from 'mongodb';

export async function connectDB() {
    try {
        await mongoose.connect(`${env.MONGO_DB_URL}`)
        // await mongoose.connect(env.MONGO_DB_URL, {dbName: env.MONGO_DB_NAME}); 


        // await mongoose.connect(`${env.MONGO_DB_URL}/${env.MONGO_DB_NAME}`)
        // const mongoUrl = env.MONGO_DB_URL.replace(/\/+$/, '');    
        // const dbName = env.MONGO_DB_NAME.replace(/\/+$/, '');
        // await mongoose.connect(`${mongoUrl}/${dbName}`);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB: ', error);
        process.exit(1);
    }
}


// const mongoClient = new mongodb.MongoClient(env.MONGO_DB_URL); 

// export async function connectMongoClient(){
//     try{
//         await mongoClient.connect(); 
//         console.log("✅ Connected to MongoDB using MongoClient");
//         return mongoClient;
//     } catch(error){
//         console.error("❌ Error connecting to MongoDB using MongoClient: ", error);
//     }
// }


// export async function disconnectMongoClient(){
//     await mongoClient.close(); 
// }