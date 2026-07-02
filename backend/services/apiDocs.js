export const apiSpec = {
  openapi: "3.0.3",
  info: {
    title: "SBI AcquireX API",
    version: "0.2.0",
    description: "Agentic AI customer acquisition platform for personalized banking journeys."
  },
  servers: [{ url: "http://localhost:4000", description: "Local development" }],
  paths: {
    "/health": { get: { summary: "Health check", responses: { "200": { description: "OK" } } } },
    "/api/products": { get: { summary: "List all products", responses: { "200": { description: "Product catalog" } } } },
    "/api/products/search": { get: { summary: "Search products", parameters: [{ name: "q", in: "query", schema: { type: "string" } }], responses: { "200": { description: "Matching products" } } } },
    "/api/products/vector-search": { get: { summary: "Vector-based product search", parameters: [{ name: "q", in: "query", schema: { type: "string" } }], responses: { "200": { description: "Ranked products" } } } },
    "/api/profile": { post: { summary: "Build customer profile", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProfileInput" } } } }, responses: { "200": { description: "Normalized profile" } } } },
    "/api/recommendations": { post: { summary: "Get product recommendations", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProfileInput" } } } }, responses: { "200": { description: "Profile + top 3 recommendations" } } } },
    "/api/journey": { post: { summary: "Get full customer journey", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProfileInput" } } } }, responses: { "200": { description: "Journey with orchestration metadata" } } } },
    "/api/leads": { get: { summary: "List all leads/journeys", responses: { "200": { description: "Array of lead journeys" } } }, post: { summary: "Create a new lead journey", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProfileInput" } } } }, responses: { "201": { description: "Created lead" } } } },
    "/api/auth/signup": { post: { summary: "Register new user", requestBody: { content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" }, email: { type: "string", format: "email" }, password: { type: "string", minLength: 6 } }, required: ["name", "email", "password"] } } } }, responses: { "201": { description: "User + JWT token" } } } },
    "/api/auth/login": { post: { summary: "User login", requestBody: { content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" }, password: { type: "string" } }, required: ["email", "password"] } } } }, responses: { "200": { description: "User + JWT token" } } } },
    "/api/auth/me": { get: { summary: "Get current user", security: [{ bearerAuth: [] }], responses: { "200": { description: "User profile" } } } },
    "/api/kyc/status": { post: { summary: "Get KYC wizard status", requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/ProfileInput" } } } }, responses: { "200": { description: "KYC step status" } } } },
    "/api/upload": { post: { summary: "Upload document for verification", requestBody: { content: { "multipart/form-data": { schema: { type: "object", properties: { document: { type: "string", format: "binary" } } } } } }, responses: { "200": { description: "Document analysis result" } } } },
    "/api/analytics": { get: { summary: "Get analytics dashboard data", responses: { "200": { description: "Analytics with charts data" } } } },
    "/api/agents/reasoning": { post: { summary: "Get agent reasoning output", requestBody: { content: { "application/json": { schema: { type: "object", properties: { agent: { type: "string", enum: ["profile", "recommend", "onboard", "recover", "engage"] }, profile: { $ref: "#/components/schemas/ProfileInput" } } } } } }, responses: { "200": { description: "Agent reasoning text" } } } }
  },
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    schemas: {
      ProfileInput: {
        type: "object",
        properties: {
          name: { type: "string" }, age: { type: "number" }, occupation: { type: "string" },
          income: { type: "number" }, goal: { type: "string" }, riskAppetite: { type: "string", enum: ["low", "medium", "high"] }
        },
        required: ["name", "age", "occupation", "income", "goal"]
      }
    }
  }
};
