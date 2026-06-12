import {
  apiFetch,
  authHeader,
  clearAdminToken,
  clearCustomerToken,
  getAdminToken,
  getCustomerToken,
  setAdminToken,
  setCustomerToken,
} from './client'

export async function registerCustomer({ name, phone, email, password }) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, phone, email, password }),
  })

  if (data.token) {
    setCustomerToken(data.token)
  }

  return data
}

export async function verifyCustomerEmail(token) {
  const data = await apiFetch(
    `/auth/verify-email?token=${encodeURIComponent(token)}`,
  )

  setCustomerToken(data.token)

  return data.user
}

export async function resendCustomerVerification(email) {
  return apiFetch('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export async function loginCustomer({ phone, password }) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })

  setCustomerToken(data.token)

  return data.user
}

export async function loginAdmin({ phone, password }) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })

  if (data.user.role !== 'admin') {
    throw new Error('Este usuario nao tem acesso administrativo.')
  }

  setAdminToken(data.token)

  return data.user
}

export async function loadCustomerSession() {
  const token = getCustomerToken()

  if (!token) return null

  try {
    const data = await apiFetch('/auth/me', {
      headers: authHeader(token),
    })

    return data.user
  } catch {
    clearCustomerToken()
    return null
  }
}

export async function loadAdminSession() {
  const token = getAdminToken()

  if (!token) return null

  try {
    const data = await apiFetch('/auth/me', {
      headers: authHeader(token),
    })

    if (data.user.role !== 'admin') {
      clearAdminToken()
      return null
    }

    return data.user
  } catch {
    clearAdminToken()
    return null
  }
}

export function logoutCustomer() {
  clearCustomerToken()
}

export function logoutAdmin() {
  clearAdminToken()
}
