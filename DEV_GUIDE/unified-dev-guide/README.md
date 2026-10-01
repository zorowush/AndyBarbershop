# 🏛️ Unified Dev Guide & Agent Skills for Antigravity

Selamat datang di **Unified Development Toolkit** — sistem master terpadu yang menggabungkan:
1. **Playbook Rekayasa Software Profesional** (SOP, Clean Code, UI SaaS, Responsive Design, Git Workflow, Security, Testing, DevOps, Observability, Product Positioning).
2. **Engine 116 Skills Teknis & Growth On-Demand**:
   - **67 Fullstack Dev Skills**: NestJS, React, Next.js, Django, FastAPI, Kubernetes, Docker, Postgres, Playwright, Go, Python, dll.
   - **49 Marketing & CRO Skills**: Copywriting, CRO, SEO Audit, AI Search/LLM SEO, Pricing, Cold Email, Ads, Onboarding, Paywalls, Churn Prevention, dll.
3. **Peta Jalan Anti-Bingung ("0 to 1 to Scale")** melalui [START_HERE.md](file:///d:/DEV_GUIDE/unified-dev-guide/START_HERE.md).
4. **51 Zero-Dependency Node.js CLI Tools** untuk otomatisasi SEO, skema data, analitik, dan tracking.

---

## 📂 Struktur Master Folder

```
unified-dev-guide/
├── AGENTS.md                  ← Master Directive yang dibaca otomatis oleh Antigravity / AI
├── START_HERE.md              ← Panduan praktis langkah demi langkah mulai proyek dari nol
├── README.md                  ← Dokumentasi master folder ini
├── setup-project.ps1          ← Skrip penghubung master guide ke proyek koding baru (PowerShell)
├── setup-project.bat          ← Skrip pembantu eksekusi cepat (Batch)
│
├── playbook/                  ← [16 Modul SOP & Panduan Praktis Developer]
│   ├── README.md
│   ├── 01 s/d 08              ← Structure, Frontend, Backend, Security, Architecture, Git, Clean Code, Tools
│   ├── 09 & 10                ← Responsive Design & Snippets UI Siap Pakai
│   ├── 11-quick-start.md      ← Checklist inisialisasi awal
│   ├── 12 s/d 15              ← Testing, DevOps, Observability, Sprint DoD
│   └── 16-product-marketing.md← Template positioning produk untuk shared marketing context
│
├── skills/                    ← [116 Spesialis Teknis & Marketing On-Demand]
│   ├── (67 Dev Specialists: nextjs-developer, nestjs-expert, postgres-pro, kubernetes, dll.)
│   └── (49 Marketing Specialists: copywriting, cro, seo-audit, ai-seo, pricing, launch, dll.)
│
├── tools/                     ← [51 Zero-Dependency Node.js CLI Tools & API Guides]
└── commands/                  ← Utilitas Context Engineering (/common-ground & alur epics)
```

---

## ⚡ Cara Menghubungkan ke Proyek Baru (Sangat Mudah & Profesional)

Saat Anda membuat proyek koding baru (misal: `D:\projects\my-saas-app`):

### Cara 1: Menggunakan Script (Disarankan)
Buka terminal dan jalankan:
```powershell
d:\DEV_GUIDE\unified-dev-guide\setup-project.ps1 -TargetDir "D:\projects\my-saas-app"
```
atau via command prompt / batch:
```cmd
d:\DEV_GUIDE\unified-dev-guide\setup-project.bat "D:\projects\my-saas-app"
```

**Apa yang terjadi di proyek Anda?**
1. File [AGENTS.md](file:///d:/DEV_GUIDE/unified-dev-guide/AGENTS.md) dan [START_HERE.md](file:///d:/DEV_GUIDE/unified-dev-guide/START_HERE.md) otomatis tersedia di root proyek Anda.
2. Folder `.agents/skills` dan `.agents/playbook` dihubungkan secara instan via **NTFS Junction** (memakan 0 byte ruang disk tambahan dan otomatis sinkron bila master diupdate).
3. Jika proyek Anda menggunakan Git, entry `.agents/skills` otomatis ditambahkan ke `.gitignore` sehingga repository proyek Anda tetap ringan dan bersih.

---

## 🎯 Cara Memulai Ngoding Proyek Baru (Alur Anti-Bingung)

1. Buka folder proyek baru Anda di **Antigravity**.
2. Buka [START_HERE.md](file:///d:/DEV_GUIDE/unified-dev-guide/START_HERE.md) untuk melihat tahapan dari nol (Fase 0 s/d Fase 6).
3. Berikan instruksi awal ke Antigravity dengan merujuk pada panduan:
   > *"Antigravity, ikuti AGENTS.md dan START_HERE.md. Saya ingin membuat aplikasi SaaS manajemen klinik menggunakan Next.js App Router, Tailwind CSS, dan PostgreSQL. Mari mulai dari Fase 0 (Klarifikasi & Data Model) dan Fase 2 (Struktur Folder)."*
4. Antigravity akan otomatis mengaktifkan skill `nextjs-developer`, `postgres-pro`, serta menerapkan kaidah UI bersih dari `playbook/09-responsive-design.md` dan keamanan dari `playbook/04-security.md`.
