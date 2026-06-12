import { useEffect, useState } from 'react'
import { createAppointment, getBookedTimes } from '../api/appointments'

const services = ['Corte masculino', 'Barba completa', 'Corte + barba']
const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

function formatDateValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getAvailableDates() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() + index)

    const weekday = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'short',
    })
      .format(date)
      .replace('.', '')

    const day = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
    }).format(date)

    const month = new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
    })
      .format(date)
      .replace('.', '')

    return {
      label: index === 0 ? 'Hoje' : weekday,
      detail: `Dia ${day}`,
      month,
      value: formatDateValue(date),
    }
  })
}

function formatStoredPhone(phone) {
  if (!phone) return ''

  const digits = String(phone).replace(/\D/g, '')

  if (digits.length !== 11) return phone

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function Scheduling({ customerSession, navigateTo }) {
  const [availableDates] = useState(getAvailableDates)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookedTimes, setBookedTimes] = useState([])
  const [confirmation, setConfirmation] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadBookedTimes() {
      if (!selectedDate) {
        setBookedTimes([])
        return
      }

      try {
        const nextBookedTimes = await getBookedTimes(selectedDate)

        if (!isActive) return

        setBookedTimes(nextBookedTimes)

        if (nextBookedTimes.includes(selectedTime)) {
          setSelectedTime('')
        }
      } catch (error) {
        if (isActive) {
          setConfirmation(error.message)
          setMessageType('error')
          setBookedTimes([])
        }
      }
    }

    loadBookedTimes()

    return () => {
      isActive = false
    }
  }, [selectedDate, selectedTime])

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    setConfirmation('')
    setMessageType('success')

    if (!selectedDate || !selectedTime) {
      setConfirmation(
        'Escolha um dia e um horario antes de confirmar o agendamento.',
      )
      setMessageType('error')
      return
    }

    if (bookedTimes.includes(selectedTime)) {
      setConfirmation('Este horario ja foi reservado. Escolha outro.')
      setMessageType('error')
      return
    }

    const formData = new FormData(form)
    const appointment = {
      client: formData.get('client'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      date: selectedDate,
      time: selectedTime,
      notes: formData.get('notes'),
    }

    setIsSubmitting(true)

    try {
      await createAppointment(appointment)
      setConfirmation(
        'Agendamento enviado. A barbearia ja consegue ver no painel administrativo.',
      )
      setMessageType('success')
      form.reset()
      setSelectedTime('')
      setSelectedDate('')
      setBookedTimes([])
    } catch (error) {
      setConfirmation(error.message)
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-white/10 bg-zinc-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8"
      >
        <div className="mb-6">
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Informe seus dados para reservar um horario.
          </h2>
          {customerSession && (
            <p className="mt-4 rounded-md border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-100">
              Conta ativa: {customerSession.name}. Seus dados ja foram
              preenchidos no formulario.
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-300">
              Nome do cliente
            </span>
            <input
              name="client"
              required
              type="text"
              defaultValue={customerSession?.name ?? ''}
              placeholder="Digite seu nome"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-300">
              Telefone
            </span>
            <input
              name="phone"
              required
              type="tel"
              defaultValue={formatStoredPhone(customerSession?.phone)}
              placeholder="(00) 00000-0000"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-300">Servico</span>
            <select
              name="service"
              required
              defaultValue=""
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            >
              <option value="" disabled>
                Selecione um servico
              </option>
              {services.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </label>

          <div className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-zinc-300">
              Dia da semana
            </span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {availableDates.map((date) => (
                <button
                  key={date.value}
                  type="button"
                  onClick={() => setSelectedDate(date.value)}
                  className={`rounded-md border px-3 py-4 text-left transition ${
                    selectedDate === date.value
                      ? 'border-amber-400 bg-amber-400 text-zinc-950 shadow-lg shadow-amber-950/30'
                      : 'border-white/10 bg-black/30 text-zinc-300 hover:border-amber-400/60 hover:bg-amber-400/10 hover:text-white'
                  }`}
                >
                  <span className="block text-sm font-bold uppercase">
                    {date.label}
                  </span>
                  <span className="mt-1 block text-lg font-semibold">
                    {date.detail}
                  </span>
                  <span className="mt-1 block text-xs opacity-75">
                    {date.month}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <span className="text-sm font-medium text-zinc-300">
            Horarios disponiveis
          </span>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {times.map((time) => (
              (() => {
                const isBooked = bookedTimes.includes(time)

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={isBooked}
                    onClick={() => setSelectedTime(time)}
                    className={`rounded-md border px-3 py-4 text-sm font-bold transition ${
                      selectedTime === time
                        ? 'border-amber-400 bg-amber-400 text-zinc-950 shadow-lg shadow-amber-950/30'
                        : isBooked
                          ? 'cursor-not-allowed border-white/5 bg-black/20 text-zinc-600 line-through'
                          : 'border-white/10 bg-black/30 text-zinc-300 hover:border-amber-400/60 hover:bg-amber-400/10 hover:text-white'
                    }`}
                  >
                    {time}
                    {isBooked && (
                      <span className="mt-1 block text-[11px] font-semibold no-underline">
                        Ocupado
                      </span>
                    )}
                  </button>
                )
              })()
            ))}
          </div>
        </div>

        <label className="mt-6 block space-y-2">
          <span className="text-sm font-medium text-zinc-300">
            Observacao
          </span>
          <textarea
            name="notes"
            rows="4"
            placeholder="Ex: quero fazer barba tambem, tenho preferencia por horario da tarde..."
            className="w-full resize-none rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
        </label>

        <input type="hidden" name="date" value={selectedDate} required />
        <input type="hidden" name="time" value={selectedTime} required />

        {confirmation && (
          <p
            className={`mt-6 rounded-md border px-4 py-3 text-sm font-semibold ${
              messageType === 'success'
                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100'
                : 'border-red-400/20 bg-red-500/10 text-red-100'
            }`}
          >
            {confirmation}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300"
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar agendamento'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Scheduling
