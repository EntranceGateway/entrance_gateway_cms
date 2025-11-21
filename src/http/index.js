import axios from "axios";

const API = axios.create({
  baseURL: "http://185.177.116.173:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
