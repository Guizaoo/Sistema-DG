import { useEffect, useMemo, useState } from 'react'
import { listAppointments } from '../api/appointments'
import { formatCurrency } from '../data/appointments'

function AdminDashboard() {
  const [appointments, setAppointments] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadAppointments() {
      try {
        const nextAppointments = await listAppointments()

        if (!isActive) return

        setAppointments(nextAppointments)
        setError('')
      } catch (loadError) {
        if (isActive) {
          setError(loadError.message)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadAppointments()

    return () => {
      isActive = false
    }
  }, [])

  const stats = useMemo(() => {
    const totalValue = appointments.reduce(
      (total, appointment) => total + appointment.value,
      0,
    )
    const uniqueClients = new Set(
      appointments.map((appointment) => appointment.phone),
    ).size

    return [
      { label: 'Agendamentos recebidos', value: appointments.length },
      { label: 'Clientes na lista', value: uniqueClients },
      { label: 'Faturamento previsto', value: formatCurrency(totalValue) },
    ]
  }, [appointments])

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-zinc-900/85 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-amber-400/10 blur-2xl" />
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          Painel administrativo
        </span>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Comando rapido para agenda, clientes e faturamento.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300">
          Esta tela esta conectada ao formulario do cliente por armazenamento
          local. Depois vamos trocar isso por banco de dados e login real.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20"
          >
            <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
            <strong className="mt-3 block text-4xl font-semibold text-white">
              {stat.value}
            </strong>
            <div className="mt-5 h-1 rounded-full bg-[linear-gradient(90deg,#f59e0b,rgba(245,158,11,0.05))]" />
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/85 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              Agendamentos dos clientes
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Tudo que o cliente envia pela tela de agendamento aparece aqui.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              setIsLoading(true)
              try {
                setAppointments(await listAppointments())
                setError('')
              } catch (refreshError) {
                setError(refreshError.message)
              } finally {
                setIsLoading(false)
              }
            }}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-amber-400/60 hover:text-white"
          >
            Atualizar
          </button>
        </div>

        {error ? (
          <div className="p-10 text-center">
            <h4 className="text-lg font-semibold text-red-200">
              Nao foi possivel carregar os agendamentos
            </h4>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              {error}
            </p>
          </div>
        ) : isLoading ? (
          <div className="p-10 text-center">
            <h4 className="text-lg font-semibold">Carregando agenda...</h4>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-xl font-black text-amber-200">
              DG
            </div>
            <h4 className="text-lg font-semibold">Nenhum agendamento ainda</h4>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              Quando um cliente preencher o formulario de agendamento, ele vai
              aparecer nesta lista do administrador.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-black/50 text-xs uppercase text-zinc-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Data</th>
                  <th className="px-5 py-3 font-semibold">Horario</th>
                  <th className="px-5 py-3 font-semibold">Cliente</th>
                  <th className="px-5 py-3 font-semibold">Servico</th>
                  <th className="px-5 py-3 font-semibold">Telefone</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-5 py-4 font-semibold">
                      {appointment.date}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {appointment.time}
                    </td>
                    <td className="px-5 py-4">{appointment.client}</td>
                    <td className="px-5 py-4 text-zinc-300">
                      {appointment.service}
                    </td>
                    <td className="px-5 py-4 text-zinc-300">
                      {appointment.phone}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-100">
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {formatCurrency(appointment.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default AdminDashboard
