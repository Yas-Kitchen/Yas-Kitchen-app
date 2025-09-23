import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const MonthlyPlan = () => {
  const [monthlyPlan, setMonthlyPlan] = useState("");
  const foodPlans = [
    {
      key: "Regular",
      name: "Regular Plan",
      description: "Daily meals delivered to your doorstep",
      price: 83,
      image: require("@assets/Shared/regular_meal.png"),
    },
    {
      key: "Diet",
      name: "Diet Plan",
      description: "Calorie-controlled meals for weight management",
      price: 100,
      image: require("@assets/Shared/diet_meal.png"),
    },
    {
      key: "Kids",
      name: "Kids Plan",
      description: "Nutritious meals specially designed for children",
      price: 75,
      image: require("@assets/Shared/kids_meal.png"),
    },
  ];

  const scales = foodPlans.map(() => useSharedValue(1));
  const borderAnims = foodPlans.map(() => useSharedValue(0));

  const handlePress = (key: string, index: number) => {
    setMonthlyPlan(key);
    foodPlans.forEach((plan, i) => {
      if (i === index) {
        scales[i].value = withSpring(1.05);
        borderAnims[i].value = withTiming(1);
      } else {
        scales[i].value = withSpring(1);
        borderAnims[i].value = withTiming(0);
      }
    });
  };

  return (
    <View className="flex-col">
      {foodPlans.map((plan, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: scales[index].value }],
            borderColor: interpolateColor(
              borderAnims[index].value,
              [0, 1],
              ["transparent", "#FF6F00"]
            ),
          };
        });

        const isSelected = monthlyPlan === plan.key;

        return (
          <Pressable
            key={plan.key}
            onPress={() => handlePress(plan.key, index)}
          >
            <Animated.View
              layout={Layout.springify()}
              className={`overflow bg-[#F0F1EB] mt-5 pr-10 overflow-hidden rounded-2xl flex-row border-2`}
              style={animatedStyle}
            >
              <Image className="w-[130px] h-[130px]" source={plan.image} />
              <View className="flex-col pt-6 gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="w-1/2 text-[14px] font-semibold">
                    {plan.name}
                  </Text>
                  <View className="flex-row text-center items-center gap-1">
                    <Image
                      className="w-[10px] h-[10px] fill-primary"
                      source={require("@assets/Shared/dirham.png")}
                    />
                    <Text className="text-primary font-semibold">
                      {plan.price} /mo
                    </Text>
                  </View>
                </View>
                <Text className="text-base_color text-[12px] text-regular w-[200px]">
                  {plan.description}
                </Text>
                {isSelected ? (
                  <View className="rounded-full absolute bottom-4 right-1 bg-primary w-5 h-5" />
                ) : (
                  <View className="rounded-full absolute bottom-4 right-1 bg-base_color/10 w-5 h-5" />
                )}
              </View>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default MonthlyPlan;
