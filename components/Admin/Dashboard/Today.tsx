import { Text, View } from "react-native";
import QuickSettings from "../Home/QuickSettings";
import PlanPercentage from "./PlanPercentage";
import TopAddons from "./TopAddons";
import TotalRevenue from "./TotalRevenue";
import { DashboardData } from "@/types/dashboard.types";

const Today = ({ data }: { data: DashboardData | null }) => {
  return (
    <View className="font-poppins gap-5">
      <View className="font-poppins flex-row justify-evenly">
        <QuickSettings
          header="Active Users"
          icon="users"
          number={data?.today?.active_users || 0}
        />
        <QuickSettings
          header="Special Orders"
          icon="list"
          number={data?.today?.special_orders_count || 0}
        />
      </View>
      <TotalRevenue
        total={data?.today?.revenue || "0"}
        reg_total={data?.today?.regular_revenue || "0"}
        add_total={data?.today?.addon_revenue || "0"}
        label="Special Orders"
      />
      <View className="font-poppins bg-white rounded-2xl p-5 gap-3">
        <Text className="font-poppins text-[16px]">Top Add-on items</Text>
        {data?.today?.popular_items && data.today.popular_items.length > 0 ? (
          data.today.popular_items.map((item: any, index: number) => (
            <TopAddons
              key={index}
              productName={item.product_name}
              orders={item.orders}
            />
          ))
        ) : (
          <Text className="font-poppins text-gray-500 text-center">No popular items</Text>
        )}
      </View>
    </View>
  );
};

export default Today;
