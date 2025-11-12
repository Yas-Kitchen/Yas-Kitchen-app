import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Text, View } from "react-native";

interface GreetingProps {
  loading: boolean;
}

const Greetings = ({ loading }: GreetingProps) => {
  const { name, foodStyle } = useGlobalContext();

  if (loading || !name || !foodStyle) {
    return (
      <View className="flex-col gap-2 mt-2">
        <View className="w-[100px] h-[16px] bg-[#e0e0e0] rounded-md opacity-76" />
        <View className="w-[80px] h-[12px] bg-[#e0e0e0] rounded-md opacity-60" />
      </View>
    );
  }
  return (
    <View className="flex-col gap-1">
      <Text className="font-semibold text-faded_black text-[16px]">
        Hello, {name}
      </Text>
      <Text className="text-base_color text-[12px]">{foodStyle} food plan</Text>
    </View>
  );
};

export default Greetings;
