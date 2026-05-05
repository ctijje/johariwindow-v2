
# Untuk Coach & Untuk Tim — Plan

Membangun dua portal terpisah (Coach & Tim) di atas alur Johari Window yang sudah ada, plus pembersihan navigasi. Login (tombol "Masuk") hanya tersedia untuk Coach & Team — peserta individual tetap pakai flow tanpa daftar.

---

## 1. Navigasi (Header & Footer)

**Header** (`src/pages/Index.tsx`)
- Hapus link: `Cerita` (#voices) dan `FAQ` (#faq).
- Tambah link: `Untuk Coach` → `/coach`, `Untuk Tim` → `/team`.
- Tombol `Masuk` → `/auth` (login/signup khusus Coach & Team).
- Tombol CTA `Mulai Gratis` tetap → `/test` (peserta umum).

**Footer** (`src/components/Footer.tsx` & footer di `Index.tsx`)
- Pindahkan `Untuk Coach` & `Untuk Tim` dari kolom **SUMBER** ke kolom **PRODUK**.
- Kolom Produk jadi: `Cara Kerja`, `Untuk Coach`, `Untuk Tim`, `Versi Grup`, `Harga`.
- Kolom Sumber jadi: `Sains di Baliknya`, `Blog`.

---

## 2. Halaman publik baru

- `/coach` — landing page "Untuk Coach": value prop, cara kerja (invite mentee, lihat profil, sesi go-through), CTA `Daftar sebagai Coach` & `Masuk`.
- `/team` — landing page "Untuk Tim": value prop untuk team lead/HR, CTA `Daftar Tim` & `Masuk`.
- `/auth` — login + signup terpadu, dengan pilihan role saat signup (Coach atau Team Lead). Email/password + Google.

---

## 3. Authentication & Roles

- Aktifkan email/password + Google sign-in via Lovable Cloud.
- Saat signup user pilih role: `coach` atau `team_lead`.
- Setelah login → redirect ke dashboard yang sesuai (`/coach/dashboard` atau `/team/dashboard`).

---

## 4. Coach Dashboard (`/coach/dashboard`)

Kemampuan:
- **Daftar mentee**: list semua mentee yang ditambahkan coach + status (belum mulai / self words selesai / peer feedback masuk / siap review).
- **Tambah mentee**: form (nama, email, WA opsional) → otomatis generate Johari window, kirim link ke mentee untuk pilih kata + share ke peer.
- **Detail mentee** (`/coach/mentee/:id`):
  - 4 panel Johari (Open/Blind/Hidden/Unknown).
  - Profil bakat (Potensi Utama & Pendukung) — pakai logic `computeArchetypes`.
  - Daftar peer responses + ringkasan kata terbanyak.
  - **Mode "Go-through"**: tampilan presentasi step-by-step yang coach bisa share-screen saat sesi 1-on-1 dengan mentee (intro → self words → peer words → 4 panel → archetype → next steps).
  - Catatan sesi (private, hanya coach yang lihat).

---

## 5. Team Dashboard (`/team/dashboard`)

Kemampuan:
- **Daftar tim** yang dimiliki team_lead (mis. "Engineering Q1", "Design Team").
- **Buat tim baru**: nama tim + invite member (email).
- **Detail tim** (`/team/:id`):
  - Member list dengan status pengisian.
  - **Aggregate view**: arketipe dominan tim, distribusi kekuatan, gap (mis. banyak Analyst, sedikit Connector).
  - Per-member drill-down (Johari window + arketipe individu).
  - Mode go-through untuk team workshop.

---

## 6. Skema database (migrasi baru)

Tabel baru:
- **`profiles`** — `user_id` (FK auth.users, unique), `display_name`, `avatar_url`. Auto-created via trigger `on_auth_user_created`.
- **`user_roles`** — `user_id`, `role` (enum: `coach`, `team_lead`, `admin`). **Wajib tabel terpisah** untuk hindari privilege escalation. Pakai `has_role()` security definer function.
- **`coach_mentees`** — `coach_id` (FK auth.users), `window_id` (FK windows), `mentee_name`, `mentee_email`, `notes`, `status`.
- **`teams`** — `owner_id` (FK auth.users), `name`, `description`.
- **`team_members`** — `team_id` (FK teams), `window_id` (FK windows nullable), `member_email`, `member_name`, `joined_at`.

Update tabel `windows`:
- Tambah kolom `owner_type` (`self` | `coach` | `team`) dan `owner_id` (uuid nullable) supaya bisa difilter di RLS.

RLS policies:
- `profiles`: user lihat/update profilnya sendiri.
- `user_roles`: user lihat rolenya sendiri; hanya admin yang bisa insert/update.
- `coach_mentees`: hanya coach pemilik (`coach_id = auth.uid()` AND `has_role(auth.uid(), 'coach')`).
- `teams` + `team_members`: hanya owner tim (`owner_id = auth.uid()` AND `has_role(auth.uid(), 'team_lead')`).
- `windows`: tetap public insert (peserta umum); SELECT lewat RPC security-definer atau policy tambahan untuk coach/team owner.
- `peer_responses`: tetap seperti sekarang (public insert, public select via RPC).

---

## 7. Teknis singkat

- React Router: tambah route `/coach`, `/team`, `/auth`, `/coach/dashboard`, `/coach/mentee/:id`, `/team/dashboard`, `/team/:id`.
- Buat `ProtectedRoute` wrapper yang cek session + role via `has_role` RPC.
- `useAuth` hook dengan `onAuthStateChange` listener (di-set BEFORE `getSession()`).
- Reuse komponen yang sudah ada: `AdjectiveGrid`, `computePanels`, `computeArchetypes`, panel/profile UI dari `Result.tsx` & `Profile.tsx`.
- Mode go-through = komponen step-controller baru (`<GoThroughDeck />`) dengan prev/next + keyboard nav.

---

## 8. Yang TIDAK termasuk di plan ini (bisa fase berikutnya)

- Billing / paywall untuk Coach Pro / Team Pro.
- Email notifikasi otomatis ke mentee/team member (hanya copy-link share dulu).
- Real-time collaboration di mode go-through.
- Custom branding per coach/team.

---

**Konfirmasi sebelum saya mulai build:**
1. Auth: default email/password + Google sign-in — OK?
2. Saat signup, user pilih role Coach atau Team Lead di form yang sama — OK? (Atau mau dua signup page terpisah?)
3. Mentee/team member **tidak perlu akun** — mereka cuma terima link Johari seperti flow publik sekarang. OK?
