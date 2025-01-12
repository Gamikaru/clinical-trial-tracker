/**
 * src/services/api.ts
 *
 * Axios instance configured to point to your local Python backend.
 */
import axios from "axios";

// Grab the base URL from new environment variable
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const api = axios.create({
    baseURL, // e.g. "http://127.0.0.1:8000"
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add a request interceptor for logging
api.interceptors.request.use((config) => {
    console.log("[DEBUG] About to call:", config.method?.toUpperCase(), config.url);
    return config;
});

// Optional: Add a response interceptor for logging
api.interceptors.response.use(
    (response) => {
        console.log("[DEBUG] Response data from:", response.config.url, response.data);
        return response;
    },
    (error) => {
        console.error("[ERROR] API call failed:", error);
        return Promise.reject(error);
    }
);

export default api;
