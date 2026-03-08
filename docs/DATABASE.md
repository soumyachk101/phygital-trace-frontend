# 🗄️ Database Documentation

> **Phygital-Trace** | PostgreSQL + Prisma ORM — Schema, ER Diagrams, Indexes, Backup & Retention

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](./DATABASE.md)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748)](./DATABASE.md)

---

## 📖 Table of Contents

1. [Overview](#1-overview)
2. [Entity-Relationship Diagram](#2-entity-relationship-diagram)
3. [Table Definitions](#3-table-definitions)
4. [Indexes & Performance](#4-indexes--performance)
5. [Constraints & Integrity Rules](#5-constraints--integrity-rules)
6. [Data Retention Policy](#6-data-retention-policy)
7. [Backup Strategy](#7-backup-strategy)
8. [Migration Workflow](#8-migration-workflow)
9. [Query Patterns](#9-query-patterns)
10. [Database Security](#10-database-security)

---

## 1. Overview

Phygital-Trace uses **PostgreSQL 15** as its primary relational database, accessed through **Prisma 5.x** ORM.

### Design Principles

| Principle | Implementation |
|---|---|
| **Blockchain is source of truth** | DB stores derived data; can always be rebuilt from blockchain + IPFS |
| **Append-only audit logs** | All changes logged; no silent mutations |
| **Minimum PII** | Only email and display name stored; raw sensor data never stored |
| **Hash-indexed** | Lookup-by-image-hash is the primary verification query; heavily indexed |
| **Soft deletes** | Certificates are never hard-deleted (revoked instead) |

### Database Connectivity

```
Connection string format:
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public&connection_limit=25&pool_timeout=30

Connection pool:
- Min connections: 5
- Max connections: 25
- Idle timeout: 30 seconds
- Connection timeout: 30 seconds
```

---

## 2. Entity-Relationship Diagram

```mermaid
erDiagram
    User {
        string id PK
        string email UK
        string passwordHash
        string displayName
        string handle UK
        string bio
        string tier
        boolean emailVerified
        string walletAddress
        datetime createdAt
        datetime updatedAt
    }

    Certificate {
        string id PK
        string userId FK
        string imageHash UK
        string sensorHash
        string combinedHash UK
        string ipfsCid
        string txHash
        int blockNumber
        string status
        decimal latApprox
        decimal lngApprox
        string city
        string country
        string deviceModel
        string deviceOs
        string appVersion
        boolean hasGps
        boolean hasAccelerometer
        boolean hasGyroscope
        boolean hasBarometer
        boolean hasLight
        int wifiCount
        int cellTowerCount
        string publicKey
        string signature
        datetime captureTime
        datetime createdAt
        datetime updatedAt
    }

    Revocation {
        string id PK
        string certificateId FK
        string revokedByUserId FK
        string reason
        string txHash
        datetime createdAt
    }

    UserPublicKey {
        string id PK
        string userId FK
        string publicKey UK
        string deviceModel
        string attestation
        boolean isActive
        datetime createdAt
        datetime revokedAt
    }

    Webhook {
        string id PK
        string userId FK
        string url
        string secret
        string[] events
        boolean isActive
        datetime createdAt
    }

    WebhookDelivery {
        string id PK
        string webhookId FK
        string event
        json payload
        int httpStatus
        int attemptCount
        datetime nextRetryAt
        datetime deliveredAt
        datetime createdAt
    }

    AuditLog {
        string id PK
        string userId
        string action
        string entityType
        string entityId
        json changes
        string ipAddress
        datetime createdAt
    }

    User ||--o{ Certificate : "issues"
    User ||--o{ UserPublicKey : "has"
    User ||--o{ Webhook : "configures"
    Certificate ||--o| Revocation : "may have"
    Webhook ||--o{ WebhookDelivery : "generates"
```

---

## 3. Table Definitions

### 3.1 `users`

Stores journalist account information.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `TEXT` | No | ULID primary key |
| `email` | `TEXT` | No | Unique email address |
| `password_hash` | `TEXT` | No | bcrypt(12) hash |
| `display_name` | `TEXT` | No | Public display name |
| `handle` | `TEXT` | Yes | URL-safe unique handle (@jane-reporter) |
| `bio` | `TEXT` | Yes | Profile biography |
| `tier` | `TEXT` | No | `free` \| `professional` \| `organization` \| `enterprise` |
| `email_verified` | `BOOLEAN` | No | Whether email is verified |
| `wallet_address` | `TEXT` | Yes | Ethereum wallet address |
| `twitter_url` | `TEXT` | Yes | Twitter profile URL |
| `website_url` | `TEXT` | Yes | Personal website URL |
| `created_at` | `TIMESTAMPTZ` | No | Account creation time |
| `updated_at` | `TIMESTAMPTZ` | No | Last update time |

### 3.2 `certificates`

The central table. Stores all issued Truth Certificates.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `TEXT` | No | ULID primary key (`cert_` prefix) |
| `user_id` | `TEXT` | No | FK → `users.id` |
| `image_hash` | `TEXT` | No | SHA-256 of original image (`0x` prefixed) |
| `sensor_hash` | `TEXT` | No | SHA-256 of canonical sensor JSON |
| `combined_hash` | `TEXT` | No | SHA-256(imageHash \|\| sensorHash) |
| `ipfs_cid` | `TEXT` | Yes | IPFS CID once pinned |
| `tx_hash` | `TEXT` | Yes | Blockchain TX hash |
| `block_number` | `INTEGER` | Yes | Block number of registration TX |
| `status` | `TEXT` | No | `pending` \| `confirmed` \| `failed` \| `revoked` |
| `lat_approx` | `DECIMAL(7,3)` | Yes | Latitude (3 decimal places = ±111m) |
| `lng_approx` | `DECIMAL(8,3)` | Yes | Longitude (3 decimal places) |
| `city` | `TEXT` | Yes | City name (reverse geocoded) |
| `country` | `TEXT` | Yes | ISO 3166-1 alpha-2 country code |
| `device_model` | `TEXT` | Yes | e.g., "iPhone 14 Pro" |
| `device_os` | `TEXT` | Yes | e.g., "iOS 17.2" |
| `app_version` | `TEXT` | Yes | e.g., "1.0.0" |
| `has_gps` | `BOOLEAN` | No | GPS data present |
| `has_accelerometer` | `BOOLEAN` | No | Accelerometer data present |
| `has_gyroscope` | `BOOLEAN` | No | Gyroscope data present |
| `has_barometer` | `BOOLEAN` | No | Barometer data present |
| `has_light` | `BOOLEAN` | No | Light sensor data present |
| `wifi_count` | `INTEGER` | No | Number of WiFi networks detected |
| `cell_tower_count` | `INTEGER` | No | Number of cell towers detected |
| `public_key` | `TEXT` | No | Secure Enclave public key (hex) |
| `signature` | `TEXT` | No | Secure Enclave ECDSA signature |
| `capture_time` | `TIMESTAMPTZ` | No | Device-reported capture timestamp |
| `created_at` | `TIMESTAMPTZ` | No | Server-side creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | No | Last update time |

### 3.3 `revocations`

Records certificate revocations. A revocation row means the certificate cannot be verified.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `TEXT` | No | ULID primary key |
| `certificate_id` | `TEXT` | No | FK → `certificates.id` |
| `revoked_by_user_id` | `TEXT` | No | FK → `users.id` |
| `reason` | `TEXT` | No | Journalist-provided reason |
| `tx_hash` | `TEXT` | Yes | Blockchain revocation TX hash |
| `created_at` | `TIMESTAMPTZ` | No | Revocation timestamp |

### 3.4 `user_public_keys`

Tracks all Secure Enclave public keys registered by a user.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `TEXT` | No | ULID primary key |
| `user_id` | `TEXT` | No | FK → `users.id` |
| `public_key` | `TEXT` | No | Hex-encoded P-256 public key |
| `device_model` | `TEXT` | Yes | Device that generated this key |
| `attestation` | `TEXT` | Yes | Apple DeviceCheck / Google SafetyNet attestation |
| `is_active` | `BOOLEAN` | No | Whether this key is currently valid |
| `created_at` | `TIMESTAMPTZ` | No | Key registration time |
| `revoked_at` | `TIMESTAMPTZ` | Yes | Key revocation time (null if active) |

### 3.5 `audit_logs`

Append-only audit trail. Never updated, only inserted.

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `TEXT` | No | ULID primary key |
| `user_id` | `TEXT` | Yes | Acting user (null for system actions) |
| `action` | `TEXT` | No | e.g., `CREATE_CERTIFICATE`, `REVOKE_CERTIFICATE` |
| `entity_type` | `TEXT` | No | e.g., `certificate`, `user` |
| `entity_id` | `TEXT` | No | ID of affected entity |
| `changes` | `JSONB` | Yes | Diff of changes (new values only, no secrets) |
| `ip_address` | `TEXT` | Yes | Client IP (may be masked for GDPR) |
| `created_at` | `TIMESTAMPTZ` | No | Action timestamp |

---

## 4. Indexes & Performance

### 4.1 Index Definitions

```sql
-- Primary verification lookup (most frequent query)
CREATE UNIQUE INDEX idx_certificates_image_hash
  ON certificates (image_hash);

-- Combined hash lookup (blockchain sync)
CREATE UNIQUE INDEX idx_certificates_combined_hash
  ON certificates (combined_hash);

-- User certificate list (profile page, gallery)
CREATE INDEX idx_certificates_user_id_created_at
  ON certificates (user_id, created_at DESC);

-- Status-based filtering (admin dashboard)
CREATE INDEX idx_certificates_status
  ON certificates (status)
  WHERE status IN ('pending', 'failed');

-- Date range queries
CREATE INDEX idx_certificates_capture_time
  ON certificates (capture_time);

-- User public key lookup (signature verification)
CREATE UNIQUE INDEX idx_user_public_keys_public_key
  ON user_public_keys (public_key)
  WHERE is_active = TRUE;

-- Audit log queries
CREATE INDEX idx_audit_logs_entity
  ON audit_logs (entity_type, entity_id, created_at DESC);

CREATE INDEX idx_audit_logs_user
  ON audit_logs (user_id, created_at DESC);

-- User lookup
CREATE UNIQUE INDEX idx_users_email ON users (lower(email));
CREATE UNIQUE INDEX idx_users_handle ON users (handle) WHERE handle IS NOT NULL;
CREATE UNIQUE INDEX idx_users_wallet ON users (wallet_address) WHERE wallet_address IS NOT NULL;
```

### 4.2 Partial Indexes

```sql
-- Only index pending certificates (small subset, frequently queried)
CREATE INDEX idx_certificates_pending
  ON certificates (created_at)
  WHERE status = 'pending';

-- Active public keys only
CREATE INDEX idx_active_public_keys_user
  ON user_public_keys (user_id)
  WHERE is_active = TRUE;
```

### 4.3 Query Performance Targets

| Query | Expected p95 | Primary Index Used |
|---|---|---|
| `SELECT * FROM certificates WHERE image_hash = ?` | < 5ms | `idx_certificates_image_hash` |
| `SELECT * FROM certificates WHERE combined_hash = ?` | < 5ms | `idx_certificates_combined_hash` |
| `SELECT * FROM certificates WHERE user_id = ? ORDER BY created_at DESC` | < 15ms | `idx_certificates_user_id_created_at` |
| `SELECT * FROM users WHERE email = ?` | < 3ms | `idx_users_email` |
| `SELECT * FROM user_public_keys WHERE public_key = ? AND is_active = TRUE` | < 3ms | `idx_user_public_keys_public_key` |

---

## 5. Constraints & Integrity Rules

```sql
-- Certificate status must be valid
ALTER TABLE certificates
  ADD CONSTRAINT chk_certificates_status
  CHECK (status IN ('pending', 'confirmed', 'failed', 'revoked'));

-- User tier must be valid
ALTER TABLE users
  ADD CONSTRAINT chk_users_tier
  CHECK (tier IN ('free', 'professional', 'organization', 'enterprise'));

-- Latitude must be valid
ALTER TABLE certificates
  ADD CONSTRAINT chk_lat_range
  CHECK (lat_approx IS NULL OR (lat_approx BETWEEN -90 AND 90));

-- Longitude must be valid
ALTER TABLE certificates
  ADD CONSTRAINT chk_lng_range
  CHECK (lng_approx IS NULL OR (lng_approx BETWEEN -180 AND 180));

-- A certificate can only have one revocation
ALTER TABLE revocations
  ADD CONSTRAINT uq_revocations_certificate_id
  UNIQUE (certificate_id);
```

---

## 6. Data Retention Policy

| Data Category | Table | Retention | Action |
|---|---|---|---|
| Certificate metadata | `certificates` | **Permanent** | Never deleted (immutable record) |
| User accounts | `users` | Until deletion request | Hard delete + anonymize FK references |
| Public keys | `user_public_keys` | 5 years after revocation | Soft delete → hard delete after 5 years |
| Audit logs | `audit_logs` | 2 years | Automated purge via cron job |
| Webhook configs | `webhooks` | Until user deletes | Soft delete |
| Webhook delivery logs | `webhook_deliveries` | 90 days | Automated purge via cron job |
| Redis session cache | n/a | 7 days (TTL) | Automatic expiry |

### GDPR Account Deletion Process

```sql
-- When a user requests deletion:
-- 1. Anonymize user record (don't delete to preserve FK integrity)
UPDATE users SET
  email = 'deleted-' || id || '@phygital-trace.invalid',
  password_hash = 'DELETED',
  display_name = '[Deleted User]',
  handle = NULL,
  bio = NULL,
  twitter_url = NULL,
  website_url = NULL,
  wallet_address = NULL,
  updated_at = NOW()
WHERE id = $1;

-- 2. Certificates remain (immutable blockchain record)
-- 3. Public keys revoked
UPDATE user_public_keys SET is_active = FALSE, revoked_at = NOW()
WHERE user_id = $1 AND is_active = TRUE;

-- 4. Webhooks disabled
UPDATE webhooks SET is_active = FALSE WHERE user_id = $1;
```

---

## 7. Backup Strategy

### 7.1 Backup Tiers

```
Tier 1: Continuous WAL Archiving (Point-in-Time Recovery)
──────────────────────────────────────────────────────────
• PostgreSQL WAL logs streamed to S3 in real time
• Enables recovery to any point in the last 7 days
• RPO: < 30 seconds
• Storage: ~10GB/day for 500K certificates/month

Tier 2: Daily Full Snapshots
──────────────────────────────────────────────────────────
• Full pg_dump every night at 02:00 UTC
• Compressed with gzip, encrypted with AES-256
• Stored in S3 with 30-day retention
• Cross-region replication to secondary S3 bucket

Tier 3: Weekly Archives
──────────────────────────────────────────────────────────
• Weekly snapshots moved to S3 Glacier
• 1-year retention
• Used for compliance and legal hold

Tier 4: Monthly Cold Storage
──────────────────────────────────────────────────────────
• Monthly snapshots to S3 Glacier Deep Archive
• 7-year retention (financial compliance)
• Restore time: 12-48 hours
```

### 7.2 Backup Verification

```bash
# Weekly automated restore test
#!/bin/bash
# 1. Restore latest backup to isolated environment
pg_restore -d phygital_trace_verify latest_backup.dump

# 2. Run integrity checks
psql phygital_trace_verify -c "SELECT COUNT(*) FROM certificates;"
psql phygital_trace_verify -c "SELECT COUNT(*) FROM users;"

# 3. Spot-check 10 random certificates against blockchain
node scripts/verify-certificates.js --sample 10

# 4. Publish result to monitoring
curl -X POST $MONITORING_WEBHOOK -d '{"test": "backup_restore", "status": "pass"}'
```

### 7.3 Recovery Playbook

```
SCENARIO: Primary database is lost/corrupted

Step 1 (< 5 min): Promote PostgreSQL standby replica
  → AWS RDS: Automatic failover
  → Self-hosted: pg_ctl promote on standby

Step 2 (< 15 min): Verify standby is accepting writes
  → Check max(created_at) in certificates table
  → Should be within RPO window

Step 3 (< 30 min): Update application config to point to new primary
  → Update DATABASE_URL in environment
  → Redeploy or use AWS SSM Parameter Store

Step 4 (async): Investigate and document root cause
```

---

## 8. Migration Workflow

### 8.1 Development

```bash
# After modifying schema.prisma:
npx prisma migrate dev --name describe_your_change

# This will:
# 1. Generate SQL migration file
# 2. Apply it to your dev database
# 3. Regenerate Prisma Client
```

### 8.2 Production

```bash
# In CI/CD pipeline (after deployment):
npx prisma migrate deploy

# This applies any pending migrations that haven't been applied yet.
# NEVER run migrate dev in production.
```

### 8.3 Migration Safety Rules

| Rule | Why |
|---|---|
| Never drop columns immediately | Old app versions may still be running during deployment |
| Prefer nullable columns for new additions | Allows rolling deployments without constraint violations |
| Always add indexes concurrently | `CREATE INDEX CONCURRENTLY` avoids table locks |
| Test migrations on staging first | Production data may have edge cases dev data doesn't |
| Keep migrations small | Large migrations increase lock hold time |

---

## 9. Query Patterns

### 9.1 Most Common Queries

```sql
-- Pattern 1: Verify by image hash (most frequent, ~80% of traffic)
SELECT c.*, u.display_name, u.handle
FROM certificates c
JOIN users u ON c.user_id = u.id
WHERE c.image_hash = $1
LIMIT 1;

-- Pattern 2: User certificate gallery
SELECT id, image_hash, ipfs_cid, status, capture_time, city, country
FROM certificates
WHERE user_id = $1
ORDER BY capture_time DESC
LIMIT $2 OFFSET $3;

-- Pattern 3: Certificate count for profile stats
SELECT COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed,
       COUNT(DISTINCT country) AS countries_covered
FROM certificates
WHERE user_id = $1;
```

### 9.2 Admin Queries

```sql
-- Dashboard: certificates by status
SELECT status, COUNT(*) as count
FROM certificates
GROUP BY status;

-- Find stuck pending certificates
SELECT id, user_id, created_at, updated_at
FROM certificates
WHERE status = 'pending'
  AND created_at < NOW() - INTERVAL '1 hour'
ORDER BY created_at ASC;
```

---

## 10. Database Security

### 10.1 Access Control

```sql
-- Application user (least privilege)
CREATE USER phygital_app WITH PASSWORD 'secure-password';
GRANT CONNECT ON DATABASE phygital_trace TO phygital_app;
GRANT USAGE ON SCHEMA public TO phygital_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO phygital_app;
-- Note: No DELETE permission (uses soft deletes)

-- Read-only user for analytics
CREATE USER phygital_readonly WITH PASSWORD 'another-secure-password';
GRANT CONNECT ON DATABASE phygital_trace TO phygital_readonly;
GRANT USAGE ON SCHEMA public TO phygital_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO phygital_readonly;
-- Exclude sensitive tables
REVOKE SELECT ON users FROM phygital_readonly;
```

### 10.2 Connection Security

- All connections use TLS (SSL mode: `require` or `verify-full`)
- Connection strings stored in environment variables, never in code
- Database not publicly accessible — only from API server security group
- PgBouncer sits between application and database for connection pooling

### 10.3 Row-Level Security (Future)

```sql
-- Future: RLS for multi-tenant scenarios
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY certificate_isolation ON certificates
  FOR ALL
  TO phygital_app
  USING (user_id = current_setting('app.current_user_id')::text
         OR status = 'confirmed'); -- Public certificates visible to all
```

---

*Last Updated: 2026-03-08*
