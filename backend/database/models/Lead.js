import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  profile: {
    name: String, age: Number, occupation: String,
    income: Number, goal: String, riskAppetite: String, lifecycleStage: String
  },
  recommendations: [{ type: mongoose.Schema.Types.Mixed }],
  onboarding: { status: String, requiredDocuments: [String], missingDocuments: [String], nextAction: String },
  kyc: { percent: Number, requiredDocuments: [String], completedDocuments: [String], missingDocuments: [String] },
  followUp: { riskLevel: String, channel: String, reason: String, nextBestAction: String, message: String },
  engagement: { cadence: String, offers: [String], tips: [String], lifeEventSuggestion: String },
  orchestration: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
