# 📋 15 — Project Lifecycle

> Issue tracking, sprint planning, code review, Definition of Done, retrospektif.
> Solo: versi ringan. Tim: versi lengkap dengan proses yang jelas.

---

## 🎯 Issue Tracking — Standar untuk Solo & Tim

### Format Issue

```markdown
## Title: {type}: {deskripsi singkat}

Contoh: feat: add user profile photo upload
        fix: prevent duplicate order on double-click
        chore: upgrade Laravel 10 → 11

## Description
**User story (kalau feature):**
Sebagai {role}, saya ingin {action} sehingga {benefit}.

**Acceptance Criteria:**
- [ ] User bisa upload foto dari gallery / camera
- [ ] Foto di-resize ke 300x300px otomatis
- [ ] Format yang didukung: JPEG, PNG, WebP
- [ ] Ukuran maksimal 2MB
- [ ] Preview sebelum upload

## Technical Notes
- Pakai Spatie Media Library
- Simpan di disk `public`, path: `photos/{user_id}/`
- Buat command `php artisan photos:resize` untuk batch resize

## Definition of Done
- [ ] Unit test untuk resize logic
- [ ] Integration test untuk upload endpoint
- [ ] Manual test di Chrome + Mobile
- [ ] No console error
```

### Label System

```
type:      feat | fix | chore | docs | refactor | test | perf
priority:  critical | high | medium | low
status:    backlog | ready | in-progress | review | done | blocked
scope:     frontend | backend | database | devops | design
size:      xs (<2h) | s (2-4h) | m (1-2d) | l (3-5d) | xl (>5d)
```

### Solo Workflow

```
1. Ide muncul → buat issue dengan label type + scope
2. Sebelum mulai → pindah status ke "in-progress"
3. Kerja → commit dengan referensi issue (#42)
4. Selesai → buat PR → merge → pindah issue ke "done"
5. Kalau terblokir → tulis blocker di issue, pindah ke "blocked"
```

### Team Workflow

```
1. Product Owner bikin issue di backlog
2. Planning: tim pilih issue, estimasi, assign
3. Developer ambil issue → pindah ke "in-progress"
4. Developer commit → push → buat PR (referensi issue)
5. Code review → QA → merge
6. Issue pindah ke "done" setelah release
```

---

## 📅 Sprint Planning (untuk Tim)

### Siklus 2 Minggu

```
Week 1:
├── Day 1: Sprint Planning (2 jam)
│   ├── Review backlog
│   ├── Pilih issue untuk sprint
│   ├── Estimasi (story points / t-shirt size)
│   └── Sprint goal ditentukan
├── Day 2-5: Development + Daily Standup (15 menit)
└── Day 5: Mid-sprint check (ada blocker? perlu adjustment?)

Week 2:
├── Day 1-4: Development + Daily Standup
├── Day 4: Code freeze — bug fix only
└── Day 5: Sprint Review (demo) + Retrospective
```

### Sprint Board

```
┌──────────┬────────────┬───────────┬────────┬────────┐
│ Backlog  │  To Do     │ In-Progress │ Review │ Done  │
├──────────┼────────────┼───────────┼────────┼────────┤
│ Issue #5 │ Issue #3   │ Issue #1  │ Issue  │ Issue  │
│ Issue #6 │ Issue #4   │ Issue #2  │  #8    │  #7    │
│ Issue #7 │            │           │        │        │
└──────────┴────────────┴───────────┴────────┴────────┘
```

### Daily Standup (15 menit, berdiri)

Setiap anggota jawab 3 pertanyaan:

```
1. Apa yang saya kerjakan kemarin?
2. Apa yang akan saya kerjakan hari ini?
3. Ada blocker? (jika ada, lead bantu resolve setelah standup)
```

---

## 👀 Code Review Process

### Responsibility

**Author (yang buat PR):**
```
✅ Self-review dulu sebelum minta review
✅ PR description jelas: apa, mengapa, cara test
✅ PR size < 400 baris (kalau lebih, pecah)
✅ Pastikan CI passing
✅ Assign reviewer yang relevan
```

**Reviewer:**
```
✅ Review dalam 24 jam (atau sepakati SLA)
✅ Fokus ke logic, arsitektur, security
✅ Jangan nitpick gaya pribadi (kecuali tidak ikut konvensi project)
✅ Beri komentar yang konstruktif, bukan menghakimi
✅ Approve hanya kalau benar-benar siap
```

### Review Checklist

```markdown
## Correctness
- [ ] Logic sesuai acceptance criteria?
- [ ] Edge case di-handle? (null, empty, unauthorized)
- [ ] Error handling ada?

## Code Quality
- [ ] Naming jelas? Tidak ada `data`, `temp`, `x`?
- [ ] Fungsi tidak terlalu panjang (< 30 baris)?
- [ ] Tidak ada duplikasi code (DRY)?
- [ ] Comment hanya untuk "mengapa", bukan "apa"?

## Security
- [ ] Input divalidasi?
- [ ] Authorization dicek?
- [ ] Tidak ada data sensitif di response/log?

## Testing
- [ ] Ada test untuk logic baru?
- [ ] Test mencakup edge case?
- [ ] All tests passing?
```

### Review Flow

```
Author → [Draft PR] → CI runs → Author siap → [Ready for Review]
    → Reviewer review → Request changes? → Author fix → [Ready again]
    → Approve? → Merge ke develop
```

### Solo Version

Kalau solo, review tetaplah penting — tapi caranya beda:

```
1. Selesai nulis → jalanin dulu 1 jam
2. Balik baca kode dengan mata segar — apa masuk akal?
3. Cek checklist code review di atas
4. Jalanin git diff — apa aja yang berubah?
5. Baru merge
```

---

## ✅ Definition of Ready vs Definition of Done

### Definition of Ready (DoR) — Issue siap dikerjakan

```
[ ] User story jelas (siapa, apa, kenapa)
[ ] Acceptance criteria terdefinisi
[ ] UI mockup / reference ada (kalau ada perubahan UI)
[ ] Dependencies sudah clear (API ready, library available)
[ ] Tech lead sudah review (untuk task besar/risky)
```

### Definition of Done (DoD) — Issue benar-benar selesai

```
[ ] Kode sudah di-review sendiri
[ ] Tests written & passing
[ ] No console.log / dd() / debug code
[ ] Lint pass
[ ] Edge case di-handle
[ ] Loading / empty / error state ada (UI)
[ ] Keamanan dicek
[ ] Dokumentasi diupdate (API, README, migration guide)
[ ] Tested di browser yang relevant (Chrome, Firefox, Safari)
[ ] Tested di mobile (kalau ada UI)
```

---

## 🔄 Retrospektif (untuk Tim)

### Format Retrospektif (30-60 menit)

```
Start              Stop              Continue
(apa yang harus    (apa yang         (apa yang kita
kita mulai         harus kita        pertahankan karena
lakukan?)          berhenti          sudah baik?)
                   lakukan?)
```

### Contoh Output Retro

```markdown
## Start
- [ ] Mulai testing sebelum coding (TDD)
- [ ] Mulai PR review dalam 24 jam SLA
- [ ] Mulai dokumentasi API dengan Scribe

## Stop
- [ ] Stop commit langsung ke develop
- [ ] Stop deploy tanpa tag version
- [ ] Stop skip test saat buru-buru

## Continue
- [x] Daily standup tetap jalan
- [x] Code review tetap ada
- [x] Deploy dengan CI
```

### Solo Version

Solo juga perlu retrospektif — tiap akhir fitur/minggu:

```markdown
## Minggu ini:
- Apa yang berjalan lancar?
- Apa yang membuat saya stuck?
- Apa yang akan saya lakukan berbeda minggu depan?

## Action items:
1. ...
2. ...
```

---

## 📐 Estimation Guide

### T-shirt Sizing

| Size | Estimasi Jam | Contoh |
|------|-------------|--------|
| XS | < 2 jam | Fix typo, ganti warna button |
| S | 2 - 4 jam | Tambah validasi, update query |
| M | 1 - 2 hari | Fitur CRUD sederhana |
| L | 3 - 5 hari | Fitur dengan UI + logic + test |
| XL | > 5 hari | Harus dipecah jadi smaller issues |

### Aturan Estimasi

```
✅ Libatkan developer yang akan mengerjakan
✅ Estimasi = effort, bukan durasi (1 hari kerja = 6-8 jam coding efektif)
✅ Buffer 20-30% untuk unexpected
✅ Jangan estimasi di bawah 2 jam — itu XS, kerjakan langsung
✅ Issue > 5 hari HARUS dipecah
```

---

## 🛠️ Tools

### Untuk Solo

```
├── GitHub Issues       — tracking, gratis, terintegrasi dengan repo
├── GitHub Projects     — kanban board sederhana
└── Notion / Obsidian   — dokumentasi pribadi
```

### Untuk Tim

```
├── Linear              — issue tracking terbaik untuk engineering team
├── GitHub Projects     — gratis, terintegrasi dengan PR/CI
├── Notion              — wiki, sprint planning, dokumentasi
├── Slack / Discord     — komunikasi + notification
└── Sentry              — error tracking yang terintegrasi dengan issue
```

---

## ✅ Project Lifecycle Checklist

```
Setup:
[ ] Issue template sudah dibuat (.github/ISSUE_TEMPLATE/)
[ ] Label system sudah terdefinisi
[ ] PR template sudah ada (.github/PULL_REQUEST_TEMPLATE.md)
[ ] Project board (kanban) sudah aktif

Sprint (tim):
[ ] Sprint planning di awal
[ ] Daily standup rutin
[ ] Code review konsisten
[ ] Retrospektif di akhir
[ ] Action items dari retro di-track

Solo:
[ ] Issue tetap dibuat (jangan hanya di kepala)
[ ] Self-review sebelum merge
[ ] Retro pribadi mingguan
[ ] Dokumentasi untuk "future me"

Continuous:
[ ] Backlog di-review minimal 1x/sprint
[ ] Issue usang di-archive
[ ] Estimasi dievaluasi (actual vs estimated)
```
