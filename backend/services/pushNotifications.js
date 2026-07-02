import webpush from "web-push";
import logger from "./logger.js";

const SUBSCRIPTIONS = new Map();
const NOTIFICATIONS_HISTORY = [];
let vapidReady = false;

function initVapid() {
  const pubKey = process.env.VAPID_PUBLIC_KEY;
  const privKey = process.env.VAPID_PRIVATE_KEY;
  if (pubKey && privKey) {
    try {
      webpush.setVapidDetails("mailto:acquirex@sbi.co.in", pubKey, privKey);
      vapidReady = true;
      logger.info("Web Push VAPID configured from environment");
    } catch (err) {
      logger.warn("Invalid VAPID keys in environment, push notifications disabled", { error: err.message });
    }
  } else {
    logger.info("No VAPID keys configured, push notifications disabled (set VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY)");
  }
}

initVapid();

export function saveSubscription(userId, subscription) {
  SUBSCRIPTIONS.set(userId, subscription);
  logger.info(`Push subscription saved for user ${userId}`);
  return { success: true };
}

export function removeSubscription(userId) {
  SUBSCRIPTIONS.delete(userId);
  logger.info(`Push subscription removed for user ${userId}`);
}

export async function sendPushNotification(userId, title, body, data = {}) {
  const subscription = SUBSCRIPTIONS.get(userId);
  if (!subscription) {
    logger.warn(`No push subscription found for user ${userId}`);
    return { success: false, reason: "no-subscription" };
  }

  const payload = JSON.stringify({ title, body, data, timestamp: new Date().toISOString() });

  if (!vapidReady) {
    NOTIFICATIONS_HISTORY.push({ userId, title, body, data, status: "simulated", timestamp: new Date().toISOString() });
    return { success: true, simulated: true };
  }

  try {
    await webpush.sendNotification(subscription, payload);
    NOTIFICATIONS_HISTORY.push({ userId, title, body, data, status: "sent", timestamp: new Date().toISOString() });
    return { success: true };
  } catch (err) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      SUBSCRIPTIONS.delete(userId);
      logger.warn(`Push subscription expired for user ${userId}, removed`);
    }
    NOTIFICATIONS_HISTORY.push({ userId, title, body, data, status: "failed", error: err.message, timestamp: new Date().toISOString() });
    return { success: false, reason: err.message };
  }
}

export async function broadcastNotification(title, body, data = {}) {
  const results = [];
  for (const [userId] of SUBSCRIPTIONS) {
    const result = await sendPushNotification(userId, title, body, data);
    results.push({ userId, ...result });
  }
  logger.info(`Broadcast notification sent to ${SUBSCRIPTIONS.size} subscribers`);
  return { sent: SUBSCRIPTIONS.size, results };
}

export function getNotificationHistory(limit = 50) {
  return NOTIFICATIONS_HISTORY.slice(-limit).reverse();
}

export function getSubscriberCount() {
  return SUBSCRIPTIONS.size;
}
