import ThisMonth from "@/components/Admin/Dashboard/ThisMonth";
import Today from "@/components/Admin/Dashboard/Today";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ThisWeek from "../../components/Admin/Dashboard/ThisWeek";
import Orders from "@/components/Admin/Dashboard/Orders";
import { useDashboardApi } from "@/hooks/useDashboardApi";

const Dashboard = () => {
  const { getDashboardStats, data, loading, error } = useDashboardApi();
  const [active, setActive] = useState("orders");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [monthStart, setMonthStart] = useState("");
  const [monthEnd, setMonthEnd] = useState("");

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;

    getDashboardStats({
      today: todayDate,
      weekStart: weekStart,
      weekEnd: weekEnd,
      monthStart: monthStart,
      monthEnd: monthEnd,
    });
  }, [weekStart, weekEnd, monthStart, monthEnd]);

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
        <View className="min-h-[300px]">
          {loading && (
            <View className="absolute inset-0 z-50 justify-center items-center bg-white/50 w-full h-full">
              <ActivityIndicator size="large" color="#F97316" />
            </View>
          )}
          {active === "orders" ? (
            <Orders />
          ) : active === "today" ? (
            <Today data={data} />
          ) : active === "thisweek" ? (
            <ThisWeek data={data} setStart={setWeekStart} setEnd={setWeekEnd} />
          ) : (
            <ThisMonth
              data={data}
              setStart={setMonthStart}
              setEnd={setMonthEnd}
            />
          )}
        </View>
      </View>
      <View className="h-36" />
    </ScrollView>
  );
};

export default Dashboard;
