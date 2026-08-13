import axios from "axios";

// Base URL comes from an environment variable so it's different
// in local development vs production (Render). See .env.example.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const client = axios.create({
  baseURL,
  // Required so the browser sends/receives the JSESSIONID cookie
  // across origins (frontend and backend live on different domains).
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
