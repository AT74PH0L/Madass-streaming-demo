import axiosInstance from "../utils/axios";

export const logout = async () => {
  try {
    const response = await axiosInstance.get("/auth/logout");
    return response.data;
  } catch (error) {
    return error;
  }
};
