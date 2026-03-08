# 🤝 Contributing to Phygital-Trace

> Thank you for helping make citizen journalism more trustworthy!

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-enforced-blue)](./CONTRIBUTING.md)

---

## 📖 Table of Contents

1. [Code of Conduct](#1-code-of-conduct)
2. [Getting Started](#2-getting-started)
3. [Branch Naming Conventions](#3-branch-naming-conventions)
4. [Development Workflow](#4-development-workflow)
5. [Pull Request Process](#5-pull-request-process)
6. [Issue Templates](#6-issue-templates)
7. [Commit Conventions](#7-commit-conventions)
8. [Testing Requirements](#8-testing-requirements)
9. [Review Process](#9-review-process)
10. [Security Vulnerabilities](#10-security-vulnerabilities)

---

## 1. Code of Conduct

We are committed to maintaining a welcoming, inclusive environment. By contributing, you agree to:

- **Be respectful** — Treat all contributors with dignity regardless of experience level
- **Be constructive** — Critique code, not people
- **Be patient** — Maintainers are often volunteers; responses may take time
- **Be mindful** — This project may be used by journalists in dangerous situations; take quality seriously

Violations may result in removal from the project. Report issues to: conduct@phygital-trace.xyz

---

## 2. Getting Started

### Fork and Clone

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/phygital-trace.git
cd phygital-trace

# 3. Add upstream remote
git remote add upstream https://github.com/soumyachk101/phygital-trace.git

# 4. Install all dependencies
npm install
cd backend && npm install && cd ..
cd web && npm install && cd ..
cd contracts && npm install && cd ..
cd mobile && npm install && cd ..

# 5. Set up environment
cp backend/.env.example backend/.env
# Fill in required values (see DEPLOYMENT.md)

# 6. Start local services
docker-compose up -d

# 7. Run migrations
cd backend && npx prisma migrate dev && cd ..

# 8. Verify everything works
npm test
```

### Pre-Commit Hooks

```bash
# Install Husky pre-commit hooks (runs lint + tests on commit)
npm run prepare
```

---

## 3. Branch Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| New feature | `feature/<ticket>-short-description` | `feature/PT-42-batch-verification` |
| Bug fix | `fix/<ticket>-short-description` | `fix/PT-99-duplicate-cert-check` |
| Security fix | `security/<ticket>-short-description` | `security/PT-15-rate-limit-bypass` |
| Documentation | `docs/<what>` | `docs/update-api-reference` |
| Refactor | `refactor/<what>` | `refactor/extract-sensor-service` |
| Release | `release/v<major>.<minor>.<patch>` | `release/v1.2.0` |
| Hotfix | `hotfix/v<patch>-short-description` | `hotfix/v1.0.1-critical-signing-bug` |

### Branch Lifecycle

```
main (production)
  └── develop (integration)
        └── feature/PT-42-batch-verification
        └── fix/PT-99-duplicate-cert-check
        └── release/v1.2.0
```

---

## 4. Development Workflow

### Step-by-Step

```bash
# 1. Sync with upstream
git fetch upstream
git checkout develop
git rebase upstream/develop

# 2. Create feature branch
git checkout -b feature/PT-42-batch-verification

# 3. Make your changes
# ... edit files ...

# 4. Run tests continuously while developing
cd backend && npm run test:watch

# 5. Type check
cd backend && npm run typecheck

# 6. Lint and format
cd backend && npm run lint:fix

# 7. Run full test suite before pushing
npm test

# 8. Commit with conventional commit format
git commit -m "feat(backend): add batch certificate verification endpoint"

# 9. Push to your fork
git push origin feature/PT-42-batch-verification

# 10. Open PR on GitHub
```

### Development Scripts

```bash
# Backend
cd backend
npm run dev          # Start with hot reload
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # With coverage report
npm run typecheck    # TypeScript check
npm run lint         # Check linting
npm run lint:fix     # Fix lint issues

# Smart Contracts
cd contracts
npx hardhat test           # Run tests
npx hardhat test --watch   # Watch mode
REPORT_GAS=true npx hardhat test  # With gas report
npx hardhat coverage      # Coverage report

# Web Portal
cd web
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check linting
```

---

## 5. Pull Request Process

### Before Opening a PR

- [ ] All tests pass locally: `npm test`
- [ ] TypeScript compiles without errors: `npm run typecheck`
- [ ] No linting errors: `npm run lint`
- [ ] Test coverage maintained (no significant drop)
- [ ] Documentation updated if public APIs changed
- [ ] CHANGELOG updated (for user-facing changes)

### PR Title Format

```
<type>(<scope>): <short description>

Examples:
feat(backend): add batch certificate verification endpoint
fix(contracts): prevent duplicate certificate registration
docs(api): update authentication examples
security(backend): fix rate limit bypass vulnerability
```

### PR Description Template

```markdown
## Summary
Brief description of what this PR does and why.

## Related Issue
Closes #<issue-number>

## Changes Made
- Added `POST /verify/batch` endpoint in `backend/src/routes/verify.routes.ts`
- Added `batchVerify()` method in `CertificateService`
- Added Zod validation schema for batch requests

## Testing
- Added unit tests for `CertificateService.batchVerify()`
- Added integration tests for `POST /verify/batch`
- Manually tested with 100 hashes

## Breaking Changes
None / Describe any breaking changes

## Screenshots (if UI change)
<!-- Add before/after screenshots -->
```

### Merge Requirements

| Requirement | Backend | Contracts | Web |
|---|---|---|---|
| All CI checks pass | ✅ Required | ✅ Required | ✅ Required |
| At least 1 approving review | ✅ Required | ✅ Required | ✅ Required |
| Smart contract changes | — | 2 approvals | — |
| Security changes | 2 approvals | 2 approvals | 2 approvals |
| No merge conflicts | ✅ Required | ✅ Required | ✅ Required |

---

## 6. Issue Templates

### Bug Report

```markdown
**Describe the bug**
A clear description of what went wrong.

**To Reproduce**
Steps to reproduce the behavior:
1. POST to /certificates with payload: ...
2. See error: ...

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Environment**
- OS: macOS / Linux / Windows
- Node version: 20.x
- Package versions: `npm list`

**Additional context**
Logs, screenshots, blockchain TX hashes.
```

### Feature Request

```markdown
**Is your feature request related to a problem?**
Describe the problem you're trying to solve.

**Describe the solution you'd like**
A clear description of the feature you want.

**Describe alternatives you've considered**
Any alternative solutions you've considered.

**Additional context**
How would this help journalists or verifiers?
```

### Security Vulnerability

> ⚠️ **Do NOT open public issues for security vulnerabilities.** See [Section 10](#10-security-vulnerabilities).

---

## 7. Commit Conventions

We use **Conventional Commits** (https://conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to Use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code formatting (no logic change) |
| `refactor` | Code change with no behavior change |
| `test` | Adding or updating tests |
| `chore` | Build system, dependencies, config |
| `security` | Security improvement or fix |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes |

### Scopes

| Scope | What It Covers |
|---|---|
| `backend` | Node.js API server |
| `web` | Next.js web portal |
| `mobile` | React Native app |
| `contracts` | Solidity smart contracts |
| `shared` | Shared types/utilities |
| `docs` | Documentation |
| `ci` | GitHub Actions workflows |
| `docker` | Dockerfile and compose files |

### Examples

```bash
git commit -m "feat(backend): add batch certificate verification endpoint"
git commit -m "fix(contracts): prevent duplicate certificate registration"
git commit -m "security(backend): add rate limiting to verification endpoints"
git commit -m "test(backend): add integration tests for certificate creation"
git commit -m "docs(api): update authentication section with refresh token examples"
git commit -m "chore(backend): update dependencies to patch security vulnerabilities"
```

---

## 8. Testing Requirements

### Coverage Minimums

| Layer | Line Coverage | Branch Coverage |
|---|---|---|
| Backend services | 80% | 75% |
| Backend controllers | 70% | — |
| Smart contracts | 100% | 100% |
| Shared utilities | 90% | 85% |

### What to Test

**For every new feature:**
- Unit test the service/business logic layer
- Integration test the route/controller
- Handle error/edge cases (invalid input, missing data, external service failure)

**For every bug fix:**
- Write a regression test that would have caught the bug
- Verify the test fails before your fix and passes after

**For smart contracts:**
- Test all state transitions
- Test all revert conditions
- Test all events emitted
- Test access control (only owner can do X)
- Test with edge cases (zero values, max values)

```bash
# Run tests with coverage to identify gaps
cd backend && npm run test:coverage
cd contracts && npx hardhat coverage
```

---

## 9. Review Process

### What Reviewers Look For

1. **Correctness** — Does the code do what the PR says it does?
2. **Security** — Does it introduce any vulnerabilities? (see AI_INSTRUCTIONS.md Security Rules)
3. **Tests** — Are there adequate tests for the changes?
4. **Performance** — Any obvious performance issues?
5. **Style** — Does it follow the coding conventions?
6. **Docs** — Are public APIs documented?

### For Reviewers: Review Checklist

```
□ Read the PR description (understand the WHY)
□ Review each changed file
□ Check that tests cover the happy path
□ Check that tests cover error cases
□ Look for security issues (SQL injection, log injection, auth bypass)
□ Check for breaking changes
□ Verify database migrations are safe
□ For contracts: verify gas efficiency and security patterns
□ Leave constructive comments (not just "fix this")
□ Approve or request changes with clear explanation
```

### Stale PR Policy

- PRs inactive for 30 days will receive a `stale` label
- PRs inactive for 45 days will be closed (can be reopened)

---

## 10. Security Vulnerabilities

> 🔐 **Never report security vulnerabilities in public GitHub issues.**

### Responsible Disclosure Policy

1. **Email** security findings to: security@phygital-trace.xyz
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)
3. **Expect acknowledgment** within 48 hours
4. **Expect a fix** within 14 days for critical issues

### Bug Bounty

We offer recognition for valid security reports:
- 🥇 Critical vulnerabilities: Public thanks + $500 (if funded)
- 🥈 High severity: Public thanks + $100
- 🥉 Medium severity: Public thanks

We follow **coordinated disclosure** — we ask you to wait 90 days before publishing, or until a fix is released, whichever comes first.

---

*Last Updated: 2026-03-08*
