# 🔧 Technical Requirements Document (TRD)

> **Phygital-Trace** | Camera-to-Blockchain Citizen Journalism Verification Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./TRD.md)
[![Status](https://img.shields.io/badge/status-Active-green)](./TRD.md)

---

## 📖 Table of Contents

1. [Technical Overview](#1-technical-overview)
2. [System Architecture](#2-system-architecture)
3. [API Specification](#3-api-specification)
4. [Smart Contract Interface](#4-smart-contract-interface)
5. [Sequence Diagrams](#5-sequence-diagrams)
6. [Security Architecture](#6-security-architecture)
7. [Data Flow & Privacy](#7-data-flow--privacy)
8. [Infrastructure Requirements](#8-infrastructure-requirements)
9. [Integration Requirements](#9-integration-requirements)
10. [Testing Requirements](#10-testing-requirements)
11. [Performance Benchmarks](#11-performance-benchmarks)
12. [Compliance & Standards](#12-compliance--standards)

---

## 1. Technical Overview

### 1.1 Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Mobile** | React Native + Expo | RN 0.73, Expo 50 | iOS and Android app |
| **Web Portal** | Next.js 14 | 14.x | Public verification portal |
| **Web Styling** | Tailwind CSS | 3.x | UI styling |
| **Backend** | Node.js + Express | Node 20 LTS | REST API server |
| **Backend Language** | TypeScript | 5.x | Type-safe backend |
| **Smart Contracts** | Solidity | 0.8.24 | Truth Certificate registry |
| **Contract Tooling** | Hardhat | 2.22 | Compilation, testing, deployment |
| **Blockchain** | Base L2 (Sepolia testnet) | — | Certificate storage |
| **Database** | PostgreSQL | 15 | Relational data |
| **ORM** | Prisma | 5.x | Database abstraction |
| **Cache** | Redis | 7.x | Session cache, rate limiting |
| **File Storage** | IPFS via Pinata | — | Immutable file storage |
| **Testing** | Jest + Hardhat tests | — | Unit and contract tests |

### 1.2 Environment Variables

```env
# Server
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.phygital-trace.xyz

# Database
DATABASE_URL=postgresql://user:pass@host:5432/phygital_trace

# Redis
REDIS_URL=redis://default:password@host:6379

# JWT
JWT_SECRET=<256-bit-random-secret>
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# Blockchain
RPC_URL=https://sepolia.base.org
PRIVATE_KEY=<deployer-wallet-private-key>
CONTRACT_ADDRESS=0x...
CHAIN_ID=84532

# IPFS / Pinata
PINATA_API_KEY=<key>
PINATA_API_SECRET=<secret>
PINATA_GATEWAY=https://gateway.pinata.cloud

# Email (Resend)
RESEND_API_KEY=<key>
FROM_EMAIL=noreply@phygital-trace.xyz
```

---

## 2. System Architecture

### 2.1 High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          TRUST BOUNDARY: CLIENT                         │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐    │
│  │     📱 MOBILE APP            │  │     🌐 WEB PORTAL            │    │
│  │  React Native + Expo         │  │  Next.js 14 + Tailwind       │    │
│  │  ┌─────────────────────┐    │  │  ┌──────────────────────┐   │    │
│  │  │  Secure Enclave     │    │  │  │  Client-side Hashing │   │    │
│  │  │  Key Management     │    │  │  │  (SubtleCrypto)      │   │    │
│  │  └─────────────────────┘    │  │  └──────────────────────┘   │    │
│  │  ┌─────────────────────┐    │  └──────────────────────────────┘    │
│  │  │  Sensor Collectors  │    │                                       │
│  │  │  GPS/Accel/Gyro/    │    │                                       │
│  │  │  Baro/Light/RF/Cell │    │                                       │
│  │  └─────────────────────┘    │                                       │
│  └──────────────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │ HTTPS/TLS 1.3
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        TRUST BOUNDARY: API GATEWAY                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  🔧 EXPRESS API (Node.js + TypeScript)                           │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐ │  │
│  │  │  Auth      │  │ Cert       │  │ Verify     │  │  Profile  │ │  │
│  │  │  Service   │  │ Service    │  │ Service    │  │  Service  │ │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └───────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐   ┌────────────────┐   ┌─────────────────────────────┐
│ 🗄️ PostgreSQL │   │ 🔴 Redis Cache │   │  📦 IPFS / Pinata           │
│ (Prisma ORM) │   │ Sessions/Rate  │   │  Immutable file storage     │
└──────────────┘   └────────────────┘   └─────────────────────────────┘
                                                    │
                                                    ▼
                              ┌─────────────────────────────────────┐
                              │  ⛓️  BASE L2 BLOCKCHAIN              │
                              │  TruthCertificate.sol               │
                              │  PhygitalNFT.sol                    │
                              │  VerificationOracle.sol             │
                              └─────────────────────────────────────┘
```

### 2.2 Network Topology

```
Internet
   │
   ├── CDN (Cloudflare)
   │     ├── /  → Next.js web portal (Vercel)
   │     └── /api/* → Backend API (Railway/AWS)
   │
   ├── Backend API
   │     ├── PostgreSQL (Railway managed / AWS RDS)
   │     ├── Redis (Railway managed / AWS ElastiCache)
   │     └── Pinata API (external)
   │
   └── Base L2 RPC
         └── TruthCertificate contract
```

---

## 3. API Specification

### 3.1 Base URL and Versioning

```
Base URL: https://api.phygital-trace.xyz/v1
Content-Type: application/json
Authentication: Bearer <JWT token>
```

### 3.2 Authentication Endpoints

#### `POST /auth/register`

Register a new user account.

```json
// Request
{
  "email": "journalist@example.com",
  "password": "Str0ngP@ssw0rd!",
  "displayName": "Jane Reporter",
  "walletAddress": "0x1234...abcd"  // Optional
}

// Response 201 Created
{
  "success": true,
  "data": {
    "userId": "usr_01HN5B9KT2...",
    "email": "journalist@example.com",
    "displayName": "Jane Reporter",
    "createdAt": "2026-03-08T12:00:00Z"
  },
  "token": "eyJhbGc..."
}
```

#### `POST /auth/login`

```json
// Request
{
  "email": "journalist@example.com",
  "password": "Str0ngP@ssw0rd!"
}

// Response 200 OK
{
  "success": true,
  "data": {
    "userId": "usr_01HN5B9KT2...",
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 604800
  }
}
```

#### `POST /auth/refresh`

```json
// Request
{ "refreshToken": "eyJhbGc..." }

// Response 200 OK
{ "accessToken": "eyJhbGc...", "expiresIn": 604800 }
```

### 3.3 Certificate Endpoints

#### `POST /certificates`

Upload a new truth certificate.

```json
// Request (multipart/form-data)
{
  "image": <binary>,
  "sensorBundle": {
    "timestamp": 1709894400000,
    "gps": { "lat": 40.7128, "lng": -74.0060, "alt": 10.5, "accuracy": 5 },
    "accelerometer": { "x": 0.01, "y": 9.81, "z": 0.02, "samples": 100 },
    "gyroscope": { "x": 0.001, "y": 0.002, "z": 0.001, "samples": 100 },
    "barometer": { "pressure": 1013.25, "altitude": 10.5 },
    "light": { "lux": 12500 },
    "wifi": [
      { "bssid": "aa:bb:cc:dd:ee:ff", "rssi": -65 }
    ],
    "cellTowers": [
      { "mcc": 310, "mnc": 410, "lac": 1234, "cid": 5678 }
    ]
  },
  "deviceInfo": {
    "model": "iPhone 14 Pro",
    "os": "iOS 17.2",
    "appVersion": "1.0.0"
  },
  "signature": "0x304402...",  // Secure Enclave signature
  "publicKey": "0x04abc..."     // Secure Enclave public key
}

// Response 201 Created
{
  "success": true,
  "data": {
    "certificateId": "cert_01HN5B9KT2...",
    "imageHash": "0xabc123...",
    "sensorHash": "0xdef456...",
    "combinedHash": "0x789abc...",
    "ipfsCid": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    "txHash": "0x...",
    "blockNumber": 1234567,
    "status": "confirmed",
    "issuedAt": "2026-03-08T12:00:00Z"
  }
}
```

#### `GET /certificates/:certificateId`

```json
// Response 200 OK
{
  "success": true,
  "data": {
    "certificateId": "cert_01HN5B9KT2...",
    "journalist": {
      "userId": "usr_01HN5B9KT2...",
      "displayName": "Jane Reporter",
      "profileUrl": "https://phygital-trace.xyz/@jane"
    },
    "imageHash": "0xabc123...",
    "ipfsCid": "QmXoypiz...",
    "captureTime": "2026-03-08T12:00:00Z",
    "location": {
      "lat": 40.713,
      "lng": -74.006,
      "city": "New York",
      "country": "US"
    },
    "deviceInfo": { "model": "iPhone 14 Pro", "os": "iOS 17.2" },
    "blockchain": {
      "txHash": "0x...",
      "blockNumber": 1234567,
      "network": "base-sepolia",
      "contractAddress": "0x..."
    },
    "verificationStatus": "VERIFIED",
    "sensorFingerprint": {
      "hasGPS": true,
      "hasAccelerometer": true,
      "hasGyroscope": true,
      "hasBarometer": true,
      "hasLight": true,
      "wifiNetworksCount": 12,
      "cellTowersCount": 3
    }
  }
}
```

#### `GET /certificates`

```
GET /certificates?page=1&limit=20&userId=usr_01HN5B9KT2&from=2026-01-01&to=2026-03-08

// Response 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasNext": true
  }
}
```

### 3.4 Verification Endpoints

#### `POST /verify/hash`

Verify by image hash (client-side computed).

```json
// Request
{ "imageHash": "0xabc123..." }

// Response 200 OK
{
  "success": true,
  "data": {
    "verified": true,
    "certificate": { /* same as GET /certificates/:id */ }
  }
}
```

#### `POST /verify/upload`

Verify by uploading image file.

```
// Request: multipart/form-data with "image" field
// Response: same as POST /verify/hash
```

### 3.5 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "CERTIFICATE_NOT_FOUND",
    "message": "No certificate found for the provided hash",
    "details": {},
    "requestId": "req_01HN5B9KT2..."
  }
}
```

#### Standard Error Codes

| HTTP Status | Error Code | Description |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Request body validation failed |
| 401 | `UNAUTHORIZED` | Missing or invalid JWT |
| 403 | `FORBIDDEN` | Valid JWT but insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `DUPLICATE_CERTIFICATE` | Certificate already registered for this hash |
| 422 | `INVALID_SIGNATURE` | Secure Enclave signature verification failed |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |
| 503 | `BLOCKCHAIN_UNAVAILABLE` | Cannot reach Base L2 RPC |

---

## 4. Smart Contract Interface

### 4.1 `TruthCertificate.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title TruthCertificate
 * @notice Stores immutable Truth Certificates for verified photos
 * @dev Deployed on Base Sepolia (chain ID 84532)
 */
interface ITruthCertificate {

    struct Certificate {
        bytes32 imageHash;        // keccak256 of image bytes
        bytes32 sensorHash;       // keccak256 of sensor bundle JSON
        bytes32 combinedHash;     // keccak256(imageHash || sensorHash)
        address journalist;       // Wallet address of journalist
        uint256 timestamp;        // Unix timestamp of capture
        string  ipfsCid;          // IPFS CID of full certificate data
        bool    revoked;          // True if certificate is revoked
    }

    // Events
    event CertificateRegistered(
        bytes32 indexed combinedHash,
        address indexed journalist,
        uint256 timestamp,
        string ipfsCid
    );

    event CertificateRevoked(
        bytes32 indexed combinedHash,
        address indexed revokedBy,
        string reason
    );

    // Core functions
    function registerCertificate(
        bytes32 imageHash,
        bytes32 sensorHash,
        string calldata ipfsCid,
        bytes calldata journalistSignature
    ) external returns (bytes32 combinedHash);

    function getCertificate(bytes32 combinedHash)
        external view returns (Certificate memory);

    function verifyHash(bytes32 imageHash)
        external view returns (bool exists, bytes32 combinedHash);

    function revokeCertificate(bytes32 combinedHash, string calldata reason)
        external;

    function getCertificatesByJournalist(address journalist)
        external view returns (bytes32[] memory);
}
```

### 4.2 Gas Estimates

| Function | Gas Estimate | USD at 0.1 gwei |
|---|---|---|
| `registerCertificate` | ~45,000 | ~$0.001 |
| `revokeCertificate` | ~30,000 | ~$0.0007 |
| `getCertificate` (view) | 0 | Free |
| `verifyHash` (view) | 0 | Free |

---

## 5. Sequence Diagrams

### 5.1 Certificate Issuance Flow

```
Actor          MobileApp        SecureEnclave     Backend API       IPFS          Blockchain
  │               │                  │                │              │                │
  │──shutter─────>│                  │                │              │                │
  │               │──captureAll()───>│                │              │                │
  │               │  sensors         │                │              │                │
  │               │<──sensorBundle───│                │              │                │
  │               │──sign(hash)─────>│                │              │                │
  │               │<──signature──────│                │              │                │
  │               │──────────────────┼──POST /certs──>│              │                │
  │               │                  │ {img, sensors, │              │                │
  │               │                  │  sig, pubkey}  │              │                │
  │               │                  │                │──pin(data)──>│                │
  │               │                  │                │<──CID────────│                │
  │               │                  │                │──register()──┼───────────────>│
  │               │                  │                │<──txHash─────┼────────────────│
  │               │                  │                │              │                │
  │               │<────────────────────certId────────│              │                │
  │<──"Verified"──│                  │                │              │                │
```

### 5.2 Certificate Verification Flow

```
Verifier       WebPortal         Backend API       IPFS           Blockchain
  │               │                  │               │                │
  │──paste URL───>│                  │               │                │
  │               │──GET /verify────>│               │                │
  │               │   {hash}         │               │                │
  │               │                  │──fetch(CID)──>│                │
  │               │                  │<──fullData────│                │
  │               │                  │──verify()─────┼───────────────>│
  │               │                  │<──onChainData─┼────────────────│
  │               │                  │──validateSig()│                │
  │               │<──VERIFIED───────│               │                │
  │<──green badge─│                  │               │                │
```

### 5.3 Key Generation Flow (First Launch)

```
User           MobileApp        SecureEnclave     Backend API
  │               │                  │                │
  │──install+open>│                  │                │
  │               │──generateKey()──>│                │
  │               │                  │──(hardware key)│
  │               │<──publicKey──────│                │
  │               │──────────────────┼──POST /keys───>│
  │               │                  │   {publicKey,  │
  │               │                  │    deviceAttest}│
  │               │<────────────────────keyRegistered─│
  │<──"Ready"─────│                  │                │
```

---

## 6. Security Architecture

### 6.1 Threat Model

```
┌──────────────────────────────────────────────────────────────────┐
│                        THREAT CATEGORIES                         │
├──────────────────┬───────────────────────────────────────────────┤
│ T1: Client       │ Attacker modifies app, injects fake sensors    │
│ T2: Network      │ MITM intercepts sensor data before signing     │
│ T3: Server       │ Backend breach exposes user data               │
│ T4: Blockchain   │ Smart contract vulnerability                   │
│ T5: IPFS         │ Pinned data modification (impossible, by design)│
│ T6: Social Eng.  │ Journalist account takeover                    │
│ T7: Physical     │ Device stolen with unlocked Secure Enclave     │
└──────────────────┴───────────────────────────────────────────────┘
```

### 6.2 Controls

| Threat | Control | Layer |
|---|---|---|
| T1: Fake sensors | Device attestation (Apple DeviceCheck / Google SafetyNet) | Mobile |
| T1: App tampering | Code signing + certificate pinning | Mobile |
| T2: MITM | TLS 1.3 + cert pinning + HSTS | Network |
| T3: Server breach | Minimal data storage; hashes only, not raw sensors | Server |
| T3: SQL injection | Prisma parameterized queries only | Server |
| T3: Auth bypass | JWT with short expiry + refresh rotation | Server |
| T4: SC bugs | Third-party audit + formal verification | Contract |
| T4: Reentrancy | Checks-Effects-Interactions pattern | Contract |
| T5: IPFS manipulation | Content-addressed (CID = hash of content) | Storage |
| T6: Account takeover | MFA enforcement for all destructive actions | Auth |
| T7: Key theft | Secure Enclave requires biometric + device passcode | Hardware |

### 6.3 Cryptographic Primitives

| Use Case | Algorithm | Notes |
|---|---|---|
| Image hashing | SHA-256 | Via SubtleCrypto (Web) / native (Mobile) |
| Sensor bundle hashing | SHA-256 | JSON canonicalized before hashing |
| Combined hash | SHA-256(imageHash \|\| sensorHash) | Concatenated bytes |
| Secure Enclave signing | ECDSA / P-256 | Hardware-enforced |
| JWT tokens | HS256 | Server-side secret rotation every 90 days |
| Passwords | bcrypt | 12 rounds |
| API key generation | CSPRNG (32 bytes) | Base64url encoded |

### 6.4 Security Headers

```typescript
// Express security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://gateway.pinata.cloud"],
      connectSrc: ["'self'", "https://sepolia.base.org"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
```

---

## 7. Data Flow & Privacy

### 7.1 What is Stored Where

| Data | Client Only | Backend DB | IPFS | Blockchain |
|---|---|---|---|---|
| Raw image | ✅ (device) | ❌ | ⚠️ (opt-in) | ❌ |
| Image hash | — | ✅ | ✅ | ✅ |
| Raw sensor readings | ✅ (temp) | ❌ | ❌ | ❌ |
| Sensor bundle hash | — | ✅ | ✅ | ✅ |
| GPS (3-decimal) | — | ✅ | ✅ | ❌ |
| Combined hash | — | ✅ | ✅ | ✅ |
| Secure Enclave sig | — | ✅ | ✅ | ❌ |
| Device model | — | ✅ | ✅ | ❌ |
| Journalist wallet | — | ✅ | ✅ | ✅ |
| JWT | Client only | ❌ | ❌ | ❌ |

> ⚠️ **Privacy Note:** Raw GPS coordinates are truncated to 3 decimal places (~111m accuracy) before storage. Full precision is retained on-device only.

### 7.2 Data Retention Policy

| Data Category | Retention | Deletion Method |
|---|---|---|
| Certificate metadata | Permanent (on-chain) | Cannot be deleted |
| User profile data | Until account deletion | Hard delete + GDPR export |
| JWT refresh tokens | 30 days | Automatic expiry |
| Audit logs | 2 years | Automated purge |
| Redis sessions | 7 days | TTL |
| IPFS pins | User-controlled | Unpin request to Pinata |

---

## 8. Infrastructure Requirements

### 8.1 Minimum Viable Production

| Service | Spec | Provider |
|---|---|---|
| Backend API | 2 vCPU, 4GB RAM | Railway / Fly.io |
| PostgreSQL | 2 vCPU, 4GB RAM, 100GB SSD | Railway / AWS RDS |
| Redis | 1 vCPU, 1GB RAM | Railway / AWS ElastiCache |
| Web Portal | Serverless | Vercel |
| CDN | Global edge | Cloudflare (free tier) |

### 8.2 Production Scale (10,000 DAU)

| Service | Spec | Provider | Monthly Cost |
|---|---|---|---|
| Backend API | 4 vCPU, 8GB RAM × 3 instances | AWS ECS Fargate | ~$150 |
| PostgreSQL | db.t3.medium, Multi-AZ | AWS RDS | ~$100 |
| Redis | cache.t3.micro, cluster | AWS ElastiCache | ~$50 |
| Web Portal | Serverless | Vercel Pro | ~$20 |
| CDN | Global edge | Cloudflare | Free |
| Pinata IPFS | Dedicated gateway | Pinata | ~$99 |
| **Total** | | | **~$419/month** |

---

## 9. Integration Requirements

### 9.1 IPFS / Pinata

```typescript
// Certificate data structure pinned to IPFS
interface IPFSCertificatePayload {
  version: "1.0";
  certificateId: string;
  imageHash: string;
  sensorBundleHash: string;
  combinedHash: string;
  captureTimestamp: number;
  location: { lat: number; lng: number; accuracy: number };
  sensorFingerprint: SensorBundle;
  deviceInfo: DeviceInfo;
  journalistPublicKey: string;
  secureEnclaveSignature: string;
  schemaUrl: "https://phygital-trace.xyz/schema/v1.json";
}
```

### 9.2 Base L2 Blockchain

```typescript
// ethers.js v6 integration
import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  TruthCertificateABI,
  signer
);

async function registerCertificate(
  imageHash: string,
  sensorHash: string,
  ipfsCid: string,
  signature: string
): Promise<string> {
  const tx = await contract.registerCertificate(
    imageHash, sensorHash, ipfsCid, signature
  );
  const receipt = await tx.wait(1); // Wait 1 confirmation
  return receipt.hash;
}
```

---

## 10. Testing Requirements

### 10.1 Coverage Requirements

| Layer | Minimum Coverage | Tool |
|---|---|---|
| Backend unit tests | 80% | Jest |
| Backend integration tests | 70% | Jest + Supertest |
| Smart contract tests | 100% branches | Hardhat + Chai |
| Mobile unit tests | 60% | Jest |
| End-to-end tests | Critical paths | Detox / Playwright |

### 10.2 Critical Test Scenarios

```
✅ TC-001: Certificate registration succeeds with valid sensor data
✅ TC-002: Certificate registration fails with invalid Secure Enclave signature
✅ TC-003: Duplicate image hash is rejected
✅ TC-004: Verification returns correct result for valid certificate
✅ TC-005: Verification returns NOT_FOUND for unknown hash
✅ TC-006: Certificate revocation prevents further verification
✅ TC-007: Rate limiting enforced at 100 req/min
✅ TC-008: JWT expiry handled correctly
✅ TC-009: IPFS pin failure rolls back DB transaction
✅ TC-010: Blockchain TX failure triggers retry with exponential backoff
```

---

## 11. Performance Benchmarks

### 11.1 Load Test Targets

```
Scenario: Certificate issuance burst
- 100 concurrent users
- Each issuing 1 certificate per second
- Duration: 60 seconds

Expected:
- p50 response time: < 800ms
- p95 response time: < 2000ms
- p99 response time: < 3500ms
- Error rate: < 0.1%
```

### 11.2 Database Query Benchmarks

| Query | Target p95 | Index Used |
|---|---|---|
| Lookup by image hash | < 10ms | `idx_image_hash` |
| Lookup by certificate ID | < 5ms | Primary key |
| User certificate list | < 20ms | `idx_user_certificates` |
| Date range filter | < 30ms | `idx_created_at` |

---

## 12. Compliance & Standards

### 12.1 Standards Adherence

| Standard | Applicability | Status |
|---|---|---|
| OWASP Top 10 | Backend API | Required |
| C2PA (Content Credentials) | Certificate format | Aligned (not certified) |
| GDPR | EU user data | Required |
| CCPA | California users | Required |
| W3C DID | Journalist identity | Future consideration |
| OpenAPI 3.0 | API documentation | Required |
| RFC 7519 (JWT) | Authentication | Implemented |
| EIP-712 | Structured data signing | Future |

### 12.2 Audit Requirements

Before mainnet deployment:
- [ ] Smart contract security audit by Certik, OpenZeppelin, or Trail of Bits
- [ ] Backend penetration test by qualified third party
- [ ] GDPR Data Protection Impact Assessment (DPIA)
- [ ] Dependency vulnerability scan (npm audit, Snyk)
- [ ] Static code analysis (CodeQL, SonarQube)

---

*Last Updated: 2026-03-08*
