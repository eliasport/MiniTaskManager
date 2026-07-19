import axios from 'axios'
// import { env } from 'process'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API_BASE_URL = import.meta.env.VITE_MONGO_URL
console.log(API_BASE_URL)
const TOKEN_KEY = 'mini_task_manager_token'
const USER_KEY = 'mini_task_manager_user'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isTokenExpired = 
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED'

    if (isTokenExpired) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)

      if(window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export { API_BASE_URL, TOKEN_KEY, USER_KEY }
export default api
