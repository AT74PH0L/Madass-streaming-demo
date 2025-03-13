// lib/axiosInstance.js
import axios from "axios";

const API_URL = import.meta.env.VITE_PUBLIC_API_URL;

const axiosInstant = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default axiosInstant;
