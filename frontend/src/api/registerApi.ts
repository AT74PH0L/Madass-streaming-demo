import { AxiosResponse } from "axios";
import axiosInstance from "../utils/axios";

export const registerApi = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  try {
    const response: AxiosResponse = await axiosInstance.post("/auth/register", {
      email,
      firstName,
      lastName,
      password,
      role: "user",
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    return error;
  }
};
