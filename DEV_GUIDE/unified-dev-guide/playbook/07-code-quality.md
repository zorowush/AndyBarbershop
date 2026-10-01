# 🧹 07 — Code Quality & Clean Code

---

## ⚖️ Prinsip Fundamental: KISS, DRY, YAGNI

Sebelum bicara soal style, kuasai 3 prinsip ini — mereka alasannya kenapa kode bagus itu bagus:

```
KISS  (Keep It Simple, Stupid)    — Solusi paling sederhana yang bekerja. Bukan yang paling pintar.
DRY   (Don't Repeat Yourself)     — Satu sumber kebenaran untuk satu logic.
YAGNI (You Aren't Gonna Need It)  — Jangan bangun fitur/abstraksi untuk kebutuhan yang belum ada.
```

```javascript
// ❌ Over-engineering (melanggar KISS & YAGNI)
// Dipakai untuk 2 tipe notif saja, tapi dibuat 4 file + interface + factory
class NotificationFactory {
  static create(type) {
    switch (type) {
      case 'email': return new EmailNotifier(new Mailer(new SmtpConfig()));
      case 'sms': return new SmsNotifier(new SmsProvider(new ApiKey()));
      default: throw new Error('Unknown type');
    }
  }
}

// ✅ Simpel — langsung, jelas, cukup untuk kebutuhan sekarang
async function sendNotification(user, message) {
  if (user.notificationPreference === 'email') {
    await sendEmail(user.email, message);
  }
}
```

**Rule of Three untuk DRY:**

```
Duplikasi 1-2x  → biarkan saja. Duplikasi 3x → baru ekstrak.
```

Kenapa? Abstraksi yang salah lebih mahal daripada duplikasi. Kalau kamu ekstrak terlalu cepat, kamu mengunci struktur yang ternyata salah — dan 3 tempat pemakaian itu yang memvalidasi bahwa abstraksinya memang benar.

```
Duplication is better than the wrong abstraction. — Sandi Metz
```

---

## 📖 Prinsip Naming yang Baik

```javascript
// ✅ Nama variabel: deskriptif, niat jelas
const isUserAuthenticated = true;
const activeProductList = [];
const MAX_RETRY_ATTEMPTS = 3;

// ❌ Nama yang tidak informatif
const flag = true;
const arr = [];
const n = 3;

// ✅ Nama fungsi: kata kerja + objek
function getUserById(id) {}
function validateEmailFormat(email) {}
function calculateTotalPrice(items) {}
function sendWelcomeEmail(user) {}

// ❌ Nama fungsi yang ambigu
function process(data) {}
function handle() {}
function doStuff(x) {}

// ✅ Boolean: awali dengan is, has, can, should
const isLoading = false;
const hasPermission = true;
const canEditPost = user.id === post.userId;
const shouldShowModal = items.length === 0;
```

---

## 🧩 Fungsi yang Baik

```javascript
// Prinsip: Satu fungsi = satu tanggung jawab

// ❌ Fungsi yang terlalu banyak hal
async function processOrder(orderId) {
  const order = await db.orders.findById(orderId);
  
  // Validasi
  if (!order) throw new Error('Order not found');
  if (order.status !== 'pending') throw new Error('Invalid status');
  
  // Hitung total
  let total = 0;
  for (const item of order.items) {
    const product = await db.products.findById(item.productId);
    total += product.price * item.quantity;
    await db.inventory.decrease(item.productId, item.quantity);
  }
  
  // Charge payment
  const payment = await stripe.charge({ amount: total });
  
  // Update order
  await db.orders.update(orderId, { status: 'paid', total, paymentId: payment.id });
  
  // Kirim email
  const user = await db.users.findById(order.userId);
  await sendEmail(user.email, 'Order confirmed', { order, total });
  
  return order;
}

// ✅ Pecah menjadi fungsi-fungsi kecil yang fokus
async function processOrder(orderId) {
  const order = await getValidatedOrder(orderId);
  const total = await calculateAndDeductInventory(order.items);
  const payment = await chargePayment(total);
  const updatedOrder = await finalizeOrder(orderId, { total, paymentId: payment.id });
  await notifyUserOrderConfirmed(order.userId, updatedOrder);
  
  return updatedOrder;
}

async function getValidatedOrder(orderId) {
  const order = await OrderRepository.findById(orderId);
  if (!order) throw new NotFoundError('Order not found');
  if (order.status !== 'pending') throw new BusinessError('Order already processed');
  return order;
}

async function calculateAndDeductInventory(items) {
  let total = 0;
  for (const item of items) {
    const product = await ProductRepository.findById(item.productId);
    total += product.price * item.quantity;
    await InventoryService.decrease(item.productId, item.quantity);
  }
  return total;
}
```

---

## 🚫 Anti-Pattern yang Harus Dihindari

### Magic Numbers & Magic Strings
```javascript
// ❌ Angka dan string tanpa konteks
if (user.role === 2) { /* ... */ }
setTimeout(refresh, 86400000);
if (items.length > 10) showPagination();

// ✅ Konstanta yang bermakna
const ROLES = { ADMIN: 1, USER: 2, MODERATOR: 3 };
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const PAGINATION_THRESHOLD = 10;

if (user.role === ROLES.USER) { /* ... */ }
setTimeout(refresh, ONE_DAY_MS);
if (items.length > PAGINATION_THRESHOLD) showPagination();
```

### Deep Nesting (Callback Hell)
```javascript
// ❌ Terlalu dalam — sulit dibaca
function processRequest(req, res) {
  if (req.user) {
    if (req.user.isActive) {
      if (req.body.productId) {
        getProduct(req.body.productId, (err, product) => {
          if (!err) {
            if (product.inStock) {
              // tambah ke cart...
            }
          }
        });
      }
    }
  }
}

// ✅ Early return / guard clauses
async function processRequest(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!req.user.isActive) return res.status(403).json({ message: 'Account inactive' });
  if (!req.body.productId) return res.status(400).json({ message: 'Product ID required' });

  const product = await ProductService.findById(req.body.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (!product.inStock) return res.status(409).json({ message: 'Out of stock' });

  // Logika utama di sini, tanpa nesting
  await CartService.addItem(req.user.id, product);
  res.json({ success: true });
}
```

---

## 📝 Komentar yang Berguna

```javascript
// ✅ Komentar menjelaskan MENGAPA, bukan APA
// Gunakan timeout 100ms karena browser butuh waktu untuk render dropdown
// sebelum kita bisa mengukur tingginya (lihat issue #234)
setTimeout(() => measureDropdownHeight(), 100);

// ✅ Komentar untuk logika bisnis yang kompleks
// Harga dihitung dari base price + pajak (11%) - diskon member (jika ada)
// Diskon member hanya berlaku jika total belanja > 500rb
const finalPrice = calculateFinalPrice(basePrice, taxRate, memberDiscount);

// ❌ Komentar yang redundant — kode sudah jelas
// Increment i by 1
i++;

// Set user name to the value from input
userName = input.value;
```

---

## 🔍 Code Review Checklist

Saat review kode orang lain (atau kode sendiri):

```
Correctness:
[ ] Logika sudah benar?
[ ] Edge case sudah ditangani? (null, empty, 0, negatif)
[ ] Error handling sudah ada?
[ ] Tidak ada race condition atau side effect yang tidak diinginkan?

Readability:
[ ] Nama variabel/fungsi sudah deskriptif?
[ ] Tidak ada kode yang dikomentari tanpa alasan?
[ ] Tidak ada debug code (console.log, dd(), die())?
[ ] Kompleksitas fungsi masuk akal?

Security:
[ ] Input sudah divalidasi?
[ ] Tidak ada sensitive data di log?
[ ] Authorization sudah dicek?

Performance:
[ ] Tidak ada N+1 query?
[ ] Loop sudah efisien?
[ ] Asset besar sudah lazy-load?

Maintainability:
[ ] DRY — tidak ada pengulangan yang tidak perlu?
[ ] Mudah di-test?
[ ] Ada komentar untuk logika yang tidak obvious?
```

---

## 🎯 Aturan Sederhana untuk Kode Bersih

```
1. Fungsi maksimal 20-30 baris
2. File maksimal 300 baris (kalau lebih, coba split)  
3. Maksimal 3 parameter per fungsi
4. Kedalaman nesting maksimal 3 level
5. Tidak ada komentar yang menjelaskan apa (hanya mengapa)
6. Tidak ada dead code — hapus, bukan komen
7. Setiap PR maksimal 400 baris perubahan (kalau lebih, pecah PR-nya)
8. Test dulu sebelum commit
9. Baca ulang kode sendiri seperti reviewer — apakah masuk akal?
10. Nama yang baik > komentar yang panjang
11. Boy Scout Rule — tinggalkan kode lebih bersih dari saat kamu menemukannya
    (rapikan 1 hal kecil tiap menyentuh file: hapus console.log, perbaiki nama,
    tambah early return)
```

---

## ✅ Definition of Done (DoD)

Sebuah task dianggap **selesai** hanya jika semua ini terpenuhi:

```
[ ] Fitur bekerja untuk intended user (tested secara manual)
[ ] Kode readable oleh developer lain
[ ] Types valid — tidak ada 'any' sembarangan (TypeScript)
[ ] Lint pass tanpa error
[ ] Edge case penting sudah dihandle (null, empty, unauthorized)
[ ] Loading / error / empty state ada (jika ada UI)
[ ] Keamanan tidak dilemahkan
[ ] Tidak ada console.log / debug code yang tertinggal
[ ] Dokumentasi diupdate jika ada perubahan API atau behavior
[ ] Implementasi mengikuti konvensi naming dan struktur project
```

> Ini bukan checklist opsional. Kalau satu item belum, task belum selesai.

---

## 🤖 AI-Assisted Coding Standards

Saat menggunakan AI (GitHub Copilot, Cursor, Cline, dll):

```
✅ DO — Lakukan ini:
- Minta AI inspect pola yang sudah ada di project dulu
- Minta AI jelaskan tradeoff dari solusi yang dihasilkan
- Minta AI modifikasi hanya file yang diperlukan
- Minta AI hasilkan small diff / targeted patch
- Review semua kode AI secara manual sebelum commit
- Run lint dan test setelah perubahan dari AI

❌ DON'T — Jangan lakukan ini:
- Accept kode AI secara blind tanpa baca
- Biarkan AI rewrite file yang tidak ada hubungannya
- Terima generic UI yang tidak sesuai project style
- Izinkan AI menambahkan dependency tanpa penjelasan
- Abaikan nama variabel yang tidak konsisten dengan codebase
```

Prinsip: **AI adalah tools, bukan pengganti judgment developer.**
Kamu yang bertanggung jawab atas kode yang di-commit, bukan AI-nya.

> **Catatan konsistensi:** Section "Definition of Done" dan "AI-Assisted Coding Standards"
> juga ada di `AGENTS.md` (versi yang dibaca AI assistant). Jika kamu mengubah salah
> satu, update keduanya agar tidak terjadi drift.
