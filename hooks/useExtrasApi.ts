import { extrasAPI } from "@/services/api/extras.api";
import { mealsAPI } from "@/services/api/meals.api";
import {
  Addon,
  AddonCreate,
  AddonUpdate,
  TodaySpecial,
  TodaySpecialCreate,
  TodaySpecialUpdate,
} from "@/types/extras.types";
import { useState } from "react";
import { Alert } from "react-native";

export const useExtrasApi = () => {
  const [specials, setSpecials] = useState<TodaySpecial[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodaySpecials = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await extrasAPI.getTodaySpecials();
      setSpecials(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("failed to fetch specials", err);
      setError(err?.message || "Failed to fetch today's specials");
      setSpecials([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingSpecials = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await extrasAPI.getUpcomingSpecials();
      setSpecials(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("failed to fetch upcoming specials");
      setError(err?.message || "failed to fetch upcoming specials");
      setSpecials([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialsByDate = async (targetDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await extrasAPI.getSpecialsByDate(targetDate);
      setSpecials(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch special`s with date", err);
      setError(err?.message || "Failed to fetch special's with date");
      setSpecials([]);
    } finally {
      setLoading(false);
    }
  };

  const createSpecial = async (
    specialData: TodaySpecialCreate,
    imageUri?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = specialData.image_url;

      if (imageUri && !imageUri.startsWith("http")) {
        imageUrl = await mealsAPI.uploadMealImage(imageUri);
      }

      const payload = {
        ...specialData,
        ...(imageUrl && { image_url: imageUrl }),
      };

      await extrasAPI.createSpecial(payload);
      Alert.alert("Success", "Special added successfully");
      await fetchTodaySpecials();
      return true;
    } catch (err: any) {
      console.error("special creation error", err);
      setError(err?.message || "special creation error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialsById = async (specialId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await extrasAPI.getSpecialById(specialId);
      setSpecials(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch special's by id : ", err);
      setError(err.message || "Failed to fetch special's by id");
    } finally {
      setLoading(false);
    }
  };

  const updateSpecials = async (
    specialID: string,
    imageBase64: string,
    specialData: TodaySpecialUpdate
  ) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = specialData.image_url;

      if (imageBase64 && !imageBase64.startsWith("http")) {
        imageUrl = await mealsAPI.uploadMealImage(imageBase64);
      }

      const payload = {
        ...specialData,
        ...(imageUrl && { image_url: imageUrl }),
      };
      await extrasAPI.updateSpecial(specialID, payload);
      Alert.alert("Success", "Special has been updated successfully");
    } catch (err: any) {
      console.error("Failed to update specials", err);
      setError(err?.message || "Failed to update specials");
    } finally {
      setLoading(false);
    }
  };

  const deleteSpecials = async (specialId: string) => {
    setLoading(true);
    setError(null);
    try {
      await extrasAPI.deleteSpecial(specialId);
      Alert.alert("Success", "Special has been deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete special", err);
      setError(err?.message || "Failed to delete special");
    } finally {
      setLoading(false);
    }
  };

  //Addons

  const fetchAddons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await extrasAPI.getAllAddons();
      const formatted = Array.isArray(data) ? data : [];
      setAddons(formatted);
      return formatted;
    } catch (err: any) {
      console.error("Failed to fetch addons", err);
      setError(err?.message || "Failed to fetch addons");
      setAddons([]);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const fetchAddonsForKids = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await extrasAPI.getAddonsForKids();
      setAddons(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("failed to fetch addons for kids", err);
      setError(err?.message || "failed to fetch addons for kids");
    } finally {
      setLoading(false);
    }
  };

  const createAddons = async (addonData: AddonCreate, imageUri?: string) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = addonData.image_url;
      if (imageUri && !imageUri.startsWith("http")) {
        imageUrl = await mealsAPI.uploadMealImage(imageUri);
      }

      const payload = {
        ...addonData,
        ...(imageUrl && { image_url: imageUrl }),
      };

      await extrasAPI.createAddons(payload);
      await fetchAddons();
      return true;
    } catch (err: any) {
      console.error("Failed to create addon with error :", err);
      setError(err?.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAddons = async (
    addonId: string,
    addonData: AddonUpdate,
    imageUri?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      let imageUrl = addonData.image_url;

      if (imageUri && !imageUri.startsWith("http")) {
        imageUrl = await mealsAPI.uploadMealImage(imageUri);
      }
      const payload = {
        ...addonData,
        ...(imageUrl && { image_url: imageUrl }),
      };
      await extrasAPI.updateAddon(addonId, payload);
      await fetchAddons();
      return true;
    } catch (err: any) {
      console.error("Failed to update addon", err);
      setError(err?.message || "Failed to update addon");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddon = async (addonId: string) => {
    setLoading(true);
    setError(null);
    try {
      await extrasAPI.deleteAddon(addonId);
      Alert.alert("Success", "Successfully deleted the addon");
      await fetchAddons();
      return true;
    } catch (err: any) {
      console.error("Failed to delete addon with error :", err);
      setError(err?.message || "failed to delete addon");
      Alert.alert("Error", err?.message || "Failed to delete addon");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    specials,
    addons,
    loading,
    error,

    // Today's Specials
    fetchTodaySpecials,
    fetchUpcomingSpecials,
    fetchSpecialsByDate,
    createSpecial,
    updateSpecials,
    deleteSpecials,
    fetchSpecialsById,

    // Addons
    fetchAddons,
    fetchAddonsForKids,
    createAddons,
    updateAddons,
    deleteAddon,
  };
};
