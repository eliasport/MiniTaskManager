import express from "express";
import authRoutes from '../routes/auth.routes.js';
import taskRoutes from '../routes/task.routes.js';

const router = express.Router();

router.get("/test", (req, res)=> {
    res.json({
        message: "Welcome to the Mini Task Manager API"
    });
})

router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);


export default router;