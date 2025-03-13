export const authenApiGoogle = async () => {
  const API_URL = import.meta.env.VITE_PUBLIC_API_URL;
  
  const backendUrl = `${API_URL}/auth/google`; 

  const response = window.location.href = backendUrl; 

  return response;
};


// import axiosInstance from "../utils/axios";

// export const authenApiGoogle = async () => {
//   try {
//     const response = await axiosInstance.get("/auth/google");
//     return response.data;
//   } catch (error) {
//     return error;
//   }
// };
