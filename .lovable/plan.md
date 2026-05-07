## Tambahan di kartu story (`src/pages/test/Story.tsx`)

1. **Header brand "johariwindow.id"**
   - Tambahkan baris kecil di paling atas kartu (di atas chip kicker), font mono, tracking lebar, opacity ~80%, warna putih.
   - Posisikan dengan padding atas yang aman dari area "safe zone" Instagram Story (dikurangi sedikit dari `pt-[26%]` agar tidak berdesakan).

2. **Potensi utama di bawah nama**
   - Hitung primary archetype dengan `computeArchetypes(self_words, peer_words)` dari `@/lib/johari` (sudah ada).
   - Simpan di state `primary` saat fetch data window + peers.
   - Render di bawah pill nama: label kecil "POTENSI UTAMA / PRIMARY POTENTIAL" + nama arketipe (mis. "Kreator", "Pemimpin", dll) menggunakan `name_id` / `name_en` dari objek archetype.
   - Style: chip atau dua baris teks pendek, warna mengikuti `theme.cta` agar serasi dengan tema panel dominan.

3. **Penyesuaian kecil layout**
   - Kurangi sedikit `mt-*` antar elemen agar tetap muat di rasio 9:16 setelah ada 2 elemen baru.
   - Pastikan teks tidak overflow saat nama panjang (truncate / max-width).

### Catatan teknis
- Tidak perlu DB/edge function baru; semua data sudah tersedia.
- `html2canvas` sudah terpasang, jadi hasil download PNG otomatis ikut elemen baru.
- Tidak ada perubahan di file lain.
