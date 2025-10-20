import WeeklyMeals from "@/components/Admin/Manage/WeeklyMeals";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Specials from "../../components/Admin/Manage/Specials";
import Addons from "../../components/Admin/Manage/Add-ons";

const Manage = () => {
  const [active, setActive] = useState("weeklymeals");

  return (
    <ScrollView>
      <View className="mt-16 mx-5">
        <Text className="font-semibold text-[16px] text-faded_black">
          Manage
        </Text>
        <View className="flex-row justify-center gap-2 my-5">
          <TouchableOpacity onPress={() => setActive("weeklymeals")}>
            <Text
              className={`${
                active === "weeklymeals"
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-base_color"
              } text-[14px] p-3 rounded-xl w-32 text-center`}
            >
              Weekly Meals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("specials")}>
            <Text
              className={`${
                active === "specials"
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-base_color"
              } text-[14px] p-3 rounded-xl w-28 text-center`}
            >
              Specials
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("addons")}>
            <Text
              className={`${
                active === "addons"
                  ? "text-primary bg-primary/10 font-medium"
                  : "text-base_color"
              } text-[14px] p-3 rounded-xl text-center w-28`}
            >
              Add-ons
            </Text>
          </TouchableOpacity>
        </View>
        {active === "weeklymeals" ? <WeeklyMeals/> : active === "specials" ? <Specials/> : <Addons/>}
      </View>
      <View className="h-36"/>
    </ScrollView>
  );
};

export default Manage;
