import axios from "axios";

const API = axios.create({
  baseURL: "api.entrancegateway.com",
  // Do NOT set Content-Type here globally
});

export default API;
