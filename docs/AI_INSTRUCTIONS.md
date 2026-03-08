# 🤖 AI Coding Instructions

> **Phygital-Trace** | Guidelines for AI-assisted development in this codebase

[![Style](https://img.shields.io/badge/style-TypeScript%20strict-3178C6)](./AI_INSTRUCTIONS.md)
[![Linter](https://img.shields.io/badge/linter-ESLint%20+%20Prettier-purple)](./AI_INSTRUCTIONS.md)

---

## 📖 Table of Contents

1. [Project Context](#1-project-context)
2. [Style Guide](#2-style-guide)
3. [Architecture Patterns](#3-architecture-patterns)
4. [How-To Guides](#4-how-to-guides)
5. [Security Rules](#5-security-rules)
6. [Testing Conventions](#6-testing-conventions)
7. [Smart Contract Guidelines](#7-smart-contract-guidelines)
8. [Mobile App Guidelines](#8-mobile-app-guidelines)
9. [Anti-Patterns to Avoid](#9-anti-patterns-to-avoid)
10. [Commit & PR Conventions](#10-commit--pr-conventions)

---

## 1. Project Context

Phygital-Trace is a **security-critical application**. Every line of code you write may affect the integrity of journalism verification. Before making any change:

1. **Understand the trust model** — the Secure Enclave is the root of trust; never bypass it
2. **Understand the data flow** — sensor data flows from hardware → app → hash → blockchain; any break in this chain invalidates certificates
3. **Understand what is public** — blockchain data and IPFS content are permanently public; never store PII there

### Directory Structure Overview

```
phygital-trace/
├── mobile/          # React Native + Expo app
├── web/             # Next.js 14 web portal
├── backend/         # Node.js + Express + TypeScript API
├── contracts/       # Solidity smart contracts (Hardhat)
├── shared/          # Shared TypeScript types and utilities
└── docs/            # Documentation (you are here)
```

---

## 2. Style Guide

### 2.1 TypeScript Conventions

```typescript
// ✅ GOOD: Always use explicit types
const certificateId: string = generateId();
const isVerified: boolean = await verifyCertificate(hash);

// ❌ BAD: Implicit any
const result = await fetch(url); // result is implicitly any

// ✅ GOOD: Use interfaces for object shapes
interface Certificate {
  id: string;
  imageHash: string;
  issuedAt: Date;
}

// ❌ BAD: Use type aliases for simple object shapes (use interface instead)
type Certificate = { id: string }; // Prefer interface

// ✅ GOOD: Exhaustive discriminated unions
type CertificateStatus =
  | { status: "pending" }
  | { status: "confirmed"; txHash: string }
  | { status: "failed"; error: string };

// ✅ GOOD: Use const assertions for immutable data
const SENSOR_TYPES = ["gps", "accelerometer", "gyroscope"] as const;
type SensorType = typeof SENSOR_TYPES[number];
```

### 2.2 Naming Conventions

| Item | Convention | Example |
|---|---|---|
| Variables | `camelCase` | `imageHash`, `sensorBundle` |
| Functions | `camelCase` verb | `registerCertificate()`, `validateSignature()` |
| Classes | `PascalCase` | `CertificateService`, `BlockchainClient` |
| Interfaces | `PascalCase` | `ICertificateRepository`, `SensorBundle` |
| Enums | `PascalCase` | `CertificateStatus`, `ErrorCode` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES`, `BASE_CHAIN_ID` |
| Files (TS) | `kebab-case` | `certificate-service.ts` |
| Files (React) | `PascalCase` | `CertificateCard.tsx` |
| Database tables | `snake_case` | `truth_certificates` |
| Environment vars | `SCREAMING_SNAKE_CASE` | `DATABASE_URL` |
| Solidity contracts | `PascalCase` | `TruthCertificate.sol` |

### 2.3 File Organization

```typescript
// Standard file structure for a service file
// 1. Imports (external, then internal)
import { ethers } from "ethers";
import { PrismaClient } from "@prisma/client";
import { CertificateRepository } from "../repositories/certificate.repository";
import { IPFSService } from "./ipfs.service";
import { logger } from "../utils/logger";

// 2. Types/interfaces specific to this file
interface RegisterCertificateInput {
  imageHash: string;
  sensorBundle: SensorBundle;
  signature: string;
}

// 3. Constants
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// 4. Class definition
export class CertificateService {
  constructor(
    private readonly certificateRepo: CertificateRepository,
    private readonly ipfsService: IPFSService,
  ) {}

  // 5. Public methods first
  async register(input: RegisterCertificateInput): Promise<Certificate> {
    // ...
  }

  // 6. Private methods last
  private async computeHashes(input: RegisterCertificateInput) {
    // ...
  }
}
```

### 2.4 Error Handling Pattern

```typescript
// ✅ GOOD: Custom error classes with error codes
export class CertificateError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "CertificateError";
  }
}

// Usage
throw new CertificateError(
  "DUPLICATE_CERTIFICATE",
  "A certificate already exists for this image hash",
  { imageHash }
);

// ✅ GOOD: Express error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CertificateError) {
    return res.status(409).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }
  logger.error("Unhandled error", { err, requestId: req.id });
  return res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR" } });
});
```

### 2.5 Async/Await Patterns

```typescript
// ✅ GOOD: Always await Promises, never fire-and-forget for critical operations
const txHash = await blockchainClient.registerCertificate(hash);

// ✅ GOOD: Parallel independent operations
const [ipfsCid, blockNumber] = await Promise.all([
  ipfsService.pin(payload),
  blockchainClient.getBlockNumber(),
]);

// ❌ BAD: Unhandled promise
ipfsService.pin(payload); // Fire-and-forget breaks atomicity

// ✅ GOOD: Retry with exponential backoff for blockchain calls
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      await sleep(1000 * Math.pow(2, attempt));
    }
  }
  throw new Error("Unreachable");
}
```

---

## 3. Architecture Patterns

### 3.1 Repository Pattern for Database Access

```typescript
// Always abstract DB access behind repositories
// ✅ GOOD
class CertificateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByHash(imageHash: string): Promise<Certificate | null> {
    return this.prisma.certificate.findUnique({ where: { imageHash } });
  }

  async create(data: CreateCertificateInput): Promise<Certificate> {
    return this.prisma.certificate.create({ data });
  }
}

// ❌ BAD: Direct Prisma calls in controllers
app.get("/certificates/:id", async (req, res) => {
  const cert = await prisma.certificate.findUnique(...); // Don't do this
});
```

### 3.2 Dependency Injection via Constructor

```typescript
// ✅ GOOD: Constructor injection for testability
export class CertificateService {
  constructor(
    private readonly repo: CertificateRepository,
    private readonly ipfs: IPFSService,
    private readonly blockchain: BlockchainService,
  ) {}
}

// In composition root (main.ts)
const repo = new CertificateRepository(prisma);
const ipfs = new IPFSService(pinataConfig);
const blockchain = new BlockchainService(ethersProvider);
const certService = new CertificateService(repo, ipfs, blockchain);
```

### 3.3 Controller → Service → Repository Layering

```
HTTP Request
    │
    ▼
Controller (validates input, returns HTTP response)
    │
    ▼
Service (business logic, orchestrates)
    │
    ├── Repository (DB access)
    ├── IPFSService (external IPFS)
    └── BlockchainService (blockchain calls)
```

### 3.4 Transaction Boundaries

```typescript
// ✅ GOOD: Use Prisma transactions for multi-step DB operations
async function registerCertificate(input: RegisterInput) {
  return await prisma.$transaction(async (tx) => {
    // All DB operations inside the transaction
    const cert = await tx.certificate.create({ data: input });
    await tx.auditLog.create({ data: { action: "CREATE", entityId: cert.id } });
    return cert;
  });
  // If IPFS or blockchain fails AFTER this, we need saga/compensation
}
```

### 3.5 Saga Pattern for Distributed Transactions

```typescript
// Certificate issuance involves: DB write + IPFS pin + Blockchain TX
// Use compensating transactions on failure
async function issueCertificate(input: IssueInput) {
  let dbRecord: Certificate | null = null;
  let ipfsCid: string | null = null;

  try {
    // Step 1: Write to DB (status: pending)
    dbRecord = await certRepo.create({ ...input, status: "pending" });

    // Step 2: Pin to IPFS
    ipfsCid = await ipfsService.pin(buildPayload(dbRecord));

    // Step 3: Register on blockchain
    const txHash = await blockchainService.register(dbRecord.combinedHash, ipfsCid);

    // Step 4: Update DB to confirmed
    await certRepo.update(dbRecord.id, { status: "confirmed", txHash, ipfsCid });

    return dbRecord;
  } catch (err) {
    // Compensate: mark as failed, don't delete (for audit trail)
    if (dbRecord) {
      await certRepo.update(dbRecord.id, { status: "failed", error: String(err) });
    }
    throw err;
  }
}
```

---

## 4. How-To Guides

### 4.1 How to Add a New API Endpoint

1. **Create the route file** in `backend/src/routes/`
2. **Create the controller** in `backend/src/controllers/`
3. **Create/update the service** in `backend/src/services/`
4. **Add validation schema** using Zod in `backend/src/schemas/`
5. **Write tests** in `backend/src/__tests__/`
6. **Register the route** in `backend/src/app.ts`
7. **Update OpenAPI spec** in `backend/docs/openapi.yaml`

```typescript
// Example: New endpoint for batch verification
// 1. Schema (backend/src/schemas/verify.schema.ts)
import { z } from "zod";

export const batchVerifySchema = z.object({
  body: z.object({
    hashes: z.array(z.string().regex(/^0x[0-9a-f]{64}$/i)).max(100),
  }),
});

// 2. Controller (backend/src/controllers/verify.controller.ts)
export const batchVerify = async (req: Request, res: Response) => {
  const { hashes } = req.body;
  const results = await verifyService.batchVerify(hashes);
  return res.json({ success: true, data: results });
};

// 3. Route registration (backend/src/routes/verify.routes.ts)
router.post("/batch", validate(batchVerifySchema), batchVerify);
```

### 4.2 How to Add a New Sensor Type

1. **Update the sensor bundle type** in `shared/types/sensor.types.ts`
2. **Add native sensor collection** in `mobile/src/sensors/`
3. **Update the hash computation** in `shared/utils/hash.utils.ts`
4. **Update the IPFS payload schema** in `shared/schemas/certificate.schema.ts`
5. **Update the Prisma schema** if storing derived data
6. **Update TruthCertificate.sol** if it needs to change the on-chain record

### 4.3 How to Deploy a Smart Contract Update

```bash
# 1. Update contract in contracts/src/
# 2. Write tests
npx hardhat test

# 3. Deploy to testnet
npx hardhat run scripts/deploy.ts --network base-sepolia

# 4. Verify on Basescan
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>

# 5. Update CONTRACT_ADDRESS in .env
# 6. Update ABI in backend/src/blockchain/abis/
```

### 4.4 How to Add a Database Migration

```bash
# 1. Update schema.prisma
# 2. Create migration (never directly edit migration files)
npx prisma migrate dev --name add_sensor_type_column

# 3. Review generated migration SQL
cat prisma/migrations/*/migration.sql

# 4. Apply to production
npx prisma migrate deploy
```

---

## 5. Security Rules

> 🚨 **These rules are non-negotiable. Never violate them, even for tests.**

### 5.1 NEVER DO

```typescript
// ❌ NEVER: Log sensitive data
logger.info("User password", { password }); // NEVER
logger.debug("JWT token", { token }); // NEVER
logger.info("Private key", { key: process.env.PRIVATE_KEY }); // NEVER

// ❌ NEVER: Raw SQL queries (SQL injection risk)
const result = await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;
// Use parameterized: prisma.$queryRaw`... WHERE id = ${Prisma.sql`${userId}`}`

// ❌ NEVER: Trust client-provided hashes without re-computing
const hash = req.body.imageHash; // Client can lie about the hash
// ALWAYS recompute the hash server-side from the actual data

// ❌ NEVER: Expose stack traces in production
res.status(500).json({ error: err.stack }); // NEVER

// ❌ NEVER: Skip input validation
app.post("/certificates", async (req, res) => {
  await certService.create(req.body); // Validate first!
});

// ❌ NEVER: Hard-code secrets
const PRIVATE_KEY = "0xabc123..."; // Use process.env.PRIVATE_KEY

// ❌ NEVER: Disable HTTPS validation in fetch/axios
const agent = new https.Agent({ rejectUnauthorized: false }); // NEVER in prod
```

### 5.2 ALWAYS DO

```typescript
// ✅ ALWAYS: Validate all inputs with Zod before processing
const schema = z.object({ imageHash: z.string().regex(/^0x[0-9a-f]{64}$/i) });
const { imageHash } = schema.parse(req.body);

// ✅ ALWAYS: Use parameterized queries
await prisma.certificate.findUnique({ where: { imageHash } }); // Safe

// ✅ ALWAYS: Sanitize error messages before sending to client
catch (err) {
  logger.error("DB error", { err }); // Full error in logs
  res.status(500).json({ error: "INTERNAL_ERROR" }); // Generic to client
}

// ✅ ALWAYS: Check authorization before returning data
if (cert.userId !== req.user.id && !req.user.isAdmin) {
  throw new ForbiddenError("Cannot access this certificate");
}

// ✅ ALWAYS: Re-verify Secure Enclave signatures server-side
const isValid = await verifyEnclaveSignature(
  combinedHash,
  signature,
  publicKey
);
if (!isValid) throw new CertificateError("INVALID_SIGNATURE", "...");
```

### 5.3 Smart Contract Security Rules

```solidity
// ✅ ALWAYS: Checks-Effects-Interactions pattern
function registerCertificate(...) external {
    // Checks
    require(!certificates[combinedHash].exists, "Already registered");
    require(verifySignature(combinedHash, sig), "Invalid signature");

    // Effects (state changes first)
    certificates[combinedHash] = Certificate({...});

    // Interactions (external calls last)
    emit CertificateRegistered(combinedHash, msg.sender, ...);
}

// ✅ ALWAYS: Use OpenZeppelin for standard patterns
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// ❌ NEVER: Use tx.origin for authorization
require(tx.origin == owner); // Use msg.sender

// ✅ ALWAYS: Emit events for all state changes
emit CertificateRegistered(hash, journalist, timestamp, ipfsCid);
```

---

## 6. Testing Conventions

### 6.1 Test File Structure

```typescript
// backend/src/__tests__/certificate.service.test.ts

describe("CertificateService", () => {
  let service: CertificateService;
  let mockRepo: jest.Mocked<CertificateRepository>;
  let mockIPFS: jest.Mocked<IPFSService>;

  beforeEach(() => {
    mockRepo = createMockCertificateRepository();
    mockIPFS = createMockIPFSService();
    service = new CertificateService(mockRepo, mockIPFS);
  });

  describe("register()", () => {
    it("should return certificate ID on success", async () => {
      mockRepo.create.mockResolvedValue(mockCertificate);
      mockIPFS.pin.mockResolvedValue("QmXoypiz...");

      const result = await service.register(validInput);

      expect(result.id).toBeDefined();
      expect(mockRepo.create).toHaveBeenCalledOnce();
    });

    it("should throw DUPLICATE_CERTIFICATE if hash already exists", async () => {
      mockRepo.findByHash.mockResolvedValue(existingCertificate);

      await expect(service.register(validInput))
        .rejects.toThrow("DUPLICATE_CERTIFICATE");
    });
  });
});
```

### 6.2 Test Naming Convention

```
<unit>.<method>.<scenario>
Example: "CertificateService.register.should throw on duplicate hash"
```

### 6.3 Mock Data Factories

```typescript
// Always use factory functions for test data
export function createMockSensorBundle(
  overrides?: Partial<SensorBundle>
): SensorBundle {
  return {
    timestamp: Date.now(),
    gps: { lat: 40.7128, lng: -74.006, alt: 10 },
    accelerometer: { x: 0.01, y: 9.81, z: 0.02 },
    // ... etc
    ...overrides,
  };
}
```

---

## 7. Smart Contract Guidelines

### 7.1 Storage Layout

```solidity
// Group related storage variables
// Pack structs to minimize storage slots
struct Certificate {
    bytes32 imageHash;    // slot 0
    bytes32 sensorHash;   // slot 1
    address journalist;   // slot 2 (20 bytes)
    uint96 timestamp;     // slot 2 (packed, 12 bytes)
    bool revoked;         // slot 3
    string ipfsCid;       // slot 3+ (dynamic)
}
```

### 7.2 Gas Optimization Rules

```solidity
// ✅ Use bytes32 instead of string for fixed-size data (hashes)
bytes32 public imageHash; // Cheaper than string

// ✅ Use events for data that doesn't need on-chain lookup
emit CertificateData(allTheData); // vs storing all fields in struct

// ✅ Mark view/pure functions appropriately
function verifyHash(bytes32 hash) external view returns (bool) { ... }

// ✅ Use custom errors (cheaper than string revert reasons)
error AlreadyRegistered(bytes32 hash);
// vs
require(!exists, "Already registered"); // More expensive
```

---

## 8. Mobile App Guidelines

### 8.1 Sensor Collection Pattern

```typescript
// Always use the SensorCollector abstraction
// Never call native sensor APIs directly in components

import { SensorCollector } from "@/sensors/SensorCollector";

// In a hook
function useSensorCapture() {
  const collector = useRef(new SensorCollector());

  const captureAtShutter = useCallback(async () => {
    // Collector pre-warms sensors before capture
    return collector.current.captureBundle();
  }, []);

  return { captureAtShutter };
}
```

### 8.2 Secure Enclave Pattern

```typescript
// All key operations go through SecureEnclaveService
import { SecureEnclaveService } from "@/crypto/SecureEnclaveService";

const enclave = new SecureEnclaveService();

// Generate key on first launch (only once)
await enclave.generateKeyPair(); // Protected by biometric

// Sign data
const signature = await enclave.sign(combinedHash); // Triggers Face ID/Touch ID
```

### 8.3 Offline Queue

```typescript
// Certificates should be queued if offline
import { CertificateQueue } from "@/offline/CertificateQueue";

const queue = new CertificateQueue();

// Always use queue, even if online
await queue.enqueue(pendingCertificate);
// Queue processes in background when connectivity is available
```

---

## 9. Anti-Patterns to Avoid

| Anti-Pattern | Why | Alternative |
|---|---|---|
| God classes/services | Hard to test, violates SRP | Split into focused services |
| Nested callbacks | Hard to read/debug | Async/await |
| `any` type everywhere | Loses TypeScript benefits | Explicit types |
| Business logic in controllers | Hard to test | Move to services |
| Direct DB access in routes | Breaks layering | Use repositories |
| Catch-and-ignore errors | Silently breaks invariants | Always handle or rethrow |
| Checking hash from client body | Security vulnerability | Recompute server-side |
| Logging secrets | Security vulnerability | Sanitize logs |
| Trusting user-provided timestamps | Easy to fake | Use server timestamp + client timestamp |
| Blocking the event loop | Node.js performance | Use streams, worker threads for heavy computation |

---

## 10. Commit & PR Conventions

### 10.1 Conventional Commits

```
<type>(<scope>): <short description>

Types: feat, fix, docs, style, refactor, test, chore, security
Scopes: mobile, web, backend, contracts, shared, docs, ci

Examples:
feat(backend): add batch certificate verification endpoint
fix(contracts): prevent duplicate certificate registration
security(backend): add rate limiting to verification endpoints
test(contracts): add revocation edge case coverage
docs: update TRD with new sensor data privacy section
```

### 10.2 PR Requirements

- [ ] All CI checks pass (lint, tests, type-check)
- [ ] Test coverage maintained (no drop below thresholds)
- [ ] No new security vulnerabilities (Snyk scan passes)
- [ ] PR description explains WHY, not just WHAT
- [ ] Smart contract changes require maintainer approval
- [ ] Breaking API changes require version bump and migration guide

### 10.3 Branch Naming

```
feature/<ticket-id>-short-description
fix/<ticket-id>-short-description
security/<ticket-id>-short-description
release/v1.2.3
hotfix/v1.2.4-critical-fix
```

---

*Last Updated: 2026-03-08*
