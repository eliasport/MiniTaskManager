import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import env from './config/env.js';
import routes from './routes/index.js';

const app = express();

app.use(cors({origin: '*'}));
app.use(express.json());

app.get("/", (req, res) => res.json({status: "API funcionando ✅"}));

app.use('/api', routes);

app.use((req, res)=> {
    res.status(404).json({ message: "Endpoint not found" });
});

app.use((err, req, res, next)=> {
    console.error(`Error: ${err}`);
    res.status(500).json({ message: "Internal server error" });
});

export default app;