import { dashBoardAPI } from "@/services/api/dashboard.api";
import { DashboardData, DashboardStats } from "@/types/dashboard.types";
import { useState, useCallback } from "react";
export const useDashboardApi = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  const getDashboardStats = useCallback(
    async ({
      today,
      weekStart,
      weekEnd,
      monthStart,
      monthEnd,
    }: DashboardStats) => {
      setLoading(true);
      setError(null);
      try {
        const response = await dashBoardAPI.getDashBoardStats({
          today,
          weekStart,
          weekEnd,
          monthStart,
          monthEnd,
        });
        setData(response);
      } catch (err: any) {
        setError(err.message || err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  return {
    getDashboardStats,
    data,
    loading,
    error,
  };
};
