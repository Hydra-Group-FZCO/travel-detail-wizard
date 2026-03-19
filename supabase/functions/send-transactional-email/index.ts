import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { BookingConfirmationEmail } from '../_shared/email-templates/booking-confirmation.tsx'
import { ContactAcknowledgmentEmail } from '../_shared/email-templates/contact-acknowledgment.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SITE_NAME = 'Digital Moonkey Travel'
const SENDER_DOMAIN = 'notify.digitalmoonkey.travel'
const FROM_DOMAIN = 'digitalmoonkey.travel'

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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // Verify the caller is authenticated
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Verify the JWT is valid by checking the user
  const token = authHeader.slice('Bearer '.length)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let payload: EmailPayload
  try {
    payload = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let html: string
  let text: string

  try {
    if (payload.type === 'booking_confirmation') {
      const p = payload as BookingConfirmationPayload
      const element = React.createElement(BookingConfirmationEmail, {
        experienceName: p.experienceName,
        bookingDate: p.bookingDate,
        guests: p.guests,
        customerName: p.customerName,
      })
      html = await renderAsync(element)
      text = await renderAsync(element, { plainText: true })
    } else if (payload.type === 'contact_acknowledgment') {
      const p = payload as ContactAcknowledgmentPayload
      const element = React.createElement(ContactAcknowledgmentEmail, {
        customerName: p.customerName,
        subject: p.subject,
      })
      html = await renderAsync(element)
      text = await renderAsync(element, { plainText: true })
    } else {
      return new Response(JSON.stringify({ error: `Unknown email type: ${(payload as any).type}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (renderError) {
    console.error('Template render failed', renderError)
    return new Response(JSON.stringify({ error: 'Template render failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const messageId = crypto.randomUUID()

  // Log pending
  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: payload.type,
    recipient_email: payload.to,
    status: 'pending',
  })

  // Enqueue to transactional queue
  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      run_id: crypto.randomUUID(),
      message_id: messageId,
      to: payload.to,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: EMAIL_SUBJECTS[payload.type] || 'Notification',
      html,
      text,
      purpose: 'transactional',
      label: payload.type,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('Failed to enqueue email', { error: enqueueError, type: payload.type })
    return new Response(JSON.stringify({ error: 'Failed to enqueue email' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(
    JSON.stringify({ success: true, queued: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
