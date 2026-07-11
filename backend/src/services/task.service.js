import Task from "../models/Task.js";

function parsePositiveInteger(value, fieldname, defaultValue) {
    if(value === undefined || value === null || value === '') {
        return defaultValue; 
    }
    const numberValue = Number(value); 

    if(!Number.isInteger(numberValue) || numberValue <= 0) {
        throw new Error(`${fieldname} must be a positive integer`);
    }

    return numberValue;
}

async function createTask(taskData){
    return new Promise(async (resolve, reject)=> {
        try {
            const task = new Task(taskData);
            await task.save();
            resolve(task);
        } catch (err){
            reject(err);
        }
    });
}

async function getTasksByUser(userId, filter = {}){
    return new Promise(async (resolve, reject)=> {
        try {
            const { search, status, page = 1, limit = 10 } = filter; 
            const normalizedPage = parsePositiveInteger(page, "Page", 1); 
            const normalizedLimit = parsePositiveInteger(limit, "Limit", 10); 
            const query = { user: userId }; 
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } }, 
                    { description: { $regex: search, $options: 'i' } }
                ]; 
            }
            if (status === "true" || status === true){
                query.completed = true; 
            }
            if (status === "false" || status === false){
                query.completed = false; 
            }
            const tasks = await Task.find(query)
                .skip((normalizedPage - 1) * normalizedLimit)
                .limit(normalizedLimit)
                .sort({ createdAt: -1 }); 

            const total = await Task.countDocuments(query); 
            const userTotalTasks = await Task.countDocuments({ user: userId });
            const userCompletedTasks = await Task.countDocuments({ user: userId, completed: true });
            const userPendingTasks = await Task.countDocuments({ user: userId, completed: false });
            // resolve({tasks, total, page, limit});
            resolve({
                "Tasks": tasks, 
                "Page": normalizedPage, 
                "TotalPages": Math.ceil(total / normalizedLimit), 
                "TotalTasks": total,
                "UserStats": {
                    "Total": userTotalTasks,
                    "Completed": userCompletedTasks,
                    "Pending": userPendingTasks
                }
            }); 
        } catch (err){
            reject(err);
        }
    });
}

async function updateTask(taskId, userId, updateData){
    return new Promise(async (resolve, reject)=> {
        try{ 
            const task = await Task.findOneAndUpdate({ _id: taskId, user: userId }, updateData, { returnDocument: 'after' });
            if (!task) {
                return reject(new Error('Task not found or user not authorized'));
            }
            resolve(task);
        } catch (err) {
            reject(err);
        }
    })
}

async function deleteTask(taskId, userId){
    return new Promise(async (resolve, reject)=> {
        try {
            const task = await Task.findOneAndDelete({ _id: taskId, user: userId }); 
            if (!task){
                return reject(new Error('Task not found or user not authorized'));
            }
            resolve(task);
        } catch (err) {
            reject(err);
        }
    }); 
}


async function toggleTask(taskId, userId){
    return new Promise(async (resolve, reject)=> {
        try {
            const task = await Task.findOne({ _id: taskId, user: userId }); 
            if(!task){
                return reject(new Error('Task not found or user not authorized'));
            }
            task.completed = !task.completed; 
            // console.log(`Task completed status toggled to: ${task.completed}`);
            await task.save(); 
            resolve(task);
        } catch (err){
            reject(err);
        }
    }); 
}

async function getAllTasks(){
    return new Promise(async (resolve, reject) => {
        try {
            const tasks = await Task.find().sort({ createdAt: -1 });
            resolve(tasks);
        } catch (err) {
            reject(err);
        }
    });
}

export { createTask, getTasksByUser, updateTask, deleteTask, toggleTask, getAllTasks, parsePositiveInteger };
