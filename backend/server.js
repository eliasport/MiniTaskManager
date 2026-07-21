import app from './src/app.js';
import env from './src/config/env.js';
import { connectDB } from './src/config/db.js';

// connectDB(); 

// connectMongoClient().then((client) => {
//     // You can use the client for database operations if needed
// }).catch((error) => {
//     console.error("❌ Error connecting to MongoDB using MongoClient: ", error);
//     process.exit(1);
// });

// const PORT = env.PORT || 5000; 
// app.listen(PORT, ()=> {
//     console.log(`Server running on port ${PORT}`);
// }) 

async function startServer(){
    try{
        await connectDB();
        // app.listen(PORT, ()=> {
        //     console.log("✅ Server running on port " + PORT);
        // })
    } catch (error) {
        console.error("❌ Error starting server: ", error);
        // process.exit(1);
    }
}

startServer(); 
