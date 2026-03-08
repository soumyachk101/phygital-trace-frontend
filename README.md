# Phygital-Trace

**Camera-to-Blockchain Verification Platform** for citizen journalists that proves image authenticity by capturing sensor data at the moment of shutter press, signing it with hardware-backed cryptographic keys, and logging it immutably to the Base L2 blockchain.

## Project Structure

```
├── backend/       # Node.js + Express + TypeScript API
├── web/           # Next.js 14 + Tailwind CSS portal
├── mobile/        # React Native + Expo mobile app
├── docs/          # Project documentation
└── docker-compose.yml
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for local development databases)

### Backend API

```bash
cd backend
cp .env.example .env    # Edit with your values
npm install
npx prisma generate
npm run dev             # Starts on http://localhost:3001
```

### Web Portal

```bash
cd web
npm install
npm run dev             # Starts on http://localhost:3000
```

### Mobile App

```bash
cd mobile
npm install
npx expo start          # Starts Expo dev server
```

### Docker (Full Stack)

```bash
docker compose up -d    # Starts PostgreSQL + Redis + Backend API
cd web && npm run dev   # Start web portal separately
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo |
| Web | Next.js 14 + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 15 + Prisma ORM |
| Cache | Redis 7 |
| Blockchain | Solidity 0.8.x on Base L2 |
| Storage | IPFS via Pinata |
| Testing | Jest + Supertest |

## Key Metrics

| Metric | Target |
|--------|--------|
| Certificate issuance | < 3 seconds end-to-end |
| Sensor capture latency | < 50ms |
| Blockchain finality | ~2 seconds on Base L2 |
| Gas cost per certificate | ~$0.001 |
| Verification lookup | < 500ms |

## Documentation

See the [docs/](./docs/) directory for complete documentation including:

- [Product Requirements (PRD)](./docs/PRD.md)
- [Technical Requirements (TRD)](./docs/TRD.md)
- [System Design](./docs/SYSTEM_DESIGN.md)
- [Backend API](./docs/BACKEND.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)