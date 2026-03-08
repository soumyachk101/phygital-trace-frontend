# 📖 Glossary

> **Phygital-Trace** | Domain Terms, Acronyms & Technical Concepts

---

## 📖 Table of Contents

- [A–C](#ac)
- [D–F](#df)
- [G–I](#gi)
- [J–L](#jl)
- [M–P](#mp)
- [Q–S](#qs)
- [T–Z](#tz)

---

## A–C

### 🔢 Accelerometer
A hardware sensor that measures acceleration forces along three axes (X, Y, Z) in meters per second squared (m/s²). In Phygital-Trace, a 100-sample burst at 100Hz is captured at the moment of shutter press, creating a unique motion fingerprint of the specific device and hand holding it at that instant.

### 🔑 API Key
A token used to authenticate programmatic access to the Phygital-Trace REST API, primarily for third-party integrations and batch verification workflows. API keys are generated with cryptographically secure random bytes and scoped to specific rate limit tiers.

### 🔐 Apple DeviceCheck
An Apple security framework that allows servers to verify that a request comes from an unmodified, legitimate Apple device app. Phygital-Trace uses DeviceCheck attestation when registering a new Secure Enclave public key to prevent sensor spoofing via emulators.

### 🗜️ Barometer
A hardware sensor that measures atmospheric pressure in hectopascals (hPa). The barometric reading is highly location- and altitude-specific and changes rapidly with weather, providing additional entropy to the physical fingerprint.

### ⛓️ Base L2
A Layer 2 blockchain network built by Coinbase on top of Ethereum using the OP Stack (Optimistic Rollup). Phygital-Trace uses Base because it provides:
- Very low gas costs (~$0.001 per certificate)
- ~2 second transaction confirmation
- Ethereum security guarantees through the L1 bridge
- EVM compatibility for standard Solidity development

See also: **Chain ID**, **Optimistic Rollup**

### 🔢 Base Sepolia
The testnet version of Base L2. Chain ID: `84532`. Phygital-Trace deploys to Base Sepolia for all testing and staging before mainnet deployment. Faucets provide free test ETH.

### 📜 bcrypt
A password hashing function used to store user account passwords. Phygital-Trace uses bcrypt with a work factor of 12 rounds, balancing security against server-side computation cost. Passwords are never stored in plaintext.

### ⛓️ Block Explorer
A public web interface for inspecting blockchain data. For Base L2, the block explorer is [basescan.org](https://basescan.org). Anyone can use a block explorer to independently verify that a Truth Certificate TX was included in a block, without trusting Phygital-Trace.

### 🔢 Block Number
The sequential height of the blockchain at the time a transaction was confirmed. Used by Phygital-Trace to establish the **ordering** of certificates — two certificates with the same block number were both confirmed at approximately the same time.

### 🧱 Blockchain
A distributed, append-only ledger secured by cryptographic hashing and consensus mechanisms. In Phygital-Trace, the blockchain is the **source of truth** for all certificate registrations. A blockchain record cannot be modified retroactively without invalidating all subsequent blocks.

---

## D–F

### 🗄️ Database (PostgreSQL)
Phygital-Trace uses PostgreSQL 15 as its relational database. The database stores **derived data** from the blockchain plus user profiles and session state. Key principle: if the DB were destroyed, all certificate data could be reconstructed from the blockchain + IPFS.

### 🔐 ECDSA (Elliptic Curve Digital Signature Algorithm)
The signature algorithm used by Phygital-Trace's Secure Enclave signing. Specifically, the P-256 (secp256r1) curve is used for Secure Enclave signatures, while Ethereum uses secp256k1. ECDSA signatures are compact (64 bytes) and provide strong security.

### 💡 EVM (Ethereum Virtual Machine)
The runtime environment for smart contracts on Ethereum and compatible networks (including Base L2). EVM smart contracts are written in Solidity and compiled to EVM bytecode. Phygital-Trace's `TruthCertificate.sol` contract runs in the EVM.

### 🗂️ EXIF Metadata
Exchangeable Image File Format metadata embedded in JPEG and TIFF files by cameras and phones. EXIF includes GPS coordinates, device model, timestamp, and camera settings. **EXIF is easily stripped or modified** — this is exactly the problem Phygital-Trace solves by putting immutable certificate data on-chain instead.

### 👆 Face ID / Touch ID
Apple's biometric authentication systems backed by the Secure Enclave. Phygital-Trace requires Face ID or Touch ID confirmation before the Secure Enclave will sign any certificate hash, preventing unauthorized certificate creation even if the phone is unlocked.

### 🖐️ Fingerprint Strength
A composite score (WEAK / MODERATE / STRONG) indicating how many sensor types were captured in a certificate. A STRONG fingerprint (GPS + accelerometer + gyroscope + barometer + light + WiFi + cell towers) is much harder to spoof than a WEAK one (GPS only).

---

## G–I

### 🔑 Gas
The fee paid to blockchain validators for processing and storing transactions. On Base L2, gas fees are very low due to the optimistic rollup design. Phygital-Trace pays gas for `registerCertificate()` calls (~45,000 gas, ~$0.001 at typical Base gas prices).

### 📡 GPS (Global Positioning System)
A satellite-based navigation system providing latitude, longitude, altitude, and accuracy data. Phygital-Trace captures GPS coordinates at the exact moment of shutter press. Coordinates are **truncated to 3 decimal places** (±111m accuracy) before storage to protect journalist location privacy.

### 🔐 Hardhat
An Ethereum development framework used for compiling, testing, and deploying Phygital-Trace's Solidity smart contracts. Hardhat provides a local Ethereum network for testing and integrates with Mocha/Chai for contract unit testing.

### #️⃣ Hash / Cryptographic Hash
A fixed-size output (digest) produced by a hash function from arbitrary-length input. Phygital-Trace uses SHA-256 (producing 256-bit / 32-byte outputs). Key properties: deterministic, one-way (cannot reverse to get original data), and avalanche effect (any change to input produces completely different output).

### 🖼️ Image Hash
The SHA-256 hash of the raw image file bytes. Any single-pixel modification to the image produces a completely different hash, making it impossible to alter an image while keeping the original certificate valid.

### 📌 IPFS (InterPlanetary File System)
A peer-to-peer distributed file system where content is addressed by its hash (CID). Phygital-Trace uses IPFS via Pinata to store the full certificate payload. Content is immutable: once pinned to IPFS, the data at a given CID can never change (any change produces a different CID).

---

## J–L

### 🔐 JWT (JSON Web Token)
A compact, self-contained token format used for authentication. Phygital-Trace issues JWTs for API authentication with:
- Access tokens (short-lived, 7 days)
- Refresh tokens (longer-lived, 30 days)
- Signed with HMAC-SHA256 using a server-side secret

### 📸 Journalist
The primary user persona of Phygital-Trace. A journalist uses the mobile app to capture verified photos. Their Secure Enclave public key is registered on their behalf, binding their device's hardware to their identity.

### 🔑 Key Revocation
The process of invalidating a cryptographic key, rendering it unable to sign new certificates. A journalist can revoke their Secure Enclave key if their device is stolen or compromised. Revocation is recorded both in the Phygital-Trace database and on-chain.

### 2️⃣ L2 / Layer 2
A blockchain network built on top of an existing blockchain (Layer 1) to improve speed and reduce costs while inheriting the L1's security. Base L2 is built on Ethereum L1. Transactions settle to L1 regularly via the optimistic rollup bridge.

---

## M–P

### 📡 MCC/MNC (Mobile Country Code / Mobile Network Code)
Identifiers for mobile network operators. Combined with LAC (Location Area Code) and CID (Cell ID), they uniquely identify a specific cell tower. Phygital-Trace captures visible cell towers at capture time, providing network-based location evidence that's difficult to spoof.

### 💊 Mnemonic (Seed Phrase)
A 12- or 24-word phrase used to derive a hierarchical deterministic (HD) blockchain wallet. The deployer wallet's mnemonic must be kept securely offline. **Never commit a mnemonic to a code repository.**

### 📝 NFT (Non-Fungible Token)
An ERC-721 token representing ownership of a unique digital asset. Phygital-Trace optionally allows journalists to mint their certificates as NFTs via `PhygitalNFT.sol`, providing a collectible proof-of-work artifact. This is an optional feature, not required for verification.

### 🏄 Optimistic Rollup
A Layer 2 scaling technology that batches transactions off-chain and posts compressed batches to L1. Called "optimistic" because transactions are assumed valid by default; a fraud-proof window allows challenges. Base uses the OP Stack optimistic rollup.

### 📦 ORM (Object-Relational Mapper)
A library that maps between database tables and programming language objects. Phygital-Trace uses **Prisma** as its ORM, providing type-safe database access and automatic migration management.

### 📌 Pinata
A commercial IPFS pinning service. Pinata ensures that Phygital-Trace's IPFS content remains available by "pinning" it (preventing garbage collection). Pinata provides APIs for uploading, pinning, and managing IPFS content with an SLA.

### 🔑 P-256 (secp256r1)
The elliptic curve used by Apple's Secure Enclave and Android's StrongBox for key generation and ECDSA signatures. Different from the secp256k1 curve used by Ethereum, but equally secure. Phygital-Trace verifies P-256 signatures server-side using the Web Crypto API.

### 🔐 Prisma
The ORM (Object-Relational Mapper) used in the Phygital-Trace backend. Prisma provides a type-safe query builder, automatic migration generation, and a visual database schema defined in `prisma/schema.prisma`.

### 🔒 Private Key
A secret 256-bit number used to sign blockchain transactions. The Phygital-Trace deployer wallet's private key is used to submit `registerCertificate()` transactions. **This must never be committed to source code.** Use environment variables and secrets managers.

### 👤 Public Key
The publicly shareable counterpart to a private key. In Phygital-Trace, each journalist's Secure Enclave generates a key pair; the **public key** is registered with the backend so signatures can be verified by anyone.

---

## Q–S

### 📊 Rate Limiting
A security and fairness mechanism that caps how many API requests a client can make in a time window. Phygital-Trace uses Redis-backed rate limiting:
- Global: 1,000 requests / 15 minutes per IP
- Auth endpoints: 10 requests / minute
- Certificate issuance: 100 / hour per user

### ⏱️ Redis
An in-memory data structure store used for:
- Session caching
- Rate limit counters (with TTL)
- Certificate lookup caching (reduce DB load)
- Webhook retry queues

### 🔄 Revocation
The act of marking a certificate as invalid. A journalist can revoke their own certificates if the device was compromised or the photo was misrepresented. Revocations are stored on-chain and prevent future successful verification.

### 🎲 CSPRNG (Cryptographically Secure Pseudo-Random Number Generator)
A random number generator that produces outputs unpredictable to an adversary. Used in Phygital-Trace for: API key generation, JWT secret rotation, and webhook signing secrets.

### 🔒 Secure Enclave
A dedicated security processor in Apple (and Android's equivalent StrongBox) devices that:
- Generates and stores cryptographic keys in hardware
- Performs cryptographic operations without exposing keys to the main CPU
- Requires biometric authentication before signing operations
- Keys cannot be exported, even by root/jailbroken device software

The Secure Enclave is the **root of trust** for all Phygital-Trace certificates.

### 🌡️ Sensor Bundle
The complete set of sensor readings captured at the moment of shutter press:
- GPS (lat, lng, alt, accuracy)
- Accelerometer (X, Y, Z at 100Hz × 100 samples)
- Gyroscope (X, Y, Z at 100Hz × 100 samples)
- Barometer (pressure, derived altitude)
- Ambient light (lux)
- WiFi scan (list of BSSID + RSSI)
- Cell towers (MCC, MNC, LAC, CID list)

### #️⃣ Sensor Hash
The SHA-256 hash of the **canonical JSON serialization** of the sensor bundle. Canonical means the JSON keys are sorted in a deterministic order so the same sensor data always produces the same hash.

### #️⃣ SHA-256 (Secure Hash Algorithm 256-bit)
The primary hash function used in Phygital-Trace. Produces a 256-bit (32-byte) digest. Properties: deterministic, fast, one-way, and collision-resistant (no known practical attacks). Output is represented as a 64-character hex string prefixed with `0x`.

### 📝 Smart Contract
Self-executing code deployed to a blockchain that enforces rules without a trusted intermediary. Phygital-Trace's `TruthCertificate.sol` is a Solidity smart contract that:
- Registers certificate hashes
- Looks up certificates by hash
- Emits events for indexing
- Cannot be modified after deployment (unless upgradeable proxy is used)

### 🔐 Solidity
The primary programming language for Ethereum-compatible smart contracts. Phygital-Trace uses Solidity 0.8.24 with optimizer enabled. Solidity is statically typed and compiles to EVM bytecode.

---

## T–Z

### 🏅 Truth Certificate
The core product of Phygital-Trace. A Truth Certificate is an immutable on-chain record containing:
- SHA-256 hash of the original image
- SHA-256 hash of the sensor bundle
- Combined hash of both
- IPFS CID pointing to the full certificate payload
- Journalist's blockchain address
- Capture timestamp

### 📡 TX Hash (Transaction Hash)
A unique 64-character hexadecimal identifier for a blockchain transaction. Once a certificate registration TX is confirmed, its TX hash can be used to independently look up the certificate on any block explorer without trusting Phygital-Trace.

### ✅ ULID (Universally Unique Lexicographically Sortable Identifier)
The ID format used for database primary keys in Phygital-Trace (e.g., `cert_01HN5B9KT2...`). ULIDs are URL-safe, sortable by creation time, and collision-resistant without a central sequence.

### 🔍 Verification
The process of confirming that a photo has a valid Truth Certificate. Verification checks:
1. Image hash matches a certificate hash stored in DB and on-chain
2. The on-chain record matches the IPFS payload
3. The Secure Enclave signature is valid for the public key
4. The certificate is not revoked

### 🌐 Web3
A broad term for the ecosystem of decentralized technologies built on blockchain networks, including smart contracts, decentralized storage (IPFS), and cryptographic identity. Phygital-Trace uses Web3 infrastructure (Base L2, IPFS) while maintaining a traditional Web2 UX.

### 📡 WiFi BSSID
Basic Service Set Identifier — the MAC address of a WiFi access point. Phygital-Trace captures a passive WiFi scan (list of visible BSSIDs and signal strengths) at capture time without connecting to any network. The combination of visible access points in an area is highly location-specific.

### 🔑 Zod
A TypeScript-first schema validation library used in the Phygital-Trace backend to validate all incoming request bodies. Zod schemas provide:
- Runtime type checking
- Automatic TypeScript type inference
- Detailed error messages for API clients

---

*Last Updated: 2026-03-08*
