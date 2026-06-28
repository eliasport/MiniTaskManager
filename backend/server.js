import app from './src/app.js';
import env from './src/config/env.js';
import { connectDB } from './src/config/db.js';

connectDB(); 

const PORT = env.PORT || 5000; 

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
}) 