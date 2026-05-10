## Goal

Email **chairunisatijje@gmail.com** akan otomatis jadi admin, supaya bisa akses `/admin/claims` dan approve klaim pembayaran (yang otomatis generate access code + kirim email ke user).

## Status sekarang

- Email tersebut belum pernah signup di sistem (belum ada di `auth.users`).
- Tabel `user_roles` ada role `admin`, tapi belum ada row untuk email ini.
- Flow approve klaim sudah lengkap: `/admin/claims` → klik Approve → RPC `approve_payment_claim` → generate code `JW-XXXXXX` → email `claim-approved-user` ke user.

## Plan

### 1. Migrasi DB — auto-grant admin role untuk email tersebut

Update trigger `handle_new_user` supaya saat ada signup baru, kalau email-nya `chairunisatijje@gmail.com`, otomatis insert `admin` role ke `user_roles`. Untuk amannya, juga insert sekarang kalau user-nya sudah ada (tidak ada saat ini, tapi defensive).

```sql
-- Update handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));

  -- Auto-grant admin role to designated admin email
  IF lower(NEW.email) = 'chairunisatijje@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;
```

### 2. Langkah aksi user

1. Buka `/auth` di johariwindow.id, klik **Daftar/Create account** dengan email `chairunisatijje@gmail.com` + password.
2. Setelah login, akan otomatis di-redirect ke `/coach/redeem` (karena belum punya role coach), tapi sekaligus role `admin` sudah ke-set.
3. Akses `/admin/claims` → muncul dashboard semua klaim pembayaran.
4. Saat ada user bayar di lynk.id → klaim di `/coach/claim` → muncul di `/admin/claims` → klik **Approve** → user otomatis dapat email berisi access code → user redeem di `/coach/redeem` → masuk dashboard coach.

## Acceptance

- Setelah signup dengan email tersebut, query `SELECT * FROM user_roles WHERE role='admin'` menampilkan 1 row.
- Halaman `/admin/claims` bisa dibuka tanpa redirect ke home.
- Klik Approve di klaim pending menghasilkan access code dan email ke user.