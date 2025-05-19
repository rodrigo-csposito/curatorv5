import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? `${window.location.protocol}//${window.location.host}`
      : "http://localhost:5000",
});

api.defaults.timeout = 600000;

export default api;
