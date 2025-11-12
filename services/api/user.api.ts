import api from "../api";

export const userAPI = {
  getAllUser: async () => {
    const response = await api.get("admin/users/");
    return response.data;
  },
  getUserProfile: async () => {
    const response = await api.get("users/profile");
    return response.data;
  },
  updateUserProfile: async (payload: any) => {
    const response = await api.put("users/profile", payload);
    return response.data;
  },
  deactivateUserProfile: async (userId: string) => {
    const response = await api.put(`admin/users/${userId}/deactivate`);
    return response.data;
  },
  activateUserProfile: async (userId: string) => {
    const response = await api.put(`admin/users/${userId}/activate`);
    return response.data;
  },
  updateUserCategories: async (userId: string) => {
    const response = await api.put(`admin/users/${userId}/categories`);
    return response.data;
  },
  deleteUserProfile: async (userId: string) => {
    const response = await api.delete(`admin/users/${userId}`);
    return response.data;
  },
};
