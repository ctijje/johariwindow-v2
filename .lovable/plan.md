## Plan: 3 perbaikan

### 1. Sub-deskripsi kata tidak ke-translate ke EN
Di `src/data/adjectives.ts`, semua 56 adjective hanya punya `sub_id` (deskripsi singkat dalam Bahasa Indonesia). Field `sub_en` default kosong, sehingga `AdjectiveGrid` & chip hasil fallback menampilkan teks Indonesia walau bahasa = EN.

**Fix:** Tambahkan `sub_en` (terjemahan natural) untuk seluruh 56 adjective. Otomatis terpakai di halaman Words, Peer, dan Result.

### 2. Data tidak masuk ke Brevo + kirim email hasil otomatis
Log edge function menunjukkan `Brevo error 401: unrecognised IP address`. Kamu akan generate API key Brevo baru tanpa IP allowlist (atau matikan allowlistnya). Itu cukup untuk meresume sync contact.

Sekaligus pasang **email transaksional otomatis** ke user setelah submit data diri, berisi:
- Sapaan personal + ringkasan singkat
- **Link hasil** (`/test/result?w=<windowId>`) — bisa dibuka kapan saja
- **Link feedback peer** (`/peer/<code>`) — untuk dibagikan ke teman
- **Kode unik** Johari mereka

Email akan dikirim dari domain **johariwindow.id** menggunakan infrastruktur email bawaan Lovable (bukan via Brevo, biar lebih reliable, ada queue + retry, dan tidak terpengaruh IP allowlist Brevo). Sender default: `Johari Window <noreply@notify.johariwindow.id>`. Bahasa email mengikuti bahasa user saat isi form (ID/EN).

Langkah teknis:
- Setup email domain `johariwindow.id` (kamu akan diminta tambahkan DNS records sekali — dijalankan via dialog setup).
- Setup email infra + scaffold transactional email.
- Buat template `johari-window-ready.tsx` (dwibahasa, branding gradient orange sesuai app).
- Panggil `send-transactional-email` dari `DataDiri.tsx` setelah `create_window` sukses (idempotency key dari `windowId`).
- Tetap pertahankan sync ke Brevo (untuk list/contact attribute) — hanya minta kamu update secret `BREVO_API_KEY` dengan key baru tanpa IP restriction.

### 3. Tombol "Bagikan hasil" di halaman Profile tidak berfungsi
Di `src/pages/test/Profile.tsx` baris 115, button copy `window.location.origin + "/"` (homepage), bukan link hasil.

**Fix:** Copy URL hasil yang shareable: `${origin}/test/result?w=${windowId}` (windowId diambil dari `sessionStorage.getItem("johari.windowId")`). Tambahkan juga tombol "Kirim via WhatsApp" agar konsisten dengan halaman Share.

---

### File yang berubah
- `src/data/adjectives.ts` — isi `sub_en` untuk 56 entry.
- `supabase/functions/_shared/transactional-email-templates/johari-window-ready.tsx` — template baru (ID/EN, branding orange).
- `supabase/functions/_shared/transactional-email-templates/registry.ts` — daftarkan template.
- `src/pages/test/DataDiri.tsx` — invoke `send-transactional-email` setelah create window.
- `src/pages/test/Profile.tsx` — perbaiki link share + tombol WA.

### Yang dibutuhkan dari kamu (setelah plan disetujui)
1. **Update secret `BREVO_API_KEY`** dengan API key Brevo baru (tanpa IP allowlist).
2. **Setup DNS** untuk domain `johariwindow.id` (dialog akan muncul, copy-paste records ke registrar kamu sekali saja).
