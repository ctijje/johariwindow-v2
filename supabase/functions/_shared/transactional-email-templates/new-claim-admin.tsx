import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Link, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Johari Window'
const ADMIN_URL = 'https://johariwindow.id/admin/claims'

interface Props {
  email?: string
  plan?: string
  lynkOrderRef?: string
  proofUrl?: string
  note?: string
  claimId?: string
}

const NewClaimAdminEmail = ({ email, plan, lynkOrderRef, proofUrl, note, claimId }: Props) => (
  <Html lang="id" dir="ltr">
    <Head />
    <Preview>Klaim pembayaran baru — {plan ?? 'coach'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Klaim pembayaran baru</Heading>
        <Text style={text}>Ada klaim akses coach baru menunggu approval.</Text>
        <Section style={card}>
          <Text style={row}><strong>Email:</strong> {email ?? '-'}</Text>
          <Text style={row}><strong>Paket:</strong> {plan ?? '-'}</Text>
          <Text style={row}><strong>No. order lynk.id:</strong> {lynkOrderRef ?? '-'}</Text>
          {proofUrl ? (
            <Text style={row}><strong>Bukti:</strong>{' '}<Link href={proofUrl} style={link}>{proofUrl}</Link></Text>
          ) : null}
          {note ? <Text style={row}><strong>Catatan user:</strong> {note}</Text> : null}
          {claimId ? <Text style={mono}>ID: {claimId}</Text> : null}
        </Section>
        <Text style={text}>
          <Link href={ADMIN_URL} style={cta}>Buka panel admin →</Link>
        </Text>
        <Hr style={hr} />
        <Text style={footer}>{SITE_NAME} • johariwindow.id</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewClaimAdminEmail,
  subject: (d: Record<string, any>) => `Klaim baru: ${d?.plan ?? 'coach'} — ${d?.email ?? ''}`.trim(),
  displayName: 'Klaim baru (admin)',
  previewData: {
    email: 'budi@example.com',
    plan: 'starter',
    lynkOrderRef: 'LYNK-12345',
    proofUrl: 'https://drive.google.com/abc',
    note: 'Sudah transfer via BCA',
    claimId: '00000000-0000-0000-0000-000000000000',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '32px 24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '24px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f8f7f3', borderRadius: '12px', padding: '20px 22px', margin: '20px 0' }
const row = { fontSize: '14px', color: '#222', margin: '0 0 8px', lineHeight: '1.5' }
const mono = { fontSize: '11px', color: '#888', fontFamily: 'monospace', margin: '12px 0 0' }
const link = { color: '#7a4f1d', textDecoration: 'underline' }
const cta = { color: '#7a4f1d', fontWeight: 600, textDecoration: 'underline' }
const hr = { borderColor: '#eee', margin: '28px 0 16px' }
const footer = { fontSize: '12px', color: '#999', margin: 0 }