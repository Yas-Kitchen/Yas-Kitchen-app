import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const FoodStyle = () => {
  const { foodStyle, setFoodStyle } = useGlobalContext();
  return (
    <View className="mt-3">
      <View className="flex-row justify-between mx-2">
        <Pressable onPress={() => setFoodStyle("north")}>
          <Image
            className={`w-[170px] h-[140px] rounded-2xl ${
              foodStyle === "north" && "border-primary border-2"
            }`}
            source={require("@assets/Shared/north_indian.png")}
          />
        </Pressable>
        <Pressable onPress={() => setFoodStyle("south")}>
          <Image
            className={`w-[170px] h-[140px] rounded-2xl ${
              foodStyle === "south" && "border-primary border-2"
            }`}
            source={require("@assets/Shared/south_indian.png")}
          />
        </Pressable>
      </View>
      <View className="flex-row justify-evenly mt-2">
        <Text
          className={`text-[14px] ${foodStyle === "north" && "text-primary"}`}
        >
          North Indian
        </Text>
        <Text />
        <Text
          className={`text-[14px] ${foodStyle === "south" && "text-primary"}`}
        >
          South Indian
        </Text>
      </View>
    </View>
  );
};

export default FoodStyle;
