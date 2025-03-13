import axiosInstance from "../utils/axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    console.log(response)
    return response.data;
  } catch (error) {
    return error;
  }
};
