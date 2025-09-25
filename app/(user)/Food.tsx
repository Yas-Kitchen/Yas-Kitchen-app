import FoodSectionWeeklyPlan from "@/components/User/Food/FoodSectionWeeklyPlan";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Food = () => {
  const [tab, setTab] = useState("weekly");
  return (
    <ScrollView>
      <View className="mt-16 mx-5 gap-3">
        <View className="flex-row gap-2 items-center">
          <TouchableOpacity onPress={() => router.push("/(user)")}>
            <Feather name="chevron-left" size={20} color={"#212529"} />
          </TouchableOpacity>
          <Text className="text-[#212529] font-semibold text-[16px]">
            Food Section
          </Text>
        </View>
        <View className="flex-row gap-5 items-center justify-center">
          <TouchableOpacity
            onPress={() => setTab("weekly")}
            className={`${
              tab === "weekly" ? "bg-primary/10" : " bg-base_color/10"
            } w-[40%] p-4 rounded-xl`}
          >
            <Text
              className={`text-center ${
                tab === "weekly" ? "text-primary " : "text-base_color"
              } `}
            >
              Weekly Plan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("special")}
            className={`w-[40%] ${
              tab === "special" ? "bg-primary/10" : "bg-base_color/10"
            }  p-4 rounded-xl`}
          >
            <Text
              className={`${
                tab === "special" ? "text-primary" : "text-base_color"
              } text-center`}
            >
              Today&apos;s Specials
            </Text>
          </TouchableOpacity>
        </View>
        {tab === "weekly" ? <FoodSectionWeeklyPlan /> : ""}
      </View>
    </ScrollView>
  );
};

export default Food;
