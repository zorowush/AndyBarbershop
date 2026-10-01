# 🛠️ 08 — Tooling Gratis untuk Fullstack Developer

> Semua tools di sini gratis (free tier atau open source). Dipilih berdasarkan yang benar-benar dipakai developer profesional.

---

## 💻 Code Editor & Extensions (VS Code)

### Extensions Wajib
```
ESLint                    ← Deteksi error JS/TS secara realtime
Prettier                  ← Format kode otomatis
GitLens                   ← Git history langsung di editor
Auto Rename Tag           ← Rename HTML tag pembuka & penutup sekaligus
Path Intellisense         ← Autocomplete path file
Error Lens                ← Error ditampilkan inline di kode
Thunder Client            ← REST client (pengganti Postman) langsung di VS Code
DotENV                    ← Syntax highlight untuk .env file
Better Comments           ← Komentar dengan warna berbeda
Tailwind CSS IntelliSense ← (jika pakai Tailwind)
PHP Intelephense          ← (jika pakai PHP/Laravel)
```

### Settings VS Code yang Direkomendasikan
```json
// .vscode/settings.json (commit ini ke project)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "editor.insertSpaces": true,
  "editor.rulers": [80, 120],
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## 🎨 Design & UI Resources (Gratis)

### Font
```
Google Fonts          → fonts.google.com       ← Ribuan font gratis
Fontshare             → fontshare.com          ← Font premium gratis untuk dev
```

### Icons
```
Lucide                → lucide.dev             ← Clean, konsisten (React/Vue ready)
Heroicons             → heroicons.com           ← Tailwind team, kualitas premium
Phosphor Icons        → phosphoricons.com       ← Fleksibel, banyak gaya
Tabler Icons          → tabler.io/icons        ← 5000+ icon SVG gratis
Iconify               → iconify.design         ← 200,000+ icon dari semua library
Feather Icons         → feathericons.com        ← Minimal, elegant
Simple Icons          → simpleicons.org         ← Logo brand & teknologi (React, Docker, GitHub, Figma, dll.)
Devicon               → devicon.dev              ← Ikon bahasa pemrograman & tools (Python, JS, MySQL, dll.)
Font Awesome          → fontawesome.com         ← Ikon gratis, opsi pro untuk koleksi lebih lengkap
Icons8                → icons8.com              ← 200,000+ ikon, ilustrasi, foto, dengan style konsisten
```

### Ilustrasi & Gambar
```
Undraw                → undraw.co              ← Ilustrasi SVG gratis, ganti warna
Storyset              → storyset.com            ← Ilustrasi animasi gratis
Unsplash              → unsplash.com           ← Foto gratis berkualitas tinggi
Pexels                → pexels.com             ← Foto & video gratis
SVGRepo               → svgrepo.com            ← 500,000+ SVG gratis
```

### Warna & Gradient
```
Coolors               → coolors.co             ← Generate color palette
Realtime Colors       → realtimecolors.com     ← Preview warna langsung di UI
Shadcn Themes         → ui.shadcn.com/themes   ← Tema siap pakai
Open Color            → yeun.github.io/open-color ← Palette untuk developer
Tailwind Color        → tailwindcss.com/docs/customizing-colors
```

### UI Component Reference
```
Shadcn/ui             → ui.shadcn.com          ← Komponen React copy-paste
Flowbite              → flowbite.com           ← Komponen Tailwind
DaisyUI               → daisyui.com            ← Plugin Tailwind dengan komponen
Headless UI           → headlessui.com         ← Komponen accessible tanpa style
Aceternity UI         → ui.aceternity.com      ← Animasi & efek keren
Magic UI              → magicui.design         ← Animated components
21st.dev              → 21st.dev               ← Library komponen buatan komunitas
ReactBits             → reactbits.dev          ← Koleksi komponen animasi & kreatif React
Uiverse              → uiverse.io             ← Pustaka UI open-source terbesar dari komunitas (7,000+ elemen), copy-paste HTML/CSS/Tailwind/React/Figma, MIT license
```

---

## 🔧 Development Tools

### API Development
```
Thunder Client (VS Code ext)  ← REST client di dalam VS Code (gratis)
Hoppscotch                    → hoppscotch.io  ← Postman alternatif web-based
Bruno                         ← API client open source, file-based (git-friendly)
```

### Database
```
TablePlus             ← GUI database, free tier cukup untuk dev
DBeaver               ← Alternatif, fully free, banyak DB support
```

### Deployment & Hosting (Free Tier)
```
Vercel                → vercel.com             ← Frontend/Next.js (gratis unlimited)
Netlify               → netlify.com            ← Static site & functions
Railway               → railway.app            ← Backend + database (5$ credit/bulan)
Render                → render.com             ← Backend + database gratis
Fly.io                ← Backend, lebih fleksibel
Neon                  → neon.tech              ← PostgreSQL serverless (free tier)
Supabase              → supabase.com           ← PostgreSQL + Auth + Storage (gratis)
Cloudflare Pages      ← Static hosting, CDN global gratis
```

### Monitoring & Error Tracking
```
Sentry (free tier)    → sentry.io              ← Error tracking 5k error/bulan gratis
Posthog (free tier)   → posthog.com            ← Analytics + Feature flags
Umami                 ← Self-hosted analytics, open source
```

---

## 📦 Package/Library Rekomendasi

### JavaScript / TypeScript
```
Validasi              : zod, yup, valibot
Date                  : date-fns (ringan) > moment.js (besar)
HTTP Client           : axios, ky
State (React)         : zustand (simpel), jotai, redux-toolkit
State (Vue)           : pinia
Data fetching         : TanStack Query (React Query), SWR
Form                  : React Hook Form, Formik
Table                 : TanStack Table
Animasi               : Framer Motion (React), GSAP (free)
Chart                 : Recharts, Chart.js, ApexCharts
Dialog / Modal        : SweetAlert2 (universal), Radix Dialog (React)
Notifikasi            : react-hot-toast, sonner, SweetAlert2 toast
i18n                  : react-i18next, vue-i18n, i18next
Plugin/Component      : Preline (Tailwind UI kit, gratis), Headless UI
```

### PHP / Laravel
```
Auth                  : Laravel Sanctum (API), Laravel Breeze (starter)
API Docs              : Scribe (gratis, auto-generate dari controller)
Permission            : Spatie Laravel Permission
Media                 : Spatie Laravel Media Library
Excel/PDF             : Laravel Excel, DomPDF
Schedule              : Laravel Scheduler (built-in)
Queue                 : Laravel Queue + Redis/database
Testing               : PestPHP (syntax lebih bersih, berjalan di atas PHPUnit)
```

---

## 🧑‍💻 Developer Experience (DX)

### Pre-commit Hooks (Husky + lint-staged)

Otomatis format & lint sebelum commit — mencegah kode jelek masuk repo.

```bash
# Setup
npm install --save-dev husky lint-staged
npx husky init

# Konfigurasi lint-staged di package.json
{
  "lint-staged": {
    "*.{js,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"],
    "*.php": ["./vendor/bin/pint"]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

```bash
# .husky/commit-msg — validasi format commit message (opsional)
npx commitlint --edit $1
```

### Commitlint — Enforce Conventional Commits

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'test', 'chore', 'perf', 'revert',
    ]],
    'subject-case': [0], // allow any case
    'subject-max-length': [2, 'always', 72],
  },
};
```

**Hasilnya:** commit seperti `"fix stuff"` akan ditolak oleh hook.

### Taskfile / Makefile — Standardisasi Command

Biar semua developer (atau kamu sendiri 6 bulan lagi) ingat command yang sama.

```makefile
# Makefile
.PHONY: dev test lint build deploy

dev:
	npm run dev

test:
	npm test

lint:
	npm run lint

build:
	npm run build

deploy:
	./scripts/deploy.sh
```

```bash
# Penggunaan
make dev
make test
make lint
make build
```

### Docker untuk Local Dev

```dockerfile
# Dockerfile (contoh frontend + backend)
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM php:8.3-fpm AS backend
WORKDIR /app
COPY composer.* ./
RUN composer install --no-interaction
COPY . .
```

```yaml
# docker-compose.yml — untuk local development
services:
  app:
    build: .
    ports:
      - "8080:80"
    volumes:
      - .:/app
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: app_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

**Catatan:** Untuk production-grade Docker setup, lihat **`13-devops.md`**.

### Dependabot / Renovate — Auto Dependency Updates

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"

  - package-ecosystem: "composer"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "monthly"
```

**Keuntungan:**
- Otomatis buat PR untuk update dependency
- Notifikasi vulnerability
- PR dengan label otomatis, tinggal review + merge
- Prevent "dependency rot" yang bikin upgrade malas-malasan

---

## 🚀 Workflow Automation

### CI/CD (Gratis untuk public repo, murah untuk private)
```
GitHub Actions        ← Run test, deploy otomatis saat push
```

Contoh workflow sederhana `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      # Deploy ke Vercel, Netlify, dll
```

---

## 📚 Sumber Belajar Terpercaya (Gratis)

```
MDN Web Docs          → developer.mozilla.org  ← Referensi HTML/CSS/JS terbaik
JavaScript.info       → javascript.info        ← Tutorial JS terlengkap
The Odin Project      → theodinproject.com     ← Fullstack curriculum gratis
Roadmap.sh            → roadmap.sh             ← Learning path per role
FreeCodeCamp          → freecodecamp.org       ← Kursus coding gratis + sertifikasi
CSS Tricks            → css-tricks.com         ← Tips CSS mendalam
web.dev               → web.dev                ← Panduan performa & best practice Google
```

---

## ⚙️ Config Files yang Wajib Ada di Project

```
.editorconfig         ← Konsistensi indent/newline antar editor
.gitignore            ← File yang tidak di-commit
.env.example          ← Template environment variable (jangan commit .env asli!)
.prettierrc           ← Konfigurasi format kode
.eslintrc.json        ← Aturan linting
README.md             ← Cara setup dan jalankan project

Bonus (kalau tim/sudah besar):
docker-compose.yml    ← Local dev environment
Makefile              ← Standardisasi command
commitlint.config.js  ← Enforce conventional commits
.husky/pre-commit     ← Pre-commit hooks
.husky/commit-msg     ← Commit message validation
.dependabot.yml       ← Auto dependency updates
```

`.editorconfig` contoh:
```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

`.prettierrc` contoh:
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```
