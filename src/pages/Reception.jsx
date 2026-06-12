const services = [
  {
    name: 'Corte masculino',
    duration: '40 min',
    price: 'R$ 35',
    detail: 'Acabamento alinhado e finalizacao limpa.',
  },
  {
    name: 'Barba completa',
    duration: '30 min',
    price: 'R$ 25',
    detail: 'Toalha quente, desenho e cuidado com a pele.',
  },
  {
    name: 'Corte + barba',
    duration: '1h',
    price: 'R$ 55',
    detail: 'Combo completo para renovar o visual.',
  },
]

function Reception({ navigateTo }) {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-zinc-900/85 p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-amber-400/10 blur-2xl" />
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            Bem-vindo
          </span>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Visual no ponto, horario confirmado, sem espera no balcao.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Escolha o servico, informe seus dados e deixe seu horario separado
            para atendimento.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigateTo('/agendamento')}
              className="rounded-md bg-amber-400 px-6 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300"
            >
              Agendar horario
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/')}
              className="rounded-md border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-amber-300/70"
            >
              Entrar na conta
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/60 p-6 text-white shadow-2xl shadow-black/30 sm:p-8">
          <span className="text-sm font-semibold text-amber-300">
            Atendimento de hoje
          </span>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-zinc-400">Horario de funcionamento</p>
              <strong className="mt-1 block text-2xl font-semibold">
                08:00 as 19:00
              </strong>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-zinc-400">Proxima etapa</p>
              <strong className="mt-1 block text-2xl font-semibold">
                Confirmar agendamento
              </strong>
            </div>
            <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 p-4">
              <p className="text-sm text-amber-200">
                Agende com ou sem login. A conta e apenas para acelerar os
                proximos horarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <h3 className="text-2xl font-semibold tracking-tight">
            Menu de servicos
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Valores iniciais para o cliente escolher antes de reservar.
          </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
            Atualizado hoje
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.name}
              className="group rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-900"
            >
              <div className="mb-5 h-1.5 rounded-full bg-[linear-gradient(90deg,#f59e0b,#fafafa,#27272a)] opacity-80" />
              <h4 className="text-xl font-semibold">{service.name}</h4>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {service.detail}
              </p>
              <div className="mt-5 flex items-end justify-between gap-3">
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-300">
                {service.duration}
              </span>
              <strong className="block text-3xl font-semibold text-amber-200">
                {service.price}
              </strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Reception
