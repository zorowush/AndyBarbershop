# 📊 14 — Observability

> Logging, metrics, alerting, incident response.
> Solo: cukup structured logging + health check.
> Tim: tambah centralized logging, metrics, alerting, incident playbook.

---

## 🪵 Structured Logging (Production Standard)

### JSON Log Format

```
Timestamp      : ISO 8601 (2025-07-29T10:30:00.000Z)
Level          : debug | info | warn | error | critical
Message        : Human-readable ringkas
Context        : correlation_id, user_id, resource, duration_ms
Service        : backend-api, queue-worker, cron-job
Environment    : production, staging
```

### Contoh JSON Log

```json
{
  "timestamp": "2025-07-29T10:30:00.000Z",
  "level": "info",
  "message": "Order created successfully",
  "service": "order-service",
  "environment": "production",
  "correlation_id": "550e8400-e29b-41d4-a716-446655440000",
  "context": {
    "order_id": 12345,
    "user_id": 6789,
    "total": 250000,
    "items_count": 3,
    "duration_ms": 145
  }
}
```

### Log Levels — Kapan Pakai Apa

```
DEBUG     → Development only. Matiin di production kalau kebanyakan.
INFO      → Normal operation: order created, user registered, login success.
WARNING   → Something unexpected tapi app masih jalan: retry attempt, rate limit mendekati.
ERROR     → Something failed: payment declined, API timeout, database error.
CRITICAL  → System can't function: database down, disk full, out of memory.
```

### Implementasi

**Laravel** — sudah dibahas di `03-backend.md` (JSON channel + correlation ID middleware).

**Node.js (Express)**:

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  redact: {
    paths: ['password', 'token', 'secret', 'authorization'],
    censor: '[REDACTED]',
  },
});

// Middleware — tambah correlation ID
app.use((req, res, next) => {
  req.log = logger.child({
    correlation_id: req.headers['x-correlation-id'] || crypto.randomUUID(),
    ip: req.ip,
    user_agent: req.headers['user-agent'],
  });
  next();
});

// Usage
app.get('/api/users', async (req, res) => {
  req.log.info({ user_id: req.user.id }, 'Fetching users');
  // ...
});
```

---

## 🩺 Health Check Endpoint

Setiap aplikasi production WAJIB punya endpoint health check.

```php
// routes/api.php
Route::get('/health', function () {
    $checks = [
        'database' => checkDatabase(),
        'redis'    => checkRedis(),
        'queue'    => checkQueue(),
    ];

    $healthy = collect($checks)->every(fn ($v) => $v['status'] === 'ok');

    return response()->json([
        'status'   => $healthy ? 'healthy' : 'degraded',
        'checks'   => $checks,
        'uptime'   => floor(microtime(true) - LARAVEL_START) . 's',
        'version'  => config('app.version'), // tambahkan 'version' => env('APP_VERSION') di config/app.php
        'timestamp' => now()->toIso8601String(),
    ], $healthy ? 200 : 503);
});

function checkDatabase(): array
{
    try {
        DB::select('SELECT 1');
        return ['status' => 'ok'];
    } catch (\Exception $e) {
        // JANGAN bocorkan detail error — endpoint ini tanpa auth, dibaca publik
        // detail error cukup di log internal
        Log::error('Health check: database unreachable', ['error' => $e->getMessage()]);
        return ['status' => 'error'];
    }
}
```

### Aturan Health Check

```
✅ Response dalam 5 detik — jangan timeout
✅ Tidak butuh auth — dipanggil oleh load balancer / monitoring
✅ Cek dependencies: DB, Redis, queue, storage
✅ Return status 200 (healthy) atau 503 (degraded)
✅ Include version untuk tracking deploy
```

---

## 📈 Metrics (RED Method)

Gunakan **RED** untuk service, **USE** untuk infrastructure:

```
RED (Service):
├── Rate        — request per second
├── Errors      — jumlah error (4xx, 5xx, exception)
└── Duration    — response time (p50, p95, p99)

USE (Infrastructure):
├── Utilization — CPU, memory, disk, connection
├── Saturation  — queue length, thread pool
└── Errors      — disk I/O error, OOM
```

### Tools Gratis

```
├── Prometheus + Grafana — self-hosted, full kontrol
├── Laravel Pulse       — built-in untuk Laravel (gratis)
├── Posthog             — product analytics + performance (free tier)
└── Sentry              — error tracking & performance (free tier: 5k error/bulan)
```

### Apa yang Harus Di-monitor

```
Wajib:
[ ] Request rate — berapa banyak request masuk
[ ] Error rate — berapa % request yang error
[ ] Response time (p95) — lambat? ada bottleneck?
[ ] CPU & memory usage
[ ] Database connection pool

Important:
[ ] Queue length — antrean numpuk?
[ ] Cache hit ratio — efektif?
[ ] Disk usage — space mau habis?
[ ] SSL certificate expiry

Nice to have:
[ ] Business metrics — registrasi/hari, order/hari, revenue
[ ] User satisfaction — feedback, rating
[ ] Uptime monitoring — 99.9% SLA
```

---

## 🔔 Alerting Strategy

### Alert Rules — Alert Hanya untuk yang Butuh Tindakan

```
SEV1 — Critical (respons < 15 menit):
├── Service down — health check failed > 5 menit
├── Error rate > 5% dalam 5 menit
├── Database connection lost
└── P95 response time > 5 detik

SEV2 — High (respons < 1 jam):
├── Error rate > 1% dalam 15 menit
├── Disk usage > 85%
├── Queue length > 1000
└── SSL certificate expiry < 30 hari

SEV3 — Medium (respons < 24 jam):
├── P95 response time > 2 detik (tapi < 5 detik)
├── Cache hit ratio < 50%
├── Queued job failed > 10 dalam 1 jam
└── Dependency update available (Dependabot PR)

SEV4 — Low (no alert, just log):
├── Info: deployment success
├── Warning: single retry attempt
└── Notice: user hit rate limit
```

### Alerting Tools Gratis

```
├── Uptime Kuma         — self-hosted uptime monitor + notification
├── Grafana Alerting    — integrated dengan Grafana dashboard
├── Sentry              — error alert ke email/slack
├── Healthchecks.io     — cron job monitoring (free tier)
├── Better Uptime       — status page + monitoring (free tier)
└── GitHub Status       — untuk CI/CD failure notification
```

### Notifikasi Channel

```
SEV1: Push notifikasi + Telepon (kalau urgent)
SEV2: Slack / Discord
SEV3: Email
SEV4: No notification — cukup tercatat di log
```

---

## 🚨 Incident Response Playbook

### Incident Lifecycle

```
Detect → Respond → Mitigate → Resolve → Postmortem
   │         │          │          │
   ▼         ▼          ▼          ▼
 Alert    Acknowledge  Fix or    Service   Learn &
          & Triage    Rollback   Restored  Improve
```

### Incident Response Steps

```markdown
## 1. Detect
- Alert dari monitoring / user report
- Cek dashboard: what changed? (deploy, config, traffic spike)

## 2. Respond
- Acknowledge di channel #incidents
- Tentukan severity level
- Assign incident lead

## 3. Mitigate
- Rollback ke versi sebelumnya (paling cepat)
- Atau scale up / restart service
- Pastikan user experience pulih dulu

## 4. Resolve
- Apply permanent fix
- Verifikasi di staging
- Deploy fix ke production
- Konfirmasi user impact sudah hilang

## 5. Postmortem (dalam 48 jam)
- Timeline: kapan mulai, kapa detected, kapan resolved
- Root cause: kenapa terjadi
- Action items: prevent recurrence
- Blameless: jangan cari siapa salah, cari sistem yang gagal
```

### Postmortem Template

```markdown
# Incident Postmortem — {Tanggal}

## Summary
- Duration: 30 menit (10:00 - 10:30 WIB)
- Impact: 500 error di halaman checkout, ~50 user terpengaruh
- Severity: SEV1

## Timeline
- 10:00 — Deploy v1.3.0 ke production
- 10:05 — Sentry alert: error rate spike 15%
- 10:06 — Incident declared
- 10:10 — Rollback ke v1.2.0 start
- 10:25 — Rollback complete, error rate kembali normal
- 10:30 — Monitoring confirmed no impact

## Root Cause
- Typo di environment variable: `DB_CONNECTION=pgsq` (missing 'l')
- Penyebab: .env.example tidak sync dengan config
- Kenapa tidak terdeteksi staging: staging pakai SQLite, bukan PostgreSQL

## Action Items
- [ ] Add health check untuk database connection (#201)
- [ ] Staging harus pakai database yang sama dengan production (#202)
- [ ] Tambah validation di CI: cek required env vars (#203)

## Blameless Statement
Ini adalah kegagalan proses, bukan individu.
System should have caught this earlier.
```

---

## 🗄️ Centralized Logging Options (Gratis)

| Tool | Tipe | Storage | Gratis? |
|------|------|---------|---------|
| **Loki + Grafana** | Log aggregation | Object storage | Self-hosted, gratis |
| **Sentry** | Error tracking | Cloud | 5k error/bulan |
| **Better Stack** | Log management | Cloud | 100 MB/hari gratis |
| **Laravel Pulse** | Metrics dashboard | Database | Gratis (built-in) |

### Minimal Setup untuk Solo Developer

```
1. Sentry — error tracking (free tier cukup)
2. Healthchecks.io — cron job monitoring
3. Uptime Kuma — uptime monitoring (self-hosted, docker)
4. Logging ke file — rotated daily, grep kalau perlu investigasi
```

### Minimal Setup untuk Tim

```
1. Grafana + Loki — centralized logs + dashboard
2. Sentry — error tracking & performance
3. Prometheus — metrics
4. Pager — Slack channel untuk alert
5. Status page — Better Uptime / Instatus
```

---

## ✅ Observability Checklist

```
Logging:
[ ] JSON format untuk production (machine parsable)
[ ] Log levels dipakai dengan benar
[ ] Tidak ada data sensitif di log
[ ] Correlation ID untuk trace request
[ ] Log rotation aktif (hindari disk penuh)

Monitoring:
[ ] Health check endpoint (/health)
[ ] Error rate di-monitor (Sentry / Grafana)
[ ] Response time (p95) di-track
[ ] CPU & memory usage di-dashboard
[ ] Queue length di-monitor (kalau pakai queue)

Alerting:
[ ] SEV1 alert → instant notification (Slack + Telepon)
[ ] SEV2 alert → notifikasi ke channel tim
[ ] No alert fatigue — hanya yang butuh tindakan
[ ] Alert rules di-review setiap bulan

Incident:
[ ] Incident response playbook ada
[ ] Postmortem dilakukan untuk SEV1/SEV2
[ ] Action items dari postmortem di-track
[ ] Blameless culture
```
