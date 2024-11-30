import axios from "axios";

const baseApi = axios.create({
  baseURL: "http://213.176.66.87:3000/api",
});

baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export { baseApi };
