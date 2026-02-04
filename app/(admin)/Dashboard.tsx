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
import { Feather } from "@expo/vector-icons";
import Skeleton from "@/components/common/Skeleton";
import { router } from "expo-router";
import { storage } from "@/services/storage";
import { authAPI } from "@/services/api/auth.api";
import { useAlert } from "@/context/AlertContext";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const Dashboard = () => {
  const { showAlert } = useAlert();
  const { getDashboardStats, data, loading, error } = useDashboardApi();
  const [active, setActive] = useState("orders");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [monthStart, setMonthStart] = useState("");
  const [monthEnd, setMonthEnd] = useState("");
  const insets = useSafeAreaInsets();

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

  const handleLogout = async () => {
    showAlert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await storage.clearAll();
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <ScrollView>
      <View style={{ paddingTop: insets.top + 18 }} className="font-poppins mx-5">
        <Text className="font-poppins-semibold text-[16px] text-faded_black">
          Dashboard
        </Text>
        <View className="font-poppins flex-row justify-center gap-2 m-5">
          <TouchableOpacity onPress={() => setActive("orders")}>
            <Text
              className={`${active === "orders"
                ? "text-primary bg-primary/10 font-poppins-medium"
                : "text-base_color"
                } text-[10px] p-3 rounded-xl w-24 text-center`}
            >
              Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("today")}>
            <Text
              className={`${active === "today"
                ? "text-primary bg-primary/10 font-poppins-medium"
                : "text-base_color"
                } text-[10px] p-3 rounded-xl w-24 text-center`}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("thisweek")}>
            <Text
              className={`${active === "thisweek"
                ? "text-primary bg-primary/10 font-poppins-medium"
                : "text-base_color"
                } text-[10px] p-3 rounded-xl w-18 text-center`}
            >
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("thismonth")}>
            <Text
              className={`${active === "thismonth"
                ? "text-primary bg-primary/10 font-poppins-medium"
                : "text-base_color"
                } text-[10px] p-3 rounded-xl text-center w-18`}
            >
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        <View className="font-poppins min-h-[300px]">
          {loading ? (
            <View className="font-poppins gap-5">
              {/* Stats Skeleton */}
              <View className="font-poppins flex-row justify-evenly">
                <View className="font-poppins bg-white w-[45%] p-5 rounded-2xl gap-3">
                  <View className="font-poppins flex-row items-center gap-3">
                    <Skeleton width={30} height={30} borderRadius={15} />
                    <Skeleton width={80} height={14} />
                  </View>
                  <Skeleton width={60} height={24} />
                </View>
                <View className="font-poppins bg-white w-[45%] p-5 rounded-2xl gap-3">
                  <View className="font-poppins flex-row items-center gap-3">
                    <Skeleton width={30} height={30} borderRadius={15} />
                    <Skeleton width={80} height={14} />
                  </View>
                  <Skeleton width={60} height={24} />
                </View>
              </View>

              {/* Chart/List Skeleton */}
              <View className="font-poppins bg-white p-5 rounded-2xl gap-4">
                <Skeleton width="40%" height={18} />
                <Skeleton width="100%" height={40} />
                <Skeleton width="100%" height={40} />
                <Skeleton width="100%" height={40} />
              </View>
            </View>
          ) : active === "orders" ? (
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
      <View style={{ height: insets.bottom + 100 }} />
    </ScrollView>
  );
};

export default Dashboard;
