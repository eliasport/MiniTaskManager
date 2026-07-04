# Frontend - MiniTaskManager

Aplicacion web para consumir la API de MiniTaskManager. Permite registrar usuarios, iniciar sesion, cerrar sesion y administrar tareas desde una interfaz en React.

## Tecnologias

- React
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Oxlint

## Requisitos

- Node.js instalado
- npm
- Backend ejecutandose y disponible para recibir peticiones

## Instalacion

Desde la carpeta `frontend`:

```bash
npm install
```

## Variables de entorno

El frontend puede usar una variable de entorno para indicar la URL base de la API.

Crear un archivo `.env` dentro de `frontend` si se necesita cambiar la URL por defecto:

```env
VITE_API_URL=http://localhost:5000/api
```

Si no se define `VITE_API_URL`, la aplicacion usa por defecto:

```txt
http://localhost:5000/api
```

## Ejecutar el frontend

Desde `frontend`:

```bash
npm run dev
```

Vite levantara la aplicacion en una URL local, normalmente:

```txt
http://localhost:5173
```

## Scripts disponibles

Desde `frontend`:

```bash
npm run dev
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Genera la version de produccion en la carpeta `dist`.

```bash
npm run preview
```

Sirve localmente la build generada.

```bash
npm run lint
```

Ejecuta Oxlint para revisar el codigo del frontend.

## Estructura

```txt
frontend/
  index.html
  vite.config.js
  src/
    app/
      App.jsx
      main.jsx
    assets/
      hero.png
    components/
      Alert.jsx
      TaskForm.jsx
      TaskList.jsx
    context/
      AuthContext.js
      AuthProvider.jsx
      useAuth.js
    pages/
      LoginPage.jsx
      TasksPage.jsx
    routers/
      AppRouter.jsx
    services/
      api.js
      auth.service.js
      task.service.js
    styles/
      index.css
```

## Rutas del frontend

### `/`

Redirige a `/tasks`.

### `/login`

Pantalla publica para iniciar sesion o registrar un usuario nuevo.

Si el usuario ya esta autenticado, redirige a `/tasks`.

### `/tasks`

Pantalla protegida para listar, crear, editar, eliminar y marcar tareas como completadas o pendientes.

Si el usuario no esta autenticado, redirige a `/login`.

### `*`

Cualquier ruta no definida redirige a `/tasks`.

## Autenticacion en el frontend

El estado de autenticacion se maneja con `AuthProvider` y `AuthContext`.

Cuando el usuario inicia sesion o se registra correctamente, se guardan en `localStorage`:

- `mini_task_manager_token`: JWT devuelto por el backend
- `mini_task_manager_user`: datos del usuario autenticado

El cliente Axios agrega automaticamente el token en cada peticion usando el header:

```http
Authorization: Bearer TOKEN_AQUI
```

Al cerrar sesion, el frontend llama al endpoint de logout y luego elimina los datos guardados en `localStorage`.

## Servicios HTTP

El frontend centraliza las peticiones HTTP en `src/services`.

### `api.js`

Configura una instancia de Axios con:

- `baseURL`: valor de `VITE_API_URL` o `http://localhost:5000/api`
- Header `Content-Type: application/json`
- Interceptor para agregar el token JWT si existe en `localStorage`

### `auth.service.js`

Consume los endpoints de autenticacion:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`
- `POST /auth/logout`

### `task.service.js`

Consume los endpoints de tareas:

- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id`

## Flujo principal de uso

1. El usuario entra a `/login`.
2. Puede iniciar sesion o crear una cuenta.
3. Al autenticarse, el frontend guarda el token y redirige a `/tasks`.
4. En `/tasks`, se cargan las tareas del usuario autenticado.
5. El usuario puede crear, editar, eliminar, actualizar la lista o cambiar el estado de una tarea.
6. Al cerrar sesion, se limpia la sesion local y se vuelve al flujo publico.
