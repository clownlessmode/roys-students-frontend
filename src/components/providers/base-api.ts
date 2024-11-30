import axios from "axios";

const baseApi = axios.create({
  baseURL: "https://r6nt2plp-3000.asse.devtunnels.ms/api",
});

baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export { baseApi };
