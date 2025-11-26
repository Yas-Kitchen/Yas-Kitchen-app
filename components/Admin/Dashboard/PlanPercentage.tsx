import React from "react";
import { Text, View } from "react-native";

type PlanTypes = {
  northPercentage: number;
  southPercentage: number;
  diet: number;
};

const PlanPercentage = ({
  northPercentage,
  southPercentage,
  diet,
}: PlanTypes) => {
  return (
    <View className="bg-white rounded-2xl p-5 gap-2">
      <Text className="text-[16px] font-semibold">Plan Distribution</Text>
      <View className="flex-row justify-between">
        <Text className="text-[12px] text-base_color">Regular</Text>
        <Text className="text-[12px] text-base_color">
          {" "}
          ({northPercentage}%)
        </Text>
      </View>
      <View className="w-full bg-base_color/10 h-5 rounded-2xl relative">
        <View
          className="bg-primary absolute rounded-2xl h-5"
          style={{ width: `${northPercentage}%` }}
        />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-[12px] text-base_color">Diet</Text>
        <Text className="text-[12px] text-base_color">
          ({southPercentage}%)
        </Text>
      </View>
      <View className="w-full bg-base_color/10 h-5 overflow-hidden rounded-2xl relative">
        <View
          className="bg-yellow absolute rounded-2xl h-5"
          style={{ width: `${southPercentage}%` }}
        />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-[12px] text-base_color">Kids</Text>
        <Text className="text-[12px] text-base_color"> ({diet}%)</Text>
      </View>
      <View className="w-full bg-base_color/10 z-1 h-5 overflow-hidden rounded-2xl relative">
        <View
          className="bg-[#22C55E] absolute rounded-2xl h-5"
          style={{ width: `${diet}%` }}
        />
      </View>
    </View>
  );
};

export default PlanPercentage;
