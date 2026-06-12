import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: Number(process.env.PORT ?? 3001),
  databasePath: process.env.DATABASE_PATH ?? './data/agenda-dg.sqlite',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  adminName: process.env.ADMIN_NAME,
  adminPhone: process.env.ADMIN_PHONE,
  adminPassword: process.env.ADMIN_PASSWORD,
}
