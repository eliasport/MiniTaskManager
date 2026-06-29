import { useEffect, useState } from 'react'

const initialForm = {
  title: '',
  description: '',
}

function TaskForm({ editingTask, isSubmitting, onCancelEdit, onSubmit }) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
      })
      return
    }

    setForm(initialForm)
  }, [editingTask])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit(form)

    if (!editingTask) {
      setForm(initialForm)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="label" htmlFor="title">
          Titulo
        </label>
        <input
          className="input"
          id="title"
          name="title"
          onChange={handleChange}
          placeholder="Ej. Revisar entrega"
          required
          type="text"
          value={form.title}
        />
      </div>

      <div>
        <label className="label" htmlFor="description">
          Descripcion
        </label>
        <textarea
          className="input min-h-28 resize-y"
          id="description"
          name="description"
          onChange={handleChange}
          placeholder="Detalles de la tarea"
          value={form.description}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button className="btn-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Guardando...' : editingTask ? 'Guardar cambios' : 'Crear tarea'}
        </button>
        {editingTask && (
          <button className="btn-secondary" onClick={onCancelEdit} type="button">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
