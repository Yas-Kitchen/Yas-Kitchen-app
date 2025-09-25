import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Text, View } from "react-native";

const Greetings = () => {
  const { name, foodStyle } = useGlobalContext();
  return (
    <View className="flex-col gap-1">
      <Text className="font-semibold text-faded_black text-[16px]">
        Hello, {name}
      </Text>
      <Text className="text-base_color text-[12px]">
        {foodStyle} indian food plan
      </Text>
    </View>
  );
};

export default Greetings;
