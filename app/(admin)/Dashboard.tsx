import ThisMonth from "@/components/Admin/Dashboard/ThisMonth";
import Today from "@/components/Admin/Dashboard/Today";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ThisWeek from "../../components/Admin/Dashboard/ThisWeek";
import Orders from "@/components/Admin/Dashboard/Orders";

const Dashboard = () => {
  const [active, setActive] = useState("orders");
  return (
    <ScrollView>
      <View className="mt-16 mx-5">
        <Text className="font-semibold text-[16px] text-faded_black">
          Dashboard
        </Text>
        <View className="flex-row justify-center gap-2 my-5">
          <TouchableOpacity onPress={() => setActive("orders")}>
            <Text
              className={`${
                active === "orders"
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-base_color"
              } text-[14px] p-3 rounded-xl w-24 text-center`}
            >
              Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("today")}>
            <Text
              className={`${
                active === "today"
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-base_color"
              } text-[14px] p-3 rounded-xl w-24 text-center`}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("thisweek")}>
            <Text
              className={`${
                active === "thisweek"
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-base_color"
              } text-[14px] p-3 rounded-xl w-28 text-center`}
            >
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("thismonth")}>
            <Text
              className={`${
                active === "thismonth"
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-base_color"
              } text-[14px] p-3 rounded-xl text-center w-28`}
            >
              This Month
            </Text>
          </TouchableOpacity>
        </View>
        {active === "orders" ? (
          <Orders />
        ) : active === "today" ? (
          <Today />
        ) : active === "thisweek" ? (
          <ThisWeek />
        ) : (
          <ThisMonth />
        )}
      </View>
      <View className="h-36" />
    </ScrollView>
  );
};

export default Dashboard;
