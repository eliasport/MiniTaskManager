# MiniTaskManager

Aplicacion full stack para registrar usuarios y administrar tareas personales. El
backend expone una API REST con Express, MongoDB, Mongoose y JWT. El frontend
consume esa API desde una interfaz creada con React y Vite.

## Aplicacion desplegada

Acceso al proyecto en Vercel:

[https://frontend-kappa-inky-18.vercel.app/login](https://frontend-kappa-inky-18.vercel.app/login)

## Funcionalidades

- Registro, inicio de sesion y cierre de sesion.
- Sesion persistida en `localStorage` mediante JWT.
- Creacion, edicion, eliminacion y cambio de estado de tareas.
- Tareas asociadas en el backend al usuario autenticado.
- Busqueda por titulo o descripcion.
- Filtro por estado completado o pendiente.
- Paginacion y seleccion del limite de resultados.
- Estadisticas generales del usuario: total, completadas y pendientes.
- Consulta paginada de publicaciones mediante la REST API de WordPress.
- Despliegue independiente del frontend y backend en Vercel.
- Persistencia de produccion en MongoDB Atlas.

## Tecnologias

### Backend

- Node.js
- Express 5
- MongoDB y Mongoose
- JSON Web Token
- bcryptjs
- cors
- dotenv

### Frontend

- React 19
- Vite 8
- React Router DOM
- Axios
- WordPress REST API
- Tailwind CSS
- Oxlint

## Estructura del proyecto

```text
MiniTaskManager/
  README.md
  backend/
    api/
      index.js
    docs/
      openapi.yaml
    src/
      config/
      controllers/
      middlewares/
      models/
      routes/
      services/
      utils/
      app.js
    .env.example
    package.json
    server.js
    vercel.json
  frontend/
    src/
      app/
      assets/
      components/
      context/
      pages/
      routers/
      services/
      styles/
    package.json
    vercel.json
    vite.config.js
```

## Requisitos

- Node.js y npm.
- MongoDB local o un cluster de MongoDB Atlas.
- Dos terminales para ejecutar frontend y backend localmente.

## Instalacion

Instalar las dependencias de cada aplicacion:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Configuracion del backend

Crear `backend/.env` tomando como referencia `backend/.env.example`:

```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/task_manager
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=1h
```

Para MongoDB Atlas, `MONGO_URL` debe ser una URI completa. El nombre de la base
de datos se coloca antes de los parametros `?`:

```env
MONGO_URL=mongodb+srv://<db_user>:<password>@<cluster>.mongodb.net/task_manager?retryWrites=true&w=majority
```

Consideraciones:

- El usuario de la URI es un usuario de base de datos de Atlas, no la cuenta con
  la que se ingresa al panel de Atlas.
- Los caracteres especiales de la password deben estar codificados para una URL.
- La conexion activa usa directamente `MONGO_URL`; no concatena el nombre de la
  base desde otra variable.
- `JWT_SECRET` debe definirse con un valor seguro en produccion.
- No se deben subir archivos `.env` al repositorio.

## Configuracion del frontend

Crear `frontend/.env` para indicar la URL base de la API:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WORDPRESS_API_URL=http://localhost:8080/wp-json/wp/v2
```

Si no se define, el frontend utiliza `http://localhost:5000/api`.

`VITE_API_URL` ya incluye el prefijo `/api`. Los servicios agregan solamente
rutas como `/auth/login` o `/tasks`.

`VITE_WORDPRESS_API_URL` debe apuntar a la base de la REST API de WordPress. Si
no se define, se utiliza `http://localhost:8080/wp-json/wp/v2`.

## Ejecucion local

Levantar primero el backend:

```bash
cd backend
npm run dev
```

El servidor escucha por defecto en:

```text
http://localhost:5000
```

En otra terminal, levantar el frontend:

```bash
cd frontend
npm run dev
```

Vite muestra en la terminal la URL local, normalmente:

```text
http://localhost:5173
```

## Scripts

### Backend

```bash
npm run dev
```

Conecta MongoDB y ejecuta el servidor Express.

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

- `dev`: servidor de desarrollo.
- `build`: genera la aplicacion de produccion en `dist`.
- `preview`: sirve localmente la build.
- `lint`: analiza el codigo con Oxlint.

## Autenticacion

Al registrarse o iniciar sesion, la API devuelve el usuario publico y un JWT:

```json
{
  "user": {
    "id": "667f1f77bcf86cd799439011",
    "user": "elias",
    "email": "elias@correo.com"
  },
  "token": "JWT_TOKEN"
}
```

Las rutas protegidas requieren:

```http
Authorization: Bearer JWT_TOKEN
```

El middleware valida el token, busca al usuario y lo guarda en `req.user`. Al
crear una tarea, el backend usa `req.user._id`; el frontend no envia el ID del
propietario.

El frontend guarda la sesion en:

- `mini_task_manager_token`
- `mini_task_manager_user`

Si la API responde `401` con `code: "TOKEN_EXPIRED"`, el interceptor de Axios
elimina la sesion local y redirige a `/login`.

## API REST

La URL base local es:

```text
http://localhost:5000/api
```

La especificacion completa se encuentra en
[`backend/docs/openapi.yaml`](backend/docs/openapi.yaml).

### Endpoints de autenticacion

| Metodo | Ruta | Protegida | Descripcion |
| --- | --- | --- | --- |
| `GET` | `/test` | No | Comprueba que la API responde |
| `POST` | `/auth/register` | No | Registra un usuario |
| `POST` | `/auth/login` | No | Inicia sesion |
| `GET` | `/auth/me` | Si | Devuelve el usuario autenticado |
| `POST` | `/auth/logout` | Si | Finaliza la sesion del cliente |

### Endpoints de tareas

| Metodo | Ruta | Protegida | Descripcion |
| --- | --- | --- | --- |
| `POST` | `/tasks` | Si | Crea una tarea para `req.user._id` |
| `GET` | `/tasks` | Si | Lista, filtra y pagina las tareas del usuario |
| `PUT` | `/tasks/:id` | Si | Actualiza una tarea del usuario |
| `PATCH` | `/tasks/:id` | Si | Invierte el valor de `completed` |
| `DELETE` | `/tasks/:id` | Si | Elimina una tarea del usuario |
| `GET` | `/tasks/all` | No | Endpoint temporal que devuelve todas las tareas |

`GET /tasks/all` no esta protegido y expone tareas de todos los usuarios. Se
mantiene documentado porque existe en el backend actual, pero debe eliminarse o
protegerse antes de utilizar la aplicacion con datos reales.

### Crear una tarea

Peticion:

```http
POST /api/tasks
Authorization: Bearer JWT_TOKEN
Content-Type: application/json
```

```json
{
  "title": "Comprar pan",
  "description": "Pasar por la panaderia"
}
```

El backend asigna automaticamente:

- `user`: ID obtenido del JWT.
- `completed`: `false` por defecto.

### Consultar tareas

`GET /api/tasks` acepta estos parametros:

| Parametro | Tipo | Valor por defecto | Descripcion |
| --- | --- | --- | --- |
| `search` | string | vacio | Busca en titulo y descripcion sin distinguir mayusculas |
| `status` | string booleano | vacio | `true` para completadas o `false` para pendientes |
| `page` | entero positivo | `1` | Pagina solicitada |
| `limit` | entero positivo | `10` | Cantidad maxima por pagina |

Ejemplo:

```http
GET /api/tasks?search=pan&status=false&page=1&limit=5
Authorization: Bearer JWT_TOKEN
```

Respuesta:

```json
{
  "Tasks": [
    {
      "_id": "667f20c6bcf86cd799439022",
      "title": "Comprar pan",
      "description": "Pasar por la panaderia",
      "completed": false,
      "user": "667f1f77bcf86cd799439011",
      "createdAt": "2026-06-28T00:00:00.000Z",
      "updatedAt": "2026-06-28T00:00:00.000Z"
    }
  ],
  "Page": 1,
  "TotalPages": 1,
  "TotalTasks": 1,
  "UserStats": {
    "Total": 20,
    "Completed": 8,
    "Pending": 12
  }
}
```

- `TotalTasks` y `TotalPages` corresponden a los filtros aplicados.
- `UserStats` siempre corresponde a todas las tareas del usuario autenticado,
  sin depender de los filtros ni de la pagina.
- `page` y `limit` deben ser enteros mayores que cero. Por ejemplo,
  `?page=-10&limit=abc` devuelve `400`.

## Frontend

### Rutas

| Ruta | Acceso | Comportamiento |
| --- | --- | --- |
| `/` | Publico | Redirige a `/tasks` |
| `/login` | Publico | Login y registro; redirige si ya existe sesion |
| `/tasks` | Protegido | Administracion de tareas |
| `/posts` | Protegido | Publicaciones obtenidas desde WordPress |
| `*` | Publico | Redirige a `/tasks` |

### Flujo de tareas

1. Al entrar en `/tasks`, se solicitan las tareas con pagina `1` y limite `10`.
2. Los controles de busqueda, estado y limite modifican un formulario local.
3. La consulta se ejecuta al presionar `Aplicar filtros`.
4. Al aplicar o resetear filtros se vuelve a la pagina `1`.
5. Los botones de paginacion cambian `page` y cargan los resultados
   correspondientes.
6. Crear, editar, eliminar o cambiar el estado vuelve a cargar tareas,
   paginacion y estadisticas.
7. Los mensajes exitosos desaparecen automaticamente despues de 3 segundos.

### Integracion con WordPress

La ruta `/posts` consume:

```text
GET http://localhost:8080/wp-json/wp/v2/posts
```

La consulta solicita ID, fecha, enlace, titulo y extracto. La cantidad por
pagina se envia mediante `per_page`, y la vista utiliza los headers
`X-WP-Total` y `X-WP-TotalPages` para mostrar el total y controlar la
paginacion.

WordPress utiliza una instancia de Axios separada. El interceptor del backend no
se reutiliza, por lo que el JWT de MiniTaskManager no se envia a WordPress.

Los valores HTML de `title.rendered` y `excerpt.rendered` se convierten a texto
antes de mostrarse. El enlace de cada publicacion abre el post original en otra
pestana.

## Despliegue en Vercel

El monorepositorio se despliega como dos proyectos independientes.

### Proyecto backend

- Root Directory: `backend`
- Variables requeridas:

```env
MONGO_URL=mongodb+srv://<db_user>:<password>@<cluster>.mongodb.net/task_manager?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_secure_secret
JWT_EXPIRES_IN=1h
```

El cluster de Atlas debe aceptar conexiones provenientes de Vercel. Para una
aplicacion de practica puede utilizarse temporalmente `0.0.0.0/0` en Network
Access, junto con credenciales seguras y permisos minimos para el usuario de la
base.

### Proyecto frontend

- Root Directory: `frontend`
- Variable requerida:

```env
VITE_API_URL=https://<backend-domain>.vercel.app/api
VITE_WORDPRESS_API_URL=https://<wordpress-domain>/wp-json/wp/v2
```

El archivo `frontend/vercel.json` reescribe las rutas hacia `index.html` para
que React Router funcione al abrir directamente `/login`, `/tasks` o `/posts`.

Las variables de Vite se incorporan durante la build. Despues de cambiar
`VITE_API_URL` o `VITE_WORDPRESS_API_URL`, se debe generar un nuevo deployment.

`http://localhost:8080` sirve solamente para desarrollo local. En produccion,
`localhost` representa el dispositivo de cada visitante y una pagina HTTPS
puede bloquear una API HTTP. Para utilizar posts desde Vercel, WordPress debe
estar disponible mediante una URL publica con HTTPS y permitir solicitudes CORS
desde el dominio del frontend.

## CORS

El backend aplica actualmente:

```js
app.use(cors({ origin: '*' }))
```

Esto permite solicitudes desde cualquier origen y simplifica las pruebas. Para
un entorno productivo real conviene reemplazar `*` por una lista controlada que
incluya el dominio del frontend y, si corresponde, `http://localhost:5173`.

## Modelos

### User

- `user`: string requerido, unico y sin espacios laterales.
- `email`: string requerido, unico, normalizado a minusculas.
- `password`: string requerido y almacenado como hash de bcrypt.
- `createdAt` y `updatedAt`: timestamps automaticos.

### Task

- `title`: string requerido.
- `description`: string opcional.
- `completed`: boolean, `false` por defecto.
- `user`: ObjectId requerido con referencia a `User`.
- `createdAt` y `updatedAt`: timestamps automaticos.

Las operaciones de actualizacion, cambio de estado y eliminacion buscan
simultaneamente por ID de tarea e ID del usuario autenticado.

## Errores comunes

Token faltante o invalido:

```json
{
  "message": "Not authorized"
}
```

Token vencido:

```json
{
  "message": "Not authorized",
  "code": "TOKEN_EXPIRED"
}
```

Paginacion invalida:

```json
{
  "error": "Page must be a positive integer"
}
```

Tarea inexistente o perteneciente a otro usuario:

```json
{
  "error": "Task not found or user not authorized"
}
```

Endpoint inexistente:

```json
{
  "message": "Endpoint not found"
}
```
