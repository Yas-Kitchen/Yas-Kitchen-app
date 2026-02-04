import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import MealPercentage from "./MealPercentage";
import MostOrders from "./MostOrders";
import QuickSettings from "./QuickSettings";
import { useDashboardApi } from "@/hooks/useDashboardApi";
import Skeleton from "@/components/common/Skeleton";

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
      <View className="font-poppins flex-row flex-wrap gap-3 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            className="font-poppins flex-col gap-5 bg-white w-[45%] p-5 rounded-2xl"
          >
            <View className="font-poppins flex-row items-center gap-3">
              <Skeleton width={36} height={36} borderRadius={18} />
              <Skeleton width={60} height={14} />
            </View>
            <Skeleton width={80} height={24} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <>
      <View className="font-poppins flex-row flex-wrap gap-3 justify-center">
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
