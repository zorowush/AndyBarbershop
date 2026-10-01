# 🧠 Dev Best Practices — Professional Software Engineer Playbook

> Dibuat untuk digunakan di setiap project. Copy folder ini ke root project atau simpan sebagai referensi global.
> Tidak terikat framework tertentu — berlaku untuk Native, Laravel, React, Next.js, Vue, dll.

---

## 📁 Struktur File Panduan Ini

```
.dev-guide/
├── README.md                  ← Kamu di sini (indeks & prinsip)
├── AGENTS.md                  ← Instruksi untuk AI coding assistant
├── 01-project-structure.md    ← Struktur folder (native & framework)
├── 02-frontend.md             ← UI/UX, performa, aksesibilitas, i18n
├── 03-backend.md              ← API, database, logika bisnis, testing, logging
├── 04-security.md             ← Keamanan end-to-end
├── 05-architecture.md         ← Arsitektur sistem & design pattern
├── 06-git-workflow.md         ← Git, branching, PR lifecycle, ADR, changelog
├── 07-code-quality.md         ← Naming, clean code, review
├── 08-tooling.md              ← Tools gratis, DX, pre-commit, Dependabot, Docker
├── 09-responsive-design.md    ← Multi-screen: mobile, tablet, desktop
├── 10-responsive-snippets.md  ← Copy-paste ready components (hero, nav, card, table)
├── 11-quick-start.md          ← Checklist saat start project baru
├── 12-testing.md              ← Testing pyramid, strategi, TDD, CI integration
├── 13-devops.md               ← Docker, CI/CD, deployment strategy, rollback
├── 14-observability.md        ← Logging, metrics, alerting, incident response
└── 15-project-lifecycle.md    ← Issue tracking, sprint, code review, DoD, retro
```

---

## 🎯 Cara Pakai

1. **Project baru** → baca `11-quick-start.md` dulu, ikuti checklist
2. **Mulai frontend** → buka `02-frontend.md` + `09-responsive-design.md`
3. **Responsive issue** → lihat `10-responsive-snippets.md` (copy-paste komponen)
4. **Mulai backend** → buka `03-backend.md`
5. **Testing strategy** → `12-testing.md`
6. **Docker / CI / deploy** → `13-devops.md`
7. **Monitoring & logging** → `14-observability.md`
8. **Project management** → `15-project-lifecycle.md`
9. **Sebelum deploy** → checklist `04-security.md`
10. **Code review / refactor** → `07-code-quality.md`
11. **Butuh tools** → `08-tooling.md`

---

## 🧭 Prinsip Utama (Selalu Ingat)

| Prinsip | Makna |
|--------|-------|
| **YAGNI** | You Aren't Gonna Need It — jangan bikin fitur yang belum dibutuhkan |
| **DRY** | Don't Repeat Yourself — abstraksi yang berulang |
| **KISS** | Keep It Simple, Stupid — solusi paling sederhana yang bekerja |
| **SOLID** | 5 prinsip OOP untuk kode yang mudah diubah |
| **Separation of Concerns** | Pisahkan UI, logika, dan data |
| **Fail Fast** | Validasi di awal, jangan biarkan error menyebar |
| **Convention over Configuration** | Ikuti standar komunitas kecuali ada alasan kuat |

---

## ⚡ Quick Mental Checklist Sebelum Nulis Kode

```
[ ] Sudah paham requirement-nya?
[ ] Sudah tau struktur folder yang akan dipakai?
[ ] Sudah definisikan naming convention?
[ ] Ada error handling-nya?
[ ] Ada validasi input?
[ ] Performa sudah dipertimbangkan?
[ ] Keamanan sudah dipertimbangkan?
[ ] Bisa di-test?
```
