import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 → silently refresh, then retry the original request
axiosInstance.interceptors.request.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await axiosInstance.post("auth/refresh");
        const newToken = res.data.data.access_token;

        sessionStorage.setItem("access_token", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(original); // retry original request
      } catch {
        sessionStorage.removeItem("access_token");

        window.location.href = "/login"; // force logout
      }
    }
    return Promise.reject(error);
  },
);
