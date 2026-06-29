function TaskList({ isLoading, onDelete, onEdit, onToggle, tasks }) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando tareas...</p>
  }

  if (!tasks.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
        <p className="font-medium text-slate-800">Todavia no hay tareas.</p>
        <p className="mt-1 text-sm text-slate-500">Crea la primera desde el formulario.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <article className="task-card" key={task._id}>
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <button
              aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
              className={`status-toggle ${task.completed ? 'status-toggle-done' : ''}`}
              onClick={() => onToggle(task)}
              type="button"
            >
              {task.completed ? '✓' : ''}
            </button>

            <div className="min-w-0 flex-1">
              <h3
                className={`break-words text-base font-semibold ${
                  task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 break-words text-sm text-slate-600">{task.description}</p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button className="btn-secondary compact" onClick={() => onEdit(task)} type="button">
              Editar
            </button>
            <button className="btn-danger compact" onClick={() => onDelete(task)} type="button">
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

export default TaskList
