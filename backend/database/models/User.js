import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  journeys: [{ type: mongoose.Schema.Types.Mixed, default: [] }]
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
