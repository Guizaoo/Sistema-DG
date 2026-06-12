import { useEffect, useState } from 'react'

function ConfirmEmail({ navigateTo, onVerifyCustomerEmail }) {
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Confirmando seu email...')

  useEffect(() => {
    let isActive = true
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')

    async function confirmEmail() {
      if (!token) {
        setStatus('error')
        setMessage('Link de confirmacao invalido.')
        return
      }

      try {
        await onVerifyCustomerEmail(token)

        if (!isActive) return

        setStatus('success')
        setMessage('Email confirmado com sucesso. Sua conta ja esta ativa.')
      } catch (error) {
        if (!isActive) return

        setStatus('error')
        setMessage(error.message)
      }
    }

    confirmEmail()

    return () => {
      isActive = false
    }
  }, [onVerifyCustomerEmail])

  return (
    <div className="mx-auto flex min-h-[82vh] max-w-xl items-center">
      <section className="w-full rounded-lg border border-white/10 bg-zinc-900/85 p-6 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          Confirmacao de email
        </span>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">
          {status === 'success' ? 'Conta ativada.' : 'Validando sua conta.'}
        </h2>
        <p
          className={`mt-5 rounded-md px-4 py-3 text-sm font-medium ${
            status === 'error'
              ? 'bg-red-950/50 text-red-200'
              : status === 'success'
                ? 'bg-emerald-950/50 text-emerald-100'
                : 'bg-white/5 text-zinc-300'
          }`}
        >
          {message}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigateTo('/agendamento')}
            disabled={status === 'loading'}
            className="rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ir para agendamento
          </button>
          <button
            type="button"
            onClick={() => navigateTo('/')}
            className="rounded-md border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-300/70"
          >
            Voltar ao login
          </button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmEmail
