import api from "../api";

export const registerAPI = {
  startOnboarding: async () => {
    const response = await api.post(`onboarding/start`);
    return response.data;
  },
  getCuisineDetails: async () => {
    const response = await api.get(`cuisine-types/`);
    return response.data;
  },
  selectCuisine: async (cuisineId: string) => {
    const response = await api.post(`onboarding/cuisine-selection`, {
      cuisine_type_id: cuisineId,
    });
    return response.data;
  },
  profileCompletion: async (name: string, address: string) => {
    const response = await api.post(`onboarding/profile-completion`, {
      name: name,
      address: address,
    });
    return response.data;
  },
  getPlanDetails: async () => {
    const response = await api.get("onboarding/available-plans");
    return response.data;
  },
  selectPlan: async (planId: string) => {
    const response = await api.post(`onboarding/plan-selection`, {
      meal_plan_id: planId,
    });
    return response.data;
  },
  confirmPrice: async () => {
    const response = await api.post(`onboarding/confirm-price`);
    return response.data;
  },
};
