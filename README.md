# SBI AcquireX

### An Agentic AI Platform for Intelligent Customer Acquisition and Personalized Banking Journeys

<p align="center">
  <img src="https://img.shields.io/badge/Agentic%20AI-Banking-blue" />
  <img src="https://img.shields.io/badge/Hackathon-SBI%20GFF%202026-orange" />
  <img src="https://img.shields.io/badge/Status-MVP%20Complete-success" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Overview

**SBI AcquireX** is an **Agentic AI-powered customer acquisition platform** that intelligently attracts, engages, and converts potential customers into long-term banking users. The platform uses a multi-agent AI architecture to understand customer profiles, financial goals, and life stages, providing hyper-personalized banking journeys.

Built across 5 phases — UI refresh, feature gaps, production hardening, future-scope features, and security/PWA/push — the project is a fully functional full-stack application with both in-memory fallbacks and production-grade MongoDB/real-AI adapters.

---

## Features

### Core (Phases 1-2)
- **Customer Profiling** — Build detailed profiles from age, income, goals, risk appetite
- **Product Recommendations** — AI-driven SBI product matching (savings, credit cards, FD, SIP, insurance, loans)
- **Onboarding Wizard** — 5-step KYC flow (profile → documents → video KYC → e-sign → complete)
- **Document Upload** — Drag-and-drop file upload with OCR-style analysis
- **Recovery & Engagement** — Abandoned journey recovery plans, personalized engagement campaigns
- **Agent Reasoning** — View AI agent decision logs with expandable reasoning panels
- **Auth System** — JWT-based signup/login/profile with MongoDB or in-memory storage
- **Analytics Dashboard** — Conversion funnel, weekly trends, product distribution charts
- **Admin Monitoring** — Active journey list with resume/escalate/reassign controls

### Future Scope Features (Phase 4)
- **AI Financial Planner** — Retirement corpus projection, SIP targets, income-based growth plans
- **Wealth Management** — Portfolio allocation pie chart, holdings table, rebalance suggestions
- **YONO Integration** — Connection status, feature list, setup guide
- **WhatsApp Banking** — Message template builder with chat simulator
- **Voice Banking** — Web Speech API integration, command history, 8 banking intents
- **SME Banking** — Business product cards (current account, loans, credit card, insurance)

### Production Hardening (Phase 3 & 5)
- **PWA** — Manifest, service worker with offline cache-first strategy, install prompt banner
- **Real-time WebSocket** — Socket.io live updates on journeys, dashboard, admin channel
- **Push Notifications** — Web Push API with admin broadcast, per-user delivery, notification history
- **Security** — Helmet headers, rate limiting (200 req/min global, 20 req/min auth), CORS hardening, Zod validation
- **Structured Logging** — Winston with timestamped console output, JSON format in production
- **Skeleton Loaders** — CardSkeleton, StatCardSkeleton, DashboardSkeleton for loading states
- **Toast Notifications** — Context-based toast system with success/error/warning/info
- **Error Boundaries** — React error boundary component with try-again fallback
- **Docker Support** — Multi-service Docker Compose (frontend + backend + MongoDB)
- **CI/CD** — GitHub Actions workflow (test → lint → build → Docker build)
- **E2E Smoke Tests** — Playwright tests covering all pages and API endpoints
- **OpenAPI Spec** — Auto-generated API documentation at `/api/docs.json`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **UI** | Framer Motion, Recharts, Lucide React |
| **Backend** | Node.js, Express 4 |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |
| **Validation** | Zod |
| **Database** | MongoDB + Mongoose (with in-memory fallback) |
| **AI** | Gemini 1.5 Flash API (with deterministic fallback) |
| **Vector DB** | ChromaDB (with local fallback) |
| **Real-time** | Socket.io |
| **Push** | Web Push API |
| **Security** | Helmet, express-rate-limit |
| **Logging** | Winston |
| **Testing** | Vitest (14 unit tests), Playwright (10 E2E smoke tests) |
| **Container** | Docker, Docker Compose |
| **CI** | GitHub Actions |

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm (comes with Node)

### 1. Environment Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your settings (defaults work for local dev)
```

### 2. Install & Run (two terminals)

**Terminal 1 — Backend (port 4000):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend (port 3000):**
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

### 3. Docker (alternative — starts everything including MongoDB)
```bash
docker compose up
```

---

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `JWT_SECRET` | **Yes** | — | JWT signing secret (set a strong random value) |
| `MONGODB_URI` | No | — | MongoDB connection string (skipped → in-memory fallback) |
| `GEMINI_API_KEY` | No | — | Gemini API key (skipped → deterministic fallback) |
| `CORS_ORIGINS` | No | `http://localhost:3000` | Allowed CORS origins (comma-separated) |
| `RATE_LIMIT_MAX` | No | `200` | Max requests per minute per IP |
| `VAPID_PUBLIC_KEY` | No | — | Web Push public key (generate via `npx web-push generate-vapid-keys`) |
| `VAPID_PRIVATE_KEY` | No | — | Web Push private key |
| `FRONTEND_URL` | No | `http://localhost:3000` | WebSocket CORS origin |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:4000` | Frontend API base URL (set `http://backend:4000` in Docker) |

---

## Folder Structure

```
SBI-AcquireX/
├── README.md
├── package.json              # npm workspaces root
├── .gitignore
├── .dockerignore
├── docker-compose.yml
├── Dockerfile.frontend
├── Dockerfile.backend
├── .github/workflows/ci.yml  # CI/CD pipeline
├── e2e/                      # Playwright E2E tests
│   ├── playwright.config.js
│   └── smoke.spec.js
│
├── frontend/                 # Next.js 14 App Router
│   ├── app/                  # Pages (15 routes)
│   │   ├── page.tsx          # Main acquisition dashboard
│   │   ├── dashboard/        # Analytics dashboard
│   │   ├── admin/            # Agent monitoring
│   │   ├── login/ & signup/  # Auth pages
│   │   ├── profile/          # User profile
│   │   ├── planner/          # AI Financial Planner
│   │   ├── wealth/           # Wealth Management
│   │   ├── yono/             # YONO Integration
│   │   ├── whatsapp/         # WhatsApp Banking
│   │   ├── voice/            # Voice Banking
│   │   └── sme/              # SME Banking
│   ├── components/           # Reusable React components
│   ├── lib/                  # Config, auth, socket, toast, types
│   └── public/               # Static assets, PWA manifest, service worker
│
├── backend/                  # Node.js/Express API
│   ├── api/server.js         # 30+ REST endpoints
│   ├── services/             # Business logic + AI agents
│   │   ├── acquirexEngine.js # Core acquisition engine
│   │   ├── geminiAgent.js    # Gemini AI agent prompts
│   │   ├── financialPlanner.js / wealthManager.js
│   │   ├── whatsappBot.js / voiceBanking.js
│   │   ├── websocket.js      # Socket.io real-time
│   │   ├── pushNotifications.js
│   │   ├── auth.js           # JWT auth + bcrypt
│   │   ├── logger.js         # Winston logging
│   │   ├── apiDocs.js        # OpenAPI 3.0.3 spec
│   │   └── integrationAdapters.js / chromaClient.js / convexSync.js
│   ├── database/             # MongoDB models + connection manager
│   └── __tests__/            # 14 Vitest unit tests
```

---

## API Endpoints

The backend exposes 30+ REST endpoints. Full OpenAPI spec available at `/api/docs.json` when the server is running.

### Core
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| POST | `/api/profile` | Build customer profile |
| POST | `/api/recommendations` | Get product recommendations |
| POST | `/api/journey` | Build onboarding journey |
| POST | `/api/kyc-readiness` | Calculate KYC readiness |
| POST | `/api/kyc/status` | Get KYC step status |

### Auth
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (auth required) |

### Admin
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/leads` | List all journeys (auth required) |
| POST | `/api/journey/:id/intervene` | Resume/escalate/reassign (auth required) |
| GET | `/api/analytics` | Analytics data (auth required) |

### Financial
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/planner` | AI financial plan |
| POST | `/api/wealth` | Wealth portfolio |

### Communication
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/whatsapp/templates` | WhatsApp templates |
| POST | `/api/whatsapp/send` | Generate WhatsApp message |
| POST | `/api/voice/process` | Process voice command |
| GET | `/api/voice/commands` | Available voice commands |

### Notifications (auth required)
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/notifications/subscribe` | Subscribe to push |
| POST | `/api/notifications/send` | Send/broadcast notification |
| GET | `/api/notifications/history` | Notification history |

---

## Running Tests

```bash
# Backend unit tests (14 tests)
cd backend && npm test

# Frontend unit tests
cd frontend && npm test

# E2E smoke tests (requires both servers running)
cd frontend && npx playwright test ../e2e/
```

---

## Known Fallbacks

The app gracefully degrades when external services are unavailable:

| Service | Without Config | Behaves As |
|---------|---------------|------------|
| MongoDB | `MONGODB_URI` unset | In-memory storage (data lost on restart) |
| Gemini API | `GEMINI_API_KEY` unset | Deterministic canned responses |
| ChromaDB | `CHROMA_URL` unset | Local keyword-based vector search |
| VAPID keys | Not configured | Push notifications simulated (logged, not delivered) |
| JWT_SECRET | Not set | Server refuses to start (safety) |

---

## Build & Deployment

```bash
# Frontend production build
cd frontend && npm run build

# Docker (full stack)
docker compose up

# CI pipeline
# Configured in .github/workflows/ci.yml — runs on push/PR to main
```

---

## Team

**Project:** SBI AcquireX
**Team:** Alpha
**Member:** Bharath Kumar
**Institute:** National Institute of Technology Warangal
**Hackathon:** SBI Global Fintech Fest (GFF) 2026

---

*SBI AcquireX — transforming customer acquisition from a one-time interaction into an intelligent, lifelong banking relationship powered by Agentic AI.*
