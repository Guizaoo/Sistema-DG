import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { db } from '../db.js'
import { createHttpError } from '../utils/http.js'

export function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: '7d' },
  )
}

export function requireAuth(request, _response, next) {
  const authHeader = request.headers.authorization
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null

  if (!token) {
    return next(createHttpError(401, 'Login obrigatorio.'))
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    const user = db
      .prepare('SELECT id, name, phone, role, created_at FROM users WHERE id = ?')
      .get(payload.sub)

    if (!user) {
      return next(createHttpError(401, 'Usuario nao encontrado.'))
    }

    request.user = user
    return next()
  } catch {
    return next(createHttpError(401, 'Sessao invalida ou expirada.'))
  }
}

export function optionalAuth(request, _response, next) {
  const authHeader = request.headers.authorization
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null

  if (!token) {
    return next()
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret)
    const user = db
      .prepare('SELECT id, name, phone, role, created_at FROM users WHERE id = ?')
      .get(payload.sub)

    if (user) {
      request.user = user
    }

    return next()
  } catch {
    return next()
  }
}

export function requireAdmin(request, _response, next) {
  if (request.user?.role !== 'admin') {
    return next(createHttpError(403, 'Acesso administrativo obrigatorio.'))
  }

  return next()
}
