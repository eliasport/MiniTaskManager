import express from 'express';
import { createTaskController, getTasksController, updateTaskController, removeTaskController, toggleTaskController, getAllTasksController } from '../controllers/task.controller.js';
import protect from '../middlewares/auth.middleware.js';

const taskRouter = express.Router();

taskRouter.post('/', protect, createTaskController);
taskRouter.get('/', protect, getTasksController);
taskRouter.put('/:id', protect, updateTaskController);
taskRouter.delete('/:id', protect, removeTaskController);
taskRouter.patch('/:id', protect, toggleTaskController);

// Linea de código temporal para obtener todas las tareas sin protección
taskRouter.get('/all', getAllTasksController); 

export default taskRouter;