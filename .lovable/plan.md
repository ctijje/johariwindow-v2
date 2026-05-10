## Masalah

1. **Teks CTA salah** — di `/coach/redeem` masih tertulis "Don't have a code? Contact us for payment info → WhatsApp". Harusnya arahkan ke halaman pricing + konfirmasi via email admin.
2. **Bug akses otomatis** — semua user yang login/daftar lewat `/auth` (tanpa `?next=...`) langsung dapat role `coach` secara otomatis. Penyebabnya: `src/pages/Auth.tsx` memanggil `supabase.rpc("claim_coach_role")` setiap kali user login sebagai non-individual, dan RPC `claim_coach_role` di database memang langsung insert role tanpa cek apapun. Jadi alur approval (`coach_payment_claims` → admin approve → access code → redeem) jadi tidak ada artinya karena role sudah dikasih duluan.

## Yang akan diubah

### 1. `src/pages/coach/CoachRedeem.tsx` — ubah teks "noCode"

- ID: `"Belum punya code? "` + link ke `/pricing` ("lihat paket & konfirmasi pembayaran") + teks "kirim bukti ke admin.johariwindow.id@gmail.com"
- EN versi sama dalam bahasa Inggris
- Hapus tombol WhatsApp di section ini, ganti jadi link ke `/pricing` + mailto ke `admin.johariwindow.id@gmail.com`

### 2. `src/pages/Auth.tsx` — hapus auto-claim coach role

- Hapus blok `await supabase.rpc("claim_coach_role")` di `useEffect` (baris 31–34) dan di handler signup (baris 84–87).
- Setelah login/signup berhasil:
  - Kalau ada `?next=...` → redirect ke `next` (sama seperti sekarang).
  - Kalau tidak ada `next` → redirect ke `/coach/redeem` (bukan `/coach/dashboard`). User harus masukkan access code dulu, baru bisa masuk dashboard.
- `ProtectedRoute` sudah menangani redirect `coach` → `/coach/redeem` kalau role belum ada, jadi akses `/coach/dashboard` langsung tetap aman.

### 3. Database — nonaktifkan `claim_coach_role` RPC (migrasi)

Karena RPC ini bisa dipanggil siapa saja yang login dan langsung kasih role `coach`, ini harus diamankan. Opsi: ganti body function-nya jadi `RAISE EXCEPTION 'Deprecated, use redeem_coach_code instead'`. Lebih aman daripada drop (menghindari error tipe TypeScript & migrasi lain yang mungkin reference). Satu-satunya cara dapat role `coach` jadi lewat `redeem_coach_code` (yang validate access code dari approval admin).

## Catatan untuk user

- **User existing yang sudah dapat role `coach` lewat bug ini** akan tetap punya akses. Kalau mau dibersihkan, harus hapus manual dari tabel `user_roles`. Mau aku siapkan query pembersihannya juga?
- Setelah perubahan ini, alur lengkap: bayar di lynk.id → klaim di `/coach/claim` → admin approve di `/admin/claims` → email berisi access code → user redeem di `/coach/redeem` → masuk dashboard.

## Acceptance criteria

- Teks di `/coach/redeem` bagian bawah berbunyi (ID): "Belum punya code? Lihat paket & konfirmasi pembayaran ke admin.johariwindow.id@gmail.com"
- Akun baru yang signup/login dari `/auth` tanpa pernah redeem code → di-redirect ke `/coach/redeem`, akses `/coach/dashboard` ditolak.
- Memanggil RPC `claim_coach_role` dari client menghasilkan error.