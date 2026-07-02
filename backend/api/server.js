import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { z } from "zod";
import { analyzeDocument } from "../services/geminiVision.js";
import { callGemini, agentPrompts } from "../services/geminiAgent.js";
import { buildFinancialPlan } from "../services/financialPlanner.js";
import { buildWealthPlan } from "../services/wealthManager.js";
import { generateWhatsAppMessage, getWhatsAppTemplates, simulateConversation } from "../services/whatsappBot.js";
import { processVoiceCommand, getAvailableCommands } from "../services/voiceBanking.js";
import { createUser, authenticateUser, generateToken, authMiddleware, getUserById } from "../services/auth.js";
import { connectMongo } from "../database/mongo.js";
import { apiSpec } from "../services/apiDocs.js";
import logger from "../services/logger.js";
import { initWebSocket, emitJourneyUpdate, emitNotification } from "../services/websocket.js";
import { saveSubscription, removeSubscription, sendPushNotification, broadcastNotification, getNotificationHistory, getSubscriberCount } from "../services/pushNotifications.js";
import {
  buildCustomerProfile,
  buildEngagementPlan,
  buildJourney,
  calculateKycReadiness,
  createRecoveryPlan,
  getIntegrationStatus,
  getProductCatalog,
  recommendProducts,
  searchProducts,
  verifyDocuments
} from "../services/acquirexEngine.js";
import {
  buildLangGraphPlan,
  getSystemReadiness,
  listLeadJourneys,
  runVectorProductSearch,
  saveLeadJourney,
  verifyDocumentWithGeminiAdapter
} from "../services/integrationAdapters.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

initWebSocket(server);

const profileSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().min(18).max(100),
  occupation: z.string().min(1),
  income: z.coerce.number().min(0),
  goal: z.string().min(3),
  riskAppetite: z.enum(["low", "medium", "high"]).default("medium")
});

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.use(helmet({ crossOriginEmbedderPolicy: false }));

const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",").map(s => s.trim());
app.use(cors({
  origin: corsOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400
}));

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || "200"),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts, please try again later." }
});

app.use(globalLimiter);
app.use(express.json({ limit: "5mb" }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "uploads"),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/docs.json", (_request, response) => response.json(apiSpec));

app.use((request, _response, next) => {
  logger.info(`${request.method} ${request.path}`, { query: request.query });
  next();
});

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "sbi-acquirex-backend" });
});

app.get("/api/products", (_request, response) => {
  response.json({ products: getProductCatalog() });
});

app.get("/api/products/search", (request, response) => {
  response.json({ products: searchProducts(String(request.query.q || "")) });
});

app.get("/api/products/vector-search", asyncHandler(async (request, response) => {
  const products = await runVectorProductSearch(String(request.query.q || ""), getProductCatalog());
  response.json({
    provider: process.env.CHROMA_URL ? "chroma" : "local-vector-fallback",
    products
  });
}));

app.get("/api/integrations", (_request, response) => {
  response.json({ integrations: getIntegrationStatus() });
});

app.get("/api/system/readiness", (_request, response) => {
  response.json(getSystemReadiness());
});

app.post("/api/auth/demo-token", (request, response) => {
  const parsed = z.object({ customerId: z.string().min(1).default("demo-customer") }).safeParse(request.body || {});
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid auth request", details: parsed.error.flatten() });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) return response.status(500).json({ error: "JWT_SECRET not configured" });
  const token = jwt.sign(
    { sub: parsed.data.customerId, scope: "acquirex:journey" },
    jwtSecret,
    { expiresIn: "1h" }
  );
  response.json({ token, tokenType: "Bearer", expiresIn: 3600 });
});

app.post("/api/profile", (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid profile", details: parsed.error.flatten() });
  }

  response.json({ profile: buildCustomerProfile(parsed.data) });
});

app.post("/api/recommendations", (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid profile", details: parsed.error.flatten() });
  }

  const profile = buildCustomerProfile(parsed.data);
  response.json({ profile, recommendations: recommendProducts(profile) });
});

app.post("/api/journey", (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid profile", details: parsed.error.flatten() });
  }

  const profile = buildCustomerProfile(parsed.data);
  const recommendations = recommendProducts(profile);
  const journey = buildJourney(profile, recommendations);
  const orchestration = buildLangGraphPlan(profile, recommendations);

  emitJourneyUpdate(journey.id || "new", { action: "created", journey, orchestration });

  response.json({
    ...journey,
    orchestration
  });
});

app.get("/api/leads", authMiddleware, asyncHandler(async (_request, response) => {
  response.json({ leads: await listLeadJourneys() });
}));

app.post("/api/leads", asyncHandler(async (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid lead", details: parsed.error.flatten() });
  }

  const profile = buildCustomerProfile(parsed.data);
  const recommendations = recommendProducts(profile);
  const lead = await saveLeadJourney(buildJourney(profile, recommendations));
  response.status(201).json({ lead });
}));

app.post("/api/auth/signup", authLimiter, asyncHandler(async (request, response) => {
  const parsed = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
  }).safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const user = await createUser(parsed.data);
  if (!user) {
    return response.status(409).json({ error: "An account with this email already exists." });
  }

  const token = generateToken(user);
  response.status(201).json({ user, token, tokenType: "Bearer" });
}));

app.post("/api/auth/login", authLimiter, asyncHandler(async (request, response) => {
  const parsed = z.object({
    email: z.string().email(),
    password: z.string().min(1)
  }).safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
  }

  const user = await authenticateUser(parsed.data.email, parsed.data.password);
  if (!user) {
    return response.status(401).json({ error: "Invalid email or password." });
  }

  const token = generateToken(user);
  response.json({ user, token, tokenType: "Bearer" });
}));

app.get("/api/auth/me", authMiddleware, asyncHandler(async (request, response) => {
  const user = await getUserById(request.user.sub);
  if (!user) return response.status(404).json({ error: "User not found" });
  response.json({ user });
}));

app.post("/api/kyc-readiness", (request, response) => {
  const parsed = profileSchema
    .extend({
      uploadedDocuments: z.array(z.string()).default([])
    })
    .safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid KYC request", details: parsed.error.flatten() });
  }

  const profile = buildCustomerProfile(parsed.data);
  const recommendations = recommendProducts(profile);
  response.json({ profile, kyc: calculateKycReadiness(recommendations, parsed.data.uploadedDocuments) });
});

app.post("/api/recovery-plan", (request, response) => {
  const parsed = profileSchema
    .extend({
      stage: z.string().min(3).default("document upload"),
      idleHours: z.coerce.number().min(1).max(168).default(24)
    })
    .safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid recovery request", details: parsed.error.flatten() });
  }

  const profile = buildCustomerProfile(parsed.data);
  response.json({ profile, recoveryPlan: createRecoveryPlan(profile, parsed.data.stage, parsed.data.idleHours) });
});

app.post("/api/upload", upload.single("document"), asyncHandler(async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ error: "No file uploaded. Accepted formats: PDF, JPG, PNG, WEBP (max 10MB)." });
  }

  const result = analyzeDocument(request.file);
  const fileInfo = {
    name: request.file.originalname,
    path: `/uploads/${request.file.filename}`,
    size: request.file.size
  };

  emitNotification("admin", {
    type: "info",
    title: "Document Uploaded",
    body: `${request.file.originalname} (${(request.file.size / 1024).toFixed(1)}KB)`
  });

  response.json({
    success: true,
    file: fileInfo,
    analysis: result
  });
}));

app.post("/api/document-verification", (request, response) => {
  const parsed = z.object({ documents: z.array(z.string()).default([]) }).safeParse(request.body || {});
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid document request", details: parsed.error.flatten() });
  }

  response.json({ results: verifyDocuments(parsed.data.documents) });
});

app.post("/api/document-verification/vision", (request, response) => {
  const parsed = z
    .object({
      documents: z
        .array(
          z.object({
            name: z.string().min(1),
            type: z.string().optional(),
            content: z.string().optional()
          })
        )
        .default([])
    })
    .safeParse(request.body || {});
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid vision request", details: parsed.error.flatten() });
  }

  response.json({ results: parsed.data.documents.map(verifyDocumentWithGeminiAdapter) });
});

app.post("/api/kyc/status", (request, response) => {
  const parsed = profileSchema
    .extend({
      documents: z.array(z.string()).default([]),
      step: z.string().default("profile")
    })
    .safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid KYC request", details: parsed.error.flatten() });
  }

  const profile = buildCustomerProfile(parsed.data);
  const recommendations = recommendProducts(profile);
  const kyc = calculateKycReadiness(recommendations, parsed.data.documents);

  const steps = ["profile", "documents", "video-kyc", "esign", "complete"];
  const currentIndex = steps.indexOf(parsed.data.step);
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  response.json({
    profile,
    step: parsed.data.step,
    nextStep,
    progress: Math.round(((currentIndex + 1) / steps.length) * 100),
    kyc,
    recommendations: recommendations.map((r) => ({ id: r.id, name: r.name, category: r.category }))
  });
});

app.post("/api/engagement-plan", (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid engagement request", details: parsed.error.flatten() });
  }

  const profile = buildCustomerProfile(parsed.data);
  const recommendations = recommendProducts(profile);
  response.json({ profile, engagementPlan: buildEngagementPlan(profile, recommendations) });
});

app.post("/api/agents/reasoning", asyncHandler(async (request, response) => {
  const parsed = z.object({
    agent: z.enum(["profile", "recommend", "onboard", "recover", "engage"]),
    profile: profileSchema
  }).safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  }

  const { agent, profile } = parsed.data;
  const promptConfig = agentPrompts[agent](profile);
  const result = await callGemini(promptConfig.prompt, promptConfig.system);

  response.json({
    agent,
    ...result,
    profile: buildCustomerProfile(profile)
  });
}));

app.post("/api/journey/:id/intervene", authMiddleware, (request, response) => {
  const parsed = z.object({ action: z.enum(["resume", "escalate", "reassign"]) }).safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid action. Use: resume, escalate, or reassign." });
  }

  response.json({
    success: true,
    journeyId: request.params.id,
    action: parsed.data.action,
    status: "queued",
    message: parsed.data.action === "resume"
      ? "Recovery workflow triggered for this journey."
      : parsed.data.action === "escalate"
        ? "Journey escalated to senior agent for manual handling."
        : "Journey reassigned to the next available agent."
  });
});

app.get("/api/analytics", authMiddleware, asyncHandler(async (request, response) => {
  const leads = await listLeadJourneys();
  const total = leads.length;
  const converted = leads.filter((l) => l.onboarding?.status === "completed").length;
  const dropOff = leads.filter((l) => l.followUp?.riskLevel === "high").length;

  const products = {};
  leads.forEach((l) => {
    (l.recommendations || []).forEach((r) => {
      products[r.category || r.name] = (products[r.category || r.name] || 0) + 1;
    });
  });

  response.json({
    summary: {
      totalLeads: total,
      converted,
      conversionRate: total ? Math.round((converted / total) * 100) : 0,
      dropOffRate: total ? Math.round((dropOff / total) * 100) : 0,
      activeAgents: 5,
      avgTimeToConvert: "~12m"
    },
    productDistribution: Object.entries(products).map(([name, count]) => ({ name, count })),
    weeklyTrends: [
      { week: "Week 1", leads: 12, converted: 8 },
      { week: "Week 2", leads: 18, converted: 13 },
      { week: "Week 3", leads: 15, converted: 11 },
      { week: "Week 4", leads: 22, converted: 17 }
    ],
    funnel: [
      { stage: "Profiled", count: total || 24 },
      { stage: "Recommended", count: Math.round((total || 24) * 0.88) },
      { stage: "KYC Started", count: Math.round((total || 24) * 0.7) },
      { stage: "Video KYC", count: Math.round((total || 24) * 0.55) },
      { stage: "Converted", count: converted || 13 }
    ]
  });
}));

app.post("/api/planner", (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: "Invalid profile", details: parsed.error.flatten() });
  const profile = buildCustomerProfile(parsed.data);
  response.json({ profile, plan: buildFinancialPlan(profile) });
});

app.post("/api/wealth", (request, response) => {
  const parsed = profileSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: "Invalid profile", details: parsed.error.flatten() });
  const profile = buildCustomerProfile(parsed.data);
  response.json({ profile, wealth: buildWealthPlan(profile) });
});

app.get("/api/whatsapp/templates", (_request, response) => {
  response.json({ templates: getWhatsAppTemplates() });
});

app.post("/api/whatsapp/send", (request, response) => {
  const parsed = z.object({ template: z.string(), variables: z.record(z.string()).default({}) }).safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  response.json({ message: generateWhatsAppMessage(parsed.data.template, parsed.data.variables), provider: "whatsapp-business-api" });
});

app.post("/api/whatsapp/chat", (request, response) => {
  const parsed = z.object({ intent: z.string().default("support"), name: z.string().default("Customer") }).safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
  response.json(simulateConversation(parsed.data.intent));
});

app.post("/api/voice/process", (request, response) => {
  const parsed = z.object({ transcript: z.string().min(1) }).safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: "No transcript provided" });
  response.json(processVoiceCommand(parsed.data.transcript));
});

app.get("/api/voice/commands", (_request, response) => {
  response.json({ commands: getAvailableCommands() });
});

app.get("/api/yono/status", (_request, response) => {
  response.json({
    connected: false,
    status: "integration-ready",
    features: ["Single sign-on", "Account summary sync", "Transaction history", "Product recommendations"],
    setupGuide: "Add SBI YONO API credentials in .env: YONO_CLIENT_ID, YONO_CLIENT_SECRET",
    lastSync: null
  });
});

app.get("/api/sme/products", (_request, response) => {
  response.json({
    products: [
      { id: "sme-current", name: "SBI SME Current Account", features: ["Free digital transactions", "Overdraft facility up to ₹25L", "Multi-location operations"], rate: "0%" },
      { id: "sme-loan", name: "SBI SME Business Loan", features: ["Term loan up to ₹5Cr", "Working capital finance", "Collateral-free up to ₹50L"], rate: "9.5% p.a." },
      { id: "sme-cc", name: "SBI Business Credit Card", features: ["₹5L credit limit", "Fuel & travel benefits", "GST filing support"], rate: "1.99%/mo" },
      { id: "sme-insurance", name: "SBI SME Insurance Bundle", features: ["Property insurance", "Keyman insurance", "Business interruption cover"], rate: "Custom" }
    ]
  });
});

app.post("/api/notifications/subscribe", authMiddleware, (request, response) => {
  const userId = request.user.sub;
  const subscription = request.body;
  const parsed = z.object({
    endpoint: z.string().url(),
    keys: z.object({ p256dh: z.string(), auth: z.string() }).optional()
  }).safeParse(subscription);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid push subscription", details: parsed.error.flatten() });
  }
  saveSubscription(userId, parsed.data);
  response.json({ success: true });
});

app.post("/api/notifications/unsubscribe", (request, response) => {
  const userId = request.body?.userId || "anonymous";
  removeSubscription(userId);
  response.json({ success: true });
});

app.post("/api/notifications/send", authMiddleware, asyncHandler(async (request, response) => {
  const parsed = z.object({
    userId: z.string().optional(),
    title: z.string().min(1),
    body: z.string().min(1),
    type: z.enum(["info", "success", "warning", "error"]).default("info"),
    broadcast: z.boolean().default(false)
  }).safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid notification", details: parsed.error.flatten() });
  }

  const { userId, title, body, type, broadcast: isBroadcast } = parsed.data;

  if (isBroadcast) {
    const result = await broadcastNotification(title, body, { type });
    emitNotification("broadcast", { type, title, body });
    response.json({ success: true, broadcast: true, sent: result.sent });
  } else if (userId) {
    const result = await sendPushNotification(userId, title, body, { type });
    emitNotification(userId, { type, title, body });
    response.json(result);
  } else {
    response.status(400).json({ error: "Provide userId or set broadcast: true" });
  }
}));

app.get("/api/notifications/history", (_request, response) => {
  response.json({ notifications: getNotificationHistory() });
});

app.get("/api/notifications/stats", (_request, response) => {
  response.json({ subscriberCount: getSubscriberCount() });
});

app.use((err, _request, response, _next) => {
  logger.error("Unhandled error", { error: err.message, stack: err.stack });
  response.status(500).json({ error: "Internal server error" });
});

async function start() {
  await connectMongo();
  server.listen(port, () => {
    logger.info(`SBI AcquireX backend running on http://localhost:${port}`);
  });
}

start();
