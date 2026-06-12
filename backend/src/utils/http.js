export function asyncHandler(handler) {
  return async (request, response, next) => {
    try {
      await handler(request, response, next)
    } catch (error) {
      next(error)
    }
  }
}

export function normalizePhone(phone) {
  return String(phone ?? '').replace(/\D/g, '')
}

export function createHttpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}
