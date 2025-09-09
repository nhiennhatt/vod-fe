import axios from "axios";
import env from "./env";

const unauthorizedRequest = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const authorizedRequest = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authorizedRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    return Promise.reject(new Error("Unauthorized"));
  }
  return config;
});

let isRefreshing = false;
let failedRequests: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedRequests.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedRequests = [];
};

authorizedRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.errorCode === "EXPIRED_TOKEN" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return authorizedRequest(originalRequest);
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        console.log("refreshToken");
        if (!localStorage.getItem("refreshToken")) return Promise.reject(error);

        const res = await unauthorizedRequest.post<{
          accessToken: string;
          refreshToken: string;
        }>("/token/refresh", {
          token: localStorage.getItem("refreshToken"),
        });

        const { accessToken, refreshToken } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        authorizedRequest.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
      } catch (error) {
        processQueue(error as Error);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
      return authorizedRequest(originalRequest);
    }

    return Promise.reject(error);
  }
);

export { unauthorizedRequest, authorizedRequest };
