# Integration Readiness

SBI AcquireX can run fully as a local MVP while exposing adapter seams for production services.

## Working Locally

- Next.js acquisition cockpit
- Node.js customer journey APIs
- JWT demo-token endpoint
- In-memory lead persistence fallback
- Local vector-like product search fallback
- Deterministic Gemini Vision-style document verification
- LangGraph-style orchestration plan returned by `/api/journey`

## Production Adapters

| Service | Environment Variable | MVP Behavior |
| --- | --- | --- |
| MongoDB | `MONGODB_URI` | Stores leads in memory until a MongoDB driver is connected |
| ChromaDB | `CHROMA_URL` | Uses local cosine scoring until ChromaDB is connected |
| Gemini Vision | `GEMINI_API_KEY` | Uses deterministic document signals until Gemini is connected |
| Convex | `CONVEX_URL` | Documents schema and sync plan; realtime sync is pending |
| JWT | `JWT_SECRET` | Demo token endpoint works now |

## New API Surfaces

- `GET /api/system/readiness`
- `GET /api/products/vector-search?q=wealth`
- `POST /api/document-verification/vision`
- `GET /api/leads`
- `POST /api/leads`
- `POST /api/journey` with orchestration metadata

