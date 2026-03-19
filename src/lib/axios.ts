import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Define the shape of your Django error responses
interface DjangoErrorResponse {
  message?: string;
  error?: string;
}

// Extend the config type to include the _retry flag
interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

//Every time your app makes a request, this runs first and injects the access token into the header. Django's auth middleware then reads that header to identify the user.
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<DjangoErrorResponse>) => {
    const original = error.config as RetryAxiosRequestConfig;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axiosInstance.post("auth/refresh/");
        const newToken = res.data.data.access_token;
        sessionStorage.setItem("access_token", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch {
        sessionStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    const serverMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;
    //Without this, `error.message` in your hooks would always be `"Request failed with status code 400"`. This digs into the actual Django response body and surfaces the real message like `"Invalid password"`.

    return Promise.reject(new Error(serverMessage));
  },
);
