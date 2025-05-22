import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

api.defaults.withCredentials = true;

export default api;

