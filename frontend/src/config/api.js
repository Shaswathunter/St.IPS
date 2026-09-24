const configuredApiUrl = import.meta.env.VITE_API_URL;
const defaultApiUrl = import.meta.env.PROD
  ? "https://stips-school-api.onrender.com/api"
  : "http://localhost:5000/api";

export const API_BASE_URL = (configuredApiUrl || defaultApiUrl).replace(/\/$/, "");
