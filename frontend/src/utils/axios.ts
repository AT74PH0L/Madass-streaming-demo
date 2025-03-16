import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
// import { useState } from "react";

const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
// const REFRESH_ENDPOINT = "https://localhost:3000/auth/refresh";
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ส่ง cookies หรือข้อมูลที่จำเป็นไปด้วย
});

const refreshToken = async (): Promise<void> => {
  try {
    console.log("AAA");
    console.log(await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true }));
    
  } catch (error) {
    console.error("Refresh Token Failed:", error);
  }
};

// Interceptor สำหรับ Response เพื่อดักจับ Error 401
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response, // ถ้าไม่มีข้อผิดพลาดก็ส่งคืนข้อมูลไป
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // ถ้าเกิด Error 401 และไม่เคยลอง Refresh Token มาก่อน
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("HELLO API");
      await refreshToken(); // รีเฟรช token
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error); // ส่ง error กลับหากไม่ใช่กรณี 401
  }
);

export default axiosInstance;
