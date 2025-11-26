import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import MealPercentage from "./MealPercentage";
import MostOrders from "./MostOrders";
import QuickSettings from "./QuickSettings";
import { useDashboardApi } from "@/hooks/useDashboardApi";

const Summary = () => {
  const { getDashboardStats, data, loading } = useDashboardApi();

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;

    getDashboardStats({
      today: todayDate,
    });
  }, []);

  if (loading && !data) {
    return (
      <View className="h-64 justify-center items-center">
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <>
      <View className="flex-row flex-wrap gap-3 justify-center">
        <QuickSettings
          header={"Active Users"}
          icon={"users"}
          number={data?.today?.active_users || 0}
        />
        <QuickSettings
          header={"Today's specials"}
          icon={"coffee"}
          number={data?.today?.special_orders_count || 0}
        />
        <QuickSettings
          header={"Total Revenue"}
          icon={"dollar-sign"}
          number={`${data?.today?.revenue || 0} AED`}
        />
        <QuickSettings
          header={"Add-on Orders"}
          icon={"list"}
          number={data?.today?.addon_count || 0}
        />
      </View>
      <MealPercentage data={data?.today?.plan_distribution} />
      <MostOrders items={data?.today?.popular_items} />
    </>
  );
};

export default Summary;
