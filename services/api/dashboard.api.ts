import { DashboardStats } from "@/types/dashboard.types";
import api from "../api";

export const dashBoardAPI = {
  getDashBoardStats: ({
    today,
    weekStart = "",
    weekEnd = "",
    monthStart = "",
    monthEnd = "",
  }: DashboardStats) => {
    return api.get("dashboard/stats", {
      params: {
        date: today,
        week_start: weekStart,
        week_end: weekEnd,
        month_start: monthStart,
        month_end: monthEnd,
      },
    });
  },
};
