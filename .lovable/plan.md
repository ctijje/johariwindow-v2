## Tujuan

Reposisi halaman hasil (`/test/profile`) agar **data mentah Johari menjadi tampilan utama** (apa adanya, tanpa interpretasi) dan **6 arketipe diturunkan jadi seksi sekunder "tema"** dengan disclaimer jelas. Update juga story image & WindowView agar konsisten pakai kata "tema" (bukan "potensi"). Tidak mengubah scoring, schema, atau flow tes.

## Susunan baru `/test/profile`

```text
Kicker: HASIL JOHARI WINDOW-MU
H1: "Begini orang lain & dirimu sendiri melihatmu"
Sub: berdasarkan self + N peer

[1] HERO — DATA MENTAH (baru, tampilan utama)
   ┌──────────────────────┬──────────────────────┐
   │ How Others See You   │ How You See Yourself │
   │ bar chart top-10 kata│ bar chart top-10 kata│
   │ pilihan peer         │ pilihan diri sendiri │
   └──────────────────────┴──────────────────────┘
   Catatan kecil:
   "Johari Window dirancang sebagai alat refleksi & dialog
   (Luft & Ingham, 1955). Data di atas adalah hasil pilihan
   kamu dan peer."

[2] TEMA YANG MUNCUL (seksi sekunder, dulunya "POTENSI")
   Disclaimer di atas:
   "Sebagai bantuan refleksi, kami mengelompokkan kata-kata
   di atas ke 6 tema bakat (Kreator, Pemimpin, Konektor,
   Analis, Empath, Eksekutor). Pengelompokan ini terinspirasi
   literatur arketipe bakat, bukan label kepribadian."
   - Card "TEMA DOMINAN" (was POTENSI UTAMA)
   - Card "TEMA PENDUKUNG" (was POTENSI PENDUKUNG)

[3] DARI MANA PROFIL INI? (revisi)
   - Sebut Luft & Ingham (1955) sebagai sumber Johari Window.
   - Jelaskan bahwa bar chart = data apa adanya, hasil pilihan
     kamu dan peer.
   - Sebut 6 tema = kurasi internal, terinspirasi literatur
     arketipe bakat, bukan label kepribadian.
   - Hapus klaim "potensi" / "talent profile".

[4] CTA: Bagikan hasil (tetap)
```

## Perubahan teks

### `src/pages/test/Profile.tsx`
- Kicker page: "PROFIL BAKAT TERSEMBUNYI" → **"HASIL JOHARI WINDOW-MU"** / "YOUR JOHARI WINDOW RESULTS"
- H1: "Profil bakat tersembunyimu" → **"Begini orang lain & dirimu sendiri melihatmu"** / "How others — and you — see yourself"
- Card kicker: "POTENSI UTAMA / PENDUKUNG" → **"TEMA DOMINAN / TEMA PENDUKUNG"** / "DOMINANT THEME / SUPPORTING THEME"
- Card heading internal: "Cara kami menentukan potensimu" → **"Apa arti hasil ini?"** / "What does this mean?"
- List "Potensi Utama / Pendukung" di seksi penjelasan → "Tema Dominan / Pendukung".

### `src/pages/test/Story.tsx` (story image yang dibagikan)
- Line 75 `title_id: "Kamu Penuh Potensi"` → **"Tema Yang Muncul Di Dirimu"** (EN sejajar: "Themes That Show Up In You").
- Line 204 label `"POTENSI UTAMA" / "PRIMARY POTENTIAL"` → **"TEMA DOMINAN" / "DOMINANT THEME"**.

### `src/components/WindowView.tsx`
- Line 36/40 label `POTENSI UTAMA / PENDUKUNG` & `PRIMARY / SUPPORTING POTENTIAL` → **TEMA DOMINAN / PENDUKUNG** & **DOMINANT / SUPPORTING THEME**.

## Komponen baru: bar chart kata sifat

Komponen kecil di dalam `Profile.tsx` (tanpa file baru, sederhana):
- Input: array string kata sifat + tone warna.
- Hitung frekuensi → ambil top 10 → render bar horizontal pakai Tailwind (`width: count/max * 100%`). Tanpa library chart baru.
- Dua instance:
  - **Peer**: gabungan semua `peers[].words`.
  - **Self**: `self_words` user.

## Yang TIDAK diubah

- `Result.tsx` (4-kuadran Johari), scoring `computeArchetypes`, schema DB, flow tes, copy Landing/Pricing/Coach.
- Tidak ada migration, tidak ada dependency baru.
- Panel "Feedback by Relationship" (dari screenshot referensi) **tidak dibangun** — butuh kolom `relationship` baru di `peer_responses` + perubahan form peer (perubahan flow). Bisa jadi follow-up terpisah.

## File yang diedit

- `src/pages/test/Profile.tsx`
- `src/pages/test/Story.tsx`
- `src/components/WindowView.tsx`
