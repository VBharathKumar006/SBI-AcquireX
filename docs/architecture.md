# SBI AcquireX Architecture

SBI AcquireX is organized as a multi-agent customer acquisition platform.

## Frontend

The Next.js app captures lead details, displays product recommendations, and shows the agent workspace state.

## Backend

The Node.js API exposes profile, recommendation, KYC, recovery, engagement, auth, lead persistence, product search, readiness, and customer journey endpoints. The current implementation uses deterministic rules and local fallbacks so the MVP can run without external AI credentials.

## Agent Layer

The application uses a Node.js-based multi-agent system (`backend/services/acquirexEngine.js`, `geminiAgent.js`) with 5 specialized AI agents:

- Customer Profiling Agent — builds enriched customer profiles
- Recommendation Agent — matches products based on profile signals
- Onboarding Agent — guides KYC and document verification
- Follow-up Agent — detects abandonment and triggers recovery
- Engagement Agent — generates personalized offers and tips

Each agent can operate with real AI (Gemini API) or deterministic fallback logic.

## Integration Adapters

- Gemini API for natural language reasoning through `GEMINI_API_KEY`
- Gemini Vision for document verification through `/api/document-verification/vision`
- MongoDB for lead, journey, and event persistence through `/api/leads`
- ChromaDB for product and policy retrieval through `/api/products/vector-search`
- JWT authentication for secure user sessions through `/api/auth/demo-token`
- Convex realtime sync plan in `convex/`

## Adapter Fallbacks

- MongoDB: in-memory lead store
- ChromaDB: local cosine-style vector scoring
- Gemini Vision: deterministic document signal extraction
- LangGraph: orchestration metadata returned with the journey
- Convex: schema example and sync plan
