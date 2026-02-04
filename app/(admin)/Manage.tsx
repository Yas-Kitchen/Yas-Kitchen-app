import WeeklyMeals from "@/components/Admin/Manage/WeeklyMeals";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Specials from "../../components/Admin/Manage/Specials";
import Addons from "../../components/Admin/Manage/Add-ons";
import DietPlan from "@/components/Admin/Manage/DietPlan";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const Manage = () => {
  const [active, setActive] = useState("weeklymeals");
  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
      <View style={{ paddingTop: insets.top + 20 }} className="font-poppins mx-5">
        <Text className="font-poppins-semibold text-[16px] text-faded_black">
          Manage
        </Text>
        <View className="font-poppins flex-row justify-center gap-2 my-5">
          <TouchableOpacity onPress={() => setActive("weeklymeals")}>
            <Text
              className={`${active === "weeklymeals"
                ? "text-primary bg-primary/10 font-poppins-medium"
                : "text-base_color"
                } text-xs p-3 rounded-xl w-32 text-center`}
            >
              Weekly Meals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("specials")}>
            <Text
              className={`${active === "specials"
                ? "text-primary bg-primary/10 font-poppins-medium"
                : "text-base_color"
                } text-xs p-3 rounded-xl text-center`}
            >
              Specials
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("addons")}>
            <Text
              className={`${active === "addons"
                ? "text-primary bg-primary/10 font-poppins-medium"
                : "text-base_color"
                } text-xs p-3 rounded-xl text-center`}
            >
              Add-ons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive("dietplan")}>
            <Text
              className={`${active === "dietplan"
                ? "text-primary bg-primary/10 font-poppins-medium"
                : "text-base_color"
                } text-xs p-3 rounded-xl text-center`}
            >
              Diet Plan
            </Text>
          </TouchableOpacity>
        </View>
        {active === "weeklymeals" ? (
          <WeeklyMeals />
        ) : active === "specials" ? (
          <Specials />
        ) : active === "addons" ? (
          <Addons />
        ) : (
          <DietPlan />
        )}
      </View>
    </ScrollView>
  );
};

export default Manage;
