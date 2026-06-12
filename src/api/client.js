const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

const CUSTOMER_TOKEN_KEY = 'agenda-dg:customer-token'
const ADMIN_TOKEN_KEY = 'agenda-dg:admin-token'

export function getCustomerToken() {
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY)
}

export function setCustomerToken(token) {
  window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token)
}

export function clearCustomerToken() {
  window.localStorage.removeItem(CUSTOMER_TOKEN_KEY)
}

export function getAdminToken() {
  return window.sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token) {
  window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  window.sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error ?? 'Erro ao conectar com a API.')
  }

  return data
}

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
