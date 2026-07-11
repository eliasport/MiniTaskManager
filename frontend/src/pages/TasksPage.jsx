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

  // const [filters, setFilters] = useState({ // variable predeterminada para los filtros de busqueda y paginación
  //   search: '',
  //   status : '', 
  //   page: 1,
  //   limit: 10,
  // });

  // valores predeterminados para el filtro
  // const filters = {
  //   search: '',
  //   status : '', 
  //   page: 1,
  //   limit: 10
  // }; 

  const [formFilters, setFormFilters] = useState({
    search: '', 
    status: '', 
    limit: 10, 
  }); 

  const [queryFilters, setQueryFilters] = useState({
    search: '', 
    status: '', 
    page: 1, 
    limit: 10, 
  }); 

  const [pagination, setPagination] = useState({
    page: 1, 
    totalPages: 1, 
    totalTasks: 0, 
  }); 

  const [userStats, setUserStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const pages = useMemo(() => {
    return Array.from({ length: pagination.totalPages }, (_, index) => index + 1)
  }, [pagination.totalPages])

  // useEffect(() => {
  //   loadTasks()
  // }, [search, status, page, limit]);

  useEffect(() => {
    loadTasks()
  }, [queryFilters]);

  useEffect(() => {
    if (!success) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSuccess('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [success]);

  async function loadTasks() {
    setIsLoading(true)
    setError('')

    try {
      // const taskList = await taskService.getTasks({ search, status, page, limit })
      // setTasks(taskList)
      // const data = await taskService.getTasks({ search, status, page, limit })
      const data = await taskService.getTasks(queryFilters);
      // console.log('data', data); 
      setTasks(data.Tasks || []); 
      setPagination({
        page: data.Page || 1, 
        totalPages: data.TotalPages || 1, 
        totalTasks: data.TotalTasks || 0, 
      }); 
      setUserStats({
        total: data.UserStats?.Total || 0,
        completed: data.UserStats?.Completed || 0,
        pending: data.UserStats?.Pending || 0,
      });
      console.log(`Pagina actual: ${data.Page}\nTotal de paginas: ${data.TotalPages}\nTotal de tareas: ${data.TotalTasks}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'No se pudieron cargar las tareas.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleFormFilterChange(event) {
    const { name, value } = event.target; 

    setFormFilters((current) => ({
      ...current, 
      [name]: name === 'limit' ? Number(value): value,
    }));
  };

  function applyFilters() {
    event.preventDefault();

    setQueryFilters((current) => ({
      ...formFilters, 
      page: 1,
    }));
  };

  function resetFilters() {
    const initialFilters = {
      search: '', 
      status: '',
      limit: 10, 
    }
    setFormFilters(initialFilters);
    setQueryFilters({
      ...initialFilters, 
      page: 1, 
    });
  };

  function handlePageChange(nextPage) {
    if(nextPage < 1 || nextPage > pagination.totalPages) {
      return;
    }

    setQueryFilters((current) => ({
      ...current, 
      page: nextPage,
    }));
  }

  async function handleSubmit(form) {
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      // if (editingTask) {
      //   const updatedTask = await taskService.updateTask(editingTask._id, form)
      //   setTasks((current) =>
      //     current.map((task) => (task._id === updatedTask._id ? updatedTask : task)),
      //   )
      //   setEditingTask(null)
      //   setSuccess('Tarea actualizada.')
      // } else {
      //   const createdTask = await taskService.createTask({
      //     ...form,
      //     user: user.id,
      //   })
      //   setTasks((current) => [createdTask, ...current])
      //   setSuccess('Tarea creada.')
      // }

      if(editingTask) {
        await taskService.updateTask(editingTask._id, form);
        setEditingTask(null);
        setSuccess('Tarea actualizada.');
      } else { 
        await taskService.createTask({
          ...form, 
          user: user.id, 
        });
        setSuccess('Tarea creada.');
      };
      
      await loadTasks();

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
      // const updatedTask = await taskService.toggleTask(task._id)
      // setTasks((current) =>
      //   current.map((currentTask) =>
      //     currentTask._id === updatedTask._id ? updatedTask : currentTask,
      //   ),
      // )

      await taskService.toggleTask(task._id);
      await loadTasks();

    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo actualizar el estado.')
    }
  }

  async function handleDelete(task) {
    setError('')
    setSuccess('')

    try {
      // await taskService.deleteTask(task._id)
      // setTasks((current) => current.filter((currentTask) => currentTask._id !== task._id))

      // if (editingTask?._id === task._id) {
      //   setEditingTask(null)
      // }

      // setSuccess('Tarea eliminada.')

      await taskService.deleteTask(task._id);
      if(editingTask?._id === task._id)  {
        setEditingTask(null);
      }
      setSuccess('Tarea eliminada.');
      await loadTasks();
      
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
              <span>{userStats.total}</span>
              <p>Total</p>
            </div>
            <div className="stat">
              <span>{userStats.pending}</span>
              <p>Pendientes</p>
            </div>
            <div className="stat">
              <span>{userStats.completed}</span>
              <p>Hechas</p>
            </div>
          </div>
        </aside>
{/* 
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
        </section> */}


        <section className="panel">
          <div className="mb-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Listado
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Total de tareas encontradas: {pagination.totalPages}
                </p>
              </div>
              <button className="btn-primary" onClick={loadTasks} type="button">
                Actualizar
              </button>
            </div>
            <form className="grid gap-3 md:grid-cols-[1fr_180px_140px_auto]" onSubmit={applyFilters}>
              <div>
                <label className="label" htmlFor="search">
                  Buscar
                </label>
                <input
                  className="input"
                  id="search"
                  name="search"
                  onChange={handleFormFilterChange}
                  placeholder="Buscar por título o descripción"
                  type='search'
                  value={formFilters.search}
                />
              </div>
              <div>
                <label className="label" htmlFor="status">
                  Estado
                </label>
                <select
                  className="input"
                  id="status"
                  name="status"
                  onChange={handleFormFilterChange}
                  value={formFilters.status}
                >
                  <option value="">Todos</option>
                  <option value="true">Hechas</option>
                  <option value="false">Pendientes</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="limit">
                  Límite
                </label>
                <select className="input"
                  id="limit"
                  name="limit"
                  onChange={handleFormFilterChange}
                  value={formFilters.limit}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <button className="btn-primary" type="button" onClick={applyFilters}>
                  Aplicar filtros
                </button>
                <button className="btn-secondary" onClick={resetFilters} type="button">
                  Resetear filtros
                </button>
              </div>
            </form>
          </div>
          <div className="mb-4 space-y-2">
            <Alert>{error}</Alert>
            <Alert type="success">{success}</Alert>
          </div>
          <TaskList
            isLoading={isLoading}
            tasks={tasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
          ></TaskList>

          <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600"> 
                Pagina {pagination.page} de {pagination.totalPages}
              </p>
              {/* <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600" htmlFor="page">
                  Ir a la pagina:
                </label>
                <select 
                  className="input w-24"
                  disabled={pagination.totalPages <= 1}
                  id="page"
                  onChange={(event)=>handlePageChange(Number(event.target.value))}
                  >
                  {pages.map((pageNumber)=>(
                    <option key={pageNumber} value={pageNumber}>
                      {pageNumber}
                    </option>
                  ))}
                </select>
              </div> */}
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className="btn-secondary"
                disabled={pagination.page <= 1}
                onClick={()=>handlePageChange(pagination.page - 1)}
                type="button">
                Anterior
              </button>
              {pages.map((pageNumber)=> (
                <button 
                  className={pageNumber === pagination.page ? 'btn-primary' : 'btn-secondary'}
                  key={pageNumber}
                  onClick={()=>handlePageChange(pageNumber)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ))}
              <button 
                className="btn-secondary"
                disabled={pagination.page >= pagination.totalPages}
                onClick={()=>handlePageChange(pagination.page + 1)}
                type="button"
                >
                Siguiente
              </button>
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}

export default TasksPage
