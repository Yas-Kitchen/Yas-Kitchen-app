import React from "react";
import { Text, View } from "react-native";

type PlanTypes = {
  northPercentage: number;
  southPercentage: number;
  kidsMeal: number;
};

const PlanPercentage = ({
  northPercentage,
  southPercentage,
  kidsMeal,
}: PlanTypes) => {
  return (
    <View className="bg-white rounded-2xl p-5 gap-2">
      <Text className="text-[16px] font-semibold">Plan Distribution</Text>
      <View className="flex-row justify-between">
        <Text className="text-[12px] text-base_color">North Indian</Text>
        <Text className="text-[12px] text-base_color">432 ({northPercentage}%)</Text>
      </View>
      <View className="w-full bg-base_color/10 h-5 rounded-2xl relative">
        <View
          className="bg-primary absolute rounded-2xl h-5"
          style={{ width: `${northPercentage}%` }}
        />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-[12px] text-faded_black">South Indian</Text>
        <Text className="text-[12px] text-faded_black">
          432 ({southPercentage}%)
        </Text>
      </View>
      <View className="w-full bg-base_color/10 h-5 overflow-hidden rounded-2xl relative">
        <View
          className="bg-yellow absolute rounded-2xl h-5"
          style={{ width: `${southPercentage}%` }}
        />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-[12px] text-faded_black">Kids Plan</Text>
        <Text className="text-[12px] text-faded_black">43 ({kidsMeal}%)</Text>
      </View>
      <View className="w-full bg-base_color/10 z-1 h-5 overflow-hidden rounded-2xl relative">
        <View
          className="bg-[#22C55E] absolute rounded-2xl h-5"
          style={{ width: `${kidsMeal}%` }}
        />
      </View>
    </View>
  );
};

export default PlanPercentage;
