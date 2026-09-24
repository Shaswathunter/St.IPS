const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (configuredApiUrl || "http://localhost:5000/api").replace(/\/$/, "");
