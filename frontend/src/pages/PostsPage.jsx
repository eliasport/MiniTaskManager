import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import useAuth from '../context/useAuth'
import { getPosts } from '../services/wordpress.service'

const POSTS_PER_PAGE = 6

function htmlToText(value = '') {
  const document = new DOMParser().parseFromString(value, 'text/html')
  return document.body.textContent?.trim() || ''
}

function formatDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('es-PY', {
    dateStyle: 'medium',
  }).format(date)
}

function PostsPage() {
  const { logout, user } = useAuth()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPosts() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getPosts({
          page,
          perPage: POSTS_PER_PAGE,
          signal: controller.signal,
        })

        setPosts(result.posts)
        setTotal(result.total)
        setTotalPages(result.totalPages)
      } catch (err) {
        if (err.code !== 'ERR_CANCELED') {
          setError(
            err.response?.data?.message ||
              'No se pudieron cargar las publicaciones de WordPress.',
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadPosts()

    return () => controller.abort()
  }, [page, requestVersion])

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-700">
              MiniTaskManager
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Publicaciones</h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-sm text-slate-600">
              Sesion: <span className="font-medium text-slate-900">{user.user}</span>
            </p>
            <div className="flex gap-2">
              <Link className="btn-secondary" to="/tasks">
                Tareas
              </Link>
              <button className="btn-secondary" onClick={logout} type="button">
                Cerrar sesion
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Posts de WordPress</h2>
            <p className="mt-1 text-sm text-slate-600">
              {total} {total === 1 ? 'publicacion encontrada' : 'publicaciones encontradas'}
            </p>
          </div>
          <button
            className="btn-primary"
            disabled={isLoading}
            onClick={() => setRequestVersion((current) => current + 1)}
            type="button"
          >
            Actualizar
          </button>
        </div>

        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Cargando publicaciones...</p>}

        {!isLoading && !error && posts.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="font-medium text-slate-800">No hay publicaciones disponibles.</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <article
                className="flex min-h-56 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                key={post.id}
              >
                <p className="text-sm text-slate-500">{formatDate(post.date)}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  {htmlToText(post.title?.rendered)}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                  {htmlToText(post.excerpt?.rendered) || 'Sin extracto disponible.'}
                </p>
                <div className="mt-5">
                  <a
                    className="btn-primary"
                    href={post.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Leer publicacion
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Pagina {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                type="button"
              >
                Anterior
              </button>
              <button
                className="btn-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                type="button"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default PostsPage
