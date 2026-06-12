const STORAGE_KEY = 'agenda-dg:appointments'

const servicePrices = {
  'Corte masculino': 35,
  'Barba completa': 25,
  'Corte + barba': 55,
}

export function getServicePrice(service) {
  return servicePrices[service] ?? 0
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getAppointments() {
  const storedAppointments = window.localStorage.getItem(STORAGE_KEY)

  if (!storedAppointments) return []

  try {
    return JSON.parse(storedAppointments)
  } catch {
    return []
  }
}

export function saveAppointment(appointment) {
  const appointments = getAppointments()
  const nextAppointment = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'Pendente',
    value: getServicePrice(appointment.service),
    ...appointment,
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([nextAppointment, ...appointments]),
  )

  window.dispatchEvent(new Event('appointments-updated'))

  return nextAppointment
}
