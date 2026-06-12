import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { config } from './config.js'
import './db.js'
import { appointmentsRouter } from './routes/appointments.js'
import { authRouter } from './routes/auth.js'

const app = express()

app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin,
  }),
)
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (_request, response) => {
  response.json({ ok: true, service: 'agenda-dg-backend' })
})

app.use('/auth', authRouter)
app.use('/appointments', appointmentsRouter)

app.use((request, response) => {
  response.status(404).json({
    error: `Rota nao encontrada: ${request.method} ${request.path}`,
  })
})

app.use((error, _request, response, _next) => {
  const status = error.status ?? 500

  if (status >= 500) {
    console.error(error)
  }

  response.status(status).json({
    error: error.message ?? 'Erro interno do servidor.',
  })
})

app.listen(config.port, () => {
  console.log(`Agenda DG backend running on port ${config.port}`)
})
