import { useState } from 'react'

function AdminLogin({ navigateTo, onAdminLogin }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await onAdminLogin({ phone, password })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full overflow-hidden rounded-lg border border-white/10 bg-zinc-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8"
      >
        <div className="-mx-6 -mt-6 mb-6 h-2 bg-[linear-gradient(90deg,#f59e0b,#fafafa,#27272a,#f59e0b)] sm:-mx-8 sm:-mt-8" />
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          Acesso restrito
        </span>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">
          Entrar como administrador
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          Esta tela separa a area do cliente da area administrativa. Depois
          trocamos esta senha simples por login real com backend.
        </p>

        <label className="mt-6 block space-y-2">
          <span className="text-sm font-medium text-zinc-300">Telefone</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value)
              setError('')
            }}
            placeholder="Telefone do admin"
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
        </label>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-zinc-300">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            placeholder="Digite a senha do admin"
            className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
          />
        </label>

        {error && (
          <p className="mt-3 rounded-md bg-red-950/50 px-3 py-2 text-sm font-medium text-red-200">
            {error}
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
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminLogin
