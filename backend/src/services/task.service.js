import Task from "../models/Task.js";

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
            const query = { user: userId }; 
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } }, 
                    { description: { $regex: search, $options: 'i' } }
                ]; 
            }
            if (status){
                query.completed = status === "completed"; 
            }
            const tasks = await Task.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 }); 

            const total = await Task.countDocuments(query); 
            // resolve({tasks, total, page, limit});
            resolve({
                "Tasks": tasks, 
                "Page": page, 
                "TotalPages": Math.ceil(total / limit), 
                "TotalTasks": total
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

export { createTask, getTasksByUser, updateTask, deleteTask, toggleTask };