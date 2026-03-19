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
  Hr,
} from 'npm:@react-email/components@0.0.22'

interface BookingConfirmationEmailProps {
  experienceName: string
  bookingDate: string
  guests: number
  customerName: string
}

export const BookingConfirmationEmail = ({
  experienceName,
  bookingDate,
  guests,
  customerName,
}: BookingConfirmationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Booking confirmed — {experienceName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Booking Confirmed ✈️</Heading>
        <Text style={text}>
          Hi {customerName}, your booking has been confirmed! Here are the details:
        </Text>
        <Container style={detailsBox}>
          <Text style={detailLabel}>Experience</Text>
          <Text style={detailValue}>{experienceName}</Text>
          <Hr style={divider} />
          <Text style={detailLabel}>Date</Text>
          <Text style={detailValue}>{bookingDate}</Text>
          <Hr style={divider} />
          <Text style={detailLabel}>Guests</Text>
          <Text style={detailValue}>{guests}</Text>
        </Container>
        <Text style={text}>
          If you have any questions about your booking, please don't hesitate to contact us at support@digitalmoonkey.travel.
        </Text>
        <Text style={footer}>
          Digital Moonkey Travel — Personal assistance services for travellers.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default BookingConfirmationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1e2a3a', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: '0 0 25px' }
const detailsBox = { backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px 20px', margin: '0 0 25px' }
const detailLabel = { fontSize: '11px', fontWeight: 'bold' as const, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '0' }
const detailValue = { fontSize: '15px', fontWeight: '600' as const, color: '#1e2a3a', margin: '2px 0 0' }
const divider = { borderColor: '#e5e7eb', margin: '12px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
