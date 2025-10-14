import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PROFILE: 'user_profile',
};

export const storage = {
  // Token management
  setToken: async (accessToken: string, refreshToken: string) => {
    await AsyncStorage.multiSet([
      [KEYS.ACCESS_TOKEN, accessToken],
      [KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  },

  getToken: async () => {
    return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
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
