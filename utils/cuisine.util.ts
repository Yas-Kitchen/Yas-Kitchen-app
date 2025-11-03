import { mealsAPI } from "@/services/api/meals.api";

export const getCuisineNameByID = async (
  cuisineId: string
): Promise<string> => {
  try {
    const cuisines = await mealsAPI.getCuisineDetails();
    const match = cuisines?.find((item: { id: string }) => item.id === cuisineId);
    return match?.name || "Unknown";
  } catch {
    return "Unknown";
  }
};
