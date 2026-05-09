# Rencana

## 1. Google OAuth pakai kredensial sendiri (Opsi 1 — BYOK)

**Tidak ada perubahan kode.** Tombol "Lanjut dengan Google" yang sudah ada akan otomatis pakai Client ID & Secret milikmu setelah disetting. Langkah yang kamu lakukan sendiri:

### A. Di Google Cloud Console (https://console.cloud.google.com)
1. Buat project baru (atau pakai yang sudah ada), misal nama "Johari Window".
2. Buka **APIs & Services → OAuth consent screen**:
   - User Type: **External**
   - App name: `Johari Window`
   - User support email: `admin@johariwindow.id`
   - App logo: (opsional, upload logo Johari Window)
   - Authorized domains: `johariwindow.id` dan `lovable.app`
   - Developer contact: `admin@johariwindow.id`
   - Scopes yang ditambahkan: `userinfo.email`, `userinfo.profile`, `openid`
   - Publishing status: klik **Publish app** supaya tidak terbatas test users
3. Buka **APIs & Services → Credentials → Create credentials → OAuth Client ID**:
   - Application type: **Web application**
   - Name: `Johari Window Web`
   - Authorized redirect URIs: tempel callback URL dari Lovable Cloud (lihat langkah B di bawah — ambil URL itu dulu, baru paste di sini)
4. Salin **Client ID** dan **Client Secret** yang muncul.

### B. Di Lovable Cloud (project ini)
1. Buka tab **Cloud** (kiri) → **Users** → **Authentication Settings** (ikon gear) → **Sign In Methods** → expand **Google**.
2. Salin **Callback URL** yang ditampilkan di sana → tempel ke "Authorized redirect URIs" di Google Cloud (langkah A.3 di atas).
3. Tempel **Client ID** dan **Client Secret** ke form Google di Lovable Cloud → Save.

Setelah ini, layar consent Google akan menampilkan "Johari Window" + logo + domain `johariwindow.id`, bukan Lovable.

## 2. Ganti email kontak

⚠️ Catatan: kamu mengetik `admin@johariwindow.id@gmail.com` — itu bukan format email valid (ada dua `@`). Aku asumsikan yang dimaksud adalah **`admin@johariwindow.id`**. Kalau ternyata maksudmu alamat Gmail terpisah, tolong konfirmasi alamat lengkapnya.

Ganti semua link kontak email dari `hello@johariwindow.id` → `admin@johariwindow.id` di:
- `src/components/Footer.tsx` (link Kontak/Contact)
- `src/pages/Index.tsx` (link Kontak/Contact di footer)
- File lain bila ada referensi `hello@johariwindow.id` (akan di-grep saat implementasi)

## Detail teknis
- Tidak ada perubahan di `src/integrations/lovable/index.ts` atau halaman Auth — Lovable Cloud otomatis swap kredensial managed → kredensial-mu begitu form Google Client ID/Secret terisi di Auth Settings.
- Tidak perlu deploy ulang edge function.
- Tidak perlu migrasi database.
