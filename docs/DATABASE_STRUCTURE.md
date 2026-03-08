# 🔍 Database Structure

> **Phygital-Trace** | Prisma Schema, Sample Queries, Seed Data & Performance Tips

[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)](./DATABASE_STRUCTURE.md)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](./DATABASE_STRUCTURE.md)

---

## 📖 Table of Contents

1. [Prisma Schema](#1-prisma-schema)
2. [Schema Annotations](#2-schema-annotations)
3. [Sample Queries with Prisma Client](#3-sample-queries-with-prisma-client)
4. [Seed Data](#4-seed-data)
5. [Performance Tips](#5-performance-tips)
6. [Common Prisma Pitfalls](#6-common-prisma-pitfalls)
7. [Database Utilities](#7-database-utilities)

---

## 1. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ──────────────────────────────────────────────────────────────────────
// ENUMS
// ──────────────────────────────────────────────────────────────────────

enum CertificateStatus {
  PENDING
  CONFIRMED
  FAILED
  REVOKED
}

enum UserTier {
  FREE
  PROFESSIONAL
  ORGANIZATION
  ENTERPRISE
}

enum AuditAction {
  CREATE_USER
  UPDATE_USER
  DELETE_USER
  CREATE_CERTIFICATE
  CONFIRM_CERTIFICATE
  FAIL_CERTIFICATE
  REVOKE_CERTIFICATE
  REGISTER_PUBLIC_KEY
  REVOKE_PUBLIC_KEY
  CREATE_WEBHOOK
  DELETE_WEBHOOK
}

// ──────────────────────────────────────────────────────────────────────
// USER
// ──────────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  displayName   String    @map("display_name")
  handle        String?   @unique
  bio           String?
  tier          UserTier  @default(FREE)
  emailVerified Boolean   @default(false) @map("email_verified")
  walletAddress String?   @unique @map("wallet_address")
  twitterUrl    String?   @map("twitter_url")
  websiteUrl    String?   @map("website_url")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  certificates  Certificate[]
  publicKeys    UserPublicKey[]
  webhooks      Webhook[]

  @@map("users")
  @@index([email])
  @@index([handle])
  @@index([walletAddress])
}

// ──────────────────────────────────────────────────────────────────────
// CERTIFICATE (core entity)
// ──────────────────────────────────────────────────────────────────────

model Certificate {
  id              String            @id @default(cuid())
  userId          String            @map("user_id")
  imageHash       String            @unique @map("image_hash")
  sensorHash      String            @map("sensor_hash")
  combinedHash    String            @unique @map("combined_hash")
  ipfsCid         String?           @map("ipfs_cid")
  txHash          String?           @map("tx_hash")
  blockNumber     Int?              @map("block_number")
  status          CertificateStatus @default(PENDING)

  // Location (privacy-truncated to 3 decimal places)
  latApprox       Decimal?          @db.Decimal(7, 3) @map("lat_approx")
  lngApprox       Decimal?          @db.Decimal(8, 3) @map("lng_approx")
  city            String?
  country         String?           @db.Char(2)

  // Device info
  deviceModel     String?           @map("device_model")
  deviceOs        String?           @map("device_os")
  appVersion      String?           @map("app_version")

  // Sensor presence flags (for fingerprint strength)
  hasGps          Boolean           @default(false) @map("has_gps")
  hasAccelerometer Boolean          @default(false) @map("has_accelerometer")
  hasGyroscope    Boolean           @default(false) @map("has_gyroscope")
  hasBarometer    Boolean           @default(false) @map("has_barometer")
  hasLight        Boolean           @default(false) @map("has_light")
  wifiCount       Int               @default(0) @map("wifi_count")
  cellTowerCount  Int               @default(0) @map("cell_tower_count")

  // Cryptographic proof
  publicKey       String            @map("public_key")
  signature       String

  // Timestamps
  captureTime     DateTime          @map("capture_time")
  createdAt       DateTime          @default(now()) @map("created_at")
  updatedAt       DateTime          @updatedAt @map("updated_at")

  // Relations
  user            User              @relation(fields: [userId], references: [id])
  revocation      Revocation?

  @@map("certificates")
  @@index([userId, captureTime(sort: Desc)])
  @@index([captureTime])
  @@index([status])
  @@index([country, captureTime])
}

// ──────────────────────────────────────────────────────────────────────
// REVOCATION
// ──────────────────────────────────────────────────────────────────────

model Revocation {
  id                String      @id @default(cuid())
  certificateId     String      @unique @map("certificate_id")
  revokedByUserId   String      @map("revoked_by_user_id")
  reason            String
  txHash            String?     @map("tx_hash")
  createdAt         DateTime    @default(now()) @map("created_at")

  certificate       Certificate @relation(fields: [certificateId], references: [id])

  @@map("revocations")
}

// ──────────────────────────────────────────────────────────────────────
// USER PUBLIC KEY (Secure Enclave keys)
// ──────────────────────────────────────────────────────────────────────

model UserPublicKey {
  id          String    @id @default(cuid())
  userId      String    @map("user_id")
  publicKey   String    @unique @map("public_key")
  deviceModel String?   @map("device_model")
  attestation String?
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")
  revokedAt   DateTime? @map("revoked_at")

  user        User      @relation(fields: [userId], references: [id])

  @@map("user_public_keys")
  @@index([userId, isActive])
}

// ──────────────────────────────────────────────────────────────────────
// WEBHOOK
// ──────────────────────────────────────────────────────────────────────

model Webhook {
  id        String            @id @default(cuid())
  userId    String            @map("user_id")
  url       String
  secret    String
  events    String[]
  isActive  Boolean           @default(true) @map("is_active")
  createdAt DateTime          @default(now()) @map("created_at")

  user      User              @relation(fields: [userId], references: [id])
  deliveries WebhookDelivery[]

  @@map("webhooks")
  @@index([userId, isActive])
}

// ──────────────────────────────────────────────────────────────────────
// WEBHOOK DELIVERY
// ──────────────────────────────────────────────────────────────────────

model WebhookDelivery {
  id           String    @id @default(cuid())
  webhookId    String    @map("webhook_id")
  event        String
  payload      Json
  httpStatus   Int?      @map("http_status")
  attemptCount Int       @default(0) @map("attempt_count")
  nextRetryAt  DateTime? @map("next_retry_at")
  deliveredAt  DateTime? @map("delivered_at")
  createdAt    DateTime  @default(now()) @map("created_at")

  webhook      Webhook   @relation(fields: [webhookId], references: [id])

  @@map("webhook_deliveries")
  @@index([webhookId, createdAt(sort: Desc)])
  @@index([nextRetryAt])
}

// ──────────────────────────────────────────────────────────────────────
// AUDIT LOG (append-only, never update)
// ──────────────────────────────────────────────────────────────────────

model AuditLog {
  id         String      @id @default(cuid())
  userId     String?     @map("user_id")
  action     AuditAction
  entityType String      @map("entity_type")
  entityId   String      @map("entity_id")
  changes    Json?
  ipAddress  String?     @map("ip_address")
  createdAt  DateTime    @default(now()) @map("created_at")

  @@map("audit_logs")
  @@index([entityType, entityId, createdAt(sort: Desc)])
  @@index([userId, createdAt(sort: Desc)])
  @@index([createdAt])
}
```

---

## 2. Schema Annotations

### Why `@map` Everywhere?

We use `@map` to keep Prisma model names in `camelCase` (TypeScript convention) while the database columns are in `snake_case` (SQL convention). This avoids forcing quoted identifiers in SQL.

### Why CUIDs for IDs?

CUIDs (via Prisma's `@default(cuid())`) are:
- URL-safe (no special characters)
- Sortable by creation time
- Collision-resistant without a central sequence
- Faster to generate than UUID v4

### Why Sensor Presence Flags?

Storing `has_gps`, `has_accelerometer`, etc. as boolean columns (rather than querying IPFS) enables fast SQL queries for:
- "Fingerprint strength" computation
- Admin analytics
- Filtering high-confidence certificates

---

## 3. Sample Queries with Prisma Client

### 3.1 Create a Certificate

```typescript
const certificate = await prisma.certificate.create({
  data: {
    userId: "usr_01HN5B9KT2...",
    imageHash: "0xabc123...",
    sensorHash: "0xdef456...",
    combinedHash: "0x789abc...",
    status: "PENDING",
    captureTime: new Date(sensorBundle.timestamp),
    publicKey: publicKey,
    signature: signature,
    hasGps: !!sensorBundle.gps,
    hasAccelerometer: !!sensorBundle.accelerometer,
    hasGyroscope: !!sensorBundle.gyroscope,
    hasBarometer: !!sensorBundle.barometer,
    hasLight: !!sensorBundle.light,
    wifiCount: sensorBundle.wifi?.length ?? 0,
    cellTowerCount: sensorBundle.cellTowers?.length ?? 0,
    latApprox: sensorBundle.gps
      ? Number(sensorBundle.gps.lat.toFixed(3))
      : null,
    lngApprox: sensorBundle.gps
      ? Number(sensorBundle.gps.lng.toFixed(3))
      : null,
    deviceModel: deviceInfo.model,
    deviceOs: deviceInfo.os,
    appVersion: deviceInfo.appVersion,
  },
});
```

### 3.2 Verify by Image Hash

```typescript
const certificate = await prisma.certificate.findUnique({
  where: { imageHash: imageHash },
  include: {
    user: {
      select: {
        id: true,
        displayName: true,
        handle: true,
      },
    },
    revocation: true,
  },
});
```

### 3.3 Paginated Certificate List

```typescript
async function getUserCertificates(
  userId: string,
  options: { page: number; limit: number; from?: Date; to?: Date }
) {
  const { page, limit, from, to } = options;
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.certificate.findMany({
      where: {
        userId,
        ...(from || to
          ? { captureTime: { gte: from, lte: to } }
          : {}),
      },
      orderBy: { captureTime: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        imageHash: true,
        ipfsCid: true,
        status: true,
        captureTime: true,
        city: true,
        country: true,
        txHash: true,
      },
    }),
    prisma.certificate.count({ where: { userId } }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      hasNext: skip + data.length < total,
      hasPrev: page > 1,
    },
  };
}
```

### 3.4 User Profile Stats

```typescript
const stats = await prisma.certificate.aggregate({
  where: { userId, status: "CONFIRMED" },
  _count: { id: true },
});

const countriesCount = await prisma.certificate.findMany({
  where: { userId, status: "CONFIRMED", country: { not: null } },
  distinct: ["country"],
  select: { country: true },
});
```

### 3.5 Admin: Find Stuck Pending Certificates

```typescript
const stuck = await prisma.certificate.findMany({
  where: {
    status: "PENDING",
    createdAt: { lt: new Date(Date.now() - 60 * 60 * 1000) }, // > 1 hour old
  },
  orderBy: { createdAt: "asc" },
  take: 100,
});
```

### 3.6 Audit Log Entry

```typescript
await prisma.auditLog.create({
  data: {
    userId: req.user.id,
    action: "CREATE_CERTIFICATE",
    entityType: "certificate",
    entityId: certificate.id,
    changes: {
      status: "PENDING",
      imageHash: certificate.imageHash,
    },
    ipAddress: req.ip,
  },
});
```

---

## 4. Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test journalist user
  const jane = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      passwordHash: await bcrypt.hash("TestPassword123!", 12),
      displayName: "Jane Reporter",
      handle: "jane-reporter",
      bio: "Test journalist for development",
      tier: "PROFESSIONAL",
      emailVerified: true,
    },
  });
  console.log(`✅ User: ${jane.email}`);

  // Create sample certificates
  const certs = await Promise.all([
    prisma.certificate.create({
      data: {
        userId: jane.id,
        imageHash: "0x" + "a".repeat(64),
        sensorHash: "0x" + "b".repeat(64),
        combinedHash: "0x" + "c".repeat(64),
        status: "CONFIRMED",
        txHash: "0x" + "d".repeat(64),
        blockNumber: 1234567,
        ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        captureTime: new Date("2026-03-08T10:00:00Z"),
        latApprox: 40.712,
        lngApprox: -74.006,
        city: "New York",
        country: "US",
        deviceModel: "iPhone 14 Pro",
        deviceOs: "iOS 17.2",
        appVersion: "1.0.0",
        hasGps: true,
        hasAccelerometer: true,
        hasGyroscope: true,
        hasBarometer: true,
        hasLight: true,
        wifiCount: 8,
        cellTowerCount: 2,
        publicKey: "0x04" + "e".repeat(128),
        signature: "0x3044" + "f".repeat(126),
      },
    }),
  ]);
  console.log(`✅ Created ${certs.length} sample certificates`);

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

### Running Seed

```bash
# Development only
npx prisma db seed

# Or manually
npx ts-node prisma/seed.ts
```

---

## 5. Performance Tips

### 5.1 Use Select to Limit Returned Fields

```typescript
// ✅ GOOD: Only select fields you need
const certs = await prisma.certificate.findMany({
  select: { id: true, imageHash: true, status: true, captureTime: true },
});

// ❌ BAD: Select everything when you only need a few fields
const certs = await prisma.certificate.findMany(); // Fetches all columns
```

### 5.2 Batch DB Calls with $transaction

```typescript
// ✅ GOOD: Single round-trip to DB
const [cert, user, auditLog] = await prisma.$transaction([
  prisma.certificate.findUnique({ where: { id } }),
  prisma.user.findUnique({ where: { id: userId } }),
  prisma.auditLog.create({ data: auditData }),
]);

// ❌ BAD: Three separate round-trips
const cert = await prisma.certificate.findUnique({ where: { id } });
const user = await prisma.user.findUnique({ where: { id: cert.userId } });
await prisma.auditLog.create({ data: auditData });
```

### 5.3 Avoid N+1 with Include

```typescript
// ✅ GOOD: Single JOIN query
const certs = await prisma.certificate.findMany({
  include: { user: { select: { displayName: true } } },
});

// ❌ BAD: N+1 - 1 query for certs + N queries for users
const certs = await prisma.certificate.findMany();
for (const cert of certs) {
  cert.user = await prisma.user.findUnique({ where: { id: cert.userId } });
}
```

### 5.4 Use Cursor Pagination for Large Tables

```typescript
// ✅ GOOD for large tables: cursor-based pagination is O(1) regardless of page
const certs = await prisma.certificate.findMany({
  take: 20,
  skip: 1, // Skip the cursor itself
  cursor: { id: lastSeenId },
  orderBy: { captureTime: "desc" },
});

// ⚠️ CAUTION: offset pagination is O(n) for large offsets
const certs = await prisma.certificate.findMany({
  skip: page * limit, // Gets slower as page increases
  take: limit,
});
```

### 5.5 Query Plan Analysis

```bash
# Check if your queries are using indexes
EXPLAIN ANALYZE SELECT * FROM certificates WHERE image_hash = '0xabc123';

# Expected output should show:
# Index Scan using idx_certificates_image_hash on certificates
# -> NOT a Seq Scan (full table scan)
```

---

## 6. Common Prisma Pitfalls

| Pitfall | Problem | Solution |
|---|---|---|
| Using `findFirst` for unique lookups | Returns undefined instead of throwing | Use `findUnique` for unique fields |
| Not handling `null` from `findUnique` | Runtime errors when record not found | Always check `if (!result) throw new NotFoundError()` |
| Nested writes without transactions | Partial writes if one fails | Use `prisma.$transaction()` |
| Large `include` chains | Cartesian product = huge result sets | Use separate queries or limit `select` |
| `updateMany` without a where clause | Updates ALL records | Always include a `where` clause |
| Missing `await` on Prisma calls | Silent failures | TypeScript strict null checks help |
| Prisma Client not disconnected | Connection pool exhaustion in tests | Call `prisma.$disconnect()` after each test |

---

## 7. Database Utilities

### 7.1 Health Check Query

```typescript
// Used by health check endpoint
async function isDatabaseHealthy(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
```

### 7.2 Graceful Shutdown

```typescript
// Always disconnect Prisma on shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

### 7.3 Reset Dev Database

```bash
# WARNING: Destroys all data. Development only.
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Re-create it
# 3. Run all migrations
# 4. Run seed script
```

---

*Last Updated: 2026-03-08*
