import { useState } from 'react'

function CustomerLogin({
  customerSession,
  navigateTo,
  onCustomerLogin,
  onCustomerLogout,
  onCustomerSignup,
}) {
  const [mode, setMode] = useState('login')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()
    setFeedback('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      await onCustomerLogin({
        phone: formData.get('phone'),
        password: formData.get('password'),
      })
      navigateTo('/agendamento')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSignup(event) {
    event.preventDefault()
    setFeedback('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)

    try {
      await onCustomerSignup({
        name: formData.get('name'),
        phone: formData.get('phone'),
        password: formData.get('password'),
      })
      navigateTo('/agendamento')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (customerSession) {
    return (
      <div className="mx-auto grid min-h-[82vh] max-w-6xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="mb-8 h-2 rounded-full bg-[linear-gradient(90deg,#f59e0b_0_25%,#fafafa_25%_50%,#18181b_50%_75%,#f59e0b_75%)]" />
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            Conta conectada
          </span>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Ola, {customerSession.name}. Seu horario esta a poucos cliques.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
            Voce pode agendar usando seus dados salvos ou sair da conta e
            continuar sem login quando preferir.
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
              onClick={onCustomerLogout}
              className="rounded-md border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:text-white"
            >
              Sair da conta
            </button>
          </div>
        </section>

        <section className="grid gap-4">
          {[
            ['08:00 - 19:00', 'Horario de atendimento'],
            ['3 servicos', 'Corte, barba e combo'],
            ['Login opcional', 'Agende com ou sem conta'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20"
            >
              <strong className="block text-2xl font-semibold text-white">
                {value}
              </strong>
              <span className="mt-1 block text-sm text-zinc-400">{label}</span>
            </div>
          ))}
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[82vh] max-w-xl items-center">
      <section className="w-full rounded-lg border border-white/10 bg-zinc-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
        <div className="mb-6 grid grid-cols-2 rounded-md border border-white/10 bg-black/40 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setFeedback('')
            }}
            className={`rounded px-3 py-2 text-sm font-semibold transition ${
              mode === 'login'
                ? 'bg-amber-400 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setFeedback('')
            }}
            className={`rounded px-3 py-2 text-sm font-semibold transition ${
              mode === 'signup'
                ? 'bg-amber-400 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Cadastro
          </button>
        </div>

        {mode === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            {/* <span className="text-sm font-semibold text-amber-300">
              Login do cliente
            </span> */}
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Acesse sua conta.
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Se preferir, voce tambem pode entrar sem cadastro e agendar
              normalmente.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-300">
              Telefone
            </span>
            <input
              name="phone"
              required
              type="tel"
              placeholder="(00) 00000-0000"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-300">Senha</span>
            <input
              name="password"
              required
              type="password"
              placeholder="Digite sua senha"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </label>

          {feedback && (
            <p className="rounded-md bg-red-950/50 px-3 py-2 text-sm font-medium text-red-200">
              {feedback}
            </p>
          )}

          <div className="grid gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar e agendar'}
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/agendamento')}
              className="w-full rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-300/70"
            >
              Entrar sem cadastro
            </button>
          </div>
        </form>
        ) : (
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            {/* <span className="text-sm font-semibold text-amber-300">
              Cadastro do cliente
            </span> */}
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
              Crie sua conta.
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Com cadastro, seus dados ficam prontos para os proximos
              agendamentos.
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-300">Nome</span>
            <input
              name="name"
              required
              type="text"
              placeholder="Digite seu nome"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-300">
              Telefone
            </span>
            <input
              name="phone"
              required
              type="tel"
              placeholder="(00) 00000-0000"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-300">Senha</span>
            <input
              name="password"
              required
              type="password"
              minLength="4"
              placeholder="Crie uma senha"
              className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
          </label>

          {feedback && (
            <p className="rounded-md bg-red-950/50 px-3 py-2 text-sm font-medium text-red-200">
              {feedback}
            </p>
          )}

          <div className="grid gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar e agendar'}
            </button>
            
          </div>
        </form>
        )}
      </section>
    </div>
  )
}

export default CustomerLogin
