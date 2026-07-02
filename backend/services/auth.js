import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../database/models/User.js";
import { isMongoConnected } from "../database/mongo.js";
import logger from "./logger.js";

const memoryUsers = [];
function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export async function createUser({ name, email, password }) {
  if (isMongoConnected()) {
    try {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return null;
      const user = await User.create({ name, email: email.toLowerCase(), password: hashPassword(password) });
      return { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt };
    } catch (err) {
      logger.error("MongoDB createUser failed", { error: err.message });
      return null;
    }
  }

  const existing = memoryUsers.find((u) => u.email === email.toLowerCase());
  if (existing) return null;
  const user = { id: `mem_${Date.now()}`, name, email: email.toLowerCase(), password: hashPassword(password), createdAt: new Date().toISOString(), journeys: [] };
  memoryUsers.push(user);
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export async function authenticateUser(email, password) {
  if (isMongoConnected()) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !verifyPassword(password, user.password)) return null;
      return { id: user._id.toString(), name: user.name, email: user.email };
    } catch (err) {
      logger.error("MongoDB authenticateUser failed", { error: err.message });
      return null;
    }
  }

  const user = memoryUsers.find((u) => u.email === email.toLowerCase());
  if (!user || !verifyPassword(password, user.password)) return null;
  return { id: user.id, name: user.name, email: user.email };
}

export function generateToken(user) {
  return jwt.sign({ sub: user.id, name: user.name, email: user.email }, getJwtSecret(), { expiresIn: "24h" });
}

export function verifyToken(token) {
  try { return jwt.verify(token, getJwtSecret()); }
  catch { return null; }
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }
  const decoded = verifyToken(header.slice(7));
  if (!decoded) return res.status(401).json({ error: "Invalid or expired token" });
  req.user = decoded;
  next();
}

export async function getUserById(id) {
  if (isMongoConnected()) {
    try {
      const user = await User.findById(id);
      if (!user) return null;
      return { id: user._id.toString(), name: user.name, email: user.email, createdAt: user.createdAt, journeys: user.journeys || [] };
    } catch { return null; }
  }

  const user = memoryUsers.find((u) => u.id === id);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt, journeys: user.journeys };
}

export async function addJourneyToUser(userId, journey) {
  if (isMongoConnected()) {
    try { await User.findByIdAndUpdate(userId, { $push: { journeys: journey } }); }
    catch { logger.error("addJourneyToUser failed", { userId }); }
    return;
  }
  const user = memoryUsers.find((u) => u.id === userId);
  if (user) user.journeys.push(journey);
}
