import express from 'express';
import { createTaskController, getTasksController, updateTaskController, removeTaskController, toggleTaskController } from '../controllers/task.controller.js';
import protect from '../middlewares/auth.middleware.js';

const taskRouter = express.Router();

taskRouter.post('/', protect, createTaskController);
taskRouter.get('/', protect, getTasksController);
taskRouter.put('/:id', protect, updateTaskController);
taskRouter.delete('/:id', protect, removeTaskController);
taskRouter.patch('/:id', protect, toggleTaskController);

export default taskRouter;