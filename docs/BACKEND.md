# 🚀 Backend API Documentation

> **Phygital-Trace** | Node.js + Express + TypeScript REST API

[![API Version](https://img.shields.io/badge/API-v1-blue)](./BACKEND.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](./BACKEND.md)
[![Express](https://img.shields.io/badge/Express-4.x-000000)](./BACKEND.md)

---

## 📖 Table of Contents

1. [Overview](#1-overview)
2. [Middleware Stack](#2-middleware-stack)
3. [Authentication](#3-authentication)
4. [Certificate Endpoints](#4-certificate-endpoints)
5. [Verification Endpoints](#5-verification-endpoints)
6. [Profile Endpoints](#6-profile-endpoints)
7. [Admin Endpoints](#7-admin-endpoints)
8. [Webhook System](#8-webhook-system)
9. [Error Handling](#9-error-handling)
10. [Services Reference](#10-services-reference)
11. [Utilities Reference](#11-utilities-reference)
12. [Performance Tuning](#12-performance-tuning)

---

## 1. Overview

The Phygital-Trace backend is a **Node.js + Express + TypeScript** REST API that serves as the orchestration layer between the mobile app, web portal, IPFS, and Base L2 blockchain.

### Base URL

```
Development:  http://localhost:3001/v1
Staging:      https://api-staging.phygital-trace.xyz/v1
Production:   https://api.phygital-trace.xyz/v1
```

### Tech Stack

| Component | Technology |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express 4.x |
| Language | TypeScript 5.x |
| ORM | Prisma 5.x |
| Cache | ioredis |
| Blockchain | ethers.js v6 |
| Logging | Pino |
| Validation | Zod |
| Testing | Jest + Supertest |
| Process Manager | PM2 |

### Starting the Server

```bash
# Development (hot reload)
npm run dev

# Production
npm run build && npm start

# With PM2
pm2 start ecosystem.config.js

# Run tests
npm test

# Check types
npm run typecheck

# Lint
npm run lint
```

---

## 2. Middleware Stack

The middleware is applied in this exact order:

```typescript
// backend/src/app.ts

// 1. Request ID (first for logging correlation)
app.use(requestId());

// 2. Security headers
app.use(helmet({ /* config */ }));

// 3. CORS
app.use(cors({ origin: allowedOrigins, credentials: true }));

// 4. Rate limiting (Redis-backed)
app.use("/v1/", globalRateLimit);

// 5. Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 6. Request logging
app.use(pinoHttp({ logger }));

// 7. Authentication (sets req.user if token present)
app.use("/v1/", optionalAuth);

// 8. Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/certificates", requireAuth, certRoutes);
app.use("/v1/verify", verifyRoutes); // Public
app.use("/v1/profiles", profileRoutes); // Mostly public

// 9. 404 handler
app.use(notFoundHandler);

// 10. Global error handler (must be last)
app.use(errorHandler);
```

### 2.1 Rate Limiter Configuration

```typescript
// Global: 1000 requests per 15 minutes per IP
const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  store: new RedisStore({ client: redisClient }),
});

// Strict: 10 requests per minute for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.ip,
});

// Per-user: 100 certificate issuances per hour
const certIssuanceLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user?.id ?? req.ip,
});
```

### 2.2 CORS Configuration

```typescript
const allowedOrigins = [
  "https://phygital-trace.xyz",
  "https://www.phygital-trace.xyz",
  ...(isDevelopment ? ["http://localhost:3000"] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
}));
```

---

## 3. Authentication

### 3.1 Register

```bash
curl -X POST https://api.phygital-trace.xyz/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "journalist@example.com",
    "password": "Str0ngP@ssw0rd!",
    "displayName": "Jane Reporter"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_01HN5B9KT2VRJT4GCXDH8VXPQ",
    "email": "journalist@example.com",
    "displayName": "Jane Reporter",
    "createdAt": "2026-03-08T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3.2 Login

```bash
curl -X POST https://api.phygital-trace.xyz/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "journalist@example.com",
    "password": "Str0ngP@ssw0rd!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_01HN5B9KT2VRJT4GCXDH8VXPQ",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 604800
  }
}
```

### 3.3 Using the Token

```bash
# Include in Authorization header for all authenticated endpoints
curl -H "Authorization: Bearer eyJhbGc..." \
  https://api.phygital-trace.xyz/v1/certificates
```

### 3.4 Refresh Token

```bash
curl -X POST https://api.phygital-trace.xyz/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{ "refreshToken": "eyJhbGc..." }'
```

### 3.5 JWT Payload Structure

```json
{
  "sub": "usr_01HN5B9KT2VRJT4GCXDH8VXPQ",
  "email": "journalist@example.com",
  "tier": "professional",
  "iat": 1709894400,
  "exp": 1710499200
}
```

---

## 4. Certificate Endpoints

### 4.1 Create Certificate

```bash
curl -X POST https://api.phygital-trace.xyz/v1/certificates \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/photo.jpg" \
  -F 'sensorBundle={
    "timestamp": 1709894400000,
    "gps": {
      "lat": 40.7128,
      "lng": -74.0060,
      "alt": 10.5,
      "accuracy": 5.0
    },
    "accelerometer": {
      "x": 0.012,
      "y": 9.813,
      "z": 0.021,
      "samples": 100
    },
    "gyroscope": {
      "x": 0.001,
      "y": 0.002,
      "z": 0.001,
      "samples": 100
    },
    "barometer": {
      "pressure": 1013.25,
      "altitude": 10.5
    },
    "light": { "lux": 12500 },
    "wifi": [
      { "bssid": "aa:bb:cc:dd:ee:ff", "rssi": -65 }
    ],
    "cellTowers": [
      { "mcc": 310, "mnc": 410, "lac": 1234, "cid": 5678 }
    ]
  }' \
  -F 'deviceInfo={
    "model": "iPhone 14 Pro",
    "os": "iOS 17.2",
    "appVersion": "1.0.0"
  }' \
  -F 'signature=0x304402...' \
  -F 'publicKey=0x04abc...'
```

**Response 201 Created:**
```json
{
  "success": true,
  "data": {
    "certificateId": "cert_01HN5B9KT2VRJT4GCXDH8VXPQ",
    "imageHash": "0xabc123def456...",
    "sensorHash": "0xdef456abc789...",
    "combinedHash": "0x789abcdef012...",
    "ipfsCid": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    "txHash": "0x1234567890abcdef...",
    "blockNumber": 1234567,
    "status": "confirmed",
    "issuedAt": "2026-03-08T12:00:00.000Z",
    "shareUrl": "https://phygital-trace.xyz/verify/cert_01HN5B9KT2..."
  }
}
```

### 4.2 Get Certificate by ID

```bash
curl https://api.phygital-trace.xyz/v1/certificates/cert_01HN5B9KT2VRJT4GCXDH8VXPQ
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "certificateId": "cert_01HN5B9KT2VRJT4GCXDH8VXPQ",
    "journalist": {
      "userId": "usr_01HN5B9KT2...",
      "displayName": "Jane Reporter",
      "profileUrl": "https://phygital-trace.xyz/@jane-reporter"
    },
    "imageHash": "0xabc123...",
    "ipfsCid": "QmXoypiz...",
    "captureTime": "2026-03-08T12:00:00.000Z",
    "location": {
      "lat": 40.713,
      "lng": -74.006,
      "city": "New York",
      "country": "US"
    },
    "deviceInfo": {
      "model": "iPhone 14 Pro",
      "os": "iOS 17.2"
    },
    "blockchain": {
      "txHash": "0x1234...",
      "blockNumber": 1234567,
      "network": "base-sepolia",
      "contractAddress": "0xabcd...",
      "explorerUrl": "https://sepolia.basescan.org/tx/0x1234..."
    },
    "verificationStatus": "VERIFIED",
    "sensorFingerprint": {
      "hasGPS": true,
      "hasAccelerometer": true,
      "hasGyroscope": true,
      "hasBarometer": true,
      "hasLight": true,
      "wifiNetworksCount": 12,
      "cellTowersCount": 3,
      "fingerprintStrength": "STRONG"
    }
  }
}
```

### 4.3 List My Certificates

```bash
curl "https://api.phygital-trace.xyz/v1/certificates?page=1&limit=20&from=2026-01-01&to=2026-03-08" \
  -H "Authorization: Bearer <token>"
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": [
    { "certificateId": "cert_...", "captureTime": "...", "status": "confirmed" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 4.4 Revoke Certificate

```bash
curl -X DELETE https://api.phygital-trace.xyz/v1/certificates/cert_01HN5B9KT2... \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "reason": "Device compromised — Secure Enclave key may have been extracted" }'
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "certificateId": "cert_01HN5B9KT2...",
    "status": "revoked",
    "revokedAt": "2026-03-08T15:00:00.000Z",
    "revocationTxHash": "0xabcdef..."
  }
}
```

---

## 5. Verification Endpoints

### 5.1 Verify by Hash (Client-computed)

```bash
curl -X POST https://api.phygital-trace.xyz/v1/verify/hash \
  -H "Content-Type: application/json" \
  -d '{ "imageHash": "0xabc123def456..." }'
```

**Response — Verified:**
```json
{
  "success": true,
  "data": {
    "verified": true,
    "certificate": { /* full certificate details */ }
  }
}
```

**Response — Not Found:**
```json
{
  "success": true,
  "data": {
    "verified": false,
    "reason": "NO_CERTIFICATE_FOUND",
    "message": "No Truth Certificate found for this image. This may mean the image was not captured with Phygital-Trace, or it has been edited since capture."
  }
}
```

### 5.2 Verify by Image Upload

```bash
curl -X POST https://api.phygital-trace.xyz/v1/verify/upload \
  -F "image=@/path/to/photo.jpg"
```

**Note:** The image is hashed client-side in the web portal using SubtleCrypto. The upload endpoint is provided for third-party integrations that cannot compute hashes independently.

### 5.3 Batch Verification

```bash
curl -X POST https://api.phygital-trace.xyz/v1/verify/batch \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "hashes": [
      "0xabc123...",
      "0xdef456...",
      "0x789abc..."
    ]
  }'
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "results": [
      { "hash": "0xabc123...", "verified": true, "certificateId": "cert_..." },
      { "hash": "0xdef456...", "verified": false, "reason": "NO_CERTIFICATE_FOUND" },
      { "hash": "0x789abc...", "verified": false, "reason": "CERTIFICATE_REVOKED" }
    ],
    "summary": {
      "total": 3,
      "verified": 1,
      "notFound": 1,
      "revoked": 1
    }
  }
}
```

---

## 6. Profile Endpoints

### 6.1 Get Public Profile

```bash
curl https://api.phygital-trace.xyz/v1/profiles/jane-reporter
```

**Response 200 OK:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_01HN5B9KT2...",
    "displayName": "Jane Reporter",
    "handle": "jane-reporter",
    "bio": "Photojournalist covering conflict zones",
    "stats": {
      "totalCertificates": 147,
      "verifiedCertificates": 145,
      "countriesCovered": 12,
      "memberSince": "2026-01-15"
    },
    "socialLinks": {
      "twitter": "https://twitter.com/janereporter",
      "website": "https://janereporter.com"
    },
    "recentCertificates": [ /* last 5 */ ]
  }
}
```

### 6.2 Update Profile

```bash
curl -X PUT https://api.phygital-trace.xyz/v1/profiles/me \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Jane Reporter",
    "bio": "Award-winning photojournalist",
    "twitterUrl": "https://twitter.com/janereporter",
    "websiteUrl": "https://janereporter.com"
  }'
```

---

## 7. Admin Endpoints

> 🔐 All admin endpoints require `role: admin` in JWT payload.

### 7.1 Get System Stats

```bash
curl https://api.phygital-trace.xyz/v1/admin/stats \
  -H "Authorization: Bearer <admin-token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "certificates": {
      "total": 500000,
      "today": 1247,
      "pending": 12,
      "failed": 3
    },
    "users": {
      "total": 12500,
      "activeThisMonth": 3200
    },
    "blockchain": {
      "lastBlockProcessed": 1234567,
      "pendingTxs": 2
    }
  }
}
```

### 7.2 Force Certificate Retry

```bash
curl -X POST https://api.phygital-trace.xyz/v1/admin/certificates/cert_01HN.../retry \
  -H "Authorization: Bearer <admin-token>"
```

---

## 8. Webhook System

### 8.1 Configure a Webhook

```bash
curl -X POST https://api.phygital-trace.xyz/v1/webhooks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-newsroom.com/phygital-webhook",
    "events": ["certificate.confirmed", "certificate.revoked"],
    "secret": "your-webhook-secret"
  }'
```

### 8.2 Webhook Payload

```json
{
  "event": "certificate.confirmed",
  "timestamp": "2026-03-08T12:00:00.000Z",
  "data": {
    "certificateId": "cert_01HN5B9KT2...",
    "imageHash": "0xabc123...",
    "txHash": "0x1234...",
    "journalist": {
      "userId": "usr_01HN...",
      "displayName": "Jane Reporter"
    }
  },
  "signature": "sha256=abc123..." // HMAC-SHA256 of payload with your secret
}
```

### 8.3 Webhook Signature Verification

```javascript
// Node.js example
const crypto = require("crypto");

function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expected}`),
    Buffer.from(signature)
  );
}
```

---

## 9. Error Handling

### 9.1 Standard Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description of what went wrong",
    "details": {
      "field": "sensorBundle.gps.lat",
      "issue": "Must be between -90 and 90"
    },
    "requestId": "req_01HN5B9KT2VRJT4GCXDH8VXPQ"
  }
}
```

### 9.2 Error Code Reference

| HTTP | Code | When |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Zod validation failed |
| 400 | `MALFORMED_REQUEST` | JSON parse error |
| 401 | `UNAUTHORIZED` | No/invalid JWT |
| 401 | `TOKEN_EXPIRED` | JWT is expired |
| 403 | `FORBIDDEN` | Authenticated but no permission |
| 404 | `CERTIFICATE_NOT_FOUND` | No cert for given ID/hash |
| 404 | `USER_NOT_FOUND` | User does not exist |
| 409 | `DUPLICATE_CERTIFICATE` | imageHash already registered |
| 409 | `EMAIL_ALREADY_EXISTS` | Email already registered |
| 422 | `INVALID_SIGNATURE` | Enclave signature verification failed |
| 422 | `SENSOR_DATA_INCOMPLETE` | Required sensors missing |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unhandled server error |
| 502 | `BLOCKCHAIN_ERROR` | Error calling Base L2 |
| 503 | `IPFS_UNAVAILABLE` | Pinata API unreachable |

### 9.3 Global Error Handler

```typescript
// backend/src/middleware/error-handler.ts
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = req.id;

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: err.flatten().fieldErrors,
        requestId,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.httpStatus).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId,
      },
    });
  }

  // Unknown error — log full details but return generic response
  logger.error({ err, requestId }, "Unhandled error");
  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred", requestId },
  });
}
```

---

## 10. Services Reference

### 10.1 CertificateService

| Method | Description |
|---|---|
| `register(input)` | Full certificate issuance: DB + IPFS + blockchain |
| `getById(id)` | Fetch certificate by internal ID |
| `getByHash(imageHash)` | Fetch certificate by image hash |
| `listByUser(userId, options)` | Paginated certificate list for a user |
| `revoke(id, reason)` | Mark certificate as revoked on-chain and in DB |

### 10.2 BlockchainService

| Method | Description |
|---|---|
| `registerCertificate(hashes, ipfsCid, sig)` | Submit registration TX |
| `getOnChainCertificate(combinedHash)` | Read certificate from contract |
| `verifySignature(hash, sig, pubKey)` | Verify Secure Enclave signature |
| `revokeCertificate(combinedHash, reason)` | Submit revocation TX |
| `getBlockNumber()` | Current block height |
| `waitForConfirmation(txHash, confirmations)` | Wait for N confirmations |

### 10.3 IPFSService

| Method | Description |
|---|---|
| `pin(payload)` | Pin JSON payload to IPFS via Pinata |
| `get(cid)` | Retrieve content by CID |
| `unpin(cid)` | Unpin content from Pinata |
| `isPinned(cid)` | Check if CID is pinned |

### 10.4 AuthService

| Method | Description |
|---|---|
| `register(email, password, name)` | Create user + send verification email |
| `login(email, password)` | Validate credentials + issue JWT pair |
| `refreshToken(refreshToken)` | Issue new access token |
| `logout(refreshToken)` | Invalidate refresh token |
| `verifyEmail(token)` | Mark email as verified |

---

## 11. Utilities Reference

### 11.1 Hash Utilities

```typescript
import { computeImageHash, computeSensorHash, computeCombinedHash }
  from "../utils/hash.utils";

const imageHash = await computeImageHash(imageBuffer); // SHA-256
const sensorHash = computeSensorHash(sensorBundle);    // SHA-256 of canonical JSON
const combinedHash = computeCombinedHash(imageHash, sensorHash);
```

### 11.2 Signature Utilities

```typescript
import { verifyEnclaveSignature } from "../utils/signature.utils";

const isValid = await verifyEnclaveSignature(
  combinedHash,  // What was signed
  signature,     // ECDSA signature from Secure Enclave
  publicKey      // P-256 public key from Secure Enclave
);
```

### 11.3 Pagination Utilities

```typescript
import { paginate, PaginationOptions } from "../utils/pagination.utils";

const options: PaginationOptions = {
  page: Number(req.query.page) || 1,
  limit: Math.min(Number(req.query.limit) || 20, 100),
};

const result = await certRepo.findMany(options);
// Returns: { data: T[], pagination: { page, limit, total, hasNext, hasPrev } }
```

---

## 12. Performance Tuning

### 12.1 Connection Pool Configuration

```typescript
// backend/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"],
});

// Pool configuration via DATABASE_URL
// postgresql://user:pass@host:5432/db?connection_limit=25&pool_timeout=30
```

### 12.2 Redis Caching Pattern

```typescript
// backend/src/utils/cache.utils.ts
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;

  const result = await fn();
  await redis.setex(key, ttlSeconds, JSON.stringify(result));
  return result;
}

// Usage
const certificate = await withCache(
  `cert:id:${certificateId}`,
  3600,
  () => certRepo.findById(certificateId)
);
```

### 12.3 Response Time Targets

| Endpoint | p50 | p95 | p99 |
|---|---|---|---|
| GET /certificates/:id | 20ms | 80ms | 150ms |
| POST /verify/hash | 30ms | 100ms | 200ms |
| POST /certificates | 500ms | 2000ms | 3500ms |
| GET /profiles/:handle | 15ms | 60ms | 120ms |
| POST /verify/batch | 100ms | 400ms | 800ms |

---

*Last Updated: 2026-03-08*
