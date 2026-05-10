## Tujuan
Setelah user bayar di lynk.id, mereka klaim akses lewat halaman web. Kamu approve manual di admin panel. Kedua pihak dapat email otomatis.

## Flow user
1. Di **Pricing** klik "Bayar via lynk.id" → buka link lynk.id (tab baru)
2. Selesai bayar → di "pesan setelah pembayaran" lynk.id, kamu paste link: `https://johariwindow.id/coach/claim`
3. User buka `/coach/claim` → isi form: email, paket (Starter/Growth), nomor order lynk.id, URL bukti (opsional)
4. Submit → status "menunggu approval" + **email notif otomatis ke `admin.johariwindow.id@gmail.com`** dengan detail klaim
5. User bisa kembali ke `/coach/claim` kapan saja → lihat status klaimnya
6. Setelah kamu approve → **user dapat email otomatis** berisi access code + link aktivasi → halaman `/coach/claim` juga otomatis menampilkan code + tombol "Aktifkan sekarang" → `/coach/redeem?code=...` → role coach aktif

## Flow admin (kamu)
- Halaman baru `/admin/claims` (hanya role `admin`) — list klaim `pending`
- Tiap kartu: detail user + tombol **Approve** / **Reject** + textarea catatan admin
- Approve → generate code unik → assign ke klaim → status `approved` → trigger email ke user
- Reject → status `rejected` → (opsional) email ke user dengan alasan

## Database
- Enum `app_role` tambah value `'admin'`
- Tabel baru `coach_payment_claims`:
  - `id`, `user_id` (nullable), `email`, `plan` (`starter` | `growth`)
  - `lynk_order_ref`, `proof_url` (nullable), `note` (nullable)
  - `status` (`pending` | `approved` | `rejected`), `admin_note`, `access_code` (nullable)
  - `reviewed_by`, `reviewed_at`, `created_at`, `updated_at`
- RLS:
  - Authenticated: INSERT klaim sendiri (`user_id = auth.uid()`)
  - User: SELECT klaim sendiri
  - Admin (`has_role(auth.uid(),'admin')`): SELECT/UPDATE semua
- RPC `approve_payment_claim(_claim_id, _admin_note)`:
  - Cek caller admin → generate code `JW-XXXXXX` → INSERT `coach_access_codes` → UPDATE klaim
  - Return: `{ access_code, recipient_email, plan }` untuk dipakai trigger email
- RPC `reject_payment_claim(_claim_id, _admin_note)` — sama, status `rejected`

## Email (pakai infrastruktur email yang sudah ada)
Scaffold transactional email + 2 template baru:
- **`new-claim-admin`** — dikirim ke `admin.johariwindow.id@gmail.com` saat klaim baru
  - Isi: email klaim, paket, nomor order lynk, link bukti, link ke `/admin/claims`
  - Trigger: di `CoachClaim.tsx` setelah INSERT klaim sukses → `supabase.functions.invoke('send-transactional-email', ...)`
- **`claim-approved-user`** — dikirim ke email klaim saat approve
  - Isi: salam, paket, **access code**, tombol "Aktifkan akses" → `/coach/redeem?code=...`
  - Trigger: di `AdminClaims.tsx` setelah RPC approve sukses
- (Opsional) **`claim-rejected-user`** — saat reject, kirim alasan

## Frontend
- `src/pages/coach/CoachClaim.tsx` — form klaim + status klaim aktif (pending/approved/rejected). Jika approved: tampilkan code + tombol aktifkan
- `src/pages/admin/AdminClaims.tsx` — list pending, approve/reject
- Update `CoachRedeem.tsx` — terima `?code=` dari URL, auto-fill input
- Update `Pricing.tsx` — ganti link lynk.id (kamu kasih URL nya), tambah teks "Setelah bayar, klaim akses di johariwindow.id/coach/claim"
- Update `App.tsx` — tambah route `/coach/claim`, `/admin/claims`
- Update `ProtectedRoute.tsx` — support `requireRole="admin"`

## Setup admin pertama
Setelah migration, kasih tau email akun kamu (yang dipakai login di johariwindow.id) → aku INSERT manual `user_roles (user_id, role='admin')`.

## Yang kamu siapkan
- URL lynk.id untuk **Coach Starter** dan **Coach Growth** (kalau berbeda dari `pro.johariwindow.id` yang sekarang) — atau kamu update sendiri nanti
- Email akun login kamu di johariwindow.id (untuk dijadikan admin)

## Out of scope (versi awal)
- Tidak ada upload file langsung (cukup URL screenshot ke Drive/Imgur). Bisa ditambah bucket nanti.
- Tidak ada webhook lynk.id (lynk.id tidak menyediakannya).
