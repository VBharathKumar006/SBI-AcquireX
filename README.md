#  SBI AcquireX

### An Agentic AI Platform for Intelligent Customer Acquisition and Personalized Banking Journeys

<p align="center">
  <img src="https://img.shields.io/badge/Agentic%20AI-Banking-blue" />
  <img src="https://img.shields.io/badge/Hackathon-SBI%20GFF%202026-orange" />
  <img src="https://img.shields.io/badge/Status-Idea%20Stage-success" />
</p>

---

##  Overview

**SBI AcquireX** is an **Agentic AI-powered customer acquisition platform** designed to help SBI intelligently attract, engage, and convert potential customers into long-term banking users.

Unlike traditional banking chatbots, SBI AcquireX acts as an **autonomous AI agent** that understands customer profiles, financial goals, and life stages to provide **hyper-personalized banking journeys**.

The platform autonomously:

- Understands customer needs
- Recommends suitable SBI products
- Assists onboarding and KYC
- Recovers abandoned onboarding journeys
- Continuously engages customers with personalized recommendations

---

##  Problem Statement

Traditional banking customer acquisition faces several challenges:

- Lengthy onboarding processes
- Poor personalization
- High customer drop-off rates
- Limited cross-selling opportunities
- Lack of proactive customer engagement

Banks spend significant resources acquiring customers but often fail to convert them into long-term active users.

---

##  Proposed Solution

**SBI AcquireX** introduces a **Multi-Agent AI Architecture** where specialized AI agents collaborate autonomously to provide an end-to-end customer acquisition journey.

The platform:

 Builds customer profiles

 Recommends personalized SBI products

 Guides onboarding and KYC

 Recovers abandoned applications

 Provides life-event based financial recommendations

---

#  Key Features

## 1. Customer Profiling Agent

Builds a customer profile using:

- Age
- Occupation
- Income
- Financial Goals
- Risk Appetite

---

## 2. Recommendation Agent

Suggests personalized SBI products:

- Savings Accounts
- Credit Cards
- Fixed Deposits
- SIPs
- Insurance Plans
- Education Loans
- Personal Loans

---

## 3. Onboarding Agent

Assists customers with:

- Account Opening
- Form Filling
- KYC Verification
- Eligibility Checks
- Document Upload

---

## 4. Follow-up Agent

If a customer abandons onboarding:

- Sends reminders
- Answers queries
- Resolves issues
- Resumes onboarding automatically

---

## 5. Engagement Agent

Continuously provides:

- Personalized offers
- Financial tips
- Investment recommendations
- Life-event based suggestions

---

#  Agentic AI Architecture

<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/fe786daf-44d7-4dc8-99df-4e8b64151cc0" />


---

#  User Journey
<img width="1024" height="559" alt="image" src="https://github.com/user-attachments/assets/a1656aac-2422-456f-9afe-6faeb802c113" />


---

#  Technology Stack

### Frontend

- Next.js
- React.js
- Tailwind CSS

### Backend

- Node.js
- Convex

### AI & Agentic Framework

- Gemini API
- LangGraph

### Database

- MongoDB

### Vector Database

- ChromaDB

### Authentication

- JWT

### OCR / Document Verification

- Gemini Vision

---

#  Proposed Folder Structure

```text
SBI-AcquireX/

├── README.md
├── LICENSE
├── .gitignore

├── docs/
│   ├── architecture.png
│   ├── user-flow.png
│   └── idea-deck.pdf

├── frontend/
│   ├── app/
│   ├── components/
│   └── pages/

├── backend/
│   ├── api/
│   ├── database/
│   └── services/

├── agents/
│   ├── customer_profiling_agent.py
│   ├── recommendation_agent.py
│   ├── onboarding_agent.py
│   ├── followup_agent.py
│   └── engagement_agent.py

├── prompts/
│   ├── recommendation_prompt.txt
│   └── onboarding_prompt.txt

└── assets/
```

---

# Innovation

- Multi-Agent AI Architecture
- Hyper-Personalized Banking
- Context Memory
- Autonomous Workflows
- Onboarding Recovery
- Life-Event Based Recommendations
- Proactive Financial Engagement

---

#  Expected Business Impact

- Reduce onboarding drop-offs by **30%**
- Increase customer acquisition rates
- Improve digital adoption
- Increase cross-selling opportunities
- Enhance customer lifetime value
- Strengthen customer engagement

---

#  Future Scope

- Voice Banking
- WhatsApp Banking Integration
- SBI YONO Integration
- AI Financial Planner
- Wealth Management Assistant
- SME Banking Support

---

##  Team Details

**Project:** SBI AcquireX

**Team:** Alpha

**Member:** Bharath Kumar

**Institute:** National Institute of Technology Warangal

**Hackathon:** SBI Global Fintech Fest (GFF) 2026

---

---

#  Current MVP Build

The repository now includes a working starter implementation:

- **Frontend:** Next.js dashboard for lead intake, recommendations, journey status, and agent insights.
- **Frontend options:** Customer segment presets, KYC readiness tracker, product comparison, and drop-off recovery simulator.
- **Backend:** Node.js/Express API with profile, product, recommendation, KYC readiness, recovery, and journey endpoints.
- **Agents:** Python multi-agent stubs for profiling, recommendations, onboarding, follow-up, and engagement.
- **Docs:** Architecture and user-flow notes for the first hackathon iteration.

##  Run Locally

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev:frontend
```

Start the backend:

```bash
npm run dev:backend
```

Run the Python agent demo:

```bash
npm run agent:demo
```

Backend environment variables can be copied from `backend/.env.example`.

---

*SBI AcquireX aims to transform customer acquisition from a one-time interaction into an intelligent, lifelong banking relationship powered by Agentic AI.*
