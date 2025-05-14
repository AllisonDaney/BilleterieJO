import type { RuntimeConfig } from 'nuxt/schema'
import axios from 'axios'

export function useEmail(config: RuntimeConfig) {
  const sendEmail = async ({ sender, to, subject, htmlContent }: { sender: { name: string, email: string }, to: { email: string, name: string }[], subject: string, htmlContent: string }) => {
    return await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender,
      to,
      subject,
      htmlContent,
    }, {
      headers: {
        'api-key': config.private.NUXT_BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    })
  }

  return {
    sendEmail,
  }
}
