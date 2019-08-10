import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000
});
