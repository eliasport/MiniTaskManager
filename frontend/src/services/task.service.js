import api from './api'

async function getTasks({ search, status, page, limit }) {
  const { data } = await api.get('/tasks', { params: { search, status, page, limit } }); 
  // console.log(data); 
  // console.log(data.Tasks); 
  // return data.Tasks || []; 
  // const data = await api.get('/tasks')
  return data
}

async function createTask(task) {
  const { data } = await api.post('/tasks', task)
  return data
}

async function updateTask(id, task) {
  const { data } = await api.put(`/tasks/${id}`, task)
  return data
}

async function deleteTask(id) {
  const { data } = await api.delete(`/tasks/${id}`)
  return data
}

async function toggleTask(id) {
  const { data } = await api.patch(`/tasks/${id}`)
  return data
}

export { createTask, deleteTask, getTasks, toggleTask, updateTask }
