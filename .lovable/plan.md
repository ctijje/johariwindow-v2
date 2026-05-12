## Revisi Judul Card Story Johari Window

### Perubahan

1. **Panel Hidden (Façade)**
   - `title_id`: "Kamu Tipe Misterius" → **"Kamu Tipe Tertutup"**
   - `title_en`: "You Are Mysterious" → **"You Are Private"**

2. **Panel Unknown**
   - Judul tetap **"Kamu Penuh Kemungkinan"** / **"You Are Full of Possibility"**
   - Tambahkan **sub-text baru** di bawah judul: "Masih Banyak Sisi yang Belum Tergali" (ID) / "Many Sides of You Are Yet to Be Discovered" (EN)

3. **Implementasi teknis**
   - Tambahkan field opsional `subtitle_id` dan `subtitle_en` pada type `Theme`
   - Render subtitle di bawah `<h1>` judul, hanya muncul jika subtitle tersedia (khusus panel `unknown`)
   - Styling subtitle: font-serif italic, sedikit lebih kecil dari tags, warna white/70

### File yang diubah
- `src/pages/test/Story.tsx` — update data tema + tambah render subtitle

Tidak ada perubahan backend, database, atau file lain.