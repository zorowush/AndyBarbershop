# Product Requirement Document (PRD)
## Proyek: Website Resmi & Sistem Reservasi Andy Barbershop

---

### Informasi Dokumen
* **Nama Produk:** Website Resmi & WhatsApp Booking Gateway Andy Barbershop
* **Klien / Bisnis:** Andy Barbershop (Bakalan, Kalinyamatan, Jepara)
* **Status:** Siap Implementasi (Ready for Production)
* **Target Rilis:** Fase 1 (MVP)
* **Penulis:** Product Lead / Web Engineer

---

## 1. Executive Summary & Ringkasan Eksekutif

**Andy Barbershop** adalah penyedia jasa potong rambut pria terpercaya di Bakalan, Kalinyamatan, Jepara dengan reputasi tinggi di Google Maps (Rating **4.6 Bintang**). Jam operasional unik barbershop ini—yang dominan buka sore hingga malam hari (hingga pukul 22.00/23.00 WIB)—menjadi daya tarik utama bagi pelajar, pekerja kantoran, dan warga lokal.

Website ini dibangun sebagai **etalase digital satu halaman (Single-Page Landing Page)** yang bertujuan membangun identitas merek yang maskulin dan profesional, memberikan kepastian jadwal/jam buka bagi pelanggan, memamerkan katalog layanan dan inspirasi gaya rambut, serta memfasilitasi alur pemesanan jadwal potong rambut (antrean) tanpa hambatan via WhatsApp resmi (+62 896-9075-2162).

---

## 2. Latar Belakang & Pernyataan Masalah

### 2.1 Latar Belakang
* Andy Barbershop telah memiliki jejak digital di Google Maps, namun belum memiliki portal resmi mandiri yang menyajikan daftar harga terperinci, katalog gaya rambut, dan panduan reservasi langsung.
* Pelanggan sering kali menanyakan pertanyaan berulang melalui pesan singkat terkait:
  1. *Apakah barbershop buka hari ini dan sampai jam berapa?*
  2. *Berapa kisaran harga potong rambut, semir, atau paket komplit?*
  3. *Bisakah reservasi jadwal agar tidak perlu antre lama?*

### 2.2 Pernyataan Masalah (Problem Statement)
* **Bagi Pelanggan:** Risiko datang ke lokasi saat barbershop tutup atau mendapati antrean panjang karena ketidakpastian jam operasional harian.
* **Bagi Pemilik Barbershop:** Waktu terbuang untuk menjawab pesan manual berformat bebas di WhatsApp mengenai harga, jenis layanan, dan jadwal yang tersedia.

---

## 3. Tujuan Produk & Metrik Keberhasilan (KPI)

### 3.1 Tujuan Produk
1. Menyediakan landing page responsif, cepat, dan berkesan premium dengan palet warna *Dark Slate & Gold*.
2. Mengotomatisasi penyusunan pesan booking WhatsApp sehingga pelanggan dapat mengirim format reservasi yang rapi hanya dalam beberapa klik.
3. Menyajikan transparansi jadwal operasional 7 hari seminggu dengan visual highlight otomatis untuk hari yang aktif.
4. Menghubungkan titik lokasi Google Maps agar rute navigasi pelanggan menuju Kalinyamatan, Jepara menjadi akurat.

### 3.2 Indikator Kinerja Utama (Key Performance Indicators)
* **Conversion Rate (CR):** $\ge 15\%$ dari total pengunjung mengklik tombol WhatsApp atau menyelesaikan form booking.
* **Kecepatan Akses (Core Web Vitals):** Skor Google Lighthouse $\ge 90$ untuk performa, aksesibilitas, dan SEO di perangkat mobile.
* **Penurunan Bounce Rate:** Waktu keterlibatan pengguna rata-rata (Average Engagement Time) $\ge 45$ detik.

---

## 4. Persona Pengguna (User Persona)

| Atribut | Persona 1: Pekerja / Profesional Muda | Persona 2: Pelajar / Mahasiswa |
| :--- | :--- | :--- |
| **Nama Representatif** | Dimas (26 tahun) | Rizky (18 tahun) |
| **Pekerjaan & Rutinitas** | Karyawan pabrik/swasta di Jepara, pulang kerja pukul 17.30 WIB | Pelajar SMA/Mahasiswa di Kalinyamatan |
| **Kebutuhan Utama** | Memastikan tempat cukur masih buka malam hari dan tidak antre berjam-jam | Memilih model potongan rambut tren (Fade, Two Block, Mullet) dengan harga terjangkau |
| **Pain Points** | Pulang kerja lelah, tidak mau kecewa jika tiba-tiba barbershop tutup | Ragu masuk jika belum tahu daftar harga pasti |
| **Perilaku Digital** | 95% mengakses lewat smartphone, menyukai komunikasi via WhatsApp | Mengakses melalui smartphone, menyukai visual foto & referensi gaya |

---

## 5. Ruang Lingkup Proyek (Scope of Work)

### 5.1 Masuk dalam Lingkup (In-Scope - MVP)
* Arsitektur Single Page Application (SPA) berbasis HTML5, Tailwind CSS, dan Vanilla JavaScript.
* Top Navigation Bar responsif (Desktop & Mobile Burger Menu).
* Hero Section dengan *social proof* rating Google Maps (4.6★) & Call to Action (CTA) instan.
* Kartu Layanan & Daftar Tarif Transparan (Classic Haircut, Beard Trim, Hair Wash, Hair Tattoo, Coloring, Full Grooming).
* Galeri Inspirasi Hairstyle (Taper Fade, Two Block, French Crop, Modern Mullet, Pompadour, Side Part).
* Modul Jam Operasional Dinamis dengan deteksi otomatis hari lokal (JS Date API).
* Modul Lokasi Terintegrasi dengan Google Maps Iframe, Alamat Lengkap, dan Plus Code (`7P6H+Q84`).
* Komponen Modal Interaktif "WhatsApp Reservation Generator" yang memvalidasi nama, pilihan layanan, tanggal, dan jam.
* Social Proof Section menampilkan ulasan terverifikasi pelanggan.
* Footer komprehensif berisi hak cipta, navigasi pintas, dan kontak darurat.

### 5.2 Di Luar Lingkup (Out-of-Scope - Next Phase)
* Integrasi Database backend (PostgreSQL/MySQL) atau dashboard admin kustom.
* Sistem gateway pembayaran otomatis (Payment Gateway Midtrans/Xendit) — transaksi tetap diselesaikan langsung di kasir (tunai/QRIS).
* Otentikasi / Registrasi akun member pengguna.

---

## 6. Persyaratan Fungsional (Functional Requirements)

### FR-01: Navigasi & Tampilan Antarmuka
* **FR-01.1:** Header harus tetap menempel di atas layar (*sticky*) saat pengguna menggulir halaman, dilengkapi efek latar semi-transparan (*backdrop blur*).
* **FR-01.2:** Pada layar dengan lebar $< 768\text{ px}$ (mobile), navigasi desktop berubah menjadi menu hamburger yang dapat dibuka dan ditutup dengan transisi halus.
* **FR-01.3:** Setiap item menu harus melakukan *smooth scrolling* menuju *anchor ID* yang dituju (`#beranda`, `#layanan`, `#galeri`, `#lokasi-jam`, `#testimoni`).

### FR-02: Modul Layanan & Integrasi Prefill Booking
* **FR-02.1:** Setiap kartu layanan menampilkan judul, deskripsi paket pengerjaan, daftar *benefit*, dan nominal harga (Rp).
* **FR-02.2:** Menekan tombol "Pilih Layanan" pada kartu tertentu wajib membuka Modal Booking dan secara otomatis memilih layanan tersebut pada elemen `<select>`.

### FR-03: WhatsApp Booking Generator (Modal)
* **FR-03.1:** Modal wajib meminta masukan pengguna:
  * Nama Lengkap (Wajib / *Required*)
  * Pilihan Layanan (Dropdown)
  * Tanggal Pemesanan (Datepicker, default: hari ini)
  * Perkiraan Jam Kedatangan (Dropdown sesuai jam operasional)
  * Catatan / Request Model Rambut (Opsional)
* **FR-03.2:** Sistem harus memvalidasi agar field "Nama" tidak boleh kosong. Jika kosong, tampilkan peringatan peringatan visual berwarna kuning/merah.
* **FR-03.3:** Ketika validasi terpenuhi, sistem mengonversi seluruh data ke dalam format teks terstruktur yang di-encode URL (`encodeURIComponent`) dan membuka URL WhatsApp API:
  $$\text{https://wa.me/6289690752162?text=...}$$

### FR-04: Deteksi Jam Operasional Hari Ini (Dynamic Schedule)
* **FR-04.1:** Sistem JavaScript membaca indeks hari lokal klien menggunakan `new Date().getDay()` ($0 = \text{Minggu}, 1 = \text{Senin}, \dots, 6 = \text{Sabtu}$).
* **FR-04.2:** Baris jadwal yang sesuai dengan hari saat ini wajib diberikan penanda visual khusus (*highlight* emas dan label `HARI INI`).
* **FR-04.3:** Hero widget wajib menampilkan teks dinamis jam buka hari ini secara akurat:
  * Senin – Rabu: `19:00 - 22:00 WIB`
  * Kamis: `19:00 - 23:00 WIB`
  * Jumat: `19:00 - 22:00 WIB`
  * Sabtu: `15:00 - 23:00 WIB`
  * Minggu: `12:00 - 23:00 WIB`

### FR-05: Integrasi Geografis & Peta
* **FR-05.1:** Halaman wajib menampilkan peta interaktif Google Maps yang terfokus pada titik Andy Barbershop di Kalinyamatan Jepara.
* **FR-05.2:** Tersedia tombol langsung menuju aplikasi Google Maps dengan tautan deep link / CID navigasi.

---

## 7. Persyaratan Non-Fungsional (Non-Functional Requirements)

| Kategori | Parameter | Spesifikasi |
| :--- | :--- | :--- |
| **Performa** | Waktu Muat (LCP) | $< 2.0\text{ detik}$ pada jaringan 4G standar |
| **Responsivitas** | Kompatibilitas Layar | 100% responsif dari ukuran layar $320\text{ px}$ (Mobile) hingga $1920\text{ px}$ (4K Desktop) |
| **Aksesibilitas** | Kontras Warna | Memenuhi standar WCAG 2.1 Level AA untuk keterbacaan teks emas/putih di latar gelap |
| **Kompatibilitas** | Browser | Google Chrome, Safari, Mozilla Firefox, Edge, dan Samsung Internet |
| **Dependensi** | Keandalan | Berbasis client-side murni tanpa ketergantungan runtime server dinamis (dapat di-host via GitHub Pages, Vercel, Netlify, atau Cloudflare Pages) |

---

## 8. Desain & Arsitektur Visual (Design System)

### 8.1 Palet Warna
* **Darker Background:** `#0B0F19` (Latar utama)
* **Card Slate:** `#161F30` (Latar kartu dan modal)
* **Primary Gold Accent:** `#D4AF37` (Aksen tombol, ikon, sorotan teks)
* **Gold Light:** `#F3E5AB` (Warna hover & gradasi teks)
* **Emerald Green:** `#059669` (Tombol WhatsApp & status buka)
* **Text Slate:** `#CBD5E1` (Body text sekunder) & `#FFFFFF` (Heading utama)

### 8.2 Tipografi
* **Body Font:** `Plus Jakarta Sans` (Modern, bersih, mudah dibaca di mobile)
* **Display/Heading Font:** `Cinzel` & `Plus Jakarta Sans Extra Bold` (Mencerminkan ketegasan maskulin barbershop)

---

## 9. Struktur Data Reservasi WhatsApp (Contract Payload)

Berikut adalah cetak biru format pesan WhatsApp terotomatisasi yang dikirimkan ke nomor barber:

```text
Halo Andy Barbershop, saya ingin booking antrean cukur:

• Nama: [Nama Pelanggan]
• Layanan: [Nama Layanan Terpilih]
• Tanggal: [YYYY-MM-DD]
• Estimasi Jam: [Jam Kedatangan]
• Catatan / Model: [Catatan Opsional]

Mohon infokan ketersediaan slotnya. Terima kasih!
```

---

## 10. Rencana Rilis & Roadmap Pengembangan

```
+-------------------------------------------------------------+
| FASE 1: MVP Peluncuran (Selesai)                            |
| - Desain responsif Tailwind CSS                             |
| - Integrasi WA Generator & Jam Dinamis                      |
| - Deployment ke Static Hosting                              |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| FASE 2: Optimalisasi SEO Lokal & Media (Bulan 1-2)          |
| - Penambahan Schema.org LocalBusiness JSON-LD               |
| - Penggantian gambar Unsplash dengan dokumentasi riil outlet|
| - Optimasi Google Search Console & integrasi Google Review  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| FASE 3: Sistem Antrean Berbasis Web (Masa Depan)            |
| - Fitur nomor antrean live di layar barbershop              |
| - Notifikasi estimasi panggilan melalui bot WhatsApp        |
+-------------------------------------------------------------+
```

---

## 11. Manajemen Risiko & Mitigasi

1. **Risiko:** Pelanggan salah memilih jam kedatangan di luar jam operasional (misal: memilih siang hari pada hari kerja biasa).
   * **Mitigasi:** Dropdown jam pada form booking telah dikurasi dengan keterangan jelas (misal: `15:00 WIB (Khusus Sabtu)`, `13:00 WIB (Khusus Minggu)`).
2. **Risiko:** Perubahan jam operasional sewaktu-waktu oleh pihak barber saat hari libur nasional.
   * **Mitigasi:** Struktur kode JavaScript dirancang modular sehingga objek jadwal `schedules` di `index.html` dapat diperbarui dengan mudah dalam satu baris kode.