import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { z } from "zod";
import {
  buildCustomerProfile,
  buildJourney,
  calculateKycReadiness,
  createRecoveryPlan,
  getProductCatalog,
  recommendProducts
} from "../services/acquirexEngine.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const profileSchema = z.object({
  name: z.string().min(1),
  age: z.coerce.number().min(18).max(100),
  occupation: z.string().min(1),
  income: z.coerce.number().min(0),
  goal: z.string().min(3),
  riskAppetite: z.enum(["low", "medium", "high"]).default("medium")
});

app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "sbi-acquirex-backend" });
});

app.get("/api/products", (_request, response) => {
  response.json({ products: getProductCatalog() });
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
  response.json(buildJourney(profile, recommendations));
});

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

app.listen(port, () => {
  console.log(`SBI AcquireX backend running on http://localhost:${port}`);
});
