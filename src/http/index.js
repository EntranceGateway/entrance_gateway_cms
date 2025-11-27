import axios from "axios";

const API = axios.create({
  baseURL: "http://185.177.116.173:8080",
  // Do NOT set Content-Type here globally
});

export default API;
