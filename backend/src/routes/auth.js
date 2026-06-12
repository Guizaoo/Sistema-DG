import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { db } from '../db.js'
import { createToken, requireAuth } from '../middleware/auth.js'
import { asyncHandler, createHttpError, normalizePhone } from '../utils/http.js'

export const authRouter = Router()

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
  }
}

authRouter.post(
  '/register',
  asyncHandler(async (request, response) => {
    const name = String(request.body.name ?? '').trim()
    const phone = normalizePhone(request.body.phone)
    const password = String(request.body.password ?? '')

    if (!name || !phone || password.length < 4) {
      throw createHttpError(
        400,
        'Informe nome, telefone e uma senha com pelo menos 4 caracteres.',
      )
    }

    const existingUser = db
      .prepare('SELECT id FROM users WHERE phone = ?')
      .get(phone)

    if (existingUser) {
      throw createHttpError(409, 'Ja existe uma conta com este telefone.')
    }

    const user = {
      id: randomUUID(),
      name,
      phone,
      password_hash: await bcrypt.hash(password, 10),
      role: 'customer',
    }

    db.prepare(
      `
        INSERT INTO users (id, name, phone, password_hash, role)
        VALUES (@id, @name, @phone, @password_hash, @role)
      `,
    ).run(user)

    response.status(201).json({
      token: createToken(user),
      user: publicUser(user),
    })
  }),
)

authRouter.post(
  '/login',
  asyncHandler(async (request, response) => {
    const phone = normalizePhone(request.body.phone)
    const password = String(request.body.password ?? '')

    const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone)

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw createHttpError(401, 'Telefone ou senha invalidos.')
    }

    response.json({
      token: createToken(user),
      user: publicUser(user),
    })
  }),
)

authRouter.get('/me', requireAuth, (request, response) => {
  response.json({ user: publicUser(request.user) })
})
