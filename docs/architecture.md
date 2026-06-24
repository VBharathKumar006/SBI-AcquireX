# SBI AcquireX Architecture

SBI AcquireX is organized as a multi-agent customer acquisition platform.

## Frontend

The Next.js app captures lead details, displays product recommendations, and shows the agent workspace state.

## Backend

The Node.js API exposes profile, recommendation, and customer journey endpoints. The current implementation uses deterministic rules so the MVP can run without external AI credentials.

## Agent Layer

The Python agents model the intended LangGraph nodes:

- Customer Profiling Agent
- Recommendation Agent
- Onboarding Agent
- Follow-up Agent
- Engagement Agent

## Future Integrations

- Gemini API for natural language reasoning
- Gemini Vision for document verification
- MongoDB for lead, journey, and event persistence
- ChromaDB for product and policy retrieval
- JWT authentication for secure user sessions

