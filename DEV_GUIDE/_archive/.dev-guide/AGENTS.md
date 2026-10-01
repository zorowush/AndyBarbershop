/momg/# AGENTS.md — Instruksi untuk AI Coding Assistant

> File ini dibaca oleh AI coding agent seperti Cursor, Cline, Copilot, Windsurf, Roo Code, Continue, Aider, dan sejenisnya.
> Ikuti file ini saat membuat, mengedit, mereview, atau merefaktor kode di project ini.

---

## Tujuan Utama

Bangun software yang profesional, maintainable, dan production-ready.
Hasilnya harus terasa seperti dibuat oleh tim engineering nyata — bukan template AI generik.

---

## Aturan Komunikasi

- Jawab langsung dan singkat.
- Jelaskan tradeoff penting.
- Tanya klarifikasi hanya jika benar-benar blocking.
- Jika requirement ambigu tapi tidak blocking, buat asumsi masuk akal dan sebut asumsinya.
- Prefer perubahan kecil dan aman daripada rewrite besar.
- Jangan berlebihan dengan emoji.

---

## Sebelum Menulis Kode

Sebelum modifikasi file apapun:

```
1. Inspect struktur project yang ada.
2. Identifikasi framework, bahasa, package manager, dan konvensi yang dipakai.
3. Baca file yang relevan sebelum mengedit.
4. Cek pola komponen yang sudah ada.
5. Cek naming convention yang sudah ada.
6. Cek pendekatan styling yang sudah ada.
7. Rencanakan perubahan sekecil dan seaman mungkin.
```

Jangan asumsikan stack kalau bisa diinspeksi langsung.

---

## File Referensi Project

Jika file-file ini ada, ikuti:

```
.dev-guide/README.md
.dev-guide/01-project-structure.md
.dev-guide/02-frontend.md
.dev-guide/03-backend.md
.dev-guide/04-security.md
.dev-guide/05-architecture.md
.dev-guide/06-git-workflow.md
.dev-guide/07-code-quality.md
.dev-guide/08-tooling.md
.dev-guide/09-responsive-design.md
.dev-guide/10-responsive-snippets.md
.dev-guide/11-quick-start.md
.dev-guide/12-testing.md
.dev-guide/13-devops.md
.dev-guide/14-observability.md
.dev-guide/15-project-lifecycle.md
.env.example
README.md
```

Jika ada konflik antar file, prioritaskan:

```
1. Instruksi user secara langsung
2. Keamanan dan kebenaran kode
3. Konvensi yang sudah ada di project
4. .dev-guide/04-security.md
5. .dev-guide/03-backend.md
6. .dev-guide/02-frontend.md
7. .dev-guide/07-code-quality.md
```

---

## Aturan UI

Saat membuat UI:

**Gunakan:**

- Desain SaaS profesional yang bersih
- Spacing konsisten (8-point system)
- Tipografi yang jelas dan hirarki yang baik
- Warna semantik sesuai konteks
- State lengkap: loading, empty, error, success
- Data shape yang realistis, bukan konten dekoratif palsu
- Layout yang responsive
- Aksesibilitas dasar (label, aria, focus)

**Hindari:**

- Shadow berlebihan
- Gradient berlebihan
- Glassmorphism kecuali diminta
- Terlalu banyak card
- Icon random tanpa konteks
- Emoji di UI kecuali diminta
- Copywriting AI generik ("Revolutionize your workflow")
- Animasi di semua elemen

**Target UI yang benar:**

- Linear, GitHub, Stripe Dashboard, Vercel Dashboard, Notion (admin-like)

**Bukan:**

- Neon admin template
- Gradient-heavy fake SaaS
- Dribbble shot yang susah dipakai
- Toy app penuh emoji

---

## Aturan Frontend

```
✅ Gunakan TypeScript jika tersedia
✅ Hindari any
✅ Reuse komponen yang sudah ada
✅ Komponen harus fokus, tidak campur aduk
✅ Ekstrak logika kompleks ke hooks atau utilities
✅ API call keluar dari komponen UI besar
✅ Form validation wajib
✅ Ikuti styling convention yang ada
❌ Jangan buat global state kecuali diperlukan
❌ Jangan scatter fetch calls di mana-mana
```

---

## Aturan Backend

```
✅ Validasi semua input
✅ Enforce auth & authorization di backend
✅ Response shape konsisten
✅ Handle error secara intentional
✅ Gunakan transaksi untuk multi-step writes
❌ Jangan percaya frontend checks
❌ Jangan bocorkan internal error ke user
❌ Jangan skip authorization check
```

---

## Aturan Database

```
✅ Pakai migrations
✅ Index untuk query yang sering
✅ Preserve data historis penting
✅ Prefer soft delete untuk data bisnis kritis
❌ Jangan modifikasi schema tanpa migrasi
❌ Jangan hardcode tenant/user ID
```

---

## Aturan Keamanan

**Jangan pernah:**

- Commit secrets atau API key
- Expose credentials di frontend
- Hardcode user ID atau tenant ID
- Disable auth agar kode jalan
- Percaya nilai role/permission dari client
- Tampilkan stack trace ke user

**Selalu:**

- Validasi input
- Cek permissions
- Handle unauthorized dan forbidden state
- Simpan sensitive logic di server

---

## Aturan Dependency

Sebelum tambah dependency:

```
1. Cek apakah project sudah punya yang equivalent
2. Prefer built-in framework features
3. Prefer library kecil, mature, maintained
4. Hindari dependency untuk utilitas trivial
5. Jelaskan mengapa dependency dibutuhkan
```

---

## Aturan Refactoring

Refactor hanya jika meningkatkan clarity, correctness, atau maintainability.

**Jangan:**

- Rewrite seluruh project tanpa alasan kuat
- Ubah file yang tidak relevan
- Rename banyak file tanpa alasan kuat
- Introduce library baru tanpa justifikasi
- Ganti pola yang bekerja hanya karena ada pola yang lebih "trendy"

---

## Token-Saving Rules (Efisiensi AI)

```
✅ Baca hanya file yang relevan dulu
✅ Summarize temuan sebelum edit besar
✅ Gunakan targeted patch, bukan rewrite
✅ Hindari repeat kode yang tidak berubah
✅ Prefer structured checklist
✅ Jawaban ringkas
❌ Jangan print seluruh file kecuali diminta
❌ Jangan satu task sekaligus semua
```

---

## Workflow yang Direkomendasikan

Untuk setiap task:

```
1. Pahami requirement.
2. Inspect file yang relevan.
3. Identifikasi pola yang sudah ada.
4. Propose rencana singkat.
5. Buat perubahan minimal.
6. Cek types / lint / tests jika tersedia.
7. Summarize file yang berubah dan risiko.
```

---

## Untuk Fitur Baru

Sebelum coding fitur baru, definisikan:

```
- User role yang terlibat
- Tujuan user
- Main flow
- Data model
- API contract
- UI states (loading, empty, error, success)
- Permission rules
- Edge cases
```

---

## Untuk Bug Fix

Sebelum fix:

```
- Reproduce secara mental atau dengan test
- Identifikasi root cause
- Fix area sekecil yang bertanggung jawab
- Hindari cleanup yang tidak terkait
- Tambah regression test jika praktis
```

---

## Untuk SaaS Products

Jika project kamu adalah SaaS product (bukan website statis / internal tool), selain itu semua, selalu pertimbangkan:

```
Multi-tenancy          → data harus scope per tenant/organisasi
Roles & permissions    → jangan hardcode role logic
Audit logs             → catat aksi penting
Billing readiness      → pertimbangkan usage tracking
Data import/export     → user butuh akses datanya
User invitations       → onboarding flow
Usage limits           → plan limits
Security               → lihat .dev-guide/04-security.md
Backups                → strategy backup data
```

---

## Domain-Specific Considerations

Dev guide ini berlaku universal untuk semua jenis project (e-commerce, akademik, HR, POS, health, dll).

Sebelum mulai coding, **identifikasi domain project dulu** — jangan asumsikan:

```
1. Tentukan domain project: e-commerce / akademik / HR / POS / lainnya?
2. Cek kebutuhan spesifik domain itu (tanyakan ke user jika tidak jelas)
3. Sesuaikan data model, role, dan fitur dengan domain

Contoh domain-specific checklist (hanya berlaku jika domain-nya sesuai):

Akademik/Sekolah:
├── Tahun ajaran & semester
├── Data siswa (NISN, kelas, jurusan)
├── Data guru & staff
├── Mata pelajaran & jadwal
├── Presensi (harian/per mapel)
├── Nilai (UTS, UAS, harian, rapor)
├── Laporan akademik (bisa dicetak/export)
├── Akses orang tua & siswa
├── Role-based permissions
├── Audit trail
└── Export ke Excel / PDF

E-commerce:
├── Produk & kategori & stok
├── Keranjang & checkout
├── Pembayaran & integrasi gateway
├── Ongkir & alamat pengiriman
├── Pesanan & status order
├── Kupon & promo
├── Review produk
└── Riwayat belanja user
```

---

## Format Output Setelah Perubahan

Setelah membuat perubahan, respond dengan:

```
Changed:
- namafile.ts: penjelasan singkat
- namafile.tsx: penjelasan singkat

Checked:
- Typecheck: pass / fail / not run
- Tests: pass / fail / not run
- Lint: pass / fail / not run

Notes:
- Asumsi yang dibuat
- Risiko yang perlu diperhatikan
```

Jangan sertakan penjelasan panjang yang tidak diperlukan.

---

## Definition of Done

Sebuah task dianggap selesai hanya jika:

```
[ ] Fitur bekerja untuk intended user
[ ] Kode readable
[ ] Types valid (tidak ada any sembarangan)
[ ] Lint pass
[ ] Edge case penting sudah dihandle
[ ] Loading / error / empty state ada (jika UI)
[ ] Keamanan tidak dilemahkan
[ ] Dokumentasi diupdate jika diperlukan
[ ] Implementasi mengikuti konvensi project
```

---

## AI-Assisted Coding Standards

Saat kamu (developer) menggunakan AI tools:

```
✅ Jangan accept code AI secara blind
✅ Minta AI jelaskan tradeoff
✅ Minta AI inspect pola yang sudah ada dulu
✅ Minta AI modifikasi hanya file yang diperlukan
✅ Minta AI produce small diffs
✅ Review generated code secara manual
✅ Run tests dan lint setelah perubahan
❌ Tolak generic UI dan over-engineered code
❌ Tolak kode yang tidak ikuti konvensi project
```

---

## Reminder Akhir

Build seperti professional engineer:

```
→ Baca sebelum edit
→ Pikir sebelum coding
→ Jaga perubahan tetap focused
→ Protect user data
→ Buat UI yang berguna, bukan cuma indah
→ Prefer boring, reliable software over flashy, fragile software
```
