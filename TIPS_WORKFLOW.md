# 📝 TIPS_WORKFLOW.md — Catatan Praktis Alur Kerja Proyek

> **Catatan Pengingat Cepat**: Buka file ini kapan pun Anda ingin memulai proyek baru, baik menggunakan **Framework** maupun **Tanpa Framework (Vanilla)**.

---

## ⚡ 1. Cara Cepat Memulai Proyek Baru (1 Baris Terminal)

Setiap kali Anda ingin membuat proyek baru di lokasi mana pun di komputer Anda:

```powershell
cd D:\DEV_GUIDE\unified-dev-guide
.\setup-project.ps1 -TargetDir "D:\projects\nama-proyek-kamu"
```

**Hasil otomatis:**
- Folder proyek dibuat.
- `AGENTS.md` dan `START_HERE.md` disalin ke root proyek.
- 117 skills dan playbook terhubung via *junction* (0 KB ruang disk, auto-update).
- Buka folder tersebut di Antigravity, dan AI siap kerja.

---

## 🎯 2. Panduan Workflow: Framework vs Tanpa Framework

| Skenario | Kapan Dipakai? | Pola Kerja AI | Skill Utama yang Digunakan |
| :--- | :--- | :--- | :--- |
| **A. Menggunakan Framework** | Proyek skala menengah-besar, web app, dashboard kompleks, SaaS. | Menggunakan arsitektur idiomatis framework (Server Components, composables, routing, migration). | - Framework: `skills/nextjs-developer` / `skills/vue-expert` / `skills/laravel-specialist`<br>- Styling: `skills/ui-ux-pro-max` (stack: `nextjs` / `shadcn` / `tailwind`)<br>- Database: `skills/postgres-pro` / `skills/database-optimizer` |
| **B. Tanpa Framework (Vanilla)** | Landing page cepat, prototipe MVP, web portofolio, PHP native, single page statis. | Menghindari dependensi berat/npm berlebih. Struktur kode bersih, file `index.html`, `style.css`, dan `app.js` yang modular. | - Logika: `skills/javascript-pro` (DOM modern, Fetch API, no jQuery/bloat)<br>- Styling: `skills/ui-ux-pro-max` (stack: `html-tailwind` atau pure CSS)<br>- Token Warna: [playbook/02-frontend.md](file:///d:/DEV_GUIDE/unified-dev-guide/playbook/02-frontend.md) (`variables.css`)<br>- Komponen Siap Pakai: [playbook/10-responsive-snippets.md](file:///d:/DEV_GUIDE/unified-dev-guide/playbook/10-responsive-snippets.md) |

---

## 🎨 3. Cara Mengunci Desain dengan UI/UX Pro Max

**Aturan Emas:** Sebelum menulis kode CSS atau komponen visual apa pun, kunci tema dan palet warna industri terlebih dahulu:

```bash
# Jalankan di terminal proyek target:
python .agents/skills/ui-ux-pro-max/scripts/search.py "<kategori-produk>" --design-system --persist -p "<NamaProyek>"
```

**Contoh:**
```bash
python .agents/skills/ui-ux-pro-max/scripts/search.py "fintech wealth investment" --design-system --persist -p "WealthGrow"
```

Ini otomatis membuat file `design-system/MASTER.md` yang berisi:
- Token warna `--color-primary`, `--color-accent`, dll.
- Rekomendasi font Google Fonts yang kredibel.
- Hal-hal yang DILARANG untuk industri tersebut (misal: dilarang neon atau gradien ungu acak untuk fintech).

---

## 💬 4. "Cheat Sheet" Prompting Sakti untuk AI

Salin dan gunakan formula prompt berikut sesuai kebutuhan Anda:

### 🔹 Skenario 1: Mulai Proyek Baru dengan Framework (Misal Next.js)
> *"Antigravity, ikuti START_HERE.md. Saya ingin membuat aplikasi SaaS CRM untuk agen properti dengan Next.js App Router, Tailwind, dan PostgreSQL. Mari mulai dari Fase 0 (Klarifikasi Kebutuhan), lalu jalankan UI/UX Pro Max untuk mengunci palet warnanya ke `design-system/MASTER.md`, kemudian susun struktur folder Fase 2."*

### 🔹 Skenario 2: Mulai Proyek Baru Tanpa Framework (Vanilla HTML/CSS/JS)
> *"Antigravity, ikuti START_HERE.md. Saya ingin membuat landing page portofolio agensi desain TANPA framework apa pun (pure HTML, CSS, dan Vanilla JS). Gunakan skill `javascript-pro` dan `ui-ux-pro-max`. Tolong buatkan token CSS di `style.css` sesuai `playbook/02-frontend.md` dan layout hero responsif dari `playbook/10-responsive-snippets.md`."*

### 🔹 Skenario 3: Proyek Sudah Sedang Berjalan (Audit & Refactor)
Jika Anda membuka proyek lama yang sudah ada kodenya:
> *"Tolong audit kode di folder `src/` ini:
> 1. Gunakan skill `secure-code-guardian` dan `playbook/04-security.md` untuk cek celah keamanan & authorization.
> 2. Gunakan `playbook/09-responsive-design.md` untuk cek apakah layout tampilan sudah aman di layar mobile 360px."*

### 🔹 Skenario 4: Menulis Teks Landing Page yang Menjual (Bukan AI Cliché)
> *"Baca `.agents/product-marketing.md`. Aktifkan skill `copywriting` dan `cro`. Tolong buatkan Headline dan 3 Value Proposition untuk Hero Section yang berfokus pada hasil nyata pengguna, bukan kata-kata promosi generik AI."*

---

## 🔄 5. Checklist 3 Langkah Sederhana Setiap Membangun Fitur

1. **Plan & Context**: Sebutkan nama fitur, stack yang dipakai, dan rujukan file playbook/skills.
2. **Design First**: Kunci token desain di `MASTER.md` (jangan hardcode heksadesimal acak).
3. **Build & Verify**: Buat komponen lengkap dengan 4 state (*Loading, Empty, Error, Success*), responsif di 360px - 1440px, dan uji WCAG AA (kontras min 4.5:1, icon wajib SVG).
