# 🌿 06 — Git Workflow Best Practice

---

## 🌳 Branching Strategy (Git Flow Simplified)

```
main          ← Production code. SELALU bisa di-deploy. Tidak boleh push langsung.
  │
  ├── develop       ← Integrasi semua fitur. Base untuk feature branch.
  │     │
  │     ├── feature/user-authentication
  │     ├── feature/product-crud
  │     └── feature/payment-integration
  │
  ├── hotfix/fix-login-bug    ← Perbaikan mendesak dari main
  └── release/v1.2.0          ← Persiapan release (bump version, final test)
```

### Aturan Branch

| Branch | Dari | Merge ke | Siapa yang push |
|--------|------|----------|-----------------|
| `main` | — | — | Hanya via PR dari release/hotfix |
| `develop` | `main` | — | Hanya via PR dari feature |
| `feature/*` | `develop` | `develop` | Developer individual |
| `hotfix/*` | `main` | `main` + `develop` | Developer + Lead |
| `release/*` | `develop` | `main` + `develop` | Lead / DevOps |

### Alternatif: GitHub Flow (Solo / Project Kecil)

Git Flow di atas paling cocok untuk tim. Kalau **solo atau project kecil** (1-3 bulan), `develop` cuma nambah kerjaan — pakai **GitHub Flow**:

```
main           ← SELALU bisa di-deploy (satu-satunya branch stabil)
  │
  ├── feature/user-auth      ← branch dari main, PR langsung ke main
  ├── fix/checkout-bug
  └── hotfix/payment-timeout
```

**Aturan GitHub Flow:**
- Setiap fitur/fix = branch baru dari `main` (pakai prefix `feature/`, `fix/`, `hotfix/`)
- Semua perubahan masuk via PR (CI wajib pass)
- Merge segera setelah review — jangan simpan branch lama
- Main selalu production-ready — jika tidak, itu tanda workflow rusak

**Kapan upgrade ke Git Flow:** mulai butuh staging environment terpisah, rilis versi terjadwal, atau tim > 2 orang.

### Branch Protection (Wajib diaktifkan)

Semua aturan di atas tidak akan jalan tanpa enforcement. Aktifkan di GitHub: **Settings → Branches → Add rule** untuk `main` dan `develop`:

```
✅ Require a pull request before merging
✅ Require approvals (1 untuk solo, 2 untuk tim besar)
✅ Require status checks to pass (CI: lint + test)
✅ Require branches to be up to date before merging
✅ Do not allow force pushes
✅ Do not allow deletions
```

---

## ✍️ Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <deskripsi pendek>

[optional body]

[optional footer]
```

### Tipe Commit
```
feat      ← Fitur baru
fix       ← Bug fix
docs      ← Perubahan dokumentasi
style     ← Format, spasi, titik koma (tidak ada perubahan logika)
refactor  ← Refactor kode (bukan feat, bukan fix)
test      ← Tambah atau perbaiki test
chore     ← Update dependency, config, build script
perf      ← Peningkatan performa
revert    ← Revert commit sebelumnya
```

### Contoh Commit yang Baik
```bash
feat(auth): add JWT refresh token rotation
fix(cart): prevent duplicate item when clicking fast
docs(api): add authentication endpoint documentation
refactor(user): extract email validation to utility function
perf(product): add database index on category_id column
chore: upgrade Laravel from 10.x to 11.x
```

### Contoh Commit yang Buruk
```bash
# ❌ Terlalu singkat dan tidak informatif
fix stuff
update code
asdfgh
WIP
fix bug

# ❌ Terlalu banyak perubahan dalam satu commit
feat: add auth, product CRUD, payment, email, and fix navigation bug
```

---

## 📋 Template Pull Request

Simpan sebagai `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## 📋 Deskripsi
<!-- Jelaskan apa yang berubah dan mengapa -->

## 🔗 Related Issue
Closes #(nomor issue)

## 🧪 Cara Test
1. Langkah pertama
2. Langkah kedua
3. Hasil yang diharapkan

## 📸 Screenshot (jika ada perubahan UI)
| Before | After |
|--------|-------|
| | |

## ✅ Checklist
- [ ] Kode sudah di-review sendiri
- [ ] Tidak ada console.log yang tertinggal  
- [ ] Tidak ada sensitive data (password, key)
- [ ] Sudah test di lokal
- [ ] Sudah update dokumentasi (jika perlu)
```
---

## 🔄 PR Lifecycle (Solo & Team)

### PR Workflow

```
[Author]              [Reviewer]              [CI]
    │                     │                    │
    ├── Push feature ────→┤                    │
    │  (Draft PR)         │                    │
    │                     ├── Run tests ──────→│
    │                     │←── Pass/Fail ──────┤
    │                     │                    │
    │←── Request changes ─┤                    │
    ├── Push fix ────────→┤                    │
    │                     ├── Approve ────────→│
    │←── Merge ───────────┤                    │
    ↓                     ↓                    ↓
```

### Aturan PR

```
1. PR title: ikut conventional commits (feat:, fix:, refactor:)
2. PR description: jelaskan apa, mengapa, dan cara test
3. Jangan buat PR > 400 baris perubahan — pecah jadi smaller PR
4. Self-review sebelum minta review orang lain
5. Minimal 1 approve sebelum merge ke develop/main
6. Pastikan CI passing (lint + test) sebelum merge
7. Squash merge untuk feature branch, merge commit untuk release
```

### Contoh PR yang Baik

```markdown
## 📋 Deskripsi
Tambahkan fitur export laporan penjualan ke PDF.
Menggunakan Laravel DomPDF, data diambil dari transaksi per periode.

## 🔗 Related Issue
Closes #142

## 🧪 Cara Test
1. Login sebagai admin
2. Buka menu Laporan → pilih periode → klik "Export PDF"
3. File PDF terdownload dengan format yang benar

## 📸 Screenshot (jika ada perubahan UI)
| Before | After |
|--------|-------|
| (kosong — fitur baru) | [pdf-preview.png] |

## ✅ Checklist
- [ ] Kode sudah di-review sendiri
- [ ] Tests ditambahkan untuk export service
- [ ] Test manual: export 3 laporan berhasil
- [ ] Tidak ada console.log / dd() yang tertinggal
```

### Solo Version

Kalau kamu solo, tetap buat PR — ke `main` langsung (GitHub Flow, lihat di atas). Fungsinya:

```
1. Record — dokumentasi perubahan untuk masa depan
2. Safety net — CI ngecek sebelum merge ke branch stabil
3. Habit — saat nanti ada tim, workflow sudah natural
4. Changelog — PR description jadi bahan changelog otomatis
```

---

## 📝 Changelog Management

Gunakan standar **Keep a Changelog** ([keepachangelog.com](https://keepachangelog.com)).

### Format

```markdown
# Changelog

## [1.2.0] - 2025-06-15

### Added
- Fitur export laporan penjualan PDF (#142)
- Filter pencarian produk berdasarkan kategori (#138)
- Dark mode untuk dashboard (#130)

### Changed
- Perbaiki performa query dashboard (dari 3s ke 200ms) (#135)
- Update Laravel 10 → 11 (#133)

### Fixed
- Perbaiki bug duplicate data saat double-click tombol simpan (#140)
- Perbaiki perhitungan diskon yang salah (#137)

### Security
- Update dependensi dengan vulnerability CVE-2025-xxx (#139)
```

### Otomatisasi dengan Release-Please (Recommended)

```bash
# Setup — sekali di awal project
npm install --save-dev release-please

# Konfigurasi di release-please-config.json
# Release-please otomatis bikin PR release berdasarkan conventional commits
```

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          release-type: node
```

**Keuntungan:**
- Changelog auto-generated dari conventional commits
- Version bump otomatis (semantic versioning)
- Release PR + GitHub Release + tag otomatis

---

## 🏗️ ADR — Architecture Decision Records

Catat keputusan arsitektur penting agar tidak hilang ingatan — terutama kalau tim sudah besar atau jeda antar sprint panjang.

### Format ADR

```
# ADR-{nomor}: {Judul Keputusan}

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Konteks
Kenapa kita perlu buat keputusan ini? Masalah apa yang dihadapi?

## Opsi yang Dipertimbangkan
1. Opsi A — kelebihan & kekurangan
2. Opsi B — kelebihan & kekurangan
3. Opsi C — kelebihan & kekurangan

## Keputusan
Pilih opsi B, karena...

## Konsekuensi
Apa yang berubah? Tradeoff apa yang harus diterima?
```

### Template File

Simpan di `docs/adr/ADR-001.md`:

```markdown
# ADR-001: Use Laravel Sanctum for API Authentication

## Status
Accepted

## Konteks
Kita perlu API authentication untuk mobile app dan SPA.
Opsi yang ada: Sanctum, Passport, JWT manual.

## Opsi yang Dipertimbangkan
1. **Sanctum** — built-in Laravel, token-based, cookie support untuk SPA
2. **Passport** — OAuth2, terlalu berat untuk kebutuhan kita
3. **JWT manual** — fleksibel, tapi maintenance overhead

## Keputusan
Pilih Sanctum. Cukup untuk kebutuhan SPA + mobile app.
Kalau butuh OAuth2 di masa depan, bisa upgrade ke Passport.

## Konsekuensi
- Setup lebih cepat (built-in)
- Tidak ada refresh token rotation (cukup untuk sekarang)
- Migrasi ke Passport relatif mudah kalau diperlukan
```

### Kapan Buat ADR

```
✅ Saat memilih tech stack (React vs Vue, MySQL vs PostgreSQL)
✅ Saat memutuskan arsitektur (monolith vs microservices)
✅ Saat perubahan database signifikan (soft delete strategy)
✅ Saat memilih third-party service (Midtrans vs Xendit)
✅ Saat memutuskan pattern (Repository pattern atau langsung Eloquent)

❌ Jangan buat ADR untuk hal sepele (indentasi, nama variabel)
❌ Jangan buat ADR untuk yang sudah menjadi standard project
```

---

## 🚫 .gitignore yang Lengkap

```gitignore
# Environment
.env
.env.local
.env.*.local
.env.production
.env.backup

# Dependencies
node_modules/
vendor/

# Database lokal (jangan commit DB dev!)
*.sqlite
*.sqlite-journal

# Build output
dist/
build/
.next/
.nuxt/
public/hot/

# Cache
.cache/
*.cache
storage/framework/cache/
storage/framework/sessions/
storage/framework/views/

# IDE
.idea/
.vscode/
*.swp
*.swo

# Logs
*.log
storage/logs/
npm-debug.log*
yarn-debug.log*

# Testing
coverage/
.phpunit.result.cache

# OS
.DS_Store
Thumbs.db
desktop.ini

# Docker lokal (override jangan ke-commit)
docker-compose.override.yml

# SSL Certificates
*.pem
*.key
*.crt
```

---

## 🔄 Daily Git Workflow

```bash
# Pagi hari — mulai kerja
git checkout develop
git pull origin develop

# Buat branch baru untuk fitur
git checkout -b feature/nama-fitur

# Kerja, kerja, kerja...
# Commit sering, tapi meaningful
git add -p                        # Review perubahan sebelum stage (bukan git add .)
git commit -m "feat(user): add profile photo upload"

# Sebelum push — sync dengan develop terbaru
git fetch origin
git rebase origin/develop         # Lebih bersih dari merge untuk feature branch

# Push
git push origin feature/nama-fitur

# Buat Pull Request di GitHub/GitLab
# Minta review dari rekan
# Setelah approve → merge ke develop
```

---

## 🏷️ Semantic Versioning

```
v MAJOR . MINOR . PATCH
   │        │       │
   │        │       └── Bug fix, no new feature
   │        └────────── New feature, backward compatible
   └─────────────────── Breaking change

Contoh:
v1.0.0  ← Release pertama
v1.0.1  ← Patch: fix bug login
v1.1.0  ← Minor: tambah fitur dark mode
v2.0.0  ← Major: redesign API, breaking change
```

---

## 💡 Tips Git Sehari-hari

```bash
# Lihat apa yang berubah sebelum commit
git diff
git status

# Unstage file yang tidak sengaja di-add
git restore --staged namafile.js

# Batalkan commit terakhir (tetap simpan perubahan)
git reset --soft HEAD~1

# Simpan pekerjaan sementara (pindah branch urgent)
git stash
git stash pop              # Ambil kembali

# Lihat history yang rapi
git log --oneline --graph --decorate

# Cari siapa yang nulis baris ini
git blame namafile.js

# Cari commit yang menyebabkan bug (binary search otomatis)
git bisect start
git bisect bad                # commit sekarang rusak
git bisect good v1.0.0        # commit ini masih aman
# git akan checkout commit tengah — test, lalu:
git bisect good | git bisect bad
# ulangi sampai ketemu pelakunya, lalu:
git bisect reset

# Ambil satu commit dari branch lain (tanpa merge seluruhnya)
git cherry-pick abc1234

# Kerja di dua branch sekaligus tanpa pindah-pindah folder
git worktree add ../nama-app-staging feature/eksperimen
git worktree list

# Alias yang berguna — tambahkan ke ~/.gitconfig
[alias]
  st = status
  co = checkout
  br = branch
  lg = log --oneline --graph --decorate
  unstage = restore --staged
```
