## Ganti Favicon dengan Logo Header

Logo di header (`DashboardShell.tsx` dan `Index.tsx`) adalah komponen CSS berbasis 2×2 grid dengan warna brand gradient merah-oranye. Saat ini favicon masih default Lovable (`/favicon.ico`).

### Yang akan dikerjakan

1. **Buat favicon SVG** (`public/favicon.svg`) — replika visual dari logo 2×2 grid header:
   - Top-left: gradient `#ff3131` → `#ff914d` (solid fill)
   - Top-right: stroke `#ff3131` 70% opacity (border)
   - Bottom-left: stroke `#ff914d` (border)
   - Bottom-right: fill `#ff914d` 40% opacity
   - Ukuran 32×32px dengan rounded corners

2. **Hapus** `public/favicon.ico` (supaya browser tidak request favicon lama)

3. **Update** `index.html` — ganti `<link rel="icon" ...>` ke `/favicon.svg`

Hasil: favicon di tab browser akan menampilkan ikon grid 2×2 brand yang sama dengan logo di header aplikasi.