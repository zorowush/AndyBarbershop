# 🎨 02 — Frontend Best Practice

> UI/UX, Performa, Aksesibilitas, CSS, JavaScript

---

## 🎨 UI/UX — Desain yang Tidak Terlihat "Buatan AI"

### Prinsip Dasar
- **Konsistensi** — spacing, warna, font harus dari sistem (jangan hardcode pixel random)
- **Hierarchy** — mata user harus tau mana yang paling penting dalam 3 detik
- **Feedback** — setiap aksi user harus ada respons visual (loading, success, error)
- **Affordance** — tombol harus terlihat bisa diklik, input harus terlihat bisa diisi

### Design Token System (Wajib Pakai)

```css
/* variables.css — SATU sumber kebenaran untuk semua nilai visual */
:root {
  /* Color Palette */
  --color-primary: #1a56db;
  --color-primary-hover: #1e429f;
  --color-secondary: #6b7280;
  --color-danger: #ef4444;
  --color-success: #10b981;
  --color-warning: #f59e0b;

  /* Neutral */
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --color-border: #e5e7eb;
  --color-text: #111827;
  --color-text-muted: #6b7280;

  /* Spacing Scale (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;

  /* Typography */
  --font-sans: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);

  /* Transition */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

### Font Gratis yang Tidak Generik (Google Fonts)
```
Display   : "Sora", "Outfit", "DM Serif Display", "Playfair Display"
Body      : "Plus Jakarta Sans", "DM Sans", "Nunito", "Manrope"
Mono      : "JetBrains Mono", "Fira Code"
```
> **Tips**: Inter dan Roboto bukan font buruk — tapi karena terlalu umum, UI kamu akan terasa mirip dengan banyak aplikasi lain. Untuk tampilan yang lebih distinct, coba font di atas dulu.

---

## ⚡ Performa Web

### Critical Rendering Path
```html
<!-- Di <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdn.example.com">

<!-- CSS kritis inline atau load pertama -->
<style>/* above-the-fold styles */</style>

<!-- Script non-kritis: defer atau async -->
<script src="app.js" defer></script>
```

### Gambar
```html
<!-- Selalu tentukan width & height untuk mencegah layout shift (CLS) -->
<!-- Gambar di bawah fold: lazy load -->
<img 
  src="hero.webp" 
  width="800" 
  height="600" 
  alt="Deskripsi yang bermakna"
  loading="lazy"
  decoding="async"
>

<!-- Format modern: WebP > JPEG/PNG -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="fallback">
</picture>
```

### CSS Performance
```css
/* ✅ Gunakan transform & opacity untuk animasi (GPU accelerated) */
.card:hover {
  transform: translateY(-4px);
  opacity: 0.9;
}

/* ❌ Hindari menganimasi properti yang trigger reflow */
.card:hover {
  margin-top: -4px; /* BAD — trigger layout */
  width: 105%;      /* BAD — trigger layout */
}

/* Hint ke browser apa yang akan berubah */
.animated-element {
  will-change: transform;
}
```

### JavaScript Performance
```javascript
// ✅ Debounce untuk event yang sering trigger (resize, input)
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce((query) => {
  fetchResults(query);
}, 400);

// ✅ Throttle untuk scroll event
function throttle(fn, limit = 100) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

// ✅ Intersection Observer untuk lazy load / infinite scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMoreContent();
    }
  });
}, { threshold: 0.1 });

observer.observe(document.querySelector('#sentinel'));
```

---

## 📱 Responsive Design

```css
/* Mobile-first approach — mulai dari kecil */
.container {
  padding: var(--space-4);
}

/* Breakpoints yang umum dipakai */
/* sm: 640px | md: 768px | lg: 1024px | xl: 1280px */

@media (min-width: 768px) {
  .container {
    padding: var(--space-8);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* Fluid typography — ukuran font menyesuaikan viewport */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

---

## ♿ Aksesibilitas (Wajib, Bukan Opsional)

```html
<!-- Label wajib ada untuk form input -->
<label for="email">Email</label>
<input id="email" type="email" required>

<!-- Tombol icon harus punya label -->
<button aria-label="Hapus item">
  <svg>...</svg>
</button>

<!-- Konten yang loading -->
<div aria-live="polite" aria-busy="true">Memuat data...</div>

<!-- Skip navigation untuk keyboard user -->
<a href="#main-content" class="skip-link">Langsung ke konten</a>

<!-- Focus visible — JANGAN hapus outline tanpa gantinya -->
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## 🏗️ Struktur HTML Semantik

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Deskripsi halaman max 160 karakter">
  <title>Judul Halaman | Nama Aplikasi</title>
  <link rel="canonical" href="https://example.com/halaman">
</head>
<body>
  <header role="banner">
    <nav aria-label="Navigasi utama">...</nav>
  </header>

  <main id="main-content">
    <section aria-labelledby="hero-heading">
      <h1 id="hero-heading">Judul Utama</h1>
    </section>
    
    <article>...</article>
    <aside aria-label="Sidebar">...</aside>
  </main>

  <footer role="contentinfo">...</footer>
</body>
</html>
```

---

## 🧩 Komponen UI Siap Pakai — SweetAlert2

**SweetAlert2** adalah library popup/modal/dialog yang accessible (WAI-ARIA), responsive, dan bisa dikustomisasi penuh. Gantikan `alert()`, `confirm()`, `prompt()` native dengan tampilan yang profesional.

```bash
npm install sweetalert2
```

```javascript
import Swal from 'sweetalert2';

// Toast notifikasi (sukses, error, warning)
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

// Sukses
Toast.fire({ icon: 'success', title: 'Data berhasil disimpan' });

// Error
Toast.fire({ icon: 'error', title: 'Gagal menyimpan data' });

// Konfirmasi sebelum aksi destruktif
Swal.fire({
  title: 'Hapus produk ini?',
  text: 'Data stok dan riwayat penjualan terkait juga akan dihapus.',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#ef4444',
  confirmButtonText: 'Ya, hapus!',
  cancelButtonText: 'Batal',
}).then((result) => {
  if (result.isConfirmed) {
    deleteProduct(id);
    Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
  }
});

// Form dialog
Swal.fire({
  title: 'Tambah Kategori',
  html: '<input id="name" class="swal2-input" placeholder="Nama kategori">',
  confirmButtonText: 'Simpan',
  preConfirm: () => Swal.getPopup().querySelector('#name').value,
}).then((result) => {
  if (result.value) {
    createCategory(result.value);
  }
});
```

**Kenapa SweetAlert2?**
- ✅ Accessible — WAI-ARIA compliant, keyboard navigable
- ✅ Responsive — bekerja di mobile, tablet, desktop
- ✅ Framework-agnostic — vanilla JS, React, Vue, Angular semua bisa
- ✅ Customizable — ubah warna, icon, layout, animasi
- ✅ ringan — ~25KB gzipped
- ✅ Open source, maintenance aktif, dipakai luas di produksi

> **Untuk project React:** package `sweetalert2-react-content`<br>
> **Untuk project Vue:** `VueSweetalert2`

---

## 🌙 Dark Mode Token System

Gunakan **nama token yang sama** seperti di `variables.css` — yang berbeda hanya nilainya. Ini menjaga "satu sumber kebenaran" tetap berlaku.

```css
/* Light mode — nilai default di :root (variables.css) */
:root {
  --color-bg: #f8fafc;
  --color-bg-subtle: #f1f5f9;
  --color-border: #e2e8f0;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-primary: #2563eb;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #0284c7;
}

/* Dark mode — HARUS didesain, bukan sekadar invert */
[data-theme="dark"], .dark {
  --color-bg: #020617;
  --color-bg-subtle: #1e293b;
  --color-border: #334155;
  --color-text: #f8fafc;
  --color-text-muted: #94a3b8;
  --color-primary: #3b82f6;       /* sedikit lebih terang di dark */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #38bdf8;
}
```

**Karena token sama, komponen tidak perlu berubah:**

```css
/* Komponen cukup pakai token — otomatis adaptif */
.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

/* Switch tema cukup ganti data-theme di <html> */
document.documentElement.setAttribute('data-theme', 'dark');
```

> **Catatan**: Kalau kamu pakai shadcn/ui (memakai naming `--background`, `--foreground`, dll), ikuti konvensi library-nya — yang penting konsisten di seluruh project, bukan nama spesifiknya.

---

## 🌐 Internationalization (i18n)

Untuk aplikasi yang melayani multi-bahasa, siapkan dari awal. Jangan tambah setelah 100+ halaman.

### Library

```bash
# React
npm install react-i18next i18next

# Vue
npm install vue-i18n

# Vanilla JS
npm install i18next
```

### Struktur File

```
src/
├── locales/
│   ├── id/
│   │   ├── common.json      ← Tombol, label, navigasi
│   │   ├── auth.json        ← Halaman login/register
│   │   ├── validation.json  ← Pesan error validasi
│   │   └── dashboard.json
│   ├── en/
│   │   ├── common.json
│   │   ├── auth.json
│   │   └── ...
│   └── i18n.ts              ← Init i18next
```

### Konfigurasi Dasar (React i18next)

```typescript
// locales/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import idCommon from './id/common.json';
import enCommon from './en/common.json';

i18n.use(initReactI18next).init({
  resources: {
    id: { common: idCommon },
    en: { common: enCommon },
  },
  lng: 'id',              // default bahasa
  fallbackLng: 'id',
  ns: ['common'],
  interpolation: {
    escapeValue: false,   // React sudah otomatis escape
  },
});
```

### Penggunaan di Komponen

```typescript
import { useTranslation } from 'react-i18next';

function WelcomeCard({ name }) {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('welcome', { name })}</h1>
      <p>{t('description')}</p>
    </div>
  );
}

// JSON: locales/id/common.json
// { "welcome": "Selamat datang, {{name}}!", "description": "Kelola data produk dengan mudah" }
// JSON: locales/en/common.json
// { "welcome": "Welcome, {{name}}!", "description": "Manage products easily" }
```

### Aturan i18n

```
✅ Gunakan namespace untuk organize (common, auth, validation)
✅ Jangan gabung semua string dalam 1 file besar
✅ Parametrisasi dynamic value — jangan concat string
✅ Fallback ke bahasa utama untuk key yang belum diterjemahkan
✅ Gunakan tool seperti Lokalise / POEditor untuk manage translation

❌ Jangan hardcode teks di komponen — harus lewat t()
❌ Jangan buat nested key terlalu dalam (maks 2 level)
❌ Jangan lupa handle RTL untuk bahasa Arab
```

### Checklist i18n

```
[ ] Semua teks user-facing lewat t() / $t()
[ ] Format tanggal & angka pakai Intl API (locale-aware)
[ ] Direction (LTR/RTL) di-handle untuk semua layout
[ ] Bahasa default sebagai fallback
[ ] Dynamic value pakai interpolation, bukan concat
[ ] Test dengan ganti bahasa di semua halaman
```

---

## 📊 Pola Dashboard yang Benar

```
Struktur dashboard yang baik:
1. Page header (judul, deskripsi, primary action)
2. Stats cards (angka penting dengan konteks)
3. Chart atau insight (jika memang berguna)
4. Recent activity
5. Table ringkas atau daftar prioritas

Stats card yang benar:
┌─────────────────────┐
│ Total Produk        │
│ 1.248               │  ← angka besar, mudah di-scan
│ +32 produk bulan ini│  ← konteks perubahan
└─────────────────────┘

Dashboard yang buruk:
❌ Terlalu banyak chart tanpa konteks
❌ Semua angka tanpa penjelasan
❌ Tidak ada aksi lanjutan
❌ Data dummy yang tidak realistis
❌ Setiap metric dijadikan card tersendiri
```

---

## 📝 Format Data yang Konsisten

```
Selalu format data dengan cara yang sama di seluruh aplikasi:

Tanggal     : 31 Mei 2025 (bukan 2025-05-31 atau 31/05/25)
Jam         : 08.30 WIB (bukan 08:30 atau 8.30)
Angka besar : 1.250 (bukan 1250 atau 1,250)
Mata uang   : Rp 250.000 (bukan Rp250000 atau IDR 250,000)
Persentase  : 82% (bukan 0.82 atau 82,00%)
Data kosong : — (em dash, bukan null, undefined, atau kosong)
Status      : gunakan badge, bukan teks plain
```

```javascript
// Utility formatter — simpan di utils/formatter.js
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  // Output: Rp 250.000

export const formatDate = (date) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
  // Output: 31 Mei 2025

export const formatNumber = (num) =>
  new Intl.NumberFormat('id-ID').format(num);
  // Output: 1.250
```

---

## 💬 Microcopy yang Baik

Microcopy = teks kecil di UI: placeholder, helper text, label, toast, empty state.

```
❌ Buruk (generik, tidak membantu):
Placeholder : "Enter your name"
Error       : "Invalid input"
Empty state : "No data found"
Toast       : "Success"
Delete confirm: "Are you sure?"

✅ Baik (spesifik, actionable, kontekstual):
Placeholder : "Cari nama produk, SKU, atau kategori..."
Error       : "SKU sudah digunakan produk lain. Gunakan SKU yang berbeda."
Empty state : "Belum ada produk. Tambahkan produk pertama atau impor dari Excel."
Toast       : "Data produk berhasil disimpan."
Delete confirm: "Hapus produk ini? Data stok dan riwayat penjualan terkait juga akan dihapus."

Panduan microcopy:
- Gunakan bahasa yang sesuai dengan pengguna (Indonesia untuk aplikasi lokal)
- Jelaskan konsekuensi dari aksi berisiko
- Tunjukkan langkah selanjutnya di empty state
- Sebutkan objek yang spesifik, bukan generik
- Hindari bahasa marketing di aplikasi admin
```

---

## ✅ Checklist Frontend Sebelum Deploy

```
Performa:
[ ] Gambar sudah WebP / AVIF dan ada width/height
[ ] CSS & JS sudah diminify
[ ] Font sudah preconnect
[ ] Tidak ada console.log yang tertinggal
[ ] Lighthouse score > 80 semua kategori

UI/UX:
[ ] Semua state sudah ada: empty, loading, error, success
[ ] Responsive di mobile, tablet, desktop
[ ] Dark mode sudah dihandle (jika ada)
[ ] Tidak ada text overflow di layar kecil
[ ] Format data konsisten (tanggal, angka, mata uang)
[ ] Microcopy menggunakan bahasa yang natural dan spesifik

Aksesibilitas:
[ ] Semua form punya label
[ ] Warna teks memenuhi contrast ratio (WCAG AA: 4.5:1)
[ ] Bisa diakses dengan keyboard saja
[ ] Screen reader friendly
[ ] Aksi destructive punya konfirmasi dialog
```
