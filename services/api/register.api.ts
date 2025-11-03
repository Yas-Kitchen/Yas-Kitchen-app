import api from "../api";

export const registerAPI = {
  startOnboarding: async () => {
    const response = await api.post(`onboarding/start`);
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

  selectPlan: async (planIds: string | string[]) => {
    const selectedPlans = Array.isArray(planIds)
      ? planIds.map((p) => p.toLowerCase())
      : [planIds.toLowerCase()];

    const response = await api.post(`onboarding/plan-selection`, {
      selected_plans: selectedPlans,
    });

    return response.data;
  },
  
  confirmPrice: async () => {
    const response = await api.post(`onboarding/confirm-pricing`, {
      confirmed: true,
    });
    return response.data;
  },

  getOnboardingUserData: async () => {
    const response = await api.get(`onboarding/user-data`);
    return response.data;
  },

  updateProfile: async (name: string, address: string) => {
    const response = await api.put(`users/profile`, {
      name,
      address,
    });
    return response.data;
  },

  getOnboardingSession: async () => {
    const response = await api.get(`onboarding/session`);
    return response.data;
  },
};
