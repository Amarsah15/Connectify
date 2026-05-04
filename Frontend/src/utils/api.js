import axios from "axios";

// For development environment baseURL: "http://localhost:8000/api/v1",

export const axiosInstance = axios.create({
  baseURL: "https://connectify-wjv8.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
