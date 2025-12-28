// Email notification system
// In production, integrate with SendGrid, AWS SES, or similar

interface AppointmentConfirmationParams {
  to: string
  visitorName: string
  chatbotName: string
  scheduledAt: Date
  duration: number
}

interface NewLeadNotificationParams {
  to: string
  ownerName: string
  chatbotName: string
  leadName: string
  leadEmail: string
  leadPhone?: string | null
  leadMessage?: string | null
  leadScore: number
}

export async function sendAppointmentConfirmation(params: AppointmentConfirmationParams) {
  const { to, visitorName, chatbotName, scheduledAt, duration } = params

  // Format date nicely
  const dateString = scheduledAt.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const timeString = scheduledAt.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">Appointment Confirmed!</h2>

      <p>Hi ${visitorName},</p>

      <p>Your appointment has been successfully scheduled. Here are the details:</p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Date:</strong> ${dateString}</p>
        <p><strong>Time:</strong> ${timeString}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
        <p><strong>With:</strong> ${chatbotName}</p>
      </div>

      <p>We look forward to speaking with you!</p>

      <p>If you need to reschedule or cancel, please reply to this email.</p>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        This is an automated message from SiteGPT.
      </p>
    </div>
  `

  console.log(`[EMAIL] Appointment confirmation would be sent to: ${to}`)
  console.log(`Subject: Appointment Confirmed - ${dateString} at ${timeString}`)
  console.log(emailContent)

  // In production, use a real email service:
  // await sendEmail({
  //   to,
  //   subject: `Appointment Confirmed - ${dateString} at ${timeString}`,
  //   html: emailContent,
  // })

  return true
}

export async function sendNewLeadNotification(params: NewLeadNotificationParams) {
  const { to, ownerName, chatbotName, leadName, leadEmail, leadPhone, leadMessage, leadScore } = params

  const scoreColor = leadScore >= 70 ? '#10b981' : leadScore >= 50 ? '#f59e0b' : '#ef4444'
  const scoreLabel = leadScore >= 70 ? 'Hot Lead 🔥' : leadScore >= 50 ? 'Qualified' : 'New Lead'

  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0ea5e9;">New Lead from ${chatbotName}!</h2>

      <p>Hi ${ownerName},</p>

      <p>Great news! You have a new lead from your chatbot.</p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
          <strong>Lead Score:</strong>
          <span style="background-color: ${scoreColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 14px;">
            ${leadScore}/100 - ${scoreLabel}
          </span>
        </div>

        <p><strong>Name:</strong> ${leadName}</p>
        <p><strong>Email:</strong> <a href="mailto:${leadEmail}">${leadEmail}</a></p>
        ${leadPhone ? `<p><strong>Phone:</strong> <a href="tel:${leadPhone}">${leadPhone}</a></p>` : ''}
        ${leadMessage ? `<p><strong>Message:</strong><br/>${leadMessage}</p>` : ''}
      </div>

      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Respond within 5 minutes to maximize conversion (78% more likely to close!)</li>
        <li>Log in to your SiteGPT dashboard to view the full conversation</li>
        <li>${leadScore >= 70 ? 'This is a hot lead - prioritize immediate follow-up' : 'Review qualification details and reach out'}</li>
      </ul>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
         style="display: inline-block; background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
        View in Dashboard
      </a>

      <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
        This is an automated notification from SiteGPT.
      </p>
    </div>
  `

  console.log(`[EMAIL] New lead notification would be sent to: ${to}`)
  console.log(`Subject: New ${scoreLabel} - ${leadName} (${leadScore}/100)`)
  console.log(emailContent)

  // In production, use a real email service:
  // await sendEmail({
  //   to,
  //   subject: `New ${scoreLabel} - ${leadName} (${leadScore}/100)`,
  //   html: emailContent,
  // })

  return true
}
