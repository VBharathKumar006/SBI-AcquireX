export async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    return { connected: false, reason: "MONGODB_URI is not configured" };
  }

  return {
    connected: false,
    reason: "MongoDB adapter placeholder. Add the official mongodb driver when persistence is required."
  };
}

