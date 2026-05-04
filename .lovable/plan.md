
# Test Johari Window — Plan Lengkap (Revisi)

Setelah pelajari screenshot, ada banyak elemen penting yang belum masuk plan sebelumnya. Berikut versi lengkap.

## Flow 5 Langkah

```
1. Data diri  →  2. Pilih kata  →  3. Bagikan ke peer  →  4. Hasil 4 panel  →  5. Profil bakat + rekomendasi
```

### Langkah 1 — Data diri (`/test`)
Form: Nama lengkap*, Email*, Nomor WhatsApp*, Pekerjaan saat ini*, Usia*, Jenis kelamin*.
Header: "LANGKAH 1 DARI 5 · Data diri" + subteks privasi.
Validasi semua field wajib sebelum lanjut.

### Langkah 2 — Pilih kata diri (`/test/words`)
- Header: "Pilih kata yang paling mencerminkan dirimu" + instruksi "Pilih 4–8 kata".
- Counter live: "Dipilih: X / 8" (warna brand saat aktif).
- Grid 24 kata sifat (4 kolom desktop, 2 mobile), tiap kartu: **judul tebal** + subtitle pendek (mis. "Empatik / Peka terhadap orang lain").
- Kartu terpilih: border + bg gradient-soft brand, teks brand.
- Tombol "Kembali" + "Lanjut bagikan ke peer →" (disabled <4 atau >8).

### Langkah 3 — Bagikan ke peer (`/test/share`)
- Card brand-soft besar berisi **kode unik 5 karakter** (mis. `J7NP0`) font mono besar + tombol "Salin kode" & "Kirim via WA" (hijau).
- Tiga slot peer (1 wajib, 2–3 opsional) — tiap slot bisa di-klik untuk "isi langsung di sini" (membuka dialog peer-pick di tab/route yang sama).
- Slot terisi → state hijau dengan checkmark + "X kata dipilih".
- Banner status: kuning ("minimal 1 peer") → hijau ("1 peer sudah mengisi").
- Tombol "Lihat hasil →" (disabled sampai ≥1 peer terisi).

### Halaman Peer Eksternal (`/peer/:kode`)
- Header: "PEER X — PILIH KATA · Pilih kata yang paling menggambarkan {NamaUser}".
- Input "Namamu" (opsional), grid 24 kata yang sama, counter 4–8.
- Submit → halaman terima kasih.

### Langkah 4 — Hasil 4 panel (`/test/result`)
- Heading: "Johari Window kamu, {Nama}" + "Berdasarkan self-assessment + N peer".
- 4 kuadran (2×2) dengan warna berbeda:
  - **OPEN AREA** (hijau) — Dikenal bersama
  - **BLIND SPOT** (peach/brand-soft) — Peer lihat, kamu belum
  - **HIDDEN / FACADE** (lavender) — Kamu tahu, peer belum
  - **UNKNOWN** (kuning/amber) — Belum disadari siapapun
- Tiap panel: kicker, judul, subtitle, **chip kata** dengan warna sesuai panel.
- Logika: bandingkan set kata self vs gabungan peer.

### Langkah 5 — Profil bakat tersembunyi (`/test/profile`)
- Header: "LANGKAH 4 DARI 5 — HASIL · PROFIL BAKAT TERSEMBUNYI".
- Card **POTENSI UTAMA** (amber): nama arketipe (mis. "Kreator & Inovator") + deskripsi naratif + box "ASSESSMENT LANJUTAN" (mis. Holland Code) + list "LANGKAH KONKRET".
- Card **POTENSI PENDUKUNG** (hijau): arketipe kedua + assessment + langkah.
- Mapping: tiap kata sifat punya tag kategori (Kreator, Pemimpin, Konektor, Analis, Empati, Eksekutor). Hitung skor dari Open+Hidden, ambil top 2.
- Tombol "← Kembali", "↓ Download laporan PDF", "Lanjut → Bagikan hasil".

## Yang Belum Ada di Plan Sebelumnya (Penting)

1. **Form data diri lengkap** (nama, email, WA, pekerjaan, usia, gender) — bukan cuma anonim.
2. **Step indicator** "LANGKAH X DARI 5" konsisten tiap halaman.
3. **Kata sifat versi pendek dengan subtitle deskriptif** (24 kata, bukan 56 klasik) — lebih ringkas & ada penjelasan.
4. **Kode pendek 5-karakter** untuk peer (bukan UUID panjang) — gampang dibagi via WA/lisan.
5. **Tombol "Kirim via WA"** dengan template pesan otomatis.
6. **Opsi "isi peer langsung di sini"** (peer ada di samping user, bisa diisi tanpa share link).
7. **Counter live & batasan 4–8 kata** (sebelumnya 5–6).
8. **Peer minimal 1, maksimal 3** dengan slot visual + state hijau saat selesai.
9. **Banner status dinamis** (kuning/hijau) di halaman share.
10. **Halaman Profil Bakat (Langkah 5)** dengan arketipe + rekomendasi assessment lanjutan + langkah konkret — ini value utama, sebelumnya sama sekali tidak ada.
11. **Kategorisasi kata sifat → arketipe** untuk menghasilkan profil.
12. **Download PDF laporan** hasil.
13. **Tombol "Bagikan hasil"** dari halaman profil.
14. **Warna spesifik per panel hasil** (hijau, peach, lavender, amber) — bukan hanya gradient brand.

## Backend (Lovable Cloud)

Tabel:
- `windows`: `id` (uuid), `code` (5-char unik), `name`, `email`, `whatsapp`, `occupation`, `age`, `gender`, `self_words` (text[]), `created_at`
- `peer_responses`: `id`, `window_id` (FK), `peer_name`, `words` (text[]), `created_at`

RLS:
- `windows` insert publik; select **hanya by code via RPC** (jangan expose email/WA ke peer)
- Buat **view publik** `windows_public` (id, code, name) untuk halaman peer — base table SELECT `USING (false)`
- `peer_responses` insert publik bila code valid; select hanya untuk owner via RPC by `window_id`

Email/WhatsApp adalah PII → tidak boleh terbaca peer/publik.

## Data & Asset
- `src/data/adjectives.ts` — 24 kata: `{ id, label_id, label_en, sub_id, sub_en, archetype }`
- `src/data/archetypes.ts` — 6 arketipe: nama, deskripsi, assessment lanjutan, langkah konkret (ID/EN)

## Routing
Tambah di `src/App.tsx`: `/test`, `/test/words`, `/test/share`, `/test/result`, `/test/profile`, `/peer/:code`.

## Update Landing Page
Semua CTA → `/test`. Toggle bahasa global via context/localStorage agar konsisten lintas halaman.

## Yang TIDAK Termasuk
- Login/akun user
- Email otomatis ke peer (cukup link + WA template)
- Time-lapse / multi-window history

Setelah disetujui, saya aktifkan Lovable Cloud, buat tabel + RLS, lalu bangun semua halaman.
