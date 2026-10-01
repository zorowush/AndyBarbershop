# 🏛️ 05 — Arsitektur & Design Patterns

> Pola-pola yang dipakai software engineer profesional untuk membuat kode yang mudah dipahami, diperluas, dan dirawat.

---

## 🎯 Kapan Pakai Pattern Apa

| Situasi | Pattern yang Cocok |
|--------|-------------------|
| Banyak tempat yang perlu objek yang sama | Singleton |
| Pembuatan objek kompleks | Factory / Builder |
| Fitur yang bisa di-on/off atau diubah | Strategy |
| Event dan listener (notifikasi, log) | Observer |
| Bungkus API yang buruk / legacy | Adapter |
| Kurangi coupling antar komponen | Dependency Injection |
| Butuh undo/history | Command |

---

## 🏗️ Arsitektur MVC (Model-View-Controller)

```
User Request
     │
     ▼
  Controller ──→ Service ──→ Repository ──→ Database
     │               │
     │          Business Logic
     │
     ▼
   View (response)
```

**Aturan per layer:**
- **Controller**: Terima request, validasi input, panggil service, kembalikan response. Tidak boleh ada query database.
- **Service**: Business logic. Orkestrasi repository, kirim email, dll. Tidak tau tentang HTTP.
- **Repository**: Hanya query database. Tidak ada business logic.
- **Model**: Definisi struktur data, relasi, scope. Tidak ada business logic kompleks.

---

## 🔄 SOLID Principles (Praktis)

### S — Single Responsibility
```php
// ❌ Satu class terlalu banyak tanggung jawab
class UserController {
    public function register(Request $request) {
        // Validasi
        // Hash password
        // Simpan ke DB
        // Kirim email
        // Buat aktivitas log
        // Return response
        // TERLALU BANYAK!
    }
}

// ✅ Pisahkan tanggung jawab
class UserController {
    public function register(CreateUserRequest $request) {
        $user = $this->userService->createUser($request->validated());
        // Response format konsisten dengan 03-backend.md
        return response()->json(['success' => true, 'data' => $user], 201);
    }
}

class UserService {
    public function createUser(array $data): User {
        $user = $this->userRepo->create($data);
        $this->mailService->sendWelcome($user);
        $this->activityLog->log('user_registered', $user);
        return $user;
    }
}
```

### O — Open/Closed
```php
// ❌ Harus modifikasi class lama setiap kali tambah payment method
class PaymentProcessor {
    public function process(string $type, float $amount) {
        if ($type === 'credit_card') { /* ... */ }
        elseif ($type === 'gopay') { /* ... */ }
        elseif ($type === 'dana') { /* tambah terus */ }
    }
}

// ✅ Extend tanpa modifikasi
interface PaymentGateway {
    public function charge(float $amount): bool;
}

class MidtransGateway implements PaymentGateway { 
    public function charge(float $amount): bool { /* ... */ }
}

class XenditGateway implements PaymentGateway { 
    public function charge(float $amount): bool { /* ... */ }
}

class PaymentProcessor {
    public function __construct(private PaymentGateway $gateway) {}
    
    public function process(float $amount): bool {
        return $this->gateway->charge($amount);
    }
}
```

### D — Dependency Injection
```php
// ❌ Hard dependency — sulit di-test, sulit diubah
class OrderService {
    private $mailer;
    
    public function __construct() {
        $this->mailer = new SmtpMailer(); // terikat implementasi spesifik
    }
}

// ✅ Inject dependency dari luar
class OrderService {
    public function __construct(
        private OrderRepository $orderRepo,
        private MailerInterface $mailer,  // interface, bukan implementasi
        private EventDispatcher $events
    ) {}
}
```

### L — Liskov Substitution
Subclass harus bisa menggantikan parent-nya tanpa memecah perilaku. Jika tidak, jangan pakai inheritance.

```php
// ❌ Melanggar LSP — Square tidak bisa menggantikan Rectangle
class Rectangle {
    public function __construct(public int $width, public int $height) {}
}

class Square extends Rectangle {
    public function __construct(int $side) {
        parent::__construct($side, $side);
        // setHeight() nanti akan melanggar kontrak Rectangle
    }
}

// ✅ Favor composition / gunakan class terpisah
class Shape {
    public function __construct(public int $width, public int $height) {}
}

class Square {
    public function __construct(public int $side) {}

    public function area(): int {
        return $this->side ** 2;
    }
}
```

### I — Interface Segregation
Jangan paksa class mengimplementasikan method yang tidak dipakainya. Pecah interface besar.

```php
// ❌ Interface terlalu lebar
interface Worker {
    public function work();
    public function eat();       // Robot tidak makan!
    public function sleep();     // Robot tidak tidur!
}

class Robot implements Worker {
    public function work() { /* ... */ }
    public function eat() { throw new Exception('Robot tidak makan'); }
    public function sleep() { throw new Exception('Robot tidak tidur'); }
}

// ✅ Interface kecil per tanggung jawab
interface Workable {
    public function work();
}

interface Liveable {
    public function eat();
    public function sleep();
}

class Robot implements Workable {
    public function work() { /* ... */ }
}

class Human implements Workable, Liveable {
    public function work() { /* ... */ }
    public function eat() { /* ... */ }
    public function sleep() { /* ... */ }
}
```

---

## ⚡ Async & Queue Architecture

Proses berat (email, export PDF, integrasi payment) **jangan dijalankan sinkron** di request — pindahkan ke queue.

```
Synchronous (OK untuk proses ringan < 100ms):
Request → Service → Database → Response

Asynchronous (untuk proses berat):
Request → Service → Dispatch Job → Response (instan!)
                          ↓
                    Queue (Redis)
                          ↓
                    Queue Worker ← proses di background
```

```php
// ❌ Lambat — user nunggu email terkirim (3-5 detik)
public function store(CreateOrderRequest $request): JsonResponse
{
    $order = $this->orderService->createOrder($request->validated());
    Mail::to($order->user->email)->send(new OrderConfirmation($order)); // blocking!
    return response()->json(['success' => true, 'data' => $order], 201);
}

// ✅ Cepat — user dapat response instan, email diproses worker
public function store(CreateOrderRequest $request): JsonResponse
{
    $order = $this->orderService->createOrder($request->validated());
    SendOrderConfirmation::dispatch($order); // dikirim ke queue, langsung return
    return response()->json(['success' => true, 'data' => $order], 201);
}
```

**Kapan pakai queue:**
```
✅ Email / notifikasi — kirim 100 email butuh waktu
✅ Export PDF / Excel — proses lama, blocking user
✅ Integrasi API eksternal — payment, SMS, upload ke cloud
✅ Batch processing — import data besar, resize gambar
✅ Webhook processing — return 200 cepat, proses di belakang

❌ JANGAN pakai queue untuk: validasi data, query sederhana, logic yang hasilnya
   langsung dibutuhkan untuk response (paling lama 100ms)
```

**Catatan skala:**
- Skala kecil: cukup queue database (driver `database`) — tanpa Redis
- Skala besar: Redis queue + multiple worker + retry policy + dead-letter queue (lihat `13-devops.md`)

---

## 📦 Design Patterns Umum

### Repository Pattern
```php
// Interface
interface UserRepositoryInterface {
    public function findById(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function create(array $data): User;
    public function update(User $user, array $data): User;
    public function delete(int $id): bool;
}

// Implementasi
class EloquentUserRepository implements UserRepositoryInterface {
    public function findById(int $id): ?User {
        return User::find($id);
    }
    
    public function create(array $data): User {
        return User::create($data);
    }
    // ...
}

// Bind di Service Provider
$this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
```

### Observer Pattern
```php
// Event
class UserRegistered {
    public function __construct(public User $user) {}
}

// Listeners
class SendWelcomeEmail {
    public function handle(UserRegistered $event) {
        Mail::to($event->user->email)->send(new WelcomeMail($event->user));
    }
}

class CreateUserProfile {
    public function handle(UserRegistered $event) {
        Profile::create(['user_id' => $event->user->id]);
    }
}

// Dispatch event
event(new UserRegistered($user));
// Semua listener jalan otomatis — UserService tidak perlu tau siapa yang dengerin
```

### Strategy Pattern (JavaScript)
```javascript
// Strategi sorting yang bisa diganti
const sortStrategies = {
  byDate: (a, b) => new Date(b.date) - new Date(a.date),
  byName: (a, b) => a.name.localeCompare(b.name),
  byPrice: (a, b) => a.price - b.price,
};

class ProductList {
  constructor(products) {
    this.products = products;
    this.sortStrategy = sortStrategies.byDate; // default
  }

  setSortStrategy(strategy) {
    this.sortStrategy = strategy;
  }

  getSorted() {
    return [...this.products].sort(this.sortStrategy);
  }
}

const list = new ProductList(products);
list.setSortStrategy(sortStrategies.byPrice);
list.getSorted(); // Ganti strategy tanpa ubah class
```

---

## 🔌 API Layer Architecture (Frontend)

```javascript
// src/lib/api.js — Sentralisasi semua API call
import axios from 'axios';

// ⚠️ Token access: simpan di MEMORY (variable), bukan localStorage.
// Refresh token harus di HttpOnly cookie — lihat 04-security.md.
// localStorage rentan XSS → jangan pernah taruh token di sana.
let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const clearAccessToken = () => { accessToken = null; };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor — tambah token otomatis
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Response interceptor — handle error global
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Service per domain
export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.patch(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
```

> **Kenapa token di memory, bukan localStorage?** localStorage bisa dibaca JavaScript apa pun yang berhasil di-inject (XSS) — satu bug XSS kecil = seluruh session user dicuri. Refresh token di HttpOnly cookie tetap aman karena JavaScript tidak bisa membacanya. Tradeoff: access token hilang saat refresh halaman → minta refresh token via cookie untuk dapat access token baru.

---

## 🗺️ Frontend State Architecture

```
Lokal (useState/ref)     → State yang hanya relevan untuk satu komponen
                           Contoh: form input, toggle dropdown

Parent-Child (props)     → State yang dibagi antara parent dan beberapa child
                           Contoh: selected item yang perlu ditampilkan di anak

Global (Zustand/Pinia)   → State yang diakses banyak komponen tidak berkaitan
                           Contoh: user session, cart, notifikasi

Server (React Query)     → Data dari API — caching, refetch, optimistic update
                           Contoh: daftar produk, profil user
```

```javascript
// Zustand store (ringan, tanpa boilerplate Redux)
// Token tidak disimpan di sini — access token di memory (lihat api.js),
// refresh token di HttpOnly cookie. Store ini hanya simpan data user.
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    clearAccessToken(); // hapus access token dari memory
    set({ user: null, isAuthenticated: false });
  },
}));

// Penggunaan di komponen
const { user, logout } = useAuthStore();
```
