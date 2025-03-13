import axiosInstance from "../utils/axios";

export const authenApi = async () => {
  try {
    const response = await axiosInstance.get("/auth/authorization");
    return response.data;
  } catch (error) {
    return error;
  }
};
