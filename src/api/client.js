import axios from "axios";

// Make sure the Render URL is hardcoded or properly loaded as fallback:
const baseURL = import.meta.env.VITE_API_BASE_URL || "https://secureshop-spring-boot.onrender.com";

const client = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
