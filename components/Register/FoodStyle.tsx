import { useGlobalContext } from "@/context/GlobalContext";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const FoodStyle = () => {
  const { foodStyle, setFoodStyle } = useGlobalContext();

  // Shared values for scale and border
  const northScale = useSharedValue(1);
  const southScale = useSharedValue(1);
  const northBorder = useSharedValue(0);
  const southBorder = useSharedValue(0);

  useEffect(() => {
    if (foodStyle === "north") {
      northScale.value = withSpring(1.05);
      northBorder.value = withSpring(1);
      southScale.value = withSpring(1);
      southBorder.value = withSpring(0);
    } else if (foodStyle === "south") {
      southScale.value = withSpring(1.05);
      southBorder.value = withSpring(1);
      northScale.value = withSpring(1);
      northBorder.value = withSpring(0);
    }
  }, [foodStyle,southScale,northBorder,northScale,southBorder]);

  const northStyle = useAnimatedStyle(() => ({
    transform: [{ scale: northScale.value }],
    borderColor: interpolateColor(northBorder.value, [0, 1], ["transparent", "#FF6F00"]),
    borderWidth: northBorder.value > 0 ? 2 : 0,
  }));

  const southStyle = useAnimatedStyle(() => ({
    transform: [{ scale: southScale.value }],
    borderColor: interpolateColor(southBorder.value, [0, 1], ["transparent", "#FF6F00"]),
    borderWidth: southBorder.value > 0 ? 2 : 0,
  }));

  return (
    <View className="mt-3">
      <View className="flex-row justify-between mx-2">
        <Pressable onPress={() => setFoodStyle("north")}>
          <Animated.Image
            className="w-[170px] h-[140px] rounded-2xl"
            source={require("@assets/Shared/north_indian.png")}
            style={northStyle}
          />
        </Pressable>

        <Pressable onPress={() => setFoodStyle("south")}>
          <Animated.Image
            className="w-[170px] h-[140px] rounded-2xl"
            source={require("@assets/Shared/south_indian.png")}
            style={southStyle}
          />
        </Pressable>
      </View>

      <View className="flex-row justify-evenly mt-2">
        <Text className={`text-[14px] ${foodStyle === "north" && "text-primary"}`}>
          North Indian
        </Text>
        <Text />
        <Text className={`text-[14px] ${foodStyle === "south" && "text-primary"}`}>
          South Indian
        </Text>
      </View>
    </View>
  );
};

export default FoodStyle;