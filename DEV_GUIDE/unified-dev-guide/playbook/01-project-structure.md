# 📁 01 — Struktur Folder Project

> Berlaku untuk: Native HTML/CSS/JS, Laravel, React/Next.js, Vue/Nuxt, Node.js/Express
> Skala: dari project kecil (landing page) sampai besar (monorepo tim)

---

## 📐 Konsep: Satu Struktur, Semua Skala

Struktur folder mengikuti **prinsip yang sama** di semua ukuran project. Yang berubah hanya kedalaman dan jumlah folder — bukan polanya.

```
Skala Kecil (landing page, tool sederhana)     Skala Besar (SaaS, tim engineering)
├── Minimal — semua di src/                    ├── Monorepo — apps/ + packages/
├── Tanpa Docker, tanpa CI                     ├── Docker + CI/CD + Observability
├── tests/ optional                             ├── tests/ wajib + E2E
└── 1 developer                                 └── 2-10 developer paralel
```

**Aturan emas:**
- Mulai dengan struktur minimal di bawah — jangan over-engineer project kecil
- **Upgrade ke struktur penuh saat** project mulai: dipakai user lain, perlu tim, butuh deployment production
- Struktur penuh = struktur minimal + folder tambahan, **bukan struktur yang berbeda**

---

## 🗂️ Native HTML/CSS/JS (No Framework)

```
project-root/
├── assets/
│   ├── css/
│   │   ├── base/
│   │   │   ├── reset.css        ← CSS reset / normalize
│   │   │   ├── variables.css    ← CSS custom properties
│   │   │   └── typography.css
│   │   ├── components/
│   │   │   ├── button.css
│   │   │   ├── card.css
│   │   │   └── modal.css
│   │   ├── layouts/
│   │   │   ├── header.css
│   │   │   ├── sidebar.css
│   │   │   └── footer.css
│   │   └── main.css             ← Import semua, jangan tulis style di sini
│   ├── js/
│   │   ├── core/
│   │   │   ├── api.js           ← Semua fetch/axios ke sini
│   │   │   ├── auth.js
│   │   │   └── router.js
│   │   ├── components/
│   │   │   ├── modal.js
│   │   │   └── toast.js
│   │   ├── pages/
│   │   │   ├── dashboard.js
│   │   │   └── login.js
│   │   ├── utils/
│   │   │   ├── formatter.js     ← Format tanggal, angka, dll
│   │   │   ├── validator.js
│   │   │   └── storage.js      ← Wrapper localStorage/sessionStorage (hanya data NON-sensitif: theme, draft; JANGAN untuk token)
│   │   └── main.js
│   └── images/
│       ├── icons/               ← SVG icons
│       └── illustrations/
├── pages/                       ← HTML per halaman
│   ├── dashboard.html
│   └── login.html
├── index.html
├── .env.example                 ← Template env, JANGAN commit .env asli
└── (skala besar: tambah .github/, docs/, scripts/, Dockerfile)
```

---

## 🐘 Laravel (Backend / Fullstack)

```
laravel-project/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/             ← Controller untuk API
│   │   │   └── Web/             ← Controller untuk view
│   │   ├── Middleware/
│   │   └── Requests/            ← Form Request validation — WAJIB pakai ini
│   ├── Models/
│   ├── Services/                ← ⭐ Business logic di sini, bukan di Controller
│   ├── Repositories/            ← Abstraksi query database
│   ├── Traits/
│   └── Exceptions/
│       └── Handler.php
├── config/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── resources/
│   ├── views/
│   │   ├── layouts/             ← Layout utama (app.blade.php)
│   │   ├── components/          ← Blade components
│   │   └── pages/
│   ├── js/
│   └── css/
├── routes/
│   ├── api.php                  ← Semua route API
│   ├── web.php                  ← Route web/view
│   └── channels.php
├── tests/
│   ├── Feature/
│   └── Unit/
├── docs/                        ← (skala besar) ADR, arsitektur
│   └── adr/
├── scripts/                     ← (skala besar) deploy.sh, backup.sh
├── docker/                      ← (skala besar) Dockerfile, nginx.conf
├── .github/                     ← (skala besar) workflows, PR template
├── .env
├── .env.example                 ← Commit ini ke Git
└── README.md
```

**Aturan wajib Laravel:**
- Controller hanya boleh memanggil Service, tidak boleh ada logika bisnis
- Validasi HARUS pakai `FormRequest`, bukan di Controller
- Query database lewat Repository atau Eloquent langsung di Model (hindari raw query)

---

## 🟢 Node.js / Express (API Server)

```
express-api/
├── src/
│   ├── config/                  ← Konfigurasi (db, env, constants)
│   ├── controllers/             ← Handle request → panggil service → response
│   ├── services/                ← ⭐ Business logic — tidak tau soal HTTP
│   ├── repositories/            ← Query database (abstraksi data access)
│   ├── models/                  ← Definisi schema & types
│   ├── middlewares/             ← Auth, validation, error handler, rate limit
│   │   └── errorHandler.js
│   ├── validations/             ← Schema validasi (zod / joi)
│   ├── utils/                   ← Fungsi murni (formatter, logger)
│   ├── routes/                  ← Definisi endpoint (router express)
│   │   ├── index.js             ← Register semua router
│   │   └── user.routes.js
│   └── app.js                   ← Inisialisasi express + middleware
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                        ← (skala besar)
├── scripts/                     ← (skala besar)
├── docker/                      ← (skala besar)
├── .github/                     ← (skala besar)
├── .env
├── .env.example                 ← Commit ini
├── package.json
└── README.md
```

**Aturan wajib Node.js:**
- Controller tipis — hanya parse request, panggil service, return response
- Business logic di Service layer, bukan di controller atau route
- Validasi dengan library (zod/joi), bukan if-else manual
- Error handling via centralized middleware, bukan try-catch per route
- TypeScript untuk skala menengah ke atas

---

## ⚛️ React / Next.js

```
nextjs-project/
├── src/
│   ├── app/                     ← Next.js 13+ App Router
│   │   ├── (auth)/              ← Route group (tidak masuk URL)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                 ← API Routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                  ← Komponen atomic (Button, Input, Modal)
│   │   ├── layouts/             ← Header, Sidebar, Footer
│   │   └── features/            ← Komponen per fitur (AuthForm, ProductCard)
│   ├── hooks/                   ← Custom hooks (useAuth, useDebounce)
│   ├── lib/
│   │   ├── api.ts               ← API client (axios/fetch wrapper)
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── locales/                 ← (skala besar) i18n translations
│   │   ├── id/
│   │   └── en/
│   ├── store/                   ← State management (Zustand / Redux)
│   ├── types/                   ← TypeScript interfaces & types
│   │   ├── api.ts
│   │   └── models.ts
│   └── styles/
│       ├── globals.css
│       └── variables.css
├── tests/                       ← (skala besar) unit + E2E
│   ├── unit/
│   └── e2e/
├── public/
├── docs/                        ← (skala besar)
├── scripts/                     ← (skala besar)
├── .github/                     ← (skala besar)
├── .env.local                   ← Jangan di-commit
├── .env.example                 ← Commit ini
├── next.config.js
└── tsconfig.json
```

---

## 💚 Vue / Nuxt

```
nuxt-project/
├── app.vue                      ← Root component (Nuxt 3)
├── assets/
│   ├── css/
│   │   ├── variables.css        ← Design tokens
│   │   └── main.css
│   └── images/
├── components/                  ← Auto-import (Nuxt)
│   ├── ui/                      ← Atomic (Button, Input, Modal)
│   ├── layouts/                 ← Header, Sidebar, Footer
│   └── features/                ← Per fitur (ProductCard, AuthForm)
├── composables/                 ← Auto-import composables (useAuth, useFetch)
├── layouts/                     ← Layout global (default.vue, auth.vue)
├── middleware/                  ← Route guards (auth, guest, admin)
├── pages/                       ← File-based routing
│   ├── index.vue
│   ├── login.vue
│   └── dashboard/
│       └── index.vue
├── plugins/                     ← Third-party plugin init (i18n, toast)
├── public/
├── server/                      ← (skala besar) API routes di Nuxt
│   ├── api/
│   └── middleware/
├── stores/                      ← Pinia state management
├── types/                       ← TypeScript types (Nuxt 3)
├── utils/                       ← Fungsi murni (formatter, validator)
├── locales/                     ← (skala besar) i18n translations
│   ├── id/
│   └── en/
├── tests/                       ← (skala besar)
├── docs/                        ← (skala besar)
├── scripts/                     ← (skala besar)
├── .github/                     ← (skala besar)
├── .env
├── .env.example                 ← Commit ini
├── nuxt.config.ts
└── tsconfig.json
```

**Catatan Vue/Nuxt:**
- Nuxt 3 auto-import komponen, composables, dan utils — folder naming jadi krusial
- `composables/` untuk logika reusable (bukan `hooks/` — konvensi Nuxt)
- `pages/` auto-generated routes — jangan buat router manual

---

## 🏢 Monorepo (Skala Besar — Tim / Multi-app)

Gunakan monorepo saat: frontend + backend dalam 1 repo, ada shared package, atau tim > 3 orang.

```
my-saas/
├── apps/                        ← Aplikasi yang di-deploy
│   ├── web/                     ← Frontend (Next.js / Nuxt)
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── api/                     ← Backend (Laravel / Express)
│   │   ├── app/
│   │   ├── routes/
│   │   └── package.json
│   └── admin/                   ← Admin panel (kalau ada)
│       ├── src/
│       └── package.json
├── packages/                    ← Shared code (bukan app)
│   ├── ui/                      ← Design system / komponen bersama
│   ├── types/                   ← Shared TypeScript types
│   └── utils/                   ← Fungsi bersama
├── docker/                      ← Dockerfile, compose per environment
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   └── nginx.conf
├── docs/
│   ├── adr/                     ← Architecture Decision Records
│   └── architecture.md
├── scripts/                     ← Build, deploy, seed, backup
├── .github/
│   ├── workflows/               ← CI/CD pipelines
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── package.json                 ← Root: workspace config (pnpm/turbo)
├── turbo.json                   ← Task orchestration (kalau pakai Turborepo)
├── .env.example
├── .gitignore
└── README.md
```

**Alasan pakai monorepo:**
```
✅ Satu PR bisa ubah frontend + backend sekaligus
✅ Shared types tanpa publish ke npm registry
✅ Satu CI pipeline untuk semua app
✅ Atomic change — refactor API + update frontend dalam 1 commit
❌ JANGAN pakai kalau solo & project kecil — over-engineering
```

**Jangan monorepo saat:**
- Project satu app saja (web atau api doang)
- Solo developer & project < 3 bulan
- Team masih eksplorasi, struktur berubah terus

---

## 🔑 Aturan Universal Struktur Folder

1. **Satu folder = satu tanggung jawab** — jangan campur component dengan halaman
2. **`utils/` hanya boleh berisi fungsi murni** — tidak ada state, tidak ada side effect
3. **`constants/` atau `config/`** — semua angka dan string magic di sini, bukan inline di kode
4. **File `index.js/ts`** — gunakan untuk re-export agar import lebih bersih
5. **Jangan buat folder terlalu dalam** — maksimal 4 level kedalaman
6. **Pisahkan `dev dependency` dan `dependency`** — penting untuk production build
7. **Struktur harus mencerminkan domain/bisnis** — fitur yang berkaitan didekatkan (`features/`), bukan dipisah per technical layer
8. **Jangan buat folder untuk 1 file** — kalau cuma ada 1 file di folder, naikkan ke parent

---

## 🆚 Skala Kecil vs Skala Besar — Ringkasan

```
┌────────────────────────────┬──────────────────────┬────────────────────────────┐
│        Aspek               │   Skala Kecil        │   Skala Besar              │
├────────────────────────────┼──────────────────────┼────────────────────────────┤
│ Struktur repo              │ Single app           │ Monorepo (apps/ + packages/)│
│ i18n                       │ Satu bahasa (ID)     │ locales/ + i18n manager     │
│ Testing                    │ Unit test inti       │ Unit + Integration + E2E    │
│ State management           │ useState / ref       │ Zustand / Pinia + Query     │
│ Environment                │ 1-2 env              │ dev / staging / prod        │
│ CI/CD                      │ Manual / simple      │ Full pipeline + review app  │
│ Observability              │ Log file + Sentry    │ Grafana + Loki + Alerting   │
│ Database                   │ SQLite / shared DB   │ PostgreSQL + Redis + Queue  │
│ Design system              │ Inline components    │ packages/ui shared          │
└────────────────────────────┴──────────────────────┴────────────────────────────┘
```

---

## 📝 Naming Convention (Berlaku Universal)

| Konteks | Konvensi | Contoh |
|--------|---------|--------|
| File komponen React/Vue | PascalCase | `UserCard.tsx` |
| File utility/helper | camelCase | `formatDate.js` |
| File CSS module | camelCase | `userCard.module.css` |
| Test file | `*.test.ts` / `*.spec.ts` | `formatDate.test.ts` |
| Folder | kebab-case | `user-management/` |
| Variabel JS | camelCase | `userName` |
| Konstanta | UPPER_SNAKE | `MAX_FILE_SIZE` |
| Class CSS | BEM / kebab | `btn-primary`, `card__title` |
| Database tabel | snake_case plural | `user_profiles` |
| Kolom DB | snake_case | `created_at` |
| Index DB | `idx_{tabel}_{kolom}` | `idx_users_email` |
| API endpoint | kebab-case | `/api/user-profiles` |
| i18n key | camelCase / dot notation | `common.welcomeMessage` |
| Enum / Role | PascalCase (JS) / snake (DB) | `UserRole.ADMIN` / `role: 'admin'` |
| Branch Git | kebab-case | `feature/user-auth` |
| Commit message | Conventional Commits | `feat(auth): add login` |
| Docker image | kebab-case | `my-app-web`, `my-app-api` |
