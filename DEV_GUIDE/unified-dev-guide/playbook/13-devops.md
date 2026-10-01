# 🐳 13 — DevOps & Deployment

> Docker, CI/CD, environment management, deployment strategies, rollback.
> Solo atau tim: DevOps bukan cuma untuk tim infrastruktur.

---

## 🐳 Docker untuk Development

### Kenapa Docker di Local Dev?

```
✅ Environment parity — semua developer punya environment yang sama
✅ Onboarding 5 menit — tinggal docker compose up, langsung jalan
✅ Isolasi — tidak perlu install PostgreSQL/Redis di lokal
✅ Production-similar — lebih dekat dengan server production
❌ Overhead untuk project kecil (HTML/CSS/JS static) — skip saja
```

### docker-compose.yml untuk Fullstack App

```yaml
# docker-compose.yml
services:
  frontend:
    build:
      context: ./frontend
      target: dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

  backend:
    build:
      context: ./backend
      target: dev
    ports:
      - "8080:80"
    volumes:
      - ./backend:/app
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      - DB_CONNECTION=pgsql
      - DB_HOST=db
      - DB_PORT=5432
      - DB_DATABASE=app_dev
      - DB_USERNAME=dev
      - DB_PASSWORD=dev
      - REDIS_HOST=redis

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: app_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev -d app_dev"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

  queue:
    build:
      context: ./backend
      target: dev
    command: php artisan queue:work --tries=3
    volumes:
      - ./backend:/app
    depends_on:
      - backend
      - redis
    environment:
      - DB_CONNECTION=pgsql
      - DB_HOST=db
      - REDIS_HOST=redis

volumes:
  pgdata:
  redisdata:
```

### Dockerfile Multi-stage

```dockerfile
# Dockerfile (Laravel)
# Stage 1: Dependencies
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.* ./
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Stage 2: Build assets
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY resources/ resources/
RUN npm run build

# Stage 3: Production image
FROM php:8.3-fpm-alpine AS prod
WORKDIR /app

# pcntl dibutuhkan queue worker (php artisan queue:work)
RUN docker-php-ext-install pdo_pgsql opcache pcntl

COPY --from=vendor /app/vendor/ ./vendor/
COPY --from=frontend /app/public/build/ ./public/build/
COPY . .

RUN php artisan optimize

# Stage 4: Development (hot reload)
FROM php:8.3-fpm-alpine AS dev
WORKDIR /app
RUN docker-php-ext-install pdo_pgsql opcache pcntl
COPY . .
```

### .dockerignore — Jangan Lupa!

Tanpa ini, seluruh `node_modules`/`vendor` terkirim ke build context (lambat + besar):

```dockerignore
# .dockerignore
node_modules/
vendor/
.git/
.env*
storage/logs/*
public/build/*
*.md
tests/
docker-compose*.yml
```

### Perintah Sehari-hari dengan Docker

```bash
# Start semua service
docker compose up -d

# Lihat log
docker compose logs -f backend

# Masuk ke container
docker compose exec backend bash

# Run artisan di container
docker compose exec backend php artisan migrate

# Reset semua (data hilang)
docker compose down -v

# Rebuild image
docker compose build --no-cache backend

# Hentikan semua
docker compose down
```

---

## 🌍 Environment Management

### Environment Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   Environment Layers                         │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Local      │  Staging     │  Production  │  Review App    │
│  (kamu)      │  (tim QA)    │  (real user) │  (per PR)      │
├──────────────┼──────────────┼──────────────┼────────────────┤
│ .env.dev     │ .env.staging │ .env.prod    │ auto-generate  │
│ DB=local     │ DB=staging   │ DB=prod      │ DB=ephemeral   │
│ Debug=true   │ Debug=false  │ Debug=false  │ Debug=false    │
│ No SSL       │ SSL staging  │ SSL real     │ SSL auto       │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### Konfigurasi per Environment

```bash
# .env.dev — development lokal
APP_ENV=local
APP_DEBUG=true
DB_HOST=127.0.0.1
DB_DATABASE=app_dev
MAIL_MAILER=log

# .env.staging — staging server
APP_ENV=staging
APP_DEBUG=false
DB_HOST=staging-db.internal
DB_DATABASE=app_staging
MAIL_MAILER=smtp

# .env.prod — production
APP_ENV=production
APP_DEBUG=false
DB_HOST=prod-db.internal
DB_DATABASE=app_prod
MAIL_MAILER=smtp
```

### Aturan Environment

```
✅ .env.example di-commit — template yang selalu up-to-date
✅ .env.* di .gitignore — jangan commit secret
✅ Setiap environment punya APP_KEY unik
✅ Jangan beda version dependency antar environment
✅ Production = APP_DEBUG=false, error page custom
✅ Gunakan secret manager (GitHub Secrets, Doppler, Vault) untuk CI/CD
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Pipeline Lengkap: Test → Build → Deploy

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop]

env:
  NODE_VERSION: 20
  PHP_VERSION: 8.3

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Lint frontend
        run: |
          npm ci
          npm run lint

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ env.PHP_VERSION }}

      - name: Lint backend
        run: |
          composer install --no-interaction
          ./vendor/bin/pint --test

  test:
    needs: lint
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ env.PHP_VERSION }}
          extensions: pgsql, pdo_pgsql

      - name: Run tests
        run: |
          cp .env.example .env
          composer install --no-interaction
          php artisan key:generate
          php artisan migrate --force
          php artisan test
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: test
          DB_USERNAME: test
          DB_PASSWORD: test

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Staging
        run: |
          # Example: deploy ke Railway / VPS via SSH
          echo "Deploying to staging..."
          # ./scripts/deploy-staging.sh

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Production
        run: |
          echo "Deploying to production..."
          # ./scripts/deploy-production.sh
```

### GitHub Environments & Protection Rules

```
Settings → Environments → production:
├── Required reviewers: 1-2 orang
├── Wait timer: 5 menit (grace period)
└── Environment secrets:
    ├── PROD_DB_PASSWORD
    ├── PROD_APP_KEY
    └── PROD_DEPLOY_KEY
```

---

## 🚢 Deployment Strategies

### Strategy Matrix

| Strategy | Downtime | Rollback | Complexity | Cocok untuk |
|----------|----------|----------|------------|-------------|
| **Simple Deploy** (git pull) | Ada (~30s) | Manual | Rendah | Solo / MVP |
| **Blue-Green** | Zero | Instant | Sedang | Tim kecil |
| **Rolling Update** | Zero (gradual) | Bertahap | Tinggi | Tim besar |
| **Canary Release** | Zero | Instant | Tinggi | Production scale |

### Simple Deploy (Solo / MVP)

```bash
#!/bin/bash
# scripts/deploy.sh

echo "Deploying to production..."

# 1. Maintenance mode
php artisan down --retry=10

# 2. Pull latest code
git pull origin main

# 3. Install dependencies & build
composer install --no-interaction --no-dev --optimize-autoloader
npm ci && npm run build

# 4. Run migration
php artisan migrate --force

# 5. Clear & warmup cache
php artisan optimize

# 6. Exit maintenance mode
php artisan up

echo "Deploy complete!"
```

### Blue-Green Deployment

```
┌──────────┐     ┌──────────┐
│  User    │────→│  Load    │
│  Request │     │ Balancer │
└──────────┘     └────┬─────┘
                      │
          ┌───────────┴───────────┐
          │                       │
    ┌─────▼─────┐          ┌─────▼─────┐
    │  Blue     │          │  Green    │
    │ (current) │          │ (new)     │
    │           │          │           │
    │ v1.2.0    │          │ v1.3.0    │
    └───────────┘          └───────────┘
          │                       │
          └───────────┬───────────┘
                      │
                 ┌────▼────┐
                 │  DB     │
                 │ (shared)│
                 └─────────┘
```

**Cara kerja:**
1. Deploy versi baru ke Green (sementara Blue masih serving)
2. Test Green secara internal
3. Switch load balancer ke Green
4. Jika error, switch balik ke Blue (instant rollback)
5. Matikan Blue

---

## 🔙 Rollback Strategy

### Rollback Plan — Wajib Ada Sebelum Deploy

```bash
# 1. Database rollback
php artisan migrate:rollback --step=1

# 2. Code rollback
git revert HEAD --no-edit
git push origin main

# 3. Re-deploy (lewat CI lagi)

# 4. Notifikasi tim
echo "Rollback ke v1.2.0 selesai. Penyebab: ..."
```

### Rollback Checklist

```
Sebelum deploy:
[ ] Database migration reversible? (down() method lengkap?)
[ ] Tag / release version sudah ada? (git tag)
[ ] Backup database sudah diambil?
[ ] Rollback script sudah siap?
[ ] Tim tau cara rollback?

Saat rollback:
[ ] Notifikasi tim lewat chat
[ ] Jangan panik — ikuti prosedur
[ ] Cek error log setelah rollback
[ ] Pastikan user tidak terpengaruh lagi
```

---

## 🗄️ Migration Tanpa Downtime (Expand-Contract)

Migration di production tidak boleh langsung drop column/table — user lama masih jalan saat deploy.

```
FASE 1 (EXPAND — deploy versi 1):
1. Tambah kolom baru (nullable / dengan default)   → add_column_migration
2. Deploy + jalankan backfill data (dari kolom lama ke baru)
3. Update kode BACA dari kolom baru

FASE 2 (CONTRACT — deploy versi 2, beberapa waktu kemudian):
4. Hapus kolom lama → drop_column_migration
5. Deploy

Contoh: rename column `name` → `full_name`
- Migrasi A: tambah full_name (nullable) → deploy → backfill: UPDATE users SET full_name = name
- Update kode: SELECT full_name (bukan name lagi)
- Migrasi B (minggu depan): drop kolom name → deploy
```

**Aturan:**
- Drop column/table = pisahkan dari migrasi yang menambah data baru
- Backfill pakai script idempotent (bisa di-run ulang tanpa error)
- Jangan pernah drop kolom di migrasi yang sama dengan deploy kode baru yang memakainya
- Untuk tim: gunakan tooling seperti Laravel Shift / deployment window khusus migration

---

## 🧪 Review App (Preview per PR)

Setiap PR bisa punya environment sendiri — sangat berguna untuk review.

```yaml
# Contoh dengan Railway
name: Preview Deploy

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: |
          npx railway up --service ${{ github.event.pull_request.head.ref }}
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Keuntungan:**
- Reviewer bisa lihat hasil langsung, bukan cuma code
- Test integrasi di environment yang isolated
- Auto-delete saat PR di-merge/close

---

## ✅ DevOps Checklist

```
Setup:
[ ] Docker compose untuk local dev (kalau project backend-heavy)
[ ] Makefile atau script untuk command standar
[ ] .env.example lengkap dengan semua variable
[ ] Semua secret ada di GitHub Secrets / Vault

CI/CD:
[ ] Lint + test jalan otomatis di setiap PR
[ ] Staging auto-deploy dari branch develop
[ ] Production deploy dari main — via GitHub Environments (approval + required reviewers, lihat di atas)
[ ] Rollback script sudah teruji
[ ] Deployment notification ke chat tim

Production:
[ ] Health check endpoint (GET /health)
[ ] Database migration auto-run di deploy
[ ] Tidak ada downtime untuk migration (kecuali unavoidable)
[ ] Monitoring aktif 1 jam pertama setelah deploy
[ ] Release tag dan changelog di-update
```

Lihat strategi logging & monitoring di **`14-observability.md`**.
