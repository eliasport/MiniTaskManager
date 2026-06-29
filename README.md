# MiniTaskManager

Documentacion actual del proyecto. De momento se documenta solamente el backend, porque es la parte en desarrollo.

## Backend

Backend para una API de gestion de tareas con autenticacion de usuarios, JWT, Express, MongoDB y Mongoose.

### Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

### Requisitos

- Node.js instalado
- MongoDB local o una URI de MongoDB disponible
- npm

### Instalacion

Desde la carpeta `backend`:

```bash
npm install
```

### Variables de entorno

Crear un archivo `.env` dentro de `backend` tomando como base `.env.example`.

Ejemplo:

```env
VITE_PORT=5000
VITE_MONGO_URL=mongodb://localhost:27017
VITE_MONGO_DB_NAME=task_manager
VITE_JWT_SECRET=your_jwt_secret_key
VITE_JWT_EXPIRES_IN=1h
```

Notas:

- `VITE_MONGO_URL` debe contener solo la URL del servidor MongoDB.
- `VITE_MONGO_DB_NAME` contiene el nombre de la base de datos.
- La conexion final se arma como `VITE_MONGO_URL/VITE_MONGO_DB_NAME`.

### Ejecutar el servidor

Desde `backend`:

```bash
npm run dev
```

Por defecto, el servidor queda disponible en:

```txt
http://localhost:5000
```

Todas las rutas principales usan el prefijo:

```txt
/api
```

### Estructura

```txt
backend/
  server.js
  src/
    app.js
    config/
      db.js
      env.js
    controllers/
      auth.controller.js
      task.controller.js
    middlewares/
      auth.middleware.js
    models/
      User.js
      Task.js
    routes/
      index.js
      auth.routes.js
      task.routes.js
    services/
      auth.service.js
      task.service.js
    utils/
      generateToken.js
```

### Autenticacion

La API usa JWT. Las rutas protegidas requieren enviar el token en el header `Authorization`.

Formato:

```http
Authorization: Bearer TOKEN_AQUI
```

### Endpoints

#### GET `/api/test`

Devuelve un mensaje basico para comprobar que la API responde.

Respuesta:

```json
{
  "message": "Welcome to the Mini Task Manager API"
}
```

### Auth

#### POST `/api/auth/register`

Registra un usuario nuevo.

Body:

```json
{
  "user": "elias",
  "email": "elias@correo.com",
  "password": "pass123"
}
```

Respuesta exitosa `201`:

```json
{
  "user": {
    "id": "USER_ID",
    "user": "elias",
    "email": "elias@correo.com"
  },
  "token": "JWT_TOKEN"
}
```

Errores posibles:

```json
{
  "message": "User or email already exists"
}
```

#### POST `/api/auth/login`

Inicia sesion con email y password.

Body:

```json
{
  "email": "elias@correo.com",
  "password": "pass123"
}
```

Respuesta exitosa `200`:

```json
{
  "user": {
    "id": "USER_ID",
    "user": "elias",
    "email": "elias@correo.com"
  },
  "token": "JWT_TOKEN"
}
```

Errores posibles:

```json
{
  "message": "Invalid credentials"
}
```

#### GET `/api/auth/me`

Devuelve los datos del usuario autenticado.

Requiere token.

Respuesta exitosa `200`:

```json
{
  "user": {
    "id": "USER_ID",
    "user": "elias",
    "email": "elias@correo.com"
  }
}
```

#### POST `/api/auth/logout`

Cierra sesion del lado del cliente. Como JWT es stateless, el backend solo devuelve un mensaje de exito.

Requiere token.

Respuesta exitosa `200`:

```json
{
  "message": "Logout successful"
}
```

### Tasks

Todas las rutas de tareas requieren token.

#### POST `/api/tasks`

Crea una tarea.

Body actual:

```json
{
  "title": "Comprar pan",
  "description": "Pasar por la panaderia",
  "completed": false,
  "user": "USER_ID"
}
```

Respuesta exitosa `201`:

```json
{
  "_id": "TASK_ID",
  "title": "Comprar pan",
  "description": "Pasar por la panaderia",
  "completed": false,
  "user": "USER_ID",
  "createdAt": "2026-06-28T00:00:00.000Z",
  "updatedAt": "2026-06-28T00:00:00.000Z"
}
```

Nota tecnica: aunque la ruta esta protegida, el controlador actual crea la tarea directamente con `req.body`. Por eso, de momento, el body debe incluir el campo `user`.

#### GET `/api/tasks`

Lista las tareas del usuario autenticado.

Respuesta exitosa `200`:

```json
[
  {
    "_id": "TASK_ID",
    "title": "Comprar pan",
    "description": "Pasar por la panaderia",
    "completed": false,
    "user": "USER_ID",
    "createdAt": "2026-06-28T00:00:00.000Z",
    "updatedAt": "2026-06-28T00:00:00.000Z"
  }
]
```

#### PUT `/api/tasks/:id`

Actualiza una tarea del usuario autenticado.

Body de ejemplo:

```json
{
  "title": "Comprar pan y leche",
  "description": "Pasar por la panaderia y el supermercado",
  "completed": true
}
```

Respuesta exitosa `200`:

```json
{
  "_id": "TASK_ID",
  "title": "Comprar pan y leche",
  "description": "Pasar por la panaderia y el supermercado",
  "completed": true,
  "user": "USER_ID"
}
```

Errores posibles:

```json
{
  "error": "Task not found or user not authorized"
}
```

#### DELETE `/api/tasks/:id`

Elimina una tarea del usuario autenticado.

Respuesta exitosa `200`:

```json
{
  "_id": "TASK_ID",
  "title": "Comprar pan",
  "description": "Pasar por la panaderia",
  "completed": false,
  "user": "USER_ID"
}
```

#### PATCH `/api/tasks/:id/toggle`

Cambia el valor de `completed` de una tarea del usuario autenticado.

Respuesta exitosa `200`:

```json
{
  "_id": "TASK_ID",
  "title": "Comprar pan",
  "description": "Pasar por la panaderia",
  "completed": true,
  "user": "USER_ID"
}
```

### Modelos

#### User

Campos:

- `user`: string, requerido, unico
- `email`: string, requerido, unico
- `password`: string, requerido
- `createdAt`: fecha generada automaticamente
- `updatedAt`: fecha generada automaticamente

Antes de guardar, la password se hashea con bcrypt.

#### Task

Campos:

- `title`: string, requerido
- `description`: string, opcional
- `completed`: boolean, por defecto `false`
- `user`: ObjectId, referencia a `User`, requerido
- `createdAt`: fecha generada automaticamente
- `updatedAt`: fecha generada automaticamente

### Respuestas de error comunes

Token faltante o invalido:

```json
{
  "message": "Not authorized"
}
```

Endpoint inexistente:

```json
{
  "message": "Endpoint not found"
}
```

Error interno:

```json
{
  "message": "Internal server error"
}
