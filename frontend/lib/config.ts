const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const API = {
  base: API_BASE,
  auth: `${API_BASE}/api/auth`,
  upload: `${API_BASE}/api/upload`,
  leads: `${API_BASE}/api/leads`,
  analytics: `${API_BASE}/api/analytics`,
  agents: `${API_BASE}/api/agents`,
  journey: (id: string) => `${API_BASE}/api/journey/${id}`,
  kyc: `${API_BASE}/api/kyc`,
  products: `${API_BASE}/api/products`,
  profile: `${API_BASE}/api/profile`,
  recommendations: `${API_BASE}/api/recommendations`,
  integrations: `${API_BASE}/api/integrations`,
  readiness: `${API_BASE}/api/system/readiness`,
  notifications: `${API_BASE}/api/notifications`
};

const config = {
  apiUrl: API_BASE,
  wsUrl: API_BASE,
  vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BPpvwZqJbGQeFkHxV7yR3Dn8cN0mW5tK9sA2fL6oQ4rU1yX8zC3vB7nM0jK5lR9tW2yF4hP6sA0dG8jL1kX3cV5n"
};

export default config;
