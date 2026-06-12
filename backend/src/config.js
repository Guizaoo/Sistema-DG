import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT ?? 3001),
  databasePath: process.env.DATABASE_PATH ?? './data/agenda-dg.sqlite',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM ?? 'Agenda DG <onboarding@resend.dev>',
  adminName: process.env.ADMIN_NAME,
  adminPhone: process.env.ADMIN_PHONE,
  adminPassword: process.env.ADMIN_PASSWORD,
}
