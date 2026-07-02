import logger from "./logger.js";

export async function syncJourneyToConvex(journey) {
  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    logger.debug("Convex sync skipped — CONVEX_URL not configured");
    return { synced: false, reason: "CONVEX_URL not configured" };
  }

  try {
    const res = await fetch(`${convexUrl}/api/mutations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "journeys:create", args: { journey } })
    });
    if (res.ok) {
      logger.info("Journey synced to Convex");
      return { synced: true };
    }
    throw new Error(`Convex responded with ${res.status}`);
  } catch (err) {
    logger.warn("Convex sync failed", { error: err.message });
    return { synced: false, reason: err.message };
  }
}
