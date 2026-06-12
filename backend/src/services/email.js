import { config } from '../config.js'

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function sendVerificationEmail({ email, name, verificationUrl }) {
  if (!config.resendApiKey) {
    console.log(
      `[email] RESEND_API_KEY ausente. Link de confirmacao para ${email}: ${verificationUrl}`,
    )

    return { sent: false, reason: 'missing_resend_api_key' }
  }

  const safeName = escapeHtml(name)
  const safeUrl = escapeHtml(verificationUrl)

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.emailFrom,
      to: email,
      subject: 'Confirme seu email na Agenda DG',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#18181b">
          <h1>Confirme sua conta</h1>
          <p>Ola, ${safeName}.</p>
          <p>Para ativar sua conta na Agenda DG, clique no botao abaixo:</p>
          <p>
            <a href="${safeUrl}" style="display:inline-block;background:#fbbf24;color:#18181b;padding:12px 18px;border-radius:6px;font-weight:700;text-decoration:none">
              Confirmar email
            </a>
          </p>
          <p>Se voce nao criou essa conta, pode ignorar este email.</p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Falha ao enviar email: ${errorBody}`)
  }

  return { sent: true }
}
