const configuredApiUrl = import.meta.env.VITE_API_URL;
const defaultApiUrl = "https://st-ips.onrender.com/api";

export const API_BASE_URL = (configuredApiUrl || defaultApiUrl).replace(/\/$/, "");
