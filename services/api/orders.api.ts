import api from "../api";

export interface OrderCreate {
  order_date: string;
  today_special_id?: string;
  addon_ids: string[];
  total_amount: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_date: string;
  status: "placed" | "confirmed" | "delivered" | "cancelled";
  total_amount: number;
  created_at: string;
  users?: {
    name: string;
    phone_number: string;
    profile_image_url?: string;
  };
  items?: {
    name: string;
    category: string;
    price: number;
  }[];
}

export const orderAPI = {
  createOrder: async (data: OrderCreate) => {
    const response = await api.post("/orders/", data);
    return response.data;
  },

  getPendingOrders: async () => {
    const response = await api.get("/orders/pending");
    return response.data;
  },

  getTodayOrders: async () => {
    const response = await api.get("/orders/today");
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.patch(
      `/orders/${orderId}/status?status=${status}`
    );
    return response.data;
  },
};
