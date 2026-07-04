import { useEffect, useMemo, useState } from 'react'
import Alert from '../components/Alert'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import useAuth from '../context/useAuth'
import * as taskService from '../services/task.service'

function TasksPage() {
  const { logout, user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    status : '', 
    page: 1,
    limit: 10,
  });

  const [search, setSearch] = useState(filters.search); 
  const [status, setStatus] = useState(filters.status); 
  const [page, setPage] = useState(filters.page); 
  const [limit, setLimit] = useState(filters.limit); 

  function resetTaskFilter() {
    // setSearch(filters.search); 
    // setStatus(filters.status); 
    setPage(filters.page); 
    setLimit(filters.limit);
  }

  const counters = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      completed,
      pending: tasks.length - completed,
      total: tasks.length,
    }
  }, [tasks])

  useEffect(() => {
    loadTasks()
  }, [filters]); 

  async function loadTasks() {
    setIsLoading(true)
    setError('')

    try {
      const taskList = await taskService.getTasks({ search, status, page, limit })
      setTasks(taskList)
      // const { data } = await taskService.getTasks() 
      // console.log('data', data); 
      // setTasks(data.tasks)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'No se pudieron cargar las tareas.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(form) {
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      if (editingTask) {
        const updatedTask = await taskService.updateTask(editingTask._id, form)
        setTasks((current) =>
          current.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
        )
        setEditingTask(null)
        setSuccess('Tarea actualizada.')
      } else {
        const createdTask = await taskService.createTask({
          ...form,
          user: user.id,
        })
        setTasks((current) => [createdTask, ...current])
        setSuccess('Tarea creada.')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo guardar la tarea.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggle(task) {
    setError('')
    setSuccess('')

    try {
      const updatedTask = await taskService.toggleTask(task._id)
      setTasks((current) =>
        current.map((currentTask) =>
          currentTask._id === updatedTask._id ? updatedTask : currentTask,
        ),
      )
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar el estado.')
    }
  }

  async function handleDelete(task) {
    setError('')
    setSuccess('')

    try {
      await taskService.deleteTask(task._id)
      setTasks((current) => current.filter((currentTask) => currentTask._id !== task._id))

      if (editingTask?._id === task._id) {
        setEditingTask(null)
      }

      setSuccess('Tarea eliminada.')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo eliminar la tarea.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
              MiniTaskManager
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Tareas</h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-sm text-slate-600">
              Sesion: <span className="font-medium text-slate-900">{user.user}</span>
            </p>
            <button className="btn-secondary" onClick={logout} type="button">
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="panel">
            <h2 className="text-lg font-semibold">
              {editingTask ? 'Editar tarea' : 'Nueva tarea'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {editingTask
                ? 'Actualiza los datos y guarda los cambios.'
                : 'Crea una tarea asociada a tu usuario.'}
            </p>

            <div className="mt-5">
              <TaskForm
                editingTask={editingTask}
                isSubmitting={isSubmitting}
                onCancelEdit={() => setEditingTask(null)}
                onSubmit={handleSubmit}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="stat">
              <span>{counters.total}</span>
              <p>Total</p>
            </div>
            <div className="stat">
              <span>{counters.pending}</span>
              <p>Pendientes</p>
            </div>
            <div className="stat">
              <span>{counters.completed}</span>
              <p>Hechas</p>
            </div>
          </div>
        </aside>

        <section className="panel">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Listado</h2>
              <p className="mt-1 text-sm text-slate-500">
                Administra tus tareas registradas en la API.
              </p>
            </div>
            <button className="btn-secondary" onClick={loadTasks} type="button">
              Actualizar
            </button>
          </div>

          <div className="mb-4 space-y-2">
            <Alert>{error}</Alert>
            <Alert type="success">{success}</Alert>
          </div>

          <TaskList
            isLoading={isLoading}
            onDelete={handleDelete}
            onEdit={setEditingTask}
            onToggle={handleToggle}
            tasks={tasks}
          />
        </section>
      </section>
    </main>
  )
}

export default TasksPage
