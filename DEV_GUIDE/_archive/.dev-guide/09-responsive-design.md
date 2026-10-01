# 📱 Responsive Design — Multi-Layar untuk Semua Device

> Panduan lengkap untuk membuat UI yang terlihat bagus di HP (320px), Tablet (768px), Laptop (1024px), hingga Desktop besar (1920px+).

---

## 📐 Breakpoint Standard yang Dipakai Industry

```css
/* Mobile-first approach — mulai dari kecil, naik ke besar */

/* Smartphone: 320px - 479px (default — TANPA media query)
   style dasar ditulis di sini, media query hanya MENAMBAH untuk layar lebih besar */

/* Tablet kecil / Landscape phone: 480px - 767px */
@media (min-width: 480px) { }

/* Tablet: 768px - 1023px */
@media (min-width: 768px) { }

/* Desktop: 1024px - 1365px */
@media (min-width: 1024px) { }

/* Desktop besar: 1366px - 1919px */
@media (min-width: 1366px) { }

/* Desktop very large: 1920px+ */
@media (min-width: 1920px) { }
```

**Standar yang paling banyak dipakai (bisa langsung copy):**
```
xs: 0px      (default, mobile)
sm: 480px    (landscape phone)
md: 768px    (tablet)
lg: 1024px   (desktop)
xl: 1366px   (desktop besar)
2xl: 1920px  (desktop sangat besar)
```

Kalau pakai **Tailwind CSS**, sudah built-in:
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

> **Penting:** standar di atas dan breakpoint Tailwind adalah dua sistem berbeda.
> Kalau kamu pakai Tailwind, ikuti breakpoint Tailwind — jangan dicampur dengan
> standar manual di atas, nanti layout jadi tidak konsisten.

---

## 🎯 Mobile-First Strategy (Cara yang Benar)

```css
/* ✅ BENAR — Mulai dari mobile, naik ke besar */
.container {
  padding: 16px;           /* default: mobile */
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    padding: 24px;         /* tablet & atas */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 32px;         /* desktop & atas */
  }
}

/* ❌ SALAH — Desktop-first (kuno, sulit di-maintain) */
.container {
  padding: 32px;
}

@media (max-width: 1024px) {
  .container {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
}
```

**Mengapa mobile-first?**
1. Lebih sederhana — cukup tambah styling saat ukuran naik
2. Performa lebih baik — mobile device tidak perlu load CSS desktop
3. Proses design lebih logis — pikirkan constraint terbatas dulu

---

## 📱 Layout Patterns untuk Berbagai Ukuran

### Pattern 1: Sidebar yang Hilang di Mobile

```html
<!-- HTML structure tetap sama di semua ukuran -->
<div class="layout">
  <aside class="sidebar">Navigasi</aside>
  <main class="content">Konten utama</main>
</div>
```

```css
/* Mobile: sidebar di bawah (full width) */
.layout {
  display: block;  /* atau flex, direction: column */
}

.sidebar {
  width: 100%;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.content {
  width: 100%;
  padding: 16px;
}

/* Tablet: sidebar di kiri */
@media (min-width: 768px) {
  .layout {
    display: grid;
    grid-template-columns: 250px 1fr;  /* sidebar 250px, content flex */
    gap: 24px;
  }

  .sidebar {
    width: auto;
    padding: 0;
    border-bottom: none;
    border-right: 1px solid #e5e7eb;
  }

  .content {
    width: auto;
    padding: 0;
  }
}
```

### Pattern 2: Grid yang Menyesuaikan Kolom

```html
<!-- Product Grid -->
<div class="product-grid">
  <div class="product-card">...</div>
  <div class="product-card">...</div>
  <div class="product-card">...</div>
  <div class="product-card">...</div>
</div>
```

```css
/* Mobile: 1 kolom */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;  /* 1 kolom, full width */
  gap: 16px;
  padding: 16px;
}

/* Tablet: 2 kolom */
@media (min-width: 640px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);  /* 2 kolom sama lebar */
    gap: 20px;
    padding: 20px;
  }
}

/* Desktop: 3 kolom */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);  /* 3 kolom */
    gap: 24px;
    padding: 32px;
  }
}

/* Desktop besar: 4 kolom, max width container */
@media (min-width: 1366px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);  /* 4 kolom */
    max-width: 1400px;  /* limit lebar maksimal */
    margin: 0 auto;
    padding: 40px;
  }
}
```

### Pattern 3: Navigation yang Berubah

```html
<!-- Mobile: Hamburger menu (hanya show icon) -->
<!-- Desktop: Horizontal navbar -->

<nav class="navbar">
  <div class="navbar-brand">Logo</div>
  
  <button class="navbar-toggle" id="menu-toggle" aria-label="Toggle menu">
    <!-- Ganti ☰ dengan 3 span bar (lihat 10-responsive-snippets.md) atau icon dari Lucide -->
    ☰
  </button>

  <ul class="navbar-menu" id="navbar-menu">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.navbar-brand {
  font-weight: bold;
  font-size: 20px;
}

/* Mobile: toggle button visible, menu hidden by default */
.navbar-toggle {
  display: block;  /* tombol hamburger */
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.navbar-menu {
  display: none;  /* hidden di mobile */
  list-style: none;
  padding: 0;
  flex-direction: column;
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e5e7eb;
}

.navbar-menu.active {
  display: flex;  /* show saat di-toggle */
}

.navbar-menu li {
  padding: 12px 20px;
  border-bottom: 1px solid #e5e7eb;
}

/* Desktop: toggle button hidden, menu always visible horizontal */
@media (min-width: 768px) {
  .navbar-toggle {
    display: none;  /* sembunyikan hamburger */
  }

  .navbar-menu {
    display: flex !important;  /* always show */
    position: static;
    flex-direction: row;  /* horizontal */
    border: none;
    background-color: transparent;
  }

  .navbar-menu li {
    border-bottom: none;
    padding: 0 24px;
  }
}
```

```javascript
// Toggle hamburger menu di mobile
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('navbar-menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// Close menu saat click di item (mobile user experience)
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
  });
});
```

---

## 💧 Fluid Typography (Font Size yang Menyesuaikan)

Daripada harus breakpoint terus-menerus, gunakan `clamp()`:

```css
/* Typography yang menyesuaikan ukuran viewport */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* min: 1.5rem, preferred: 4% dari width viewport, max: 3rem */
}

h2 {
  font-size: clamp(1.25rem, 3vw, 2rem);
}

p {
  font-size: clamp(0.875rem, 1.5vw, 1.125rem);
}

/* Padding/margin yang fluid */
.container {
  padding: clamp(16px, 4vw, 40px);
  /* min 16px, preferred 4vw, max 40px */
}
```

**Keuntungan `clamp()`:**
- Smooth scaling, tidak "jump" antar breakpoint
- Fewer media queries yang diperlukan
- Otomatis responsive tanpa perlu manual di setiap breakpoint

---

## 📏 Flexible Spacing System

```css
/* Spacing scale yang konsisten */
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}

/* Mobile spacing */
.card {
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

/* Tablet & up */
@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
    margin-bottom: var(--space-6);
  }
}

/* Desktop & up */
@media (min-width: 1024px) {
  .card {
    padding: var(--space-8);
    margin-bottom: var(--space-8);
  }
}
```

---

## 🖼️ Responsive Images

```html
<!-- Gambar dengan aspect ratio yang terjaga -->
<div class="image-container">
  <img 
    src="small.jpg"
    srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1024w, xlarge.jpg 1920w"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    alt="Deskripsi gambar"
  >
</div>
```

```css
/* Gambar yang scale dengan container */
.image-container {
  width: 100%;
  aspect-ratio: 16 / 9;  /* menjaga ratio */
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;  /* crop, bukan stretch */
}
```

---

## 📋 Form yang Responsive

```html
<!-- Mobile: form field penuh lebar, Desktop: 2 kolom -->
<form class="form-grid">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name">
  </div>

  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email">
  </div>

  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="4"></textarea>
  </div>
</form>
```

```css
/* Mobile: 1 kolom */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Desktop: 2 kolom kecuali textarea (full width) */
@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-group:nth-child(3) {
    grid-column: 1 / -1;  /* stretch ke full width */
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 16px;  /* prevent zoom on iOS */
}
```

---

## 🎬 Touch-Friendly pada Mobile

```css
/* Button yang mudah di-tap di mobile (min 44px x 44px) */
.btn {
  padding: 10px 16px;
  min-height: 44px;  /* touch target minimum */
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color var(--transition-fast);
}

/* Icon button */
.icon-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Spacing antara button di mobile */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 768px) {
  .button-group {
    flex-direction: row;
    gap: 8px;
  }
}
```

---

## 🔍 Testing Responsive — Tools Gratis

```
Chrome DevTools
├── Toggle device toolbar (Ctrl+Shift+M)
├── Test berbagai device: iPhone, Samsung Galaxy, iPad, Desktop
└── Resize custom untuk breakpoint tertentu

Firefox Developer Tools
├── Responsive Design Mode (Ctrl+Shift+M)
├── Grid overlay untuk lihat alignment
└── CSS Grid inspector

Websites:
├── responsivedesignchecker.com
├── screenfly.chromeextension.com
└── mobiledevicecheck.com
```

---

## ✅ Responsive Checklist Sebelum Deploy

```
Layout:
[ ] Tidak ada horizontal scroll di mobile
[ ] Sidebar/navigation menyesuaikan ukuran layar
[ ] Form field cukup besar untuk di-tap di mobile
[ ] Container tidak lebih dari 100% width di mobile

Tipografi:
[ ] Text readable di mobile (tidak terlalu kecil)
[ ] Font size naik di desktop (tidak stagnant)
[ ] Line length masuk akal (40-75 karakter per baris)

Gambar:
[ ] Gambar scale dengan container
[ ] Tidak ada gambar yang overflow
[ ] Menggunakan srcset untuk berbagai ukuran

Media Query:
[ ] Tested di: 320px (mobile terkecil), 375px (mobile umum), 768px (tablet), 1024px (Desktop), 1920px (Desktop besar)
[ ] Tidak ada hardcoded pixel width yang buat layout rusak
[ ] Fluid typography jika memungkinkan

Touch:
[ ] Button/link min 44px x 44px di mobile
[ ] Spacing cukup antara elemen yang bisa di-click
[ ] No hover-only content (tidak ada info yang hanya muncul di hover)

Accessibility:
[ ] prefers-reduced-motion dihormati — kurangi animasi untuk user yang sensitif
[ ] Viewport tidak di-lock (jangan pakai user-scalable=no)
[ ] Elemen full-screen pakai 100dvh, bukan 100vh (URL bar browser mobile menutupi)

Performance:
[ ] Mobile tidak load gambar ukuran besar desktop
[ ] CSS media query tidak membuat file terlalu besar
[ ] Tested di 4G connection (throttling di DevTools)
```

---

## 🎨 Contoh Real: Dashboard Responsive

```html
<div class="dashboard">
  <aside class="dashboard-sidebar">Sidebar</aside>
  <main class="dashboard-main">
    <header class="dashboard-header">Header</header>
    <section class="dashboard-content">
      <div class="stats-grid">
        <div class="stat-card">Stat 1</div>
        <div class="stat-card">Stat 2</div>
        <div class="stat-card">Stat 3</div>
        <div class="stat-card">Stat 4</div>
      </div>

      <div class="charts-grid">
        <div class="chart">Chart 1</div>
        <div class="chart">Chart 2</div>
      </div>
    </section>
  </main>
</div>
```

```css
/* Mobile */
.dashboard {
  display: flex;
  flex-direction: column;
}

.dashboard-sidebar {
  display: none;  /* hidden di mobile */
}

.dashboard-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 0 16px 16px 16px;
}

/* Tablet: 2 kolom stats, sidebar hidden masih */
@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: sidebar visible, 4 kolom stats, 2 kolom chart */
@media (min-width: 1024px) {
  .dashboard {
    flex-direction: row;
  }

  .dashboard-sidebar {
    display: block;
    width: 250px;
    border-right: 1px solid #e5e7eb;
    padding: 24px;
  }

  .dashboard-main {
    flex: 1;
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .charts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop besar: max width container */
@media (min-width: 1366px) {
  .dashboard-main {
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

---

## 📝 Kesimpulan: Rules of Thumb

```
1. Mobile-first — mulai dari 320px naik ke besar
2. Mobile adalah default, media query menambah style
3. Gunakan relative units: %, rem, em, vw (jarang hardcoded px)
4. Gunakan grid/flexbox, bukan float (sudah lama)
5. Clamp() untuk typography & spacing yang fluid
6. Aspect ratio untuk gambar dan video
7. Test di real device kalau bisa, bukan cuma DevTools
8. 44px minimum untuk touch target
9. Baca konten dari atas ke bawah (tidak ada sidebar kolom kiri di mobile)
10. Constraint adalah kreativitas — akses mobile → challenge terbesar
```
