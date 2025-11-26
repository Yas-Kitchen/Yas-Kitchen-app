import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PROFILE: "user_profile",
};

export const storage = {
  setToken: async (accessToken: string, refreshToken?: string) => {
    try {
      const items: [string, string][] = [[KEYS.ACCESS_TOKEN, accessToken]];
      if (refreshToken) items.push([KEYS.REFRESH_TOKEN, refreshToken]);
      await AsyncStorage.multiSet(items);
    } catch (error) {
      console.error("Error saving tokens : ", error);
      throw error;
    }
  },

  getTokens: async () => {
    const values = await AsyncStorage.multiGet([
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
    ]);
    return {
      accessToken: values[0][1] || null,
      refreshToken: values[1][1] || null,
    };
  },

  getRefreshToken: async () => {
    return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
  },

  clearTokens: async () => {
    await AsyncStorage.multiRemove([KEYS.ACCESS_TOKEN, KEYS.REFRESH_TOKEN]);
  },

  // User profile management
  setUserProfile: async (profile: any) => {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getUserProfile: async () => {
    const profile = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  },

  clearUserProfile: async () => {
    await AsyncStorage.removeItem(KEYS.USER_PROFILE);
  },

  // Clear all storage
  clearAll: async () => {
    await AsyncStorage.multiRemove([
      KEYS.ACCESS_TOKEN,
      KEYS.REFRESH_TOKEN,
      KEYS.USER_PROFILE,
    ]);
  },
};
