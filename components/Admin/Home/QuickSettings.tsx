import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type QuickSettingsType = {
  header: string;
  icon: "users" | "coffee" | "list" | "clipboard" | "dollar-sign";
  number: number | string;
};

const QuickSettings = ({ header, icon, number }: QuickSettingsType) => {
  return (
    <View className="font-poppins flex-col gap-5 bg-white w-[45%] p-5 rounded-2xl">
      <View className="font-poppins flex-row items-center gap-3">
        <Feather
          name={icon}
          size={20}
          color={"#FF7629"}
          className="font-poppins bg-primary/10 rounded-full p-2 "
        />
        <Text className="font-poppins text-sm w-1/2 text-base_color">
          {header}
        </Text>
      </View>
      <Text className="text-xl font-poppins-medium">{number}</Text>
    </View>
  );
};

export default QuickSettings;
