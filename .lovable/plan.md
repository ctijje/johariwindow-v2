## Perubahan di `src/pages/coach/CoachDashboard.tsx`

### 1. Rename judul
- Ganti label `h1` dari `"Roster klien"` → `"Dashboard klien"` (locale ID)
- Ganti label EN `h1` dari `"Client roster"` → `"Client dashboard"` (jika ada)

### 2. Fix error `whatsapp_len`
Penyebab: saat WhatsApp dikosongkan, kode mengirim `"-"` (1 karakter) ke kolom `whatsapp`. Constraint di DB: `whatsapp = '' OR length 5..32`. Karakter `"-"` tidak lolos.

Perbaikan di fungsi `addClient` (baris 95):
- `whatsapp: form.whatsapp.trim() || "-"` → `whatsapp: form.whatsapp.trim() || ""`

Email sudah aman (fallback otomatis ke `client-{code}@johariwindow.id`), tetap optional di UI.

### 3. UI box optional (sudah ada, hanya pastikan jelas)
Field email & WhatsApp di form sudah pakai placeholder `(opsional)` / `(optional)`. Tidak perlu validasi tambahan — cukup pastikan submit lolos walau kosong (otomatis setelah fix #2).

### Catatan
Tidak ada perubahan database. Hanya 2 baris di satu file.
