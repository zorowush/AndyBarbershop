# 🧪 12 — Testing Strategy

> Testing bukan opsional. Solo atau tim, testing adalah jaring pengaman yang bikin kamu berani refactor, deploy dengan percaya diri, dan tidur nyenyak.

---

## 🗼 Testing Pyramid

```
            ╱╲
           ╱  ╲
          ╱ E2E╲            ← 10%  — Playwright, Cypress
         ╱──────╲
        ╱        ╲
       ╱Integration╲         ← 20%  — HTTP test, DB test, API test
      ╱──────────────╲
     ╱                ╲
    ╱   Unit Test      ╲      ← 70%  — Vitest, Pest, PHPUnit
   ╱──────────────────────╲
```

**Prinsip:**
- **Banyak** unit test — cepat, isolated, ngetes satu fungsi/class
- **Sedang** integration test — ngetes interaksi antar layer (controller + service + DB)
- **Sedikit** E2E test — ngetes critical user flow aja (login, checkout, registrasi)

---

## 🧩 Unit Testing

### JavaScript / TypeScript (Vitest)

```typescript
// utils/formatNumber.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from './formatter';

describe('formatCurrency', () => {
  it('formats number to IDR currency', () => {
    expect(formatCurrency(250000)).toBe('Rp 250.000');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('Rp 0');
  });

  it('handles large numbers', () => {
    expect(formatCurrency(1000000000)).toBe('Rp 1.000.000.000');
  });
});

describe('formatDate', () => {
  it('formats date string to Indonesian locale', () => {
    expect(formatDate('2025-05-31')).toBe('31 Mei 2025');
  });

  it('handles invalid date gracefully', () => {
    expect(() => formatDate('not-a-date')).toThrow('Invalid date');
  });
});
```

### PHP / Laravel (Pest)

```php
<?php

use App\Services\DiscountService;

it('applies 10% discount for orders above 500k', function () {
    $service = new DiscountService();
    $total = $service->calculate(600000);

    expect($total)->toBe(540000);
});

it('does not apply discount for orders below 500k', function () {
    $service = new DiscountService();
    $total = $service->calculate(300000);

    expect($total)->toBe(300000);
});

it('throws exception for negative amount', function () {
    $service = new DiscountService();
    $service->calculate(-100);
})->throws(InvalidArgumentException::class);
```

### Aturan Unit Test

```
✅ Test satu hal saja per test function
✅ Gunakan describe/group untuk organize
✅ Nama test harus jelas: "should ... when ..."
✅ Test edge case: null, empty, 0, negative, max value
✅ Test error case juga, bukan hanya happy path

❌ Jangan test implementation detail (private method, internal state)
❌ Jangan buat test yang butuh database untuk pure function
❌ Jangan copy-paste test — tiap test harus punya alasan
```

---

## 🔗 Integration Testing

### HTTP API Test (Laravel Pest)

```php
<?php

use App\Models\User;
use function Pest\Laravel\postJson;
use function Pest\Laravel\getJson;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('can register a new user', function () {
    $response = postJson('/api/v1/auth/register', [
        'name'     => 'Budi Santoso',
        'email'    => 'budi@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJson(['success' => true]);
});

it('rejects duplicate email', function () {
    User::factory()->create(['email' => 'budi@example.com']);

    $response = postJson('/api/v1/auth/register', [
        'name'     => 'Budi Lain',
        'email'    => 'budi@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

it('requires authentication for protected endpoints', function () {
    getJson('/api/v1/users')
        ->assertStatus(401);
});
```

### Integration Test dengan Database (Laravel)

```php
<?php

use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use function Pest\Laravel\assertDatabaseHas;

it('creates order with correct total', function () {
    $product = Product::factory()->create(['price' => 50000]);

    $service = app(OrderService::class);
    $order = $service->createOrder([
        'items' => [
            ['product_id' => $product->id, 'quantity' => 3],
        ],
    ]);

    expect($order->total)->toBe(150000);
    assertDatabaseHas('order_items', [
        'order_id'   => $order->id,
        'product_id' => $product->id,
        'quantity'   => 3,
        'price'      => 50000,
    ]);
});
```

### Integration Test dengan API Mock (Vitest + MSW)

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

const server = setupServer(
  http.post('/api/v1/auth/login', () => {
    return HttpResponse.json({
      success: true,
      data: { token: 'fake-token', user: { name: 'Budi' } },
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('shows success message after login', async () => {
  render(<LoginForm />);

  await userEvent.type(screen.getByLabelText('Email'), 'budi@test.com');
  await userEvent.type(screen.getByLabelText('Password'), 'password123');
  await userEvent.click(screen.getByRole('button', { name: 'Masuk' }));

  await waitFor(() => {
    expect(screen.getByText('Selamat datang, Budi!')).toBeInTheDocument();
  });
});
```

---

## 🎭 Mocking Strategy

| Situasi | Mock | Real |
|---------|------|------|
| External API (stripe, midtrans) | ✅ Mock | ❌ |
| Email sending | ✅ Mock / Fake Mailer | ❌ |
| Database query (unit test) | ✅ Mock Repository | ❌ |
| Database query (integration) | ❌ | ✅ Test DB (SQLite / PostgreSQL test) |
| Current time / Date | ✅ Mock | ❌ |
| File system | ✅ Mock | ❌ |
| Another service dalam 1 project | ❌ | ✅ Panggil real service |

```php
// ✅ Mock external API di unit test
$paymentGateway = Mockery::mock(PaymentGateway::class);
$paymentGateway->shouldReceive('charge')
    ->once()
    ->with(150000)
    ->andReturn(true);

$service = new OrderService($paymentGateway);
```

```typescript
// ✅ Mock di Vitest
vi.mock('@/lib/api', () => ({
  api: {
    post: vi.fn().mockResolvedValue({ data: { token: 'mock-token' } }),
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
}));
```

---

## 🎯 Coverage Target

| Layer | Minimum Coverage | Target Ideal |
|-------|-----------------|--------------|
| Unit test — Utility functions | 90% | 100% |
| Unit test — Service/Business Logic | 80% | 90%+ |
| Integration — API endpoints | 70% | 80%+ |
| Integration — Database queries | 60% | 75%+ |
| E2E — Critical user flows | 5-10 flow | Semua critical path |

```bash
# Vitest — cek coverage
npx vitest --coverage

# Pest — cek coverage (Xdebug required)
php artisan test --coverage
```

**Catatan:**
- Jangan obsessed sama 100% coverage — lebih penting test yang *bermakna*
- Coverage < 50% di critical module = red flag
- Coverage turun = harus di-review di code review

---

## 🔄 TDD Workflow (Solo & Team)

### Solo Workflow

```
1. Tulis test → lihat fail (red)
2. Tulis kode minimal hingga test pass (green)
3. Refactor kode (refactor)
4. Commit: "feat(x): implement ..."

Cycle: 5-15 menit per iterasi
```

```bash
# Terminal split: kiri editor, kanan test runner
npx vitest --watch                      # auto re-run saat file berubah
./vendor/bin/pest --watch               # Pest: butuh composer require pestphp/pest-plugin-watch --dev
```

### Team Workflow

```
1. Ambil issue → tulis test dulu
2. Push feature branch (draft PR)
3. CI run test otomatis
4. Code review: reviewer cek test juga
5. Merge ke develop → CI run all tests
6. Sebelum release → run E2E + manual QA
```

---

## 🤖 E2E Testing — Playwright

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login and see dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[name="email"]', 'admin@store.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('h1')).toContainText('Dashboard');
});

test('shows error on invalid credentials', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'wrong@email.com');
  await page.fill('[name="password"]', 'wrongpass');
  await page.click('button[type="submit"]');

  await expect(page.locator('[role="alert"]')).toContainText('Email atau password salah');
});
```

### Aturan E2E

```
✅ Test critical user flow ONLY (login, register, checkout, create data)
✅ Gunakan data-testid untuk selector (bukan CSS class)
✅ Isolate test — setiap test harus bisa jalan sendiri
✅ Jangan test edge case di E2E (itu tugas unit/integration test)

❌ Jangan buat 100 E2E test — maintenance nightmare
❌ Jangan depend on specific data di database
❌ Jangan test UI detail (warna, font, shadow)
```

---

## 🚦 CI Integration

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop]

jobs:
  unit-and-integration:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
          extensions: pgsql, pdo_pgsql

      - name: Install dependencies
        run: composer install --no-interaction

      - name: Run Pest tests
        run: php artisan test
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: test
          DB_USERNAME: test
          DB_PASSWORD: test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright tests
        run: npx playwright test
```

---

## 🧠 Testing Mental Checklist

Sebelum commit, tanya diri sendiri:

```
[ ] Apakah perubahan ini punya test?
[ ] Sudah test edge case: null, empty, unauthorized?
[ ] Sudah test error case: validasi gagal, not found?
[ ] Test bisa jalan di CI tanpa env spesial?
[ ] Tidak ada test yang flaky (kadang pass kadang fail)?
[ ] Nama test jelas menjelaskan apa yang diuji?
```

---

## 🛠️ Tools Recommendation

| Kebutuhan | Library |
|-----------|---------|
| JS/TS Unit Test | Vitest (recommended) / Jest |
| PHP Unit Test | Pest (recommended) / PHPUnit |
| React Testing | @testing-library/react |
| Vue Testing | @testing-library/vue |
| API Mock (JS) | MSW (Mock Service Worker) |
| API Mock (PHP) | Mockery / PHPUnit built-in |
| E2E | Playwright (recommended) / Cypress |
| Coverage | c8 (JS) / Xdebug + phpunit-coverage (PHP) |
| Visual Regression | Playwright snapshot / Percy |
| Faker Data | @faker-js/faker (JS) / FakerPHP + built-in Laravel Factories (PHP) |
| DB Test (JS) | Testcontainers / SQLite in-memory |
| DB Test (PHP) | SQLite in-memory / RefreshDatabase trait |

---

## ✅ Checklist Testing Sebelum Deploy

```
Unit:
[ ] Semua utility functions tested
[ ] Service logic utama tested (happy path + error)
[ ] Coverage >= 80% untuk code baru

Integration:
[ ] Semua endpoint API tested (minimal response status)
[ ] Validasi input tested (422 cases)
[ ] Auth & authorization tested (401/403 cases)
[ ] Database transaction tested

E2E:
[ ] Critical flows tested (login, CRUD utama)
[ ] Cross-browser: Chrome + Firefox tested
[ ] Mobile viewport tested

General:
[ ] Tidak ada test yang skipped tanpa alasan
[ ] Test bisa di-run lokal dengan 1 command
[ ] Test pass di CI
[ ] Tidak ada test yang flaky
```
