# 🔒 04 — Keamanan (Security Best Practice)

> Prinsip: Security bukan fitur tambahan, tapi fondasi.
> Semua poin ini WAJIB, bukan opsional.

---

## 🔑 Autentikasi & Autorisasi

### Password
```php
// ✅ Selalu hash password
$user->password = Hash::make($request->password);

// ✅ Verifikasi
Hash::check($request->password, $user->password);

// ❌ JANGAN simpan password plain text atau MD5/SHA1
$user->password = md5($password); // BERBAHAYA
```

### JWT / Token
```
✅ Gunakan expiry yang pendek untuk access token (15 menit - 1 jam)
✅ Refresh token untuk perpanjang session (7-30 hari)
✅ Simpan refresh token di HttpOnly cookie (bukan localStorage!)
✅ Blacklist token saat logout
✅ Rotasi refresh token setiap kali dipakai
❌ Jangan simpan token sensitif di localStorage (rentan XSS)
```

### Authorization — Prinsip Least Privilege
```php
// Setiap aksi harus dicek haknya
public function update(Request $request, Post $post): JsonResponse
{
    // Cek ownership
    if ($post->user_id !== auth()->id()) {
        abort(403, 'Tidak punya akses untuk mengedit post ini');
    }
    
    // atau gunakan Policy
    $this->authorize('update', $post);
    
    // baru proses
}

// Policy di Laravel
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->isAdmin();
    }
}
```

---

## 🛡️ Proteksi dari Serangan Umum

### SQL Injection
```php
// ❌ BERBAHAYA — raw query dengan input user langsung
DB::select("SELECT * FROM users WHERE email = '$email'");

// ✅ Parameterized query
DB::select("SELECT * FROM users WHERE email = ?", [$email]);

// ✅ Atau pakai Eloquent (otomatis aman)
User::where('email', $email)->first();
```

### XSS (Cross-Site Scripting)
```php
// ✅ Laravel Blade otomatis escape output
{{ $user->name }}          // Aman — di-escape otomatis

// ❌ Hindari kecuali benar-benar diperlukan dan data sudah dibersihkan
{!! $user->bio !!}         // Tidak di-escape!

// ✅ Jika harus render HTML dari user, gunakan sanitizer yang proper (HTMLPurifier)
$clean = clean($userInput); // spatie/laravel-htmlsanitizer (HTMLPurifier wrapper)
```

> **Peringatan**: JANGAN pakai `strip_tags()` sebagai sanitizer — atribut `onerror=`, `href="javascript:..."`, dan event handler lain tetap lolos. Selalu pakai sanitizer khusus (HTMLPurifier di PHP, DOMPurify di JS).

```javascript
// ❌ Jangan inject HTML dari input user
element.innerHTML = userInput; // Berbahaya!

// ✅ Gunakan textContent untuk text biasa
element.textContent = userInput;

// ✅ Atau sanitize dulu jika perlu HTML
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### CSRF (Cross-Site Request Forgery)
```php
// Laravel sudah handle CSRF secara default
// Pastikan middleware web sudah aktif

// Di form HTML
<form method="POST">
    @csrf
    ...
</form>

// Di API, gunakan Sanctum/Passport dengan cookie
// Atau header-based CSRF token untuk SPA
```

### File Upload
```php
// ✅ Validasi tipe file yang diizinkan
$request->validate([
    'photo' => [
        'required',
        'file',
        'mimes:jpeg,png,webp',  // Whitelist tipe file
        'max:2048',              // Maks 2MB
    ]
]);

// ✅ Buat nama file baru (jangan pakai nama dari user)
$filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

// ✅ Simpan di luar public directory jika memungkinkan
Storage::disk('private')->put($filename, $file);

// ❌ Jangan izinkan upload file executable (.php, .js, .exe)
```

### Rate Limiting
```php
// Laravel — di routes/api.php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::apiResource('users', UserController::class);
});

// Throttle lebih ketat untuk endpoint sensitif
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});
```

---

## 🔐 Environment & Secret Management

```bash
# .env — TIDAK BOLEH di-commit ke Git
DB_PASSWORD=super_secret_password
APP_KEY=base64:...
JWT_SECRET=...
MAIL_PASSWORD=...
AWS_SECRET_ACCESS_KEY=...

# .gitignore — selalu ada
.env
.env.local
.env.production
*.key
*.pem

# .env.example — yang di-commit, tanpa nilai sensitif
DB_PASSWORD=
APP_KEY=
JWT_SECRET=
```

### Checklist .env Security
```
[ ] .env ada di .gitignore
[ ] .env.example sudah dicommit dan up-to-date  
[ ] Tidak ada credential di dalam kode (hardcoded)
[ ] Secret berbeda antara development dan production
[ ] APP_DEBUG=false di production
[ ] APP_ENV=production di production
```

---

## 🌐 HTTP Security Headers

```php
// Laravel — Middleware atau config

// ✅ Header untuk web app
// Catatan: X-XSS-Protection TIDAK dipakai lagi (deprecated, sudah dihapus dari Chrome)
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=()');
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'");
```

> **X-XSS-Protection sudah deprecated** — jangan tambahkan. Header lama itu dihapus dari browser modern dan bisa menimbulkan false alarm. Cukup `Content-Security-Policy` + escaping output.

```nginx
# Nginx config
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

---

## 🔍 Logging & Monitoring

```php
// Jangan log data sensitif!
// ❌ Buruk
Log::info('Login attempt', ['password' => $password]);

// ✅ Baik
Log::info('Login attempt', [
    'email' => $email,
    'ip' => $request->ip(),
    'user_agent' => $request->userAgent(),
    'timestamp' => now()->toIso8601String(),
]);

// Log aktivitas penting
Log::warning('Failed login attempt', ['email' => $email, 'ip' => $request->ip()]);
Log::info('User created', ['user_id' => $user->id, 'by' => auth()->id()]);
Log::critical('Unauthorized access attempt', ['user_id' => auth()->id(), 'resource' => $request->path()]);
```

---

## 🔄 Webhook Security

Webhook (Midtrans, Xendit, Stripe, GitHub) adalah **endpoint publik tanpa auth** — siapa saja bisa POST ke sana. Verifikasi signature wajib.

```php
// ✅ Verifikasi signature dari webhook provider
$payload   = $request->getContent();
$signature = $request->header('X-Signature');

$computed = hash_hmac('sha512', $payload, config('services.midtrans.server_key'));

if (!hash_equals($computed, $signature)) {
    abort(403, 'Invalid webhook signature');
}

// Baru proses payload — dan selalu return 200 cepat,
// proses berat (update order, kirim notifikasi) pindah ke queue
```

**Aturan webhook:**
```
✅ Selalu verifikasi signature — jangan pernah percaya payload mentah
✅ Gunakan hash_equals() untuk perbandingan (timing-safe)
✅ IP whitelist provider kalau signature tidak tersedia
✅ Respond 200 secepatnya, proses berat via queue (jangan blokir)
✅ Simpan log semua webhook yang masuk (raw + status proses)
✅ Endpoint webhook tidak butuh auth user — tapi WAJIB verifikasi signature
```

---

## 📦 Dependency Security

Vulnerability paling umum di 2020-an bukan di kode kamu — tapi di dependency yang kamu install.

```yaml
# .github/dependabot.yml — auto-scan vulnerability + update
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "composer"
    directory: "/"
    schedule:
      interval: "weekly"
```

```
✅ Aktifkan Dependabot (GitHub) / Renovate — gratis
✅ Jangan pernah abaikan security alert — triage maksimal 1 minggu
✅ Pin version dengan lockfile (package-lock.json / composer.lock) — wajib di-commit
✅ Sebelum tambah dependency: cek maintenance, download count, known CVE
✅ Kalau library abandoned (tidak update 1+ tahun), cari pengganti
```

---

## 🔒 HTTPS & SSL

```
✅ Selalu gunakan HTTPS di production — tanpa pengecualian
✅ Redirect HTTP → HTTPS
✅ HSTS header aktif
✅ SSL certificate auto-renew (gunakan Let's Encrypt — gratis)
✅ TLS 1.2 minimum, TLS 1.3 direkomendasikan
❌ Tidak ada mixed content (HTTP resource di halaman HTTPS)
```

---

## ✅ Security Checklist Sebelum Deploy

```
Autentikasi:
[ ] Password di-hash dengan bcrypt/argon2
[ ] Token punya expiry yang masuk akal
[ ] Endpoint sensitif butuh autentikasi
[ ] Logout benar-benar invalidate token
[ ] Login/register punya rate limit + account lockout (setelah N gagal)
[ ] Tidak ada user enumeration (pesan error login sama untuk "user tidak ada" vs "password salah")

Otorisasi:
[ ] Setiap aksi punya pengecekan permission
[ ] User tidak bisa akses data user lain (IDOR)
[ ] Admin endpoint dilindungi role check

Input & Output:
[ ] Semua input user divalidasi sebelum diproses
[ ] Output di-escape sebelum ditampilkan
[ ] SQL query pakai parameterized / ORM
[ ] File upload divalidasi tipe dan ukurannya
[ ] Webhook provider verifikasi signature

Dependency:
[ ] Dependabot / Renovate aktif
[ ] Tidak ada security alert yang diabaikan
[ ] Lockfile di-commit (composer.lock / package-lock.json)

Environment:
[ ] .env tidak masuk Git
[ ] APP_DEBUG=false di production
[ ] Tidak ada credential hardcoded

Infrastruktur:
[ ] HTTPS aktif + HSTS
[ ] Security headers terpasang (CSP, nosniff, frame-options)
[ ] Rate limiting aktif di endpoint login/register
[ ] Error response tidak bocorkan info internal
```
