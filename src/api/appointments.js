import { apiFetch, authHeader, getAdminToken, getCustomerToken } from './client'

export async function createAppointment(appointment) {
  return apiFetch('/appointments', {
    method: 'POST',
    headers: authHeader(getCustomerToken()),
    body: JSON.stringify(appointment),
  })
}

export async function getBookedTimes(date) {
  const params = new URLSearchParams({ date })
  const data = await apiFetch(`/appointments/available-times?${params}`)

  return data.bookedTimes
}

export async function listAppointments() {
  const data = await apiFetch('/appointments', {
    headers: authHeader(getAdminToken()),
  })

  return data.appointments
}
