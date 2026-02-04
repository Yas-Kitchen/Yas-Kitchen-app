import Constants from "expo-constants";

const API_CONFIG = {
  BASE_URL:
    Constants.expoConfig?.extra?.apiUrl ||
    process.env.EXPO_PUBLIC_API_URL ||
    "http://192.168.0.127:8000/api/v1/",
  TIMEOUT: 10000,
};

export default API_CONFIG;
