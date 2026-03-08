# 📚 Phygital-Trace Documentation

```
██████╗ ██╗  ██╗██╗   ██╗ ██████╗ ██╗████████╗ █████╗ ██╗
██╔══██╗██║  ██║╚██╗ ██╔╝██╔════╝ ██║╚══██╔══╝██╔══██╗██║
██████╔╝███████║ ╚████╔╝ ██║  ███╗██║   ██║   ███████║██║
██╔═══╝ ██╔══██║  ╚██╔╝  ██║   ██║██║   ██║   ██╔══██║██║
██║     ██║  ██║   ██║   ╚██████╔╝██║   ██║   ██║  ██║███████╗
╚═╝     ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝

████████╗██████╗  █████╗  ██████╗███████╗
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔════╝
   ██║   ██████╔╝███████║██║     █████╗
   ██║   ██╔══██╗██╔══██║██║     ██╔══╝
   ██║   ██║  ██║██║  ██║╚██████╗███████╗
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝
```

> **Camera-to-Blockchain Verification for Citizen Journalism**

---

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built on Base](https://img.shields.io/badge/Built%20on-Base%20L2-0052FF?logo=coinbase)](https://base.org)
[![React Native](https://img.shields.io/badge/React%20Native-Expo-61DAFB?logo=react)](https://expo.dev)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://typescriptlang.org)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.x-363636?logo=solidity)](https://soliditylang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql)](https://postgresql.org)
[![IPFS](https://img.shields.io/badge/IPFS-Pinata-65C2CB?logo=ipfs)](https://pinata.cloud)
[![Tests](https://img.shields.io/badge/tests-Jest%20%2B%20Hardhat-brightgreen)](https://jestjs.io)
[![Docs](https://img.shields.io/badge/docs-complete-success)](./README.md)

---

## 🌐 What is Phygital-Trace?

**Phygital-Trace** is a **Camera-to-Blockchain** verification platform for citizen journalists, news organizations, and independent photographers who need cryptographic proof that their images are authentic and untampered.

### 🔑 Core Innovation

| Feature | Description |
|---|---|
| 📱 **Secure Enclave Signing** | Uses the phone's hardware security module to sign metadata at the exact millisecond a photo is taken |
| 🌍 **Physical Fingerprint** | Captures GPS, accelerometer, gyroscope, barometer, light sensor, ambient RF, and cell tower IDs simultaneously |
| 🤖 **AI-Resistance** | The multi-sensor bundle creates a context that AI image generators cannot reproduce |
| ⛓️ **Truth Certificate** | Sensor bundle + image hash are logged to Base L2 blockchain as an immutable record |
| 🔍 **Public Verification** | Anyone can verify any image through the web portal without needing the app |

---

## 📖 Table of Contents — Documentation Index

| # | Document | Description | Lines |
|---|---|---|---|
| 1 | [📋 PRD](./PRD.md) | Product Requirements Document | 500+ |
| 2 | [🔧 TRD](./TRD.md) | Technical Requirements Document | 600+ |
| 3 | [🤖 AI Instructions](./AI_INSTRUCTIONS.md) | AI Coding Guidelines & Architecture Patterns | 400+ |
| 4 | [🏗️ System Design](./SYSTEM_DESIGN.md) | Architecture, Diagrams, Scalability, DR | 700+ |
| 5 | [🚀 Backend API](./BACKEND.md) | REST API Docs, Middleware, Error Handling | 500+ |
| 6 | [📁 Backend Structure](./BACKEND_STRUCTURE.md) | Folder Tree, Dependency Diagrams | 300+ |
| 7 | [🗄️ Database](./DATABASE.md) | Schema, ER Diagrams, Indexes, Backup | 400+ |
| 8 | [🔍 Database Structure](./DATABASE_STRUCTURE.md) | Prisma Schema, Queries, Seed Data | 400+ |
| 9 | [🚢 Deployment](./DEPLOYMENT.md) | Railway/AWS/Docker, CI/CD, Cost Estimation | 500+ |
| 10 | [🤝 Contributing](./CONTRIBUTING.md) | Branch Naming, PR Process, Issue Templates | 200+ |
| 11 | [📖 Glossary](./GLOSSARY.md) | 30+ Domain Terms Explained | 200+ |

---

## 🏛️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PHYGITAL-TRACE ECOSYSTEM                    │
├──────────────────┬──────────────────┬───────────────────────────┤
│   📱 MOBILE APP  │  🌐 WEB PORTAL   │    ⛓️  BLOCKCHAIN LAYER   │
│  React Native    │  Next.js 14      │    Base L2 (Sepolia)      │
│  + Expo          │  + Tailwind CSS  │    Solidity Contracts     │
├──────────────────┴──────────────────┤                           │
│         🔧 BACKEND API              │    📦 STORAGE LAYER       │
│    Node.js + Express + TypeScript   │    IPFS via Pinata        │
├────────────────────┬────────────────┤                           │
│  🗄️ PostgreSQL     │  🔴 Redis Cache │    🔒 SECURE ENCLAVE     │
│  + Prisma ORM      │  (Sessions/     │    Hardware Signing       │
│                    │   Rate Limits)  │    (iOS/Android)          │
└────────────────────┴────────────────┴───────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required tools
node >= 18.0.0
npm >= 9.0.0
expo-cli >= 6.0.0
hardhat >= 2.0.0
postgresql >= 15
redis >= 7.0
```

### Installation

```bash
# Clone repository
git clone https://github.com/soumyachk101/phygital-trace.git
cd phygital-trace

# Install all dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start all services
npm run dev
```

### Run Tests

```bash
# Backend unit tests
npm run test:backend

# Smart contract tests
npm run test:contracts

# Full test suite
npm test
```

---

## 🗺️ System Components

### 📱 Mobile Application (`/mobile`)

The React Native + Expo app handles:
- Camera integration with Secure Enclave signing
- Real-time sensor data collection
- Image + sensor hash generation
- Blockchain transaction submission
- Certificate viewing and sharing

### 🌐 Web Portal (`/web`)

The Next.js 14 portal provides:
- Public certificate verification
- Image truth score display
- Journalist profile pages
- Analytics dashboard

### 🔧 Backend API (`/backend`)

The Express + TypeScript API handles:
- Authentication (JWT + wallet-based)
- IPFS upload orchestration
- Blockchain event indexing
- Certificate metadata storage

### ⛓️ Smart Contracts (`/contracts`)

Solidity contracts on Base L2:
- `TruthCertificate.sol` — Main certificate registry
- `PhygitalNFT.sol` — Optional NFT minting
- `VerificationOracle.sol` — Third-party attestation

---

## 📊 Key Metrics

| Metric | Target |
|---|---|
| ⚡ Certificate issuance | < 3 seconds end-to-end |
| 🌍 Sensor capture latency | < 50ms from shutter press |
| 🔒 Blockchain finality | ~2 seconds on Base L2 |
| 📦 IPFS pinning | < 5 seconds |
| 🔍 Verification lookup | < 500ms |
| 💰 Gas cost per certificate | ~$0.001 on Base L2 |

---

## 🔐 Security Highlights

> ⚠️ **Security is the product's core value proposition.** Every architectural decision prioritizes tamper-evidence.

- **Hardware-backed keys**: Signing keys never leave the Secure Enclave
- **Multi-sensor binding**: Certificate is cryptographically bound to physical context
- **Immutable ledger**: Certificates on Base L2 cannot be modified or deleted
- **Hash verification**: Any pixel change to an image invalidates the certificate
- **Open verification**: Anyone can independently verify without trusting Phygital-Trace

---

## 📜 License

MIT License — see [LICENSE](../LICENSE) for details.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

*Last Updated: 2026-03-08*
