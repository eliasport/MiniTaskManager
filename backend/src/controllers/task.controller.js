import { createTask, getTasksByUser, updateTask, deleteTask, toggleTask } from '../services/task.service.js'; 

async function createTaskController(req, res) {
    try {
        const task = await createTask(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function getTasksController(req, res) {
    try {
        const tasks = await getTasksByUser(req.user._id, {
            search: req.query.search, 
            status: req.query.status, 
            page: parseInt(req.query.page) || 1, 
            limit: parseInt(req.query.limit) || 10
        });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function updateTaskController(req, res) {
    try {
        const task = await updateTask(req.params.id, req.user._id, req.body);
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }   
}

async function removeTaskController(req, res) {
    try {
        const task = await deleteTask(req.params.id, req.user._id);
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function toggleTaskController(req, res) {
    try {
        const task = await toggleTask(req.params.id, req.user._id);
        // console.log(task); 
        res.status(200).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export { createTaskController, getTasksController, updateTaskController, removeTaskController, toggleTaskController };