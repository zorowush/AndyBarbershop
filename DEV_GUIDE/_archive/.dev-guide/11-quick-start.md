# 🚀 Quick Start — Mulai Project Baru Dengan Benar

> Gunakan checklist ini setiap kali membuat project baru agar tidak bingung.

---

## 📋 Day 1: Setup & Planning

### Step 1: Define Project
```
[ ] Tipe project? (Website, Web App, Dashboard, API, etc)
[ ] Target user? (Mobile, Desktop, Both)
[ ] Fitur utama apa saja?
[ ] Tech stack sudah fixed? (Frontend + Backend)
[ ] Timeline & deadline?
```

### Step 2: Setup Repository
```bash
# Buat repo GitHub/GitLab
# Clone ke lokal
git clone <repo-url>
cd project-name

# Setup initial files
touch .gitignore
touch .env.example
touch README.md

# Commit pertama
git add .
git commit -m "chore: initial project setup"
```

### Step 3: Setup Folder Structure
```bash
# Copy struktur folder dari 01-project-structure.md
# Sesuaikan dengan tech stack kamu
```

### Step 4: Setup Development Tools
```bash
# Frontend (React/Next.js example)
npm install --save-dev prettier eslint
touch .prettierrc
touch .eslintrc.json

# Backend (Laravel example)
composer install
cp .env.example .env
php artisan key:generate

# Testing framework (dari 12-testing.md)
npm install --save-dev vitest @testing-library/react
# atau: composer require pestphp/pest --dev

# Copy config dari 08-tooling.md
```

### Step 5: Setup EditorConfig
```bash
# Copy dari 08-tooling.md, save sebagai .editorconfig
```

### Step 6: Setup Docker (Opsional — untuk backend-heavy project)
```bash
# Buat docker-compose.yml (copy dari 13-devops.md)
# Buat Dockerfile untuk masing-masing service
docker compose up -d
```

### Step 7: Setup CI/CD
```yaml
# .github/workflows/ci.yml — lihat template di 13-devops.md
# Minimal: lint + test jalan otomatis di setiap PR
```

---

## 📱 Frontend Project Checklist

### Design Token & CSS Setup
```bash
# Buat file CSS variables
touch assets/css/variables.css
touch assets/css/base/reset.css
touch assets/css/base/typography.css
touch assets/css/main.css

# Setup design tokens (dari 02-frontend.md)
# Copy CSS variables dari sini:
:root {
  --color-primary: #1a56db;
  --space-4: 16px;
  --transition-base: 250ms ease;
  /* ... copy semua dari file */
}
```

### Responsive Setup
```css
/* Default: mobile (320px) */
/* Media query start di sini */
@media (min-width: 480px) { /* Tablet kecil */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1366px) { /* Desktop besar */ }
```

### Testing Responsive (Setiap sebelum merge)
```bash
# DevTools: Ctrl+Shift+M (Chrome) atau Ctrl+Shift+K (Firefox)
[ ] Test di 320px (mobile terkecil)
[ ] Test di 375px (mobile umum)
[ ] Test di 768px (tablet)
[ ] Test di 1024px (desktop)
[ ] Test di 1920px (desktop besar)
[ ] Tidak ada horizontal scroll
[ ] Text readable
[ ] Button/link min 44px
```

---

## ⚙️ Backend Project Checklist

### Database Setup
```bash
# Laravel
touch database/migrations/create_users_table.php
# Define migration di sini (dari 03-backend.md)

# Run migration
php artisan migrate

# Create seeder
php artisan make:seeder UserSeeder
php artisan db:seed
```

### API Structure
```php
# Setup routes — dari 03-backend.md
routes/api.php
├── Auth endpoints
├── User endpoints
├── Product endpoints
└── Order endpoints

# Setup response format (dari 03-backend.md)
# Buat wrapper response yang konsisten
```

### Error Handling
```php
# Copy exception handler dari 03-backend.md
app/Exceptions/Handler.php
app/Exceptions/ApiException.php
```

---

## 🔐 Security — Before Any Deployment

### Environment
```bash
[ ] .env TIDAK di-git (di .gitignore)
[ ] .env.example ada di repo (tanpa nilai sensitif)
[ ] APP_DEBUG=false di production
[ ] APP_KEY di-generate (unique per environment)
```

### Database
```
[ ] Foreign key punya index
[ ] Password di-hash (bcrypt/argon2)
[ ] Sensitive data tidak di log
```

### API
```
[ ] Semua input divalidasi
[ ] Output di-escape (XSS protection)
[ ] SQL injection tidak bisa terjadi (parameterized query)
[ ] CSRF token ada (kalau ada form)
[ ] Rate limiting di login/register
```

### Check Security List
```
Buka 04-security.md dan run checklist
[ ] Autentikasi & Autorisasi
[ ] Proteksi dari serangan umum (SQL Injection, XSS, CSRF)
[ ] File upload validation
[ ] Environment & Secret management
[ ] Security headers
[ ] Logging & Monitoring
```

---

## 📊 Code Quality Before Push

### Naming Convention
```
[ ] File: ikuti naming dari 01-project-structure.md
[ ] Variable: camelCase
[ ] Konstanta: UPPER_SNAKE_CASE
[ ] Class: PascalCase
[ ] Branch: kebab-case (feature/user-auth)
[ ] Commit: Conventional Commits (feat: / fix: / refactor:)
```

### Code Review — Checklist dari 07-code-quality.md
```
[ ] Tidak ada console.log / dd() / die()
[ ] Naming deskriptif
[ ] Fungsi tidak lebih dari 30 baris
[ ] DRY — tidak ada pengulangan
[ ] Error handling ada
[ ] Tidak ada magic number/string
```

### Before Commit
```bash
# Format code
npm run format  # atau ./vendor/bin/pint

# Lint check
npm run lint    # atau ./vendor/bin/pint --test

# Test (kalau ada)
npm test        # atau php artisan test

# Diff review
git diff
git status
```

---

## 🌳 Git Workflow — Sehari-hari

### Mulai fitur baru
```bash
# Sync dengan develop terbaru
git fetch origin
git checkout develop
git pull origin develop

# Buat branch baru
git checkout -b feature/nama-fitur
```

### Saat develop
```bash
# Commit sering tapi meaningful
git add -p                                    # Review sebelum add
git commit -m "feat(user): add profile photo upload"

# Sebelum push — sync develop terbaru
git fetch origin
git rebase origin/develop

# Push
git push origin feature/nama-fitur
```

### Pull Request
```
[ ] Title: descriptive
[ ] Description: jelaskan apa & mengapa
[ ] Screenshot (kalau UI berubah)
[ ] Tested locally
[ ] No console error/warning
[ ] Follow branch naming convention (feature/*, fix/*, etc)
```

Lihat template di 06-git-workflow.md

---

## ✅ Deployment Checklist

### Before Merge ke Main
```
Performance:
[ ] Lighthouse score > 80 (frontend)
[ ] Database query optimal (no N+1)
[ ] Asset sudah minify
[ ] API response time < 500ms

Security:
[ ] Tidak ada hardcoded password
[ ] Environment variables semua di-set
[ ] HTTPS enabled
[ ] Security headers terpasang
[ ] Rate limiting aktif
[ ] Input validasi semua endpoint

Testing:
[ ] Feature sudah tested
[ ] Error case sudah tested
[ ] Mobile tested
[ ] Cross-browser tested (Chrome, Firefox, Safari)
```

### Production Deployment
```bash
# Final checks
[ ] Database migration tested di staging
[ ] Environment .env production sudah ready
[ ] Backup database sebelum deploy
[ ] CDN cache di-clear (kalau ada)
[ ] Monitor error log 1 jam pertama

# Deploy
git tag v1.0.0
git push origin v1.0.0
# Deploy menggunakan CI/CD pipeline
```

---

## 📚 File Reference Quick Access

Saat development, buka file ini sesuai kebutuhan:

```
Mulai project? 
→ 01-project-structure.md

Setup frontend?
→ 02-frontend.md
→ 09-responsive-design.md
→ 10-responsive-snippets.md (copy-paste components)

Setup backend?
→ 03-backend.md

Keamanan?
→ 04-security.md (checklist sebelum deploy)

Code patterns?
→ 05-architecture.md

Git & commit?
→ 06-git-workflow.md

Code quality?
→ 07-code-quality.md (review sebelum commit)

Setup tools?
→ 08-tooling.md (extensions, libraries, resources)

Responsive issue?
→ 09-responsive-design.md (breakpoints, patterns)
→ 10-responsive-snippets.md (copy-paste kode)

Testing strategy?
→ 12-testing.md (pyramid, contoh, TDD, CI)

DevOps / Docker / CI?
→ 13-devops.md (container, pipeline, deployment)

Observability & monitoring?
→ 14-observability.md (logging, metrics, alerting, incident)

Project management & workflow?
→ 15-project-lifecycle.md (issue, sprint, review, DoD)
```

---

## 💡 Pro Tips

### 1. Buat File Instruksi untuk AI / IDE (AGENTS.md)

Simpan di root project. File ini dibaca oleh AI coding tools (Cursor, Cline, dll)
dan beberapa IDE modern. Panduan lengkap sudah ada di `.dev-guide/AGENTS.md` —
copy dan sesuaikan dengan project kamu:

```markdown
# AGENTS.md
- Mobile-first responsive design
- Use design token system (CSS variables)
- Conventional Commits
- No hardcoded values, use constants
- API response format: { success, data, message, errors }
```

> Catatan: `.cursorrules` masih dipakai Cursor, tapi sekarang deprecated —
> pindah ke `AGENTS.md` agar bisa dipakai tools lain juga.

### 2. Keep README Updated
Setiap project perlu README yang jelas:
```markdown
# Project Name

## Quick Start
1. Clone: git clone ...
2. Install: npm install
3. Setup: cp .env.example .env
4. Run: npm run dev

## Folder Structure
- /src — source code
- /public — static assets
- /config — configuration

## Development
- `npm run dev` — start dev server
- `npm run test` — run tests
- `npm run build` — production build

## Deployment
See DEPLOYMENT.md

## Contributing
See CODE_OF_CONDUCT.md
```

### 3. Tech Stack Document
Buat file TECH_STACK.md:
```markdown
## Frontend
- React 18
- Tailwind CSS
- Zustand (state management)
- React Query (data fetching)

## Backend
- Laravel 11
- PostgreSQL
- Redis (cache)

## DevOps
- Vercel (frontend)
- Railway (backend)
- GitHub Actions (CI/CD)
```

### 4. Setup Pre-commit Hook
```bash
# Prevent commit dengan error atau console.log

# Install husky (v9+)
npm install husky --save-dev
npx husky init

# Setup lint-staged (lihat config lengkap di 08-tooling.md)
npm install lint-staged --save-dev
echo "npx lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit
```

---

## 🎯 Mental Checklist Saat Nulis Kode

Selalu tanya ke diri sendiri:

```
[ ] Sudah paham requirement-nya?
    → Baca issue/task description 2x
[ ] Nama variable/fungsi sudah deskriptif?
    → Hindari: x, data, temp, result
[ ] Penanganan error sudah ada?
    → Validasi input, try-catch, error response
[ ] Bisa ditest?
    → Logika pure? Bisa dijalan isolated?
[ ] Sudah pikirkan edge case?
    → Null, empty, 0, negatif, very large value
[ ] Performa masuk akal?
    → Tidak ada loop dalam loop?
    → Database query efficient?
[ ] Keamanan?
    → Input validated? XSS protected? SQL injection safe?
[ ] Kode sudah cukup simple?
    → Tidak perlu dipisah lagi? Tidak terlalu nested?
[ ] Documentasi / komentar jelas?
    → Orang lain bisa paham tanpa bertanya?
```

---

## 🎓 Learning Path Selanjutnya

Setelah master basic best practice:

1. **Testing** → Unit test, integration test, E2E test
2. **Performance Optimization** → Code splitting, lazy loading, caching strategy
3. **DevOps** → Docker, CI/CD pipeline, server management
4. **Database Optimization** → Indexing, query planning, replication
5. **Scalability** → Microservices, event-driven architecture, load balancing

Tapi untuk sekarang, fokus ke 15 file panduan di atas. Itu sudah cukup untuk menjadi professional fullstack developer.

---

**Good luck! Happy coding! 🚀**
