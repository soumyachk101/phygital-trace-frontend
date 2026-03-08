# 🚢 Deployment Guide

> **Phygital-Trace** | Railway, AWS, Docker, CI/CD, and Cost Estimation

[![Railway](https://img.shields.io/badge/Railway-ready-0B0D0E)](./DEPLOYMENT.md)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)](./DEPLOYMENT.md)
[![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub%20Actions-2088FF?logo=github-actions)](./DEPLOYMENT.md)

---

## 📖 Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Railway Deployment](#3-railway-deployment)
4. [AWS Deployment](#4-aws-deployment)
5. [Docker Setup](#5-docker-setup)
6. [Environment Configuration](#6-environment-configuration)
7. [CI/CD with GitHub Actions](#7-cicd-with-github-actions)
8. [Smart Contract Deployment](#8-smart-contract-deployment)
9. [Monitoring & Alerting](#9-monitoring--alerting)
10. [Cost Estimation](#10-cost-estimation)
11. [Rollback Procedures](#11-rollback-procedures)
12. [Checklist](#12-deployment-checklist)

---

## 1. Overview

Phygital-Trace is deployed across multiple services:

| Component | Platform | Notes |
|---|---|---|
| Web Portal | Vercel | Next.js SSR/SSG |
| Backend API | Railway or AWS ECS | Node.js containers |
| PostgreSQL | Railway or AWS RDS | Managed PostgreSQL 15 |
| Redis | Railway or AWS ElastiCache | Managed Redis 7 |
| Smart Contracts | Base Sepolia → Base Mainnet | Hardhat deploy scripts |
| IPFS | Pinata | Managed IPFS pinning |
| CDN | Cloudflare | Free tier |

### Deployment Environments

| Environment | Purpose | Branch | URL |
|---|---|---|---|
| `development` | Local dev | `feature/*` | `localhost:3000` |
| `staging` | Integration testing | `develop` | `staging.phygital-trace.xyz` |
| `production` | Live | `main` | `phygital-trace.xyz` |

---

## 2. Prerequisites

```bash
# Required CLIs
node --version   # >= 18.0.0
npm --version    # >= 9.0.0
docker --version # >= 24.0.0
railway --version # railway.app CLI
aws --version    # AWS CLI v2 (for AWS deployment)
npx hardhat --version # >= 2.22.0

# Install Railway CLI
npm install -g @railway/cli
railway login

# Install Vercel CLI
npm install -g vercel
vercel login
```

---

## 3. Railway Deployment

Railway is the recommended starter deployment platform for Phygital-Trace.

### 3.1 Initial Setup

```bash
# Create new Railway project
railway init

# Link to your GitHub repo
railway link

# Create services
railway add --name api
railway add --name postgres --database postgresql
railway add --name redis --database redis
```

### 3.2 Backend API Service

```bash
# Set environment variables
railway env set \
  NODE_ENV=production \
  PORT=3001 \
  JWT_SECRET=$(openssl rand -hex 32) \
  JWT_EXPIRES_IN=7d \
  PINATA_API_KEY=<your-key> \
  PINATA_API_SECRET=<your-secret> \
  RPC_URL=https://sepolia.base.org \
  PRIVATE_KEY=<deployer-key> \
  CONTRACT_ADDRESS=<deployed-contract> \
  CHAIN_ID=84532

# DATABASE_URL and REDIS_URL are auto-injected by Railway
# when you link the postgres/redis services

# Deploy
railway up
```

### 3.3 Railway `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "backend/Dockerfile"
  },
  "deploy": {
    "startCommand": "node dist/main.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### 3.4 Vercel Web Portal

```bash
cd web

# Link project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://api.phygital-trace.xyz

vercel env add NEXT_PUBLIC_CHAIN_ID production
# Enter: 84532

# Deploy
vercel --prod
```

---

## 4. AWS Deployment

For production scale, AWS provides more control and performance.

### 4.1 Architecture

```
Route 53 (DNS)
    │
Cloudflare (CDN + WAF)
    │
    ├── ALB (Application Load Balancer)
    │       │
    │       └── ECS Fargate (API containers)
    │               │
    │               ├── RDS PostgreSQL (Multi-AZ)
    │               ├── ElastiCache Redis (Cluster mode)
    │               └── Secrets Manager (env vars)
    │
    └── CloudFront → S3 (static assets)
```

### 4.2 ECR: Push Docker Image

```bash
# Authenticate with ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t phygital-trace-api ./backend
docker tag phygital-trace-api:latest \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com/phygital-trace-api:latest

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/phygital-trace-api:latest
```

### 4.3 ECS Task Definition (excerpt)

```json
{
  "family": "phygital-trace-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/phygital-trace-api:latest",
      "portMappings": [{ "containerPort": 3001, "protocol": "tcp" }],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      },
      "secrets": [
        { "name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:...:phygital/DATABASE_URL" },
        { "name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:...:phygital/JWT_SECRET" },
        { "name": "PRIVATE_KEY", "valueFrom": "arn:aws:secretsmanager:...:phygital/PRIVATE_KEY" }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/phygital-trace-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "api"
        }
      }
    }
  ]
}
```

---

## 5. Docker Setup

### 5.1 Backend `Dockerfile`

```dockerfile
# backend/Dockerfile

# ────── Build stage ──────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .
RUN npm run build

# ────── Runtime stage ──────
FROM node:20-alpine AS runner

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only what's needed
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

USER appuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', r => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "dist/main.js"]
```

### 5.2 `docker-compose.yml` (Development)

```yaml
version: "3.9"

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      PORT: 3001
      DATABASE_URL: postgresql://phygital:phygital@postgres:5432/phygital_trace
      REDIS_URL: redis://redis:6379
    env_file:
      - ./backend/.env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src  # Hot reload in dev

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: phygital
      POSTGRES_PASSWORD: phygital
      POSTGRES_DB: phygital_trace
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U phygital"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

### 5.3 Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec api npx prisma migrate dev

# Seed database
docker-compose exec api npx prisma db seed

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Stop and remove volumes (reset data)
docker-compose down -v
```

---

## 6. Environment Configuration

### 6.1 Required Variables per Environment

| Variable | Dev | Staging | Prod | Notes |
|---|---|---|---|---|
| `NODE_ENV` | `development` | `staging` | `production` | — |
| `PORT` | `3001` | `3001` | `3001` | — |
| `DATABASE_URL` | local | Railway | AWS RDS | — |
| `REDIS_URL` | local | Railway | AWS ElastiCache | — |
| `JWT_SECRET` | any | strong | strong | 32+ bytes random |
| `JWT_EXPIRES_IN` | `7d` | `7d` | `7d` | — |
| `PINATA_API_KEY` | testnet | testnet | mainnet | — |
| `RPC_URL` | local | base-sepolia | base-mainnet | — |
| `PRIVATE_KEY` | dev wallet | staging wallet | hardware wallet | Never commit |
| `CONTRACT_ADDRESS` | local | sepolia | mainnet | — |
| `CHAIN_ID` | `31337` | `84532` | `8453` | — |

### 6.2 Secrets Management

```bash
# Development: .env file (never commit)
cp backend/.env.example backend/.env

# Railway: via CLI or dashboard
railway env set JWT_SECRET=$(openssl rand -hex 32)

# AWS: Secrets Manager
aws secretsmanager create-secret \
  --name phygital/JWT_SECRET \
  --secret-string $(openssl rand -hex 32)

# Generate all secrets at once
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env.production
echo "REFRESH_TOKEN_SECRET=$(openssl rand -hex 32)" >> .env.production
```

---

## 7. CI/CD with GitHub Actions

### 7.1 Main CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-backend:
    name: Backend Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: phygital
          POSTGRES_PASSWORD: phygital
          POSTGRES_DB: phygital_trace_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Type check
        working-directory: backend
        run: npm run typecheck

      - name: Lint
        working-directory: backend
        run: npm run lint

      - name: Run migrations
        working-directory: backend
        env:
          DATABASE_URL: postgresql://phygital:phygital@localhost:5432/phygital_trace_test
        run: npx prisma migrate deploy

      - name: Run tests
        working-directory: backend
        env:
          DATABASE_URL: postgresql://phygital:phygital@localhost:5432/phygital_trace_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret-minimum-32-characters-long
          NODE_ENV: test
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          directory: backend/coverage

  test-contracts:
    name: Smart Contract Tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: contracts/package-lock.json

      - name: Install dependencies
        working-directory: contracts
        run: npm ci

      - name: Run Hardhat tests
        working-directory: contracts
        run: npx hardhat test

      - name: Check gas report
        working-directory: contracts
        run: REPORT_GAS=true npx hardhat test

  lint-web:
    name: Web Portal Lint
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: web/package-lock.json

      - run: npm ci
        working-directory: web

      - run: npm run lint
        working-directory: web

      - run: npm run typecheck
        working-directory: web

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit (backend)
        working-directory: backend
        run: npm audit --audit-level=high

      - name: Run npm audit (contracts)
        working-directory: contracts
        run: npm audit --audit-level=high

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

### 7.2 Deploy to Staging

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    name: Deploy Backend to Railway Staging
    runs-on: ubuntu-latest
    needs: [test-backend, test-contracts]

    steps:
      - uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy to Railway
        working-directory: backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_STAGING_TOKEN }}
        run: railway up --environment staging

      - name: Run database migrations
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_STAGING_TOKEN }}
        run: railway run --environment staging npx prisma migrate deploy

      - name: Deploy web to Vercel (staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: web
          alias-domains: staging.phygital-trace.xyz
```

### 7.3 Deploy to Production

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval

    steps:
      - uses: actions/checkout@v4

      - name: Deploy backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_PROD_TOKEN }}
        run: |
          npm install -g @railway/cli
          cd backend && railway up --environment production

      - name: Run migrations (production)
        run: |
          cd backend && railway run --environment production \
            npx prisma migrate deploy

      - name: Deploy web (production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: web
          vercel-args: "--prod"

      - name: Notify deployment
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "✅ Phygital-Trace deployed to production by ${{ github.actor }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 8. Smart Contract Deployment

### 8.1 Deploy to Base Sepolia (Testnet)

```bash
cd contracts

# 1. Set environment
cp .env.example .env
# Fill in PRIVATE_KEY and BASESCAN_API_KEY

# 2. Compile contracts
npx hardhat compile

# 3. Run tests
npx hardhat test

# 4. Deploy
npx hardhat run scripts/deploy.ts --network base-sepolia

# Expected output:
# TruthCertificate deployed to: 0x1234...abcd
# TX hash: 0xabcd...1234

# 5. Verify on Basescan
npx hardhat verify --network base-sepolia 0x1234...abcd
```

### 8.2 Deploy to Base Mainnet

> ⚠️ **CRITICAL:** Only deploy to mainnet after a full security audit.

```bash
# 1. Ensure you have completed:
#    □ Third-party smart contract audit
#    □ Testnet deployment working for 30+ days
#    □ All tests passing with 100% coverage

# 2. Use hardware wallet (Ledger/Trezor)
# Edit hardhat.config.ts to use LedgerSigner

# 3. Deploy
npx hardhat run scripts/deploy.ts --network base-mainnet

# 4. Verify
npx hardhat verify --network base-mainnet 0x<CONTRACT_ADDRESS>

# 5. Update environment variables in all services
# Update CONTRACT_ADDRESS and CHAIN_ID (8453 for mainnet)
```

### 8.3 Hardhat Config

```typescript
// contracts/hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 84532,
    },
    "base-mainnet": {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      "base-sepolia": process.env.BASESCAN_API_KEY!,
      "base-mainnet": process.env.BASESCAN_API_KEY!,
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
};

export default config;
```

---

## 9. Monitoring & Alerting

### 9.1 Health Check Endpoint

```typescript
// GET /health
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-03-08T12:00:00.000Z",
  "services": {
    "database": "ok",
    "redis": "ok",
    "blockchain": "ok",
    "ipfs": "ok"
  }
}
```

### 9.2 Alert Rules

| Alert | Condition | Severity | Action |
|---|---|---|---|
| API Down | Health check fails 3 times | 🔴 Critical | Page on-call |
| High Error Rate | Error rate > 5% for 5min | 🔴 Critical | Page on-call |
| High Latency | p95 > 2s for 10min | 🟡 Warning | Notify team |
| DB Connection Exhausted | Pool > 90% used | 🟡 Warning | Notify team |
| Blockchain RPC Down | Can't reach RPC for 2min | 🔴 Critical | Page on-call |
| Certificate Queue Backed Up | > 1000 pending for 30min | 🟡 Warning | Notify team |

---

## 10. Cost Estimation

### 10.1 Starter (0–1,000 MAU)

| Service | Provider | Plan | Monthly Cost |
|---|---|---|---|
| Backend API | Railway | Hobby ($5 credit) | ~$5 |
| PostgreSQL | Railway | Hobby | ~$0 (included) |
| Redis | Railway | Hobby | ~$0 (included) |
| Web Portal | Vercel | Hobby | $0 |
| CDN | Cloudflare | Free | $0 |
| IPFS | Pinata | Free (1GB) | $0 |
| Blockchain gas | Base L2 | ~$0.001/cert | ~$1 (1K certs) |
| **Total** | | | **~$6/month** |

### 10.2 Growth (10,000 MAU)

| Service | Provider | Plan | Monthly Cost |
|---|---|---|---|
| Backend API | Railway | Pro (2 instances) | ~$40 |
| PostgreSQL | Railway | Pro (8GB RAM) | ~$50 |
| Redis | Railway | Pro (1GB) | ~$20 |
| Web Portal | Vercel | Pro | $20 |
| CDN | Cloudflare | Free | $0 |
| IPFS | Pinata | Picnic ($20) | $20 |
| Blockchain gas | Base L2 | ~75K certs | ~$75 |
| **Total** | | | **~$225/month** |

### 10.3 Scale (100,000 MAU)

| Service | Provider | Plan | Monthly Cost |
|---|---|---|---|
| Backend API | AWS ECS Fargate (4 tasks) | 4×2vCPU/4GB | ~$250 |
| PostgreSQL | AWS RDS t3.large (Multi-AZ) | 2 vCPU/8GB | ~$200 |
| Redis | AWS ElastiCache r5.large | 2 vCPU/13GB | ~$150 |
| Web Portal | Vercel | Team | $30 |
| CDN | Cloudflare | Pro | $20 |
| IPFS | Pinata | Enterprise | $99 |
| Blockchain gas | Base L2 | ~750K certs | ~$750 |
| Monitoring | Datadog | Pro | $100 |
| **Total** | | | **~$1,599/month** |

---

## 11. Rollback Procedures

### 11.1 Backend Rollback

```bash
# Railway: Rollback to previous deployment
railway rollback --environment production

# AWS ECS: Update service to previous task definition revision
aws ecs update-service \
  --cluster phygital-trace \
  --service api \
  --task-definition phygital-trace-api:<PREVIOUS_REVISION>
```

### 11.2 Database Rollback (Emergency)

```bash
# ⚠️ Only if migration caused data corruption
# Step 1: Put app in maintenance mode (stop traffic)
# Step 2: Create backup of current state
pg_dump phygital_trace > pre_rollback_backup.dump

# Step 3: Restore from last known good point-in-time
# (AWS RDS supports point-in-time recovery)

# Step 4: Verify data integrity
psql phygital_trace -c "SELECT COUNT(*) FROM certificates;"

# Step 5: Resume traffic
```

### 11.3 Smart Contract Considerations

> ⚠️ Smart contracts **cannot be rolled back**. Plan accordingly:
- Always use upgradeable proxy patterns for contracts that may change
- Certificate data on-chain is permanent — bugs in contract logic may require a new contract
- Keep a `deprecated` flag mechanism to signal users to migrate to new contract

---

## 12. Deployment Checklist

### Pre-Deployment

- [ ] All tests pass in CI
- [ ] Smart contract audit complete (before mainnet)
- [ ] Environment variables configured for target environment
- [ ] Database migrations reviewed and tested on staging
- [ ] Rollback plan documented
- [ ] Monitoring and alerting configured
- [ ] Load tested to expected traffic level

### Deployment Steps

- [ ] Deploy smart contracts (if changed)
- [ ] Update CONTRACT_ADDRESS in environment
- [ ] Deploy backend API
- [ ] Run database migrations
- [ ] Deploy web portal
- [ ] Smoke test all critical endpoints
- [ ] Verify certificate issuance end-to-end

### Post-Deployment

- [ ] Monitor error rates for 30 minutes
- [ ] Check certificate issuance success rate
- [ ] Verify blockchain sync is working
- [ ] Notify team of successful deployment
- [ ] Update deployment log

---

*Last Updated: 2026-03-08*
