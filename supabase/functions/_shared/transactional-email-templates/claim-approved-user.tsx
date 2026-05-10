import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Johari Window'
const BASE_URL = 'https://johariwindow.id'

interface Props {
  accessCode?: string
  plan?: string
  name?: string
}

const ClaimApprovedEmail = ({ accessCode, plan, name }: Props) => {
  const activateUrl = accessCode
    ? `${BASE_URL}/coach/redeem?code=${encodeURIComponent(accessCode)}`
    : `${BASE_URL}/coach/redeem`
  return (
    <Html lang="id" dir="ltr">
      <Head />
      <Preview>Akses coach kamu sudah aktif</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Pembayaran kamu sudah dikonfirmasi 🎉</Heading>
          <Text style={text}>
            {name ? `Halo ${name}, ` : 'Halo, '}terima kasih sudah berlangganan paket{' '}
            <strong>Coach {plan === 'growth' ? 'Growth' : 'Starter'}</strong>.
          </Text>
          <Text style={text}>Berikut access code kamu:</Text>
          <Section style={codeBox}>
            <Text style={codeText}>{accessCode ?? '—'}</Text>
          </Section>
          <Text style={text}>
            Klik tombol di bawah untuk mengaktifkan dashboard coach. Code akan terisi otomatis.
          </Text>
          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={activateUrl} style={btn}>Aktifkan akses sekarang</Button>
          </Section>
          <Text style={small}>Atau buka tautan ini secara manual:<br /><span style={{ color: '#7a4f1d' }}>{activateUrl}</span></Text>
          <Hr style={hr} />
          <Text style={footer}>{SITE_NAME} • johariwindow.id</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ClaimApprovedEmail,
  subject: 'Akses coach kamu sudah aktif',
  displayName: 'Klaim disetujui (user)',
  previewData: { accessCode: 'JW-ABC123', plan: 'starter', name: 'Budi' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '26px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 18px', lineHeight: '1.2' }
const text = { fontSize: '15px', color: '#333', lineHeight: '1.6', margin: '0 0 14px' }
const small = { fontSize: '12px', color: '#888', lineHeight: '1.5', margin: '8px 0 0', wordBreak: 'break-all' as const }
const codeBox = { backgroundColor: '#f8f7f3', border: '1px solid #e8e1d4', borderRadius: '14px', padding: '20px', textAlign: 'center' as const, margin: '14px 0 22px' }
const codeText = { fontSize: '26px', fontFamily: 'monospace', fontWeight: 700, color: '#7a4f1d', letterSpacing: '2px', margin: 0 }
const btn = { backgroundColor: '#7a4f1d', color: '#ffffff', padding: '14px 28px', borderRadius: '999px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }
const hr = { borderColor: '#eee', margin: '32px 0 16px' }
const footer = { fontSize: '12px', color: '#999', margin: 0 }