import api from './api.js'

async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

async function register(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

async function getCurrentUser() {
  const { data } = await api.get('/auth/me')
  return data.user
}

async function logout() {
  const { data } = await api.post('/auth/logout')
  return data
}

export { login, register, getCurrentUser, logout }
