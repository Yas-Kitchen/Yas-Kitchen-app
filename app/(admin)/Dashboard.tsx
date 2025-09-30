import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Dashboard = () => {
  const [active, setActive] = useState("today");
  return (
    <View className="ios:mt-16 mt-5 mx-5 gap-10">
      <View className="flex-row gap-4">
        <Feather name="chevron-left" color={"#212529"} size={18} />
        <Text className="font-semibold text-[16px] text-faded_black">
          Dashboard
        </Text>
      </View>
      <View className="flex-row justify-center gap-2">
        <TouchableOpacity onPress={() => setActive("today")}>
          <Text
            className={`${
              active === "today"
                ? "text-primary bg-primary/10 font-medium"
                : "text-base_color bg-base_color/10"
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
                : "text-base_color bg-base_color/10"
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
                : "text-base_color bg-base_color/10"
            } text-[14px] p-3 rounded-xl text-center w-28`}
          >
            This Month
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;
