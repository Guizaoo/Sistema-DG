import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import { db } from '../db.js'
import { optionalAuth, requireAdmin, requireAuth } from '../middleware/auth.js'
import { asyncHandler, createHttpError, normalizePhone } from '../utils/http.js'

export const appointmentsRouter = Router()

const servicePrices = {
  'Corte masculino': 35,
  'Barba completa': 25,
  'Corte + barba': 55,
}

function appointmentResponse(appointment) {
  return {
    id: appointment.id,
    userId: appointment.user_id,
    client: appointment.client_name,
    phone: appointment.phone,
    service: appointment.service,
    date: appointment.date,
    time: appointment.time,
    notes: appointment.notes,
    status: appointment.status,
    value: appointment.value,
    createdAt: appointment.created_at,
  }
}

appointmentsRouter.get('/available-times', (request, response) => {
  const date = String(request.query.date ?? '')

  if (!date) {
    throw createHttpError(400, 'Informe a data para consultar horarios.')
  }

  const bookedTimes = db
    .prepare('SELECT time FROM appointments WHERE date = ?')
    .all(date)
    .map((appointment) => appointment.time)

  response.json({ date, bookedTimes })
})

appointmentsRouter.post(
  '/',
  optionalAuth,
  asyncHandler(async (request, response) => {
    const clientName = String(request.body.client ?? '').trim()
    const phone = normalizePhone(request.body.phone)
    const service = String(request.body.service ?? '')
    const date = String(request.body.date ?? '')
    const time = String(request.body.time ?? '')
    const notes = String(request.body.notes ?? '').trim()
    const value = servicePrices[service]

    if (!clientName || !phone || !service || !date || !time) {
      throw createHttpError(400, 'Preencha cliente, telefone, servico, dia e horario.')
    }

    if (value === undefined) {
      throw createHttpError(400, 'Servico invalido.')
    }

    try {
      const appointment = {
        id: randomUUID(),
        user_id: request.user?.id ?? null,
        client_name: clientName,
        phone,
        service,
        date,
        time,
        notes,
        value,
      }

      db.prepare(
        `
          INSERT INTO appointments (
            id,
            user_id,
            client_name,
            phone,
            service,
            date,
            time,
            notes,
            value
          )
          VALUES (
            @id,
            @user_id,
            @client_name,
            @phone,
            @service,
            @date,
            @time,
            @notes,
            @value
          )
        `,
      ).run(appointment)

      const savedAppointment = db
        .prepare('SELECT * FROM appointments WHERE id = ?')
        .get(appointment.id)

      response.status(201).json({
        appointment: appointmentResponse(savedAppointment),
      })
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw createHttpError(
          409,
          'Este horario ja foi reservado para esse dia. Escolha outro.',
        )
      }

      throw error
    }
  }),
)

appointmentsRouter.get(
  '/',
  requireAuth,
  requireAdmin,
  (_request, response) => {
    const appointments = db
      .prepare('SELECT * FROM appointments ORDER BY date ASC, time ASC')
      .all()
      .map(appointmentResponse)

    response.json({ appointments })
  },
)

appointmentsRouter.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  (request, response) => {
    const status = String(request.body.status ?? '').trim()
    const allowedStatuses = ['Pendente', 'Confirmado', 'Cancelado', 'Finalizado']

    if (!allowedStatuses.includes(status)) {
      throw createHttpError(400, 'Status invalido.')
    }

    const result = db
      .prepare('UPDATE appointments SET status = ? WHERE id = ?')
      .run(status, request.params.id)

    if (result.changes === 0) {
      throw createHttpError(404, 'Agendamento nao encontrado.')
    }

    const appointment = db
      .prepare('SELECT * FROM appointments WHERE id = ?')
      .get(request.params.id)

    response.json({ appointment: appointmentResponse(appointment) })
  },
)
