import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MonthlyPlan from "./MonthlyPlan";
const Plan = () => {
  const { setActiveStep } = useGlobalContext();
  return (
    <View className="bg-white rounded-2xl mt-10 p-5 pt-8">
      <Text className="text-base text-[12px]">Choose your monthly plan</Text>
      <MonthlyPlan />
      <View className="flex-row gap-3 mr-3">
        <TouchableOpacity
          onPress={() => {
            setActiveStep(1);
          }}
          className="bg-base_color/10 mt-5 p-5 w-1/2 rounded-2xl"
        >
          <Text className="text-center text-black">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveStep(3);
          }}
          className="bg-primary mt-5 w-1/2 p-5 rounded-2xl"
        >
          <Text className="text-center text-white">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Plan;
