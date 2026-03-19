import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { BookingConfirmationEmail } from '../_shared/email-templates/booking-confirmation.tsx'
import { ContactAcknowledgmentEmail } from '../_shared/email-templates/contact-acknowledgment.tsx'
import { ContactAdminNotificationEmail } from '../_shared/email-templates/contact-admin-notification.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SITE_NAME = 'Digital Moonkey Travel'
const SENDER_DOMAIN = 'notify.digitalmoonkey.travel'
const FROM_DOMAIN = 'digitalmoonkey.travel'
const ADMIN_EMAIL = 'admin@digitalmoonkey.travel'

interface BookingConfirmationPayload {
  type: 'booking_confirmation'
  to: string
  customerName: string
  experienceName: string
  bookingDate: string
  guests: number
}

interface ContactAcknowledgmentPayload {
  type: 'contact_acknowledgment'
  to: string
  customerName: string
  subject: string
  message: string
}

type EmailPayload = BookingConfirmationPayload | ContactAcknowledgmentPayload

const EMAIL_SUBJECTS: Record<string, string> = {
  booking_confirmation: 'Your Booking is Confirmed — Digital Moonkey Travel',
  contact_acknowledgment: "We've received your message — Digital Moonkey Travel",
}

async function enqueueEmail(
  supabase: any,
  to: string,
  subject: string,
  html: string,
  text: string,
  templateName: string,
) {
  const messageId = crypto.randomUUID()

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: to,
    status: 'pending',
  })

  const { error } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      run_id: crypto.randomUUID(),
      message_id: messageId,
      to,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: templateName,
      queued_at: new Date().toISOString(),
    },
  })

  if (error) {
    console.error('Failed to enqueue email', { error, templateName, to })
    throw new Error('Failed to enqueue email')
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const authHeader = req.headers.get('Authorization')

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  let payload: EmailPayload
  try {
    payload = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Contact form is public; other types require auth
  if (payload.type !== 'contact_acknowledgment') {
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const token = authHeader.slice('Bearer '.length)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  try {
    if (payload.type === 'booking_confirmation') {
      const p = payload as BookingConfirmationPayload
      const element = React.createElement(BookingConfirmationEmail, {
        experienceName: p.experienceName,
        bookingDate: p.bookingDate,
        guests: p.guests,
        customerName: p.customerName,
      })
      const html = await renderAsync(element)
      const text = await renderAsync(element, { plainText: true })
      await enqueueEmail(supabase, p.to, EMAIL_SUBJECTS.booking_confirmation, html, text, 'booking_confirmation')
    } else if (payload.type === 'contact_acknowledgment') {
      const p = payload as ContactAcknowledgmentPayload

      // 1) Send acknowledgment to customer
      const ackElement = React.createElement(ContactAcknowledgmentEmail, {
        customerName: p.customerName,
        subject: p.subject,
      })
      const ackHtml = await renderAsync(ackElement)
      const ackText = await renderAsync(ackElement, { plainText: true })
      await enqueueEmail(supabase, p.to, EMAIL_SUBJECTS.contact_acknowledgment, ackHtml, ackText, 'contact_acknowledgment')

      // 2) Send notification to admin
      const adminElement = React.createElement(ContactAdminNotificationEmail, {
        customerName: p.customerName,
        customerEmail: p.to,
        subject: p.subject,
        message: p.message,
      })
      const adminHtml = await renderAsync(adminElement)
      const adminText = await renderAsync(adminElement, { plainText: true })
      await enqueueEmail(supabase, ADMIN_EMAIL, `Contact: ${p.subject}`, adminHtml, adminText, 'contact_admin_notification')
    } else {
      return new Response(JSON.stringify({ error: `Unknown email type: ${(payload as any).type}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (err) {
    console.error('Email processing failed', err)
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Email processing failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({ success: true, queued: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
