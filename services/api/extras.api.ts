import {
  AddonCreate,
  AddonUpdate,
  TodaySpecialCreate,
  TodaySpecialUpdate,
} from "@/types/extras.types";
import api from "../api";

//Specials
export const extrasAPI = {
  getTodaySpecials: async () => {
    const response = await api.get("today-specials/today");
    return response.data;
  },
  getUpcomingSpecials: async () => {
    const response = await api.get("today-specials/upcoming");
    return response.data;
  },
  getSpecialsByDate: async (targetDate: string) => {
    const response = await api.get(`today-specials/date/${targetDate}`);
    return response.data;
  },
  createSpecial: async (data: TodaySpecialCreate) => {
    const response = await api.post("admin/today-specials/", data);
    return response.data;
  },
  getSpecialById: async (specialID: string) => {
    const response = await api.get(`admin/today-specials/${specialID}`);
    return response.data;
  },
  updateSpecial: async (specialID: string, data: TodaySpecialUpdate) => {
    const response = await api.put(`admin/today-specials/${specialID}`, data);
    return response.data;
  },
  deleteSpecial: async (specialId: string): Promise<void> => {
    const response = await api.delete(`admin/today-specials/${specialId}`);
    return response.data;
  },

  //Addons
  getAllAddons: async () => {
    const response = await api.get("addons/");
    return response.data;
  },
  getAddonsForKids: async () => {
    const response = await api.get("addons/kids-meals");
    return response.data;
  },
  createAddons: async (data: AddonCreate) => {
    const response = await api.post("admin/addons/", data);
    return response.data;
  },
  updateAddon: async (AddonID: string, data: AddonUpdate) => {
    const response = await api.put(`admin/addons/${AddonID}`, data);
    return response.data;
  },
  getAddonById: async (AddonID: string) => {
    const response = await api.get(`admin/addons/${AddonID}`);
    return response.data;
  },
  deleteAddon: async (addonId: string): Promise<void> => {
    const response = await api.delete(`admin/addons/${addonId}`);
    return response.data;
  }
};
