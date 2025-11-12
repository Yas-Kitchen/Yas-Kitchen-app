import { mealsAPI } from "@/services/api/meals.api";

let cachedCuisines: any[] | null = null;

export const getCuisineNameByID = async (cuisineId: string): Promise<string> => {
  try {
    if (!cachedCuisines) {
      cachedCuisines = await mealsAPI.getCuisineDetails();
    }

    const match = cachedCuisines!.find((item) => item.id === cuisineId);
    return match?.name || "Unknown";
  } catch (error) {
    console.error("Failed to get cuisine name:", error);
    return "Unknown";
  }
};