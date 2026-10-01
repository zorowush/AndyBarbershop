# ⚙️ 03 — Backend Best Practice

> API Design, Database, Error Handling, Logika Bisnis

---

## 🌐 REST API Design

### URL Structure
```
✅ Baik:
GET    /api/v1/users              ← Ambil semua user
GET    /api/v1/users/{id}         ← Ambil user tertentu
POST   /api/v1/users              ← Buat user baru
PUT    /api/v1/users/{id}         ← Update seluruh data
PATCH  /api/v1/users/{id}         ← Update sebagian data
DELETE /api/v1/users/{id}         ← Hapus user

GET    /api/v1/users/{id}/orders  ← Relasi (orders milik user)

❌ Buruk:
GET    /api/getUser
POST   /api/createNewUser
GET    /api/deleteUser?id=1       ← Hapus via GET? Berbahaya!
POST   /api/user_management/doCreate
```

### HTTP Status Code yang Tepat
```
200 OK           ← Request berhasil (GET, PUT, PATCH)
201 Created      ← Resource berhasil dibuat (POST)
204 No Content   ← Berhasil tapi tidak ada response body (DELETE)
400 Bad Request  ← Data yang dikirim tidak valid
401 Unauthorized ← Belum login / token tidak valid
403 Forbidden    ← Sudah login tapi tidak punya akses
404 Not Found    ← Resource tidak ada
409 Conflict     ← Konflik (misal email sudah terdaftar)
422 Unprocessable Entity ← Validasi gagal
429 Too Many Requests    ← Rate limit
500 Internal Server Error ← Kesalahan server (jangan bocorkan detail)
```

### Format Response yang Konsisten
```json
// Sukses - single resource
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Zora",
    "email": "zora@example.com"
  },
  "message": "User berhasil diambil"
}

// Sukses - multiple resource
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "per_page": 15,
    "current_page": 1,
    "last_page": 7
  }
}

// Error
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": ["Email sudah digunakan"],
    "password": ["Password minimal 8 karakter"]
  }
}
```

**Aturan `message`:**
- **Wajib** untuk mutasi (POST / PUT / PATCH / DELETE) — user butuh konfirmasi aksi
- **Opsional** untuk GET — data sudah cukup informatif
- Selalu konsisten: satu format untuk semua endpoint, jangan ada yang pakai `msg` / `error` / `message` secara acak

Saran: buat base helper `successResponse()` / `errorResponse()` sekali, reuse di semua controller.

---

## 🗄️ Database Best Practice

### Migrations
```sql
-- Selalu ada: id, timestamps (created_at, updated_at)
-- Gunakan soft delete (deleted_at) untuk data penting

CREATE TABLE users (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin', 'user') DEFAULT 'user',
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP NULL         -- soft delete
);
```

> **Catatan role ENUM**: cukup untuk skala kecil. Tapi menambah role baru (misal `supervisor`) = ALTER TABLE. Untuk skala besar / role yang sering berubah, gunakan tabel `roles` + `role_user` pivot — bisa dikelola dari admin panel tanpa migrasi.

-- Index pada kolom yang sering di-query atau dijoin
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
```

### Query Optimization
```php
// Laravel Eloquent — hindari N+1 query

// ❌ N+1 problem — 1 query ambil users + N query per user untuk orders
$users = User::all();
foreach ($users as $user) {
  echo $user->orders->count(); // query per user!
}

// ✅ Eager loading — 2 query total
$users = User::with('orders')->get();
foreach ($users as $user) {
  echo $user->orders->count();
}

// ✅ Hanya ambil kolom yang dibutuhkan
$users = User::select('id', 'name', 'email')->get();

// ✅ Chunk untuk data besar, jangan ambil semua sekaligus
User::chunk(500, function ($users) {
  foreach ($users as $user) {
    // proses per batch
  }
});
```

### Naming Convention Database
```
Tabel       : snake_case, plural  → users, product_categories, order_items
Kolom       : snake_case          → first_name, created_at, is_active
Foreign key : {tabel_singular}_id → user_id, product_id
Pivot table : alfabetis           → product_tag (bukan tag_product)
Index       : idx_{tabel}_{kolom} → idx_users_email
```

---

## 🏗️ Arsitektur Layer Backend

```
Request → Controller → Service → Repository → Model → Database
                ↓
           FormRequest (Validasi)
```

```php
// Controller — hanya routing dan response
class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->userService->createUser($request->validated());
        return response()->json(['success' => true, 'data' => $user], 201);
    }
}

// Service — business logic
class UserService
{
    public function __construct(private UserRepository $userRepo) {}

    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $user = $this->userRepo->create($data);
        
        // Logic lain: kirim email, buat aktivitas log, dll
        Mail::to($user->email)->send(new WelcomeMail($user));
        
        return $user;
    }
}

// Repository — interaksi database
class UserRepository
{
    public function create(array $data): User
    {
        return User::create($data);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
```

---

## 🔄 Error Handling

```php
// Laravel — Handler.php atau exception custom

class ApiException extends Exception
{
    public function __construct(
        string $message,
        private int $statusCode = 400,
        private array $errors = []
    ) {
        parent::__construct($message);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
            'errors' => $this->errors,
        ], $this->statusCode);
    }
}

// Penggunaan
throw new ApiException('User tidak ditemukan', 404);
```

```javascript
// Node.js / Express — Middleware error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Jangan bocorkan stack trace di production
  const response = {
    success: false,
    message: err.message || 'Terjadi kesalahan internal',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  console.error(`[${new Date().toISOString()}] ${err.stack}`);
  
  res.status(statusCode).json(response);
};

// Selalu tangkap async error
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Penggunaan
router.get('/users', asyncHandler(async (req, res) => {
  const users = await UserService.getAll();
  res.json({ success: true, data: users });
}));
```

---

## 📝 Validasi Input

```php
// Laravel FormRequest — WAJIB untuk semua input dari user
class CreateUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role'     => ['sometimes', 'in:admin,user'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Email sudah terdaftar',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
        ];
    }
}
```

---

## 🚀 Caching Strategy

```php
// Cache data yang jarang berubah, sering dibaca
public function getActiveCategories(): Collection
{
    return Cache::remember('categories:active', now()->addHours(6), function () {
        return Category::where('is_active', true)
            ->orderBy('name')
            ->get();
    });
}

// Invalidate cache saat data berubah
public function updateCategory(Category $category, array $data): Category
{
    $category->update($data);
    Cache::forget('categories:active');
    return $category;
}
```

---

## 📋 Structured Logging

Logger default Laravel/Node.js bisa saja, tapi untuk production dan debugging tim, **structured logging** adalah keharusan.

### Prinsip

```
✅ JSON format — machine parsable, gampang di-query di Grafana/ELK
✅ Correlation ID — trace request dari frontend ke database
✅ Log levels yang tepat — debug, info, warn, error, critical
✅ Context yang cukup — user_id, resource, duration, ip
❌ Jangan log data sensitif — password, token, nomor telepon
❌ Jangan log terlalu banyak — flooding bikin noise
```

### Konfigurasi Laravel

```php
// config/logging.php — gunakan stack channel
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'stderr'],
        'ignore_exceptions' => false,
    ],

    'json' => [
        'driver' => 'single',
        'path' => storage_path('logs/laravel.json'),
        'formatter' => Monolog\Formatter\JsonFormatter::class,
        'level' => env('LOG_LEVEL', 'debug'),
    ],
];
```

### Contoh Logging yang Baik

```php
// ✅ Informative — context lengkap, format JSON
Log::info('Order created', [
    'order_id'    => $order->id,
    'user_id'     => auth()->id(),
    'total'       => $order->total,
    'items_count' => $order->items->count(),
    'duration_ms' => $duration,
    'correlation_id' => request()->header('X-Correlation-ID'),
]);

// ✅ Warning — kondisi yang perlu diinvestigasi
Log::warning('Payment gateway timeout', [
    'order_id'    => $order->id,
    'gateway'     => 'midtrans',
    'attempt'     => $retryCount,
    'timeout_ms'  => 30000,
]);

// ✅ Error — exception dengan context
try {
    $payment = $gateway->charge($amount);
} catch (PaymentException $e) {
    Log::error('Payment failed', [
        'order_id'  => $order->id,
        'amount'    => $amount,
        'error'     => $e->getMessage(),
        'trace_id'  => $e->getTraceId(),
    ]);
    throw $e;
}

// ❌ Jangan log data sensitif
Log::info('Login attempt', ['password' => $password]); // BERBAHAYA!
```

### Correlation ID — Trace Request End-to-End

```php
// Middleware — generate atau forward correlation ID
class CorrelationIdMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $correlationId = $request->header('X-Correlation-ID')
            ?? (string) Str::uuid();

        // Inject ke request
        $request->attributes->set('correlation_id', $correlationId);

        // Forward ke response header
        $response = $next($request);
        $response->header('X-Correlation-ID', $correlationId);

        // Inject ke semua log channel
        Log::withContext(['correlation_id' => $correlationId]);

        return $response;
    }
}
```

---

## 🧪 Backend Testing

### Testing Pyramid untuk Backend

```
         ╱╲
        ╱ E2E╲          ← beberapa flow kritis
       ╱──────╲
      ╱  API   ╲        ← test setiap endpoint
     ╱──────────╲
    ╱ Service/Unit╲      ← test business logic
   ╱────────────────╲
```

### Laravel Pest — HTTP Test

```php
<?php

use App\Models\User;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

it('lists all users', function () {
    User::factory()->count(3)->create();

    $response = getJson('/api/v1/users');

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

it('creates a user with valid data', function () {
    $response = postJson('/api/v1/users', [
        'name'     => 'Test User',
        'email'    => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201);
    expect(User::where('email', 'test@example.com'))->toExist();
});

it('rejects invalid email', function () {
    postJson('/api/v1/users', [
        'name'  => 'Test',
        'email' => 'not-an-email',
    ])->assertStatus(422);
});
```

### Service / Unit Test (Pest)

```php
<?php

use App\Services\DiscountService;

it('applies member discount for loyal customers', function () {
    $service = new DiscountService();

    $total = $service->calculate(500000, ['is_member' => true]);

    expect($total)->toBe(450000); // 10% off
});

it('does not apply discount to non-members', function () {
    $service = new DiscountService();

    $total = $service->calculate(500000, ['is_member' => false]);

    expect($total)->toBe(500000);
});
```

### Database Test — Factory & Refresh

```php
<?php

use App\Models\Order;
use App\Models\Product;
use function Pest\Laravel\assertDatabaseHas;

// Refresh database setiap test (gunakan trait)
uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class,
);

it('creates order with items', function () {
    $product = Product::factory()->create(['price' => 25000]);

    $order = Order::factory()
        ->hasAttached($product, ['quantity' => 2, 'price' => 25000])
        ->create();

    assertDatabaseHas('order_items', [
        'order_id'   => $order->id,
        'product_id' => $product->id,
        'quantity'   => 2,
    ]);

    expect($order->total)->toBe(50000);
});
```

### Aturan Testing Backend

```
✅ Setiap endpoint punya test: happy path + 2 error case minimal
✅ Service logic tested tanpa database (pure unit test)
✅ Integration test using factory, bukan data real
✅ Jangan test Eloquent ORM — itu sudah di-test oleh Laravel team
✅ Test authorization — pastikan user tanpa akses dapat 403
✅ Test rate limiting — pastikan throttle bekerja
✅ Gunakan RefreshDatabase atau transaction per test

❌ Jangan buat test yang depend on test lain (ordered test)
❌ Jangan test dengan data hardcoded yang tidak di-factory
❌ Jangan skip error case — "user not found", "validation failed"
```

### Testing Tools

```
Laravel:
├── Pest PHP (recommended) — lebih readable dari PHPUnit
├── Laravel Dusk — browser testing (kalau butuh)
└── Mockery — mocking external service

Node.js:
├── Vitest — unit & integration test
├── Supertest — HTTP assertion
├── Testcontainers — database container untuk integration test
└── MSW — mock external API
```

Lihat strategi testing lebih lengkap di **`12-testing.md`**.

---

## ✅ Checklist Backend Sebelum Deploy

```
API:
[ ] Semua endpoint punya autentikasi yang sesuai
[ ] Response format konsisten di semua endpoint
[ ] Rate limiting sudah dipasang
[ ] Input validasi di semua endpoint yang menerima data
[ ] Tidak ada data sensitif (password, token) di response

Database:
[ ] Semua foreign key punya index
[ ] Migration bisa dijalankan ulang (idempotent)
[ ] Ada seeder untuk data awal yang dibutuhkan
[ ] Tidak ada raw SQL tanpa parameterized query

Error Handling:
[ ] Semua async function ada try-catch atau asyncHandler
[ ] Error log berjalan dengan baik
[ ] Pesan error production tidak bocorkan internal info
[ ] 500 error tidak muncul untuk validasi yang seharusnya 400/422
```
