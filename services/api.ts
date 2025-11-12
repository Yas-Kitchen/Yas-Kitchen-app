import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_CONFIG from "../config/api.config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

     if (error.response?.status === 422) {
      const validationErrors: any[] = (error.response.data as any).detail || [];
      
      console.error("❌ Validation Error (422):");
      validationErrors.forEach((err) => {
        const fieldPath = err.loc.join(".");
        console.error(`   Field: ${fieldPath}`);
        console.error(`   Message: ${err.msg}`);
        console.error(`   Input: ${JSON.stringify(err.input)}`);
      });
      
      return Promise.reject(error);
    }

    if (__DEV__ && (error.response?.status === 404 || (error.response?.data as any)?.code === "ONBOARDING_004")) {
      console.debug("Expected onboarding error:", error.response?.data || error.message);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = await AsyncStorage.getItem("refresh_token");

      if (!refreshToken) {
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${API_CONFIG.BASE_URL}/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access_token;
        await AsyncStorage.setItem("access_token", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");

        try {
          await api.post("/auth/logout");
        } catch (logoutError) {
          console.error("Logout error:", logoutError);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
