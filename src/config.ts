// Works in Vite. Reads VITE_API_BASE from your .env (or .env.local)
// Fallback is your EC2 API if the env var is missing.
export const API_BASE: string =
  (import.meta as any)?.env?.VITE_API_BASE || "http://3.110.216.196/api";
