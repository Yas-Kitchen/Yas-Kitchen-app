import { useGlobalContext } from "@/context/GlobalContext";
import { useEffect } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

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
];

const kidsPlan = {
  key: "Kids",
  name: "Kids Plan",
  description: "Nutritious meals specially designed for children",
  price: 75,
  image: require("@assets/Shared/kids_meal.png"),
};

const MonthlyPlan = () => {
  useEffect(() => {
    const images = [
      require("@assets/Shared/regular_meal.png"),
      require("@assets/Shared/diet_meal.png"),
      require("@assets/Shared/kids_meal.png"),
    ];
    images.forEach(img => Image.prefetch(img));
  }, []);
  const { monthlyPlan, setMonthlyPlan, kidsPlanSelected, setKidsPlanSelected } =
    useGlobalContext();

  const scales = foodPlans.map(() => useSharedValue(1));
  const borderAnims = foodPlans.map(() => useSharedValue(0));
  const kidsScale = useSharedValue(1);
  const kidsBorderAnim = useSharedValue(0);

  const animatedStyles = scales.map((scale, index) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      borderColor: interpolateColor(borderAnims[index].value, [0, 1], ["transparent", "#FF6F00"]),
    }))
  );

  const kidsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: kidsScale.value }],
    borderColor: interpolateColor(kidsBorderAnim.value, [0, 1], ["transparent", "#FF6F00"]),
  }));

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

  const handleKidsPress = () => {
    const newValue = !kidsPlanSelected;
    setKidsPlanSelected(newValue);
    if (newValue) {
      kidsScale.value = withSpring(1.05);
      kidsBorderAnim.value = withTiming(1);
    } else {
      kidsScale.value = withSpring(1);
      kidsBorderAnim.value = withTiming(0);
    }
  };

  return (
    <View className="flex-col">
      {foodPlans.map((plan, index) => {
        const animatedStyle = animatedStyles[index];
        const isSelected = monthlyPlan === plan.key;
        const screenWidth = Dimensions.get('window').width
        const width = Math.min(Math.max(screenWidth * 0.45 ,200), 110)
        const height = width * 1
        return (
          <Pressable
            key={plan.key}
            onPress={() => {
              handlePress(plan.key, index);
              setMonthlyPlan(plan.key);
            }}
          >
            <Animated.View
              layout={Layout.springify()}
              className={`overflow bg-[#F0F1EB] mt-5 pr-10 overflow-hidden rounded-2xl flex-row border-2`}
              style={animatedStyle}
            >
              <Image style={{height,width}} source={plan.image} />
              <View className="flex-row pt-6 gap-1 justify-evenly">
                <View className="flex-col w-1/2">
                  <Text className="text-[14px] font-semibold">
                    {plan.name}
                  </Text>
                  <Text className="text-base_color text-[12px] text-regular">
                    {plan.description}
                  </Text>
                </View>
                <View className="flex-row text-center items-baseline gap-1">
                  <Image
                    className="w-[10px] h-[10px] fill-primary"
                    source={require("@assets/Shared/dirham.svg")}
                  />
                  <Text className="text-primary font-semibold">
                    {plan.price} /mo
                  </Text>
                </View>
              </View>
                <View
                  className={`rounded-full absolute bottom-4 right-3 w-5 h-5 ${
                    isSelected ? "bg-primary" : "bg-base_color/10"
                  }`}
                />
            </Animated.View>
          </Pressable>
        );
      })}
      <Pressable key={kidsPlan.key} onPress={handleKidsPress}>
        <Animated.View
          layout={Layout.springify()}
          className="overflow bg-[#F0F1EB] mt-5 pr-10 overflow-hidden rounded-2xl flex-row border-2"
          style={kidsAnimatedStyle}
        >
          <Image style={{height: Dimensions.get('window').width * 0.25, width: Dimensions.get('window').width * 0.25}} source={kidsPlan.image} />
          <View className="flex-row gap-1 pt-4 justify-evenly">
            <View className="flex-col w-1/2">
              <Text className="text-[14px] font-semibold">
                {kidsPlan.name}
              </Text>
              <Text className="text-base_color text-[12px] text-regular">
                {kidsPlan.description}
              </Text>
            </View>
            <View className="flex-row text-center items-baseline gap-1">
              <Image
                className="w-[10px] h-[10px] fill-primary"
                source={require("@assets/Shared/dirham.svg")}
              />
              <Text className="text-primary font-semibold">
                {kidsPlan.price} /mo
              </Text>
            </View>
          </View>
          {kidsPlanSelected ? (
            <View className="rounded-full absolute bottom-4 right-3 bg-primary w-5 h-5" />
          ) : (
            <View className="rounded-full absolute bottom-4 right-3 bg-base_color/10 w-5 h-5" />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default MonthlyPlan;
