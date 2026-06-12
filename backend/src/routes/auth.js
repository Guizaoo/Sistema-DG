import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { config } from '../config.js'
import { db } from '../db.js'
import { createToken, requireAuth } from '../middleware/auth.js'
import { sendVerificationEmail } from '../services/email.js'
import {
  asyncHandler,
  createHttpError,
  normalizeEmail,
  normalizePhone,
} from '../utils/http.js'

export const authRouter = Router()

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    emailVerified: Boolean(user.email_verified),
    role: user.role,
  }
}

function createVerificationToken(userId) {
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()

  db.prepare(
    `
      INSERT INTO email_verifications (id, user_id, token, expires_at)
      VALUES (@id, @user_id, @token, @expires_at)
    `,
  ).run({
    id: randomUUID(),
    user_id: userId,
    token,
    expires_at: expiresAt,
  })

  return token
}

function buildVerificationUrl(token) {
  const url = new URL('/confirmar-email', config.frontendUrl)
  url.searchParams.set('token', token)

  return url.toString()
}

authRouter.post(
  '/register',
  asyncHandler(async (request, response) => {
    const name = String(request.body.name ?? '').trim()
    const phone = normalizePhone(request.body.phone)
    const email = normalizeEmail(request.body.email)
    const password = String(request.body.password ?? '')

    if (!name || !phone || !email || password.length < 4) {
      throw createHttpError(
        400,
        'Informe nome, telefone, email e uma senha com pelo menos 4 caracteres.',
      )
    }

    if (!email.includes('@')) {
      throw createHttpError(400, 'Informe um email valido.')
    }

    const existingUser = db
      .prepare('SELECT id, phone, email FROM users WHERE phone = ? OR email = ?')
      .get(phone, email)

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'telefone'
      throw createHttpError(409, `Ja existe uma conta com este ${field}.`)
    }

    const user = {
      id: randomUUID(),
      name,
      phone,
      email,
      email_verified: 0,
      password_hash: await bcrypt.hash(password, 10),
      role: 'customer',
    }

    db.prepare(
      `
        INSERT INTO users (id, name, phone, email, email_verified, password_hash, role)
        VALUES (@id, @name, @phone, @email, @email_verified, @password_hash, @role)
      `,
    ).run(user)

    const verificationToken = createVerificationToken(user.id)
    const verificationUrl = buildVerificationUrl(verificationToken)
    const emailResult = await sendVerificationEmail({
      email,
      name,
      verificationUrl,
    })

    response.status(201).json({
      user: publicUser(user),
      message:
        'Conta criada. Confirme seu email antes de entrar e agendar com login.',
      emailSent: emailResult.sent,
      verificationUrl: emailResult.sent ? undefined : verificationUrl,
    })
  }),
)

authRouter.post(
  '/resend-verification',
  asyncHandler(async (request, response) => {
    const email = normalizeEmail(request.body.email)

    if (!email) {
      throw createHttpError(400, 'Informe o email cadastrado.')
    }

    const user = db
      .prepare('SELECT * FROM users WHERE email = ? AND role = ?')
      .get(email, 'customer')

    if (!user) {
      throw createHttpError(404, 'Conta nao encontrada.')
    }

    if (user.email_verified) {
      response.json({ message: 'Este email ja esta confirmado.' })
      return
    }

    const verificationToken = createVerificationToken(user.id)
    const verificationUrl = buildVerificationUrl(verificationToken)
    const emailResult = await sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationUrl,
    })

    response.json({
      message: 'Novo link de confirmacao enviado.',
      emailSent: emailResult.sent,
      verificationUrl: emailResult.sent ? undefined : verificationUrl,
    })
  }),
)

authRouter.get(
  '/verify-email',
  asyncHandler(async (request, response) => {
    const token = String(request.query.token ?? '').trim()

    if (!token) {
      throw createHttpError(400, 'Token de confirmacao obrigatorio.')
    }

    const verification = db
      .prepare(
        `
          SELECT * FROM email_verifications
          WHERE token = ? AND used_at IS NULL
        `,
      )
      .get(token)

    if (!verification) {
      throw createHttpError(400, 'Link de confirmacao invalido ou ja usado.')
    }

    if (new Date(verification.expires_at).getTime() < Date.now()) {
      throw createHttpError(400, 'Link de confirmacao expirado.')
    }

    const now = new Date().toISOString()

    const confirmEmail = db.transaction(() => {
      db.prepare('UPDATE users SET email_verified = 1 WHERE id = ?').run(
        verification.user_id,
      )
      db.prepare('UPDATE email_verifications SET used_at = ? WHERE id = ?').run(
        now,
        verification.id,
      )

      return db
        .prepare('SELECT * FROM users WHERE id = ?')
        .get(verification.user_id)
    })

    const user = confirmEmail()

    response.json({
      token: createToken(user),
      user: publicUser(user),
      message: 'Email confirmado com sucesso.',
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

    if (user.role === 'customer' && !user.email_verified) {
      throw createHttpError(
        403,
        'Confirme seu email antes de entrar com sua conta.',
      )
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
