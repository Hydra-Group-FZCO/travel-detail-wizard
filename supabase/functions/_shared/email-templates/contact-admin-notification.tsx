import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Hr, Heading } from 'npm:@react-email/components@0.0.22'

interface ContactAdminNotificationEmailProps {
  customerName: string
  customerEmail: string
  subject: string
  message: string
}

export const ContactAdminNotificationEmail = ({
  customerName,
  customerEmail,
  subject,
  message,
}: ContactAdminNotificationEmailProps) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#f6f9fc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '40px 0' }}>
      <Container style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <Heading style={{ fontSize: '20px', color: '#1a1a1a', marginBottom: '24px' }}>
          📩 New Contact Form Submission
        </Heading>
        <Section style={{ marginBottom: '16px' }}>
          <Text style={{ fontSize: '14px', color: '#666', margin: '0 0 4px' }}><strong>From:</strong> {customerName} ({customerEmail})</Text>
          <Text style={{ fontSize: '14px', color: '#666', margin: '0 0 4px' }}><strong>Subject:</strong> {subject}</Text>
        </Section>
        <Hr style={{ borderColor: '#e6e6e6', margin: '16px 0' }} />
        <Section>
          <Text style={{ fontSize: '14px', color: '#333', whiteSpace: 'pre-wrap' }}>{message}</Text>
        </Section>
        <Hr style={{ borderColor: '#e6e6e6', margin: '24px 0' }} />
        <Text style={{ fontSize: '12px', color: '#999' }}>
          This message was sent via the contact form at digitalmoonkey.travel
        </Text>
      </Container>
    </Body>
  </Html>
)
