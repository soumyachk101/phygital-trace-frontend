# 📋 Product Requirements Document (PRD)

> **Phygital-Trace** | Camera-to-Blockchain Citizen Journalism Verification Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./PRD.md)
[![Status](https://img.shields.io/badge/status-Active-green)](./PRD.md)
[![Priority](https://img.shields.io/badge/priority-P0-red)](./PRD.md)

---

## 📖 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Mission](#3-vision--mission)
4. [Target Users & Personas](#4-target-users--personas)
5. [User Stories & Acceptance Criteria](#5-user-stories--acceptance-criteria)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Competitive Analysis](#8-competitive-analysis)
9. [Key Performance Indicators](#9-key-performance-indicators)
10. [Monetization Strategy](#10-monetization-strategy)
11. [Roadmap](#11-roadmap)
12. [Risks & Mitigations](#12-risks--mitigations)
13. [Success Criteria](#13-success-criteria)

---

## 1. Executive Summary

Phygital-Trace is a **Camera-to-Blockchain** verification platform that solves one of the most pressing challenges in modern journalism: **proving that a photograph is authentic and was taken at a specific place and time**.

In an era where AI-generated images are indistinguishable from real photos, Phygital-Trace uses the **physical world itself** as the ultimate source of truth. By capturing an unreproducible bundle of sensor data (GPS, accelerometer, gyroscope, barometer, ambient light, RF environment, and cell tower IDs) at the exact moment a photo is taken and signing it with **hardware-backed cryptographic keys** in the phone's Secure Enclave, Phygital-Trace creates a **Truth Certificate** that is logged immutably to the Base L2 blockchain.

### Key Value Propositions

| Stakeholder | Value |
|---|---|
| 📰 **Journalists** | Prove their photos are authentic without relying on a trusted third party |
| 🏛️ **News Organizations** | Reduce liability from inadvertently publishing AI-generated images |
| ⚖️ **Courts & Investigators** | Admissible digital evidence with cryptographic proof of chain of custody |
| 👁️ **Public** | Ability to independently verify any image shared with a Phygital-Trace certificate |
| 🔬 **Researchers** | Access to verified image datasets for AI training and media studies |

---

## 2. Problem Statement

### The Authenticity Crisis

> **"In 2024, AI-generated images influenced at least 14 major elections worldwide. News organizations spent an estimated $340M trying to verify image authenticity."** — Reuters Institute for the Study of Journalism

The current landscape of digital media authentication has three critical failure points:

#### 2.1 Failure: Metadata Is Easily Stripped or Spoofed

Standard EXIF metadata embedded in photos can be:
- Stripped by social media platforms on upload
- Modified by anyone with free software (e.g., ExifTool)
- Fabricated entirely when creating AI-generated images

#### 2.2 Failure: Centralized Verification Creates Single Points of Trust

Existing solutions (e.g., Adobe Content Credentials, Reuters Connect) require trusting:
- The platform's continued operation
- The platform's internal processes
- The platform's honesty

If the platform is compromised, acquired, or goes offline, all certificates become unverifiable.

#### 2.3 Failure: AI Cannot Be Detected Reliably

Current AI detection tools have:
- 10–40% false positive rates (flagging real photos as AI)
- 15–25% false negative rates (missing AI images)
- No forensic chain of custody
- No physical-world binding

### The Phygital-Trace Solution

Phygital-Trace solves all three failure points:

| Failure | Solution |
|---|---|
| Metadata stripping | Hash is stored on-chain, independent of image file metadata |
| Centralized trust | Base L2 blockchain is decentralized and permissionless |
| AI detection unreliability | Physical sensor bundle cannot be reproduced without a real camera in the real world |

---

## 3. Vision & Mission

### 🎯 Vision

> *"A world where any person can prove the authenticity of any photograph, without needing to trust any institution."*

### 🚀 Mission

> *"To build the most secure, user-friendly, and accessible image verification platform by anchoring digital truth in the physical world."*

### Core Principles

1. **Physical Primacy** — The physical world is the ultimate source of truth
2. **Cryptographic Transparency** — Every verification step is publicly auditable
3. **Hardware Trust** — Keys never leave the Secure Enclave; trust the hardware, not the software
4. **Permissionless Verification** — Anyone can verify any certificate without an account
5. **Journalist-First UX** — The app must work under pressure in difficult conditions

---

## 4. Target Users & Personas

### Persona 1: 📸 Field Journalist — "Maya"

| Attribute | Detail |
|---|---|
| **Age** | 28 |
| **Role** | Freelance photojournalist, conflict zones |
| **Tech Level** | Medium |
| **Primary Device** | iPhone 14 Pro |
| **Pain Point** | News desks reject her photos without third-party verification agencies |
| **Goal** | Submit verified photos directly to publications without middlemen |
| **Success Metric** | < 10 seconds from shutter press to certificate |

### Persona 2: 🏛️ News Editor — "James"

| Attribute | Detail |
|---|---|
| **Age** | 45 |
| **Role** | Senior Photo Editor at digital news organization |
| **Tech Level** | Low-Medium |
| **Platform** | Desktop web browser |
| **Pain Point** | Receives hundreds of user-submitted photos daily, cannot verify authenticity |
| **Goal** | One-click verification of submitted photos |
| **Success Metric** | Verification decision in < 30 seconds |

### Persona 3: ⚖️ Legal Investigator — "Priya"

| Attribute | Detail |
|---|---|
| **Age** | 37 |
| **Role** | Digital forensics investigator |
| **Tech Level** | High |
| **Platform** | Desktop, API access |
| **Pain Point** | Digital evidence chain of custody is difficult to establish |
| **Goal** | Export full cryptographic proof package for court submission |
| **Success Metric** | Full audit trail with blockchain transaction hashes |

### Persona 4: 👁️ Concerned Reader — "Alex"

| Attribute | Detail |
|---|---|
| **Age** | 34 |
| **Role** | General public, social media user |
| **Tech Level** | Low |
| **Platform** | Mobile web |
| **Pain Point** | Cannot tell if viral images are real |
| **Goal** | Quickly verify a photo they see on social media |
| **Success Metric** | Verification result in < 5 seconds by pasting a URL |

---

## 5. User Stories & Acceptance Criteria

### Epic 1: Image Capture & Signing

#### US-001: Capture Photo with Sensor Bundle

**As a** field journalist,
**I want to** take a photo using the Phygital-Trace app,
**So that** the app automatically captures all sensor data and signs it.

**Acceptance Criteria:**
- [ ] Camera opens within 2 seconds of app launch
- [ ] All 7 sensor streams begin collection before shutter can be pressed
- [ ] Shutter press triggers simultaneous sensor snapshot and image capture (< 50ms delta)
- [ ] Secure Enclave signs the combined hash within 100ms
- [ ] User sees "Certificate Pending" status immediately
- [ ] Certificate upload completes within 5 seconds on 4G connection

#### US-002: View My Certificates

**As a** journalist,
**I want to** view all my previously issued certificates,
**So that** I can share proof of specific photos.

**Acceptance Criteria:**
- [ ] Gallery view loads in < 1 second (paginated, 20 per page)
- [ ] Each certificate shows thumbnail, timestamp, location, and blockchain status
- [ ] Certificates are searchable by date range and location
- [ ] Share button generates a sharable verification URL

### Epic 2: Certificate Verification

#### US-003: Verify via Web Portal

**As a** news editor,
**I want to** paste a verification URL or certificate ID,
**So that** I get an instant authenticity result.

**Acceptance Criteria:**
- [ ] Verification page loads in < 500ms
- [ ] Shows green "VERIFIED" or red "FAILED" with clear explanation
- [ ] Displays: capture timestamp, GPS coordinates, device model, blockchain TX hash
- [ ] Shows sensor fingerprint summary (not raw data for privacy)
- [ ] Provides link to block explorer for independent verification

#### US-004: Verify by Image Upload

**As a** concerned reader,
**I want to** upload any photo I found online,
**So that** I can check if it has a Phygital-Trace certificate.

**Acceptance Criteria:**
- [ ] Upload supports JPEG, PNG, HEIC up to 50MB
- [ ] Hash computed client-side (image never sent to server if unverified)
- [ ] If match found: display full certificate details
- [ ] If no match: display "No certificate found" with explanation of what that means

### Epic 3: Journalist Profile

#### US-005: Create Public Profile

**As a** journalist,
**I want to** create a public profile linking my certificates to my identity,
**So that** news organizations can verify my track record.

**Acceptance Criteria:**
- [ ] Profile creation requires email + phone verification
- [ ] Optional: link to Twitter/X, LinkedIn, press credentials
- [ ] Public profile shows total certificates, verified locations, trusted publications
- [ ] Profile URL is shareable and does not require login to view

### Epic 4: API Access

#### US-006: Programmatic Verification

**As a** digital investigator,
**I want to** integrate Phygital-Trace verification into my forensics workflow via API,
**So that** I can batch-verify large sets of images.

**Acceptance Criteria:**
- [ ] REST API documented with OpenAPI 3.0 spec
- [ ] API key authentication with rate limiting (1000 req/day free tier)
- [ ] Batch verification endpoint accepts up to 100 image hashes per request
- [ ] Response includes full certificate details and blockchain proof
- [ ] SDK available for Python, JavaScript, and curl examples

---

## 6. Functional Requirements

### 6.1 Mobile Application Requirements

| ID | Requirement | Priority |
|---|---|---|
| MOB-001 | App must use native camera API, not web camera | P0 |
| MOB-002 | GPS capture with < 10m accuracy | P0 |
| MOB-003 | Accelerometer at 100Hz during capture window | P0 |
| MOB-004 | Gyroscope at 100Hz during capture window | P0 |
| MOB-005 | Barometric pressure capture | P1 |
| MOB-006 | Ambient light sensor capture | P1 |
| MOB-007 | WiFi BSSID list capture (without connecting) | P1 |
| MOB-008 | Cell tower ID capture | P1 |
| MOB-009 | Secure Enclave key generation on first launch | P0 |
| MOB-010 | Biometric auth before any signing operation | P0 |
| MOB-011 | Works offline — queue certificates for upload | P1 |
| MOB-012 | Support iOS 15+ and Android 10+ | P0 |

### 6.2 Backend API Requirements

| ID | Requirement | Priority |
|---|---|---|
| API-001 | RESTful API with JSON responses | P0 |
| API-002 | JWT authentication | P0 |
| API-003 | Rate limiting: 100 req/min per user | P0 |
| API-004 | IPFS upload via Pinata | P0 |
| API-005 | Blockchain event indexing | P0 |
| API-006 | Webhook support for certificate status updates | P1 |
| API-007 | OpenAPI 3.0 documentation | P1 |
| API-008 | Audit logging of all operations | P0 |

### 6.3 Smart Contract Requirements

| ID | Requirement | Priority |
|---|---|---|
| SC-001 | Certificate registration with hash | P0 |
| SC-002 | Certificate lookup by hash | P0 |
| SC-003 | Revocation mechanism for compromised keys | P0 |
| SC-004 | Event emission for all state changes | P0 |
| SC-005 | Owner-only admin functions | P0 |
| SC-006 | Upgradeable proxy pattern | P1 |
| SC-007 | Gas optimization (< 50,000 gas per registration) | P0 |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Requirement |
|---|---|
| Sensor capture latency | < 50ms from shutter press |
| Certificate issuance (end-to-end) | < 10 seconds on 4G |
| Web portal load time | < 1.5 seconds (LCP) |
| API response time (p95) | < 200ms |
| Verification lookup | < 500ms |
| Blockchain confirmation | < 3 seconds (Base L2) |

### 7.2 Availability & Reliability

| Metric | Requirement |
|---|---|
| Backend API uptime | 99.9% |
| Blockchain availability | Inherited from Base L2 |
| IPFS availability | 99.5% (Pinata SLA) |
| Certificate durability | Permanent (on-chain) |
| RTO (Recovery Time Objective) | < 1 hour |
| RPO (Recovery Point Objective) | < 15 minutes |

### 7.3 Security

- All sensitive keys stored in hardware Secure Enclave
- TLS 1.3 for all API communications
- OWASP Top 10 mitigations applied to all web surfaces
- Smart contract audited by third party before mainnet launch
- Penetration testing before each major release

### 7.4 Privacy

- GPS coordinates stored with 3-decimal precision (±111m) by default
- Users can optionally redact location from public certificate
- Sensor raw data never stored on server — only hashes
- GDPR-compliant data deletion on account closure
- No analytics SDKs in mobile app (privacy-first)

### 7.5 Accessibility

- Web portal: WCAG 2.1 AA compliance
- Mobile app: Dynamic type support, VoiceOver/TalkBack compatibility
- High contrast mode support

---

## 8. Competitive Analysis

| Competitor | Approach | Strengths | Weaknesses vs Phygital-Trace |
|---|---|---|---|
| **Adobe Content Credentials** | C2PA metadata standard | Industry adoption, integrates with Adobe tools | Centralized trust, metadata can be stripped |
| **Reuters Connect Verify** | Newsroom workflow tool | Professional integrations, well-known brand | Requires Reuters subscription, closed ecosystem |
| **Witness.org** | Secure video/photo app | NGO-trusted, human rights focus | No blockchain, relies on organizational trust |
| **Numbers Protocol** | NFT-based provenance | Blockchain-native, NFT market | Requires NFT purchase, not journalist-friendly |
| **Truepic** | Controlled capture | Strong enterprise sales | Proprietary black box, server-side trust |
| **Phygital-Trace** | Sensor fingerprint + blockchain | Physical world binding, permissionless, open | Early stage, requires dedicated app |

### Competitive Differentiation Matrix

| Feature | Phygital-Trace | Adobe CC | Numbers | Truepic |
|---|---|---|---|---|
| Secure Enclave Signing | ✅ | ❌ | ❌ | ⚠️ |
| Physical Sensor Bundle | ✅ | ❌ | ❌ | ❌ |
| Permissionless Verification | ✅ | ❌ | ⚠️ | ❌ |
| Decentralized Storage | ✅ | ❌ | ✅ | ❌ |
| Open Source Contracts | ✅ | ❌ | ⚠️ | ❌ |
| Free to Verify | ✅ | ✅ | ⚠️ | ❌ |
| Gas Cost < $0.01 | ✅ | N/A | ❌ | N/A |

---

## 9. Key Performance Indicators

### 9.1 Adoption KPIs

| KPI | Month 3 | Month 6 | Year 1 |
|---|---|---|---|
| Mobile App Downloads | 1,000 | 5,000 | 25,000 |
| Active Monthly Users | 500 | 2,500 | 12,000 |
| Certificates Issued | 10,000 | 75,000 | 500,000 |
| Web Verifications Performed | 25,000 | 200,000 | 2M |
| API Integrations | 5 | 25 | 100 |

### 9.2 Technical KPIs

| KPI | Target |
|---|---|
| App Store Rating | ≥ 4.5 stars |
| Certificate Issuance Success Rate | ≥ 99% |
| False Positive Verification Rate | 0% (cryptographic guarantee) |
| API Error Rate | < 0.1% |
| Blockchain Reorg Handling | 100% correct |

### 9.3 Business KPIs

| KPI | Year 1 Target |
|---|---|
| Enterprise Customers | 10 |
| MRR (Monthly Recurring Revenue) | $50,000 |
| API Revenue | $15,000/month |
| Grant/Press Coverage Mentions | 50 |
| NPS Score | ≥ 50 |

---

## 10. Monetization Strategy

### 10.1 Free Tier

> Available to all users, no credit card required.

- ✅ Up to 100 certificates/month
- ✅ Public verification portal access
- ✅ Basic journalist profile
- ✅ Mobile app (iOS + Android)
- ✅ API: 1,000 requests/day

### 10.2 Professional Tier — $29/month

> For active freelance journalists and content creators.

- ✅ Unlimited certificates
- ✅ Priority IPFS pinning
- ✅ Advanced profile with publication history
- ✅ CSV export of certificate history
- ✅ API: 10,000 requests/day
- ✅ Priority support (24hr response)

### 10.3 Organization Tier — $299/month

> For news organizations, NGOs, and media companies.

- ✅ Up to 50 team members
- ✅ Shared certificate namespace
- ✅ Custom verification badge/branding
- ✅ Webhook integrations (CMS, Slack, etc.)
- ✅ API: 500,000 requests/day
- ✅ Private IPFS pinning (Pinata dedicated gateway)
- ✅ SLA: 99.9% uptime with 4hr response
- ✅ Quarterly security briefing

### 10.4 Enterprise Tier — Custom Pricing

> For government agencies, major broadcasters, and legal firms.

- ✅ All Organization features
- ✅ On-premise deployment option
- ✅ Custom smart contract deployment
- ✅ Custom sensor certification (special hardware)
- ✅ Legal evidence package export (court-ready PDF)
- ✅ Dedicated Customer Success Manager
- ✅ Annual penetration test report

### 10.5 Additional Revenue Streams

| Stream | Description | Est. Revenue |
|---|---|---|
| **API Overage** | $0.001 per request above tier | Variable |
| **NFT Minting** | Optional NFT of certificate (5% marketplace royalty) | Variable |
| **Verification Badges** | Embeddable widgets for news sites | $99/site/month |
| **Data Licensing** | Anonymized certificate metadata for research | $50K+ grants |
| **White-label** | Private-label deployment for media companies | $50K+ custom |

---

## 11. Roadmap

### Phase 1: Foundation (Q1 2026) — MVP

- [x] Smart contracts deployed to Base Sepolia
- [x] Mobile app (iOS) with basic capture + certificate
- [x] Web portal for public verification
- [x] Backend API v1
- [ ] Android app (parity with iOS)
- [ ] TestFlight beta with 100 journalists

### Phase 2: Growth (Q2 2026)

- [ ] App Store & Google Play launch
- [ ] Professional tier launch
- [ ] API documentation + developer portal
- [ ] Webhook integrations
- [ ] Smart contract mainnet audit
- [ ] Base mainnet deployment

### Phase 3: Scale (Q3–Q4 2026)

- [ ] Organization tier launch
- [ ] CMS plugin ecosystem (WordPress, Ghost)
- [ ] Mobile SDK for third-party camera apps
- [ ] Batch verification API
- [ ] Court-ready evidence export

### Phase 4: Expansion (2027)

- [ ] Video support (frame-by-frame signing)
- [ ] Cross-chain deployment (Polygon, Arbitrum)
- [ ] Hardware partner integrations (professional cameras)
- [ ] AI forgery resistance audit
- [ ] International language support (10 languages)

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Base L2 downtime | Low | High | Offline queue; retry mechanism; multi-chain fallback |
| Secure Enclave exploit | Very Low | Critical | Defense-in-depth; hardware revocation list |
| App Store rejection | Medium | High | Privacy-first design; no undocumented APIs |
| IPFS gateway outage | Medium | Medium | Multiple pinning services; local cache |
| Sensor spoofing via emulator | Low | High | Device attestation (SafetyNet/DeviceCheck) |
| GDPR violation | Low | Critical | Privacy-by-design; DPO consulted; EU data residency |
| Smart contract bug | Low | Critical | Third-party audit; bug bounty program |
| Competitor acquisition | Medium | Medium | Open source core; community flywheel |

---

## 13. Success Criteria

### Launch Criteria (Before Public Launch)

- [ ] Smart contracts audited by reputable third party
- [ ] 99%+ certificate issuance success rate in beta testing
- [ ] < 3 second end-to-end certificate issuance on 4G
- [ ] OWASP Top 10 assessment passed
- [ ] Privacy policy reviewed by legal counsel
- [ ] App Store approved and available

### 6-Month Success Criteria

- [ ] 25,000+ app downloads
- [ ] 500,000+ certificates issued
- [ ] 5+ enterprise customers signed
- [ ] 3+ press articles in major tech/journalism publications
- [ ] Zero critical security incidents

---

*Last Updated: 2026-03-08*
