/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ContactAcknowledgmentEmailProps {
  customerName: string
  subject: string
}

export const ContactAcknowledgmentEmail = ({
  customerName,
  subject,
}: ContactAcknowledgmentEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We've received your message — Digital Moonkey Travel</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Message Received ✉️</Heading>
        <Text style={text}>
          Hi {customerName}, thank you for getting in touch! We've received your message regarding "{subject}" and our team will get back to you within 24 hours on business days.
        </Text>
        <Text style={text}>
          In the meantime, if your enquiry is urgent, you can reach us directly at support@digitalmoonkey.travel.
        </Text>
        <Text style={footer}>
          Digital Moonkey Travel — Personal assistance services for travellers.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ContactAcknowledgmentEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1e2a3a', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 25px' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
