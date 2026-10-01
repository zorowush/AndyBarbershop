# 🚀 10 — Copy-Paste Ready Responsive Components

> Kode siap pakai. Copy-paste langsung, tinggal sesuaikan warna & konten.

---

## 1️⃣ Responsive Hero Section (Hero Banner)

```html
<section class="hero">
  <div class="hero-content">
    <h1>Welcome to Our App</h1>
    <p>Build something amazing today</p>
    <button class="btn btn-primary">Get Started</button>
  </div>
  <div class="hero-image">
    <img src="hero.webp" alt="Hero image" width="600" height="400">
  </div>
</section>
```

```css
/* ⚠️ Variable di bawah dipakai SEMUA snippet di file ini —
   taruh sekali di global CSS, bukan di tiap snippet */
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --color-primary: #1a56db;
  --color-primary-hover: #1e429f;
}

.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  padding: var(--space-6);
  align-items: center;
}

.hero-content h1 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.hero-content p {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #6b7280;
  margin-bottom: var(--space-6);
  line-height: 1.6;
}

.hero-image {
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 12px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  min-height: 44px;
  min-width: 44px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

/* Tablet: image di sebelah */
@media (min-width: 768px) {
  .hero {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
    padding: var(--space-8);
  }

  .hero-image {
    order: 2;
  }

  .hero-content {
    order: 1;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero {
    gap: var(--space-12);
    padding: var(--space-12);
  }

  .hero-content h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }
}
```

---

## 2️⃣ Responsive Card Grid (Product/Blog)

```html
<section class="container">
  <h2>Our Products</h2>
  <div class="card-grid">
    <article class="card">
      <img src="product1.webp" alt="Product 1" width="300" height="300">
      <div class="card-content">
        <h3>Product Name</h3>
        <p>Short description</p>
        <button class="btn btn-secondary">Learn More</button>
      </div>
    </article>

    <article class="card">
      <!-- Same structure -->
    </article>

    <!-- ... more cards ... -->
  </div>
</section>
```

```css
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  padding: var(--space-6) 0;
}

.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.card-content {
  padding: var(--space-6);
}

.card h3 {
  font-size: 1.25rem;
  margin-bottom: var(--space-2);
}

.card p {
  color: #6b7280;
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

/* Tablet: 2 kolom */
@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

/* Desktop: 3 kolom */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}

/* Desktop besar: 4 kolom */
@media (min-width: 1366px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 3️⃣ Responsive Navigation (Mobile-Friendly)

```html
<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-brand">
      <a href="/">MyApp</a>
    </div>

    <button class="navbar-toggle" id="navbar-toggle" aria-label="Toggle navigation">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <ul class="navbar-menu" id="navbar-menu">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/products">Products</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </div>
</nav>
```

```css
.navbar {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.navbar-brand a {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}

/* Hamburger menu toggle — visible di mobile */
.navbar-toggle {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.navbar-toggle span {
  width: 24px;
  height: 3px;
  background-color: #111827;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Menu animation — hamburger to X */
.navbar-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(10px, 10px);
}

.navbar-toggle.active span:nth-child(2) {
  opacity: 0;
}

.navbar-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Mobile: menu dropdown (hidden) */
.navbar-menu {
  display: none;
  list-style: none;
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  flex-direction: column;
}

.navbar-menu.active {
  display: flex;
}

.navbar-menu li {
  border-bottom: 1px solid #f3f4f6;
}

.navbar-menu a {
  display: block;
  padding: 16px var(--space-4);
  color: #111827;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.navbar-menu a:hover {
  background-color: #f9fafb;
}

/* Desktop: menu horizontal (always visible) */
@media (min-width: 768px) {
  .navbar-toggle {
    display: none;
  }

  .navbar-menu {
    display: flex !important;
    position: static;
    flex-direction: row;
    background-color: transparent;
    border-bottom: none;
    gap: 0;
  }

  .navbar-menu li {
    border-bottom: none;
  }

  .navbar-menu a {
    padding: 8px 20px;
  }

  .navbar-menu a:hover {
    background-color: transparent;
    color: var(--color-primary);
  }
}
```

```javascript
const toggle = document.getElementById('navbar-toggle');
const menu = document.getElementById('navbar-menu');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  menu.classList.toggle('active');
});

// Close menu saat link di-click
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    menu.classList.remove('active');
  });
});

// Close menu saat resize ke desktop
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    toggle.classList.remove('active');
    menu.classList.remove('active');
  }
});
```

---

## 4️⃣ Responsive Two-Column Layout

```html
<div class="layout">
  <aside class="sidebar">
    <h3>Sidebar</h3>
    <ul>
      <li><a href="#section1">Section 1</a></li>
      <li><a href="#section2">Section 2</a></li>
    </ul>
  </aside>

  <main class="main-content">
    <h1>Main Content</h1>
    <p>Lorem ipsum dolor sit amet...</p>
  </main>
</div>
```

```css
.layout {
  display: block;
  max-width: 1400px;
  margin: 0 auto;
}

.sidebar {
  padding: var(--space-6);
  border-bottom: 1px solid #e5e7eb;
}

.sidebar h3 {
  margin-bottom: var(--space-4);
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: var(--space-3);
}

.sidebar a {
  color: var(--color-primary);
  text-decoration: none;
}

.main-content {
  padding: var(--space-6);
}

/* Tablet & up: sidebar di sebelah kiri */
@media (min-width: 768px) {
  .layout {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: var(--space-8);
  }

  .sidebar {
    padding: 0;
    border-bottom: none;
    border-right: 1px solid #e5e7eb;
    padding-right: var(--space-8);
    height: fit-content;
    position: sticky;
    top: 80px;  /* kalau ada navbar fixed 64px + gap 16px */
  }

  .main-content {
    padding: 0;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 280px 1fr;
    gap: var(--space-12);
  }
}
```

---

## 5️⃣ Responsive Table (Mobile-Friendly)

```html
<div class="table-wrapper">
  <table class="responsive-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Name">John Doe</td>
        <td data-label="Email">john@example.com</td>
        <td data-label="Status"><span class="badge badge-success">Active</span></td>
        <td data-label="Actions">
          <button class="btn-sm">Edit</button>
          <button class="btn-sm">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

```css
.table-wrapper {
  overflow-x: auto;
}

.responsive-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.responsive-table th {
  background-color: #f9fafb;
  padding: var(--space-4);
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}

.responsive-table td {
  padding: var(--space-4);
  border-bottom: 1px solid #e5e7eb;
}

.responsive-table tbody tr:hover {
  background-color: #f9fafb;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-success {
  background-color: #d1fae5;
  color: #047857;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-sm:hover {
  background-color: #f3f4f6;
}

/* Mobile: horizontal scroll atau card layout */
@media (max-width: 767px) {
  .responsive-table {
    font-size: 0.875rem;
  }

  .responsive-table thead {
    display: none;  /* hide header */
  }

  .responsive-table tbody,
  .responsive-table tr,
  .responsive-table td {
    display: block;
  }

  .responsive-table tr {
    margin-bottom: var(--space-6);
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .responsive-table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
    border: none;
    border-bottom: 1px solid #f3f4f6;
  }

  .responsive-table td:last-child {
    border-bottom: none;
  }

  .responsive-table td::before {
    content: attr(data-label);
    position: absolute;
    left: var(--space-4);
    font-weight: 600;
    text-align: left;
  }
}
```

---

## 6️⃣ Responsive Footer

```html
<footer class="footer">
  <div class="footer-container">
    <div class="footer-section">
      <h4>Product</h4>
      <ul>
        <li><a href="#">Features</a></li>
        <li><a href="#">Pricing</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Company</h4>
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">Blog</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Connect</h4>
      <ul>
        <li><a href="#">Twitter</a></li>
        <li><a href="#">LinkedIn</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; <span id="year"></span> MyApp. All rights reserved.</p>
    <!-- atau ganti dengan tahun dinamis: document.getElementById('year').textContent = new Date().getFullYear() -->
  </div>
</footer>
```

```css
.footer {
  background-color: #1f2937;
  color: #e5e7eb;
  margin-top: 80px;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
  padding: var(--space-8) var(--space-4);
}

.footer-section h4 {
  margin-bottom: var(--space-4);
  color: white;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: var(--space-3);
}

.footer-section a {
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding: var(--space-6) var(--space-4);
  text-align: center;
  color: #9ca3af;
}

/* Tablet: 2 kolom */
@media (min-width: 768px) {
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 kolom */
@media (min-width: 1024px) {
  .footer-container {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 📋 Checklist Implementasi Responsive

```
Saat membuat component baru:
[ ] Tested di mobile 320px
[ ] Tested di tablet 768px
[ ] Tested di desktop 1024px
[ ] Tidak ada horizontal scroll
[ ] Text readable tanpa zoom
[ ] Touch target min 44px
[ ] Gambar punya aspect-ratio
[ ] Tidak ada hardcoded width yang breaking layout
[ ] Spacing scale menggunakan variable
```
