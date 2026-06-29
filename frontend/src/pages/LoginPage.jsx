import { useState } from 'react'
import Alert from '../components/Alert'
import useAuth from '../context/useAuth'

const loginInitialState = {
  email: '',
  password: '',
}

const registerInitialState = {
  user: '',
  email: '',
  password: '',
}

function LoginPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState(loginInitialState)
  const [registerForm, setRegisterForm] = useState(registerInitialState)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isLogin = mode === 'login'

  function handleLoginChange(event) {
    const { name, value } = event.target
    setLoginForm((current) => ({ ...current, [name]: value }))
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target
    setRegisterForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isLogin) {
        await login(loginForm)
      } else {
        await register(registerForm)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo completar la operacion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setError('')
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_420px]">
          <div className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-cyan-300">
                MiniTaskManager
              </p>
              <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight">
                Gestion simple para tus tareas del dia a dia.
              </h1>
              <p className="mt-4 max-w-md text-slate-300">
                Inicia sesion, crea tareas, actualizalas y marca avances desde una vista enfocada.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
              <div className="rounded-md bg-white/10 p-3">JWT</div>
              <div className="rounded-md bg-white/10 p-3">React</div>
              <div className="rounded-md bg-white/10 p-3">MongoDB</div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                {isLogin ? 'Iniciar sesion' : 'Crear cuenta'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isLogin ? 'Accede con tu correo y password.' : 'Registra un nuevo usuario.'}
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-md bg-slate-100 p-1">
              <button
                className={`segmented-button ${isLogin ? 'segmented-button-active' : ''}`}
                onClick={() => changeMode('login')}
                type="button"
              >
                Login
              </button>
              <button
                className={`segmented-button ${!isLogin ? 'segmented-button-active' : ''}`}
                onClick={() => changeMode('register')}
                type="button"
              >
                Registro
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Alert>{error}</Alert>

              {isLogin ? (
                <div>
                  <label className="label" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    autoComplete="email"
                    className="input"
                    id="login-email"
                    name="email"
                    onChange={handleLoginChange}
                    required
                    type="email"
                    value={loginForm.email}
                  />
                </div>
              ) : (
                <div>
                  <label className="label" htmlFor="user">
                    Usuario
                  </label>
                  <input
                    autoComplete="username"
                    className="input"
                    id="user"
                    name="user"
                    onChange={handleRegisterChange}
                    required
                    type="text"
                    value={registerForm.user}
                  />
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <input
                    autoComplete="email"
                    className="input"
                    id="email"
                    name="email"
                    onChange={handleRegisterChange}
                    required
                    type="email"
                    value={registerForm.email}
                  />
                </div>
              )}

              <div>
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="input"
                  id="password"
                  name="password"
                  onChange={isLogin ? handleLoginChange : handleRegisterChange}
                  required
                  type="password"
                  value={isLogin ? loginForm.password : registerForm.password}
                />
              </div>

              <button className="btn-primary w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarme'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
