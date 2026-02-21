import { useGlobalContext } from "@/context/GlobalContext";
import { useMealsAPI } from "@/hooks/useMealsAPI";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

const MonthlyPlan = () => {
  const {
    has_diet_plan,
    setHasDietPlan,
    has_regular_plan,
    setHasRegularPlan,
    has_kids_plan,
    setHasKidsPlan,
    monthlyPlan,
    setMonthlyPlan,
  } = useGlobalContext();
  const { fetchPlanDetails, loading } = useMealsAPI();
  const [allPlans, setAllPlans] = useState<any[]>([]);

  const animationValues = useRef<{ [key: string]: Animated.Value }>({}).current;

  const ensureAnimation = (key: string) => {
    if (!animationValues[key]) {
      animationValues[key] = new Animated.Value(0);
    }
    return animationValues[key];
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPlanDetails();
      if (data && data.categories) {
        setAllPlans(data.categories);
      } else if (Array.isArray(data)) {
        setAllPlans(data);
      } else {
        setAllPlans([]);
      }
    };
    fetchData();
    //eslint-disable-next-line
  }, []);

  const foodPlans = useMemo(() => {
    return (allPlans || []).filter((plan: any) => plan?.key !== "Kids");
  }, [allPlans]);

  const kidsPlan = useMemo(() => {
    return (allPlans || []).find((plan: any) => plan?.key === "Kids");
  }, [allPlans]);

  foodPlans.forEach((plan: any) => {
    ensureAnimation(plan.key);
  });

  ensureAnimation("Kids");

  useEffect(() => {
    foodPlans.forEach((plan: any) => {
      const anim = animationValues[plan.key] || ensureAnimation(plan.key);

      let isSelected = false;
      if (plan.key === "Diet") {
        isSelected = has_diet_plan;
      } else if (plan.key === "Regular") {
        isSelected = has_regular_plan;
      }

      Animated.timing(anim, {
        toValue: isSelected ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    const kidsAnim = animationValues["Kids"] || ensureAnimation("Kids");
    Animated.timing(kidsAnim, {
      toValue: has_kids_plan ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line
  }, [has_diet_plan, has_regular_plan, has_kids_plan, foodPlans]);

  useEffect(() => {
    const selectedPlans: any[] = [];

    if (has_diet_plan) {
      const dietPlan = allPlans.find((p: any) => p.key === "Diet");
      if (dietPlan) selectedPlans.push(dietPlan);
    }

    if (has_regular_plan) {
      const regularPlan = allPlans.find((p: any) => p.key === "Regular");
      if (regularPlan) selectedPlans.push(regularPlan);
    }

    if (has_kids_plan) {
      const kids = allPlans.find((p: any) => p.key === "Kids");
      if (kids) selectedPlans.push(kids);
    }

    const isDifferent =
      selectedPlans.length !== monthlyPlan.length ||
      selectedPlans.some((p, i) => p.key !== monthlyPlan[i]?.key);

    if (isDifferent) setMonthlyPlan(selectedPlans);
    //eslint-disable-next-line
  }, [has_diet_plan, has_regular_plan, has_kids_plan, allPlans]);

  const handlePress = (plan: any) => {
    if (plan.key === "Diet") {
      if (has_diet_plan) {
        setHasDietPlan(false);
        if (!has_regular_plan) {
          setHasKidsPlan(false);
        }
      } else {
        setHasDietPlan(true);
        setHasRegularPlan(false);
      }
      return;
    }
    if (plan.key === "Regular") {
      if (has_regular_plan) {
        setHasRegularPlan(false);
        if (!has_diet_plan) {
          setHasKidsPlan(false);
        }
      } else {
        setHasRegularPlan(true);
        setHasDietPlan(false);
      }
      return;
    }
  };

  const handleKidsPress = () => {
    if (!has_diet_plan && !has_regular_plan) {
      return;
    }
    setHasKidsPlan(!has_kids_plan);
  };

  if (loading) {
    return (
      <View className="font-poppins flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text className="font-poppins text-base_color mt-2">
          Loading plans...
        </Text>
      </View>
    );
  }

  if (!foodPlans || foodPlans.length === 0) {
    return (
      <View className="font-poppins flex-1 items-center justify-center py-10">
        <Text className="font-poppins text-base_color">No plans available</Text>
      </View>
    );
  }

  return (
    <View className="font-poppins flex-col">
      {foodPlans.map((plan: any) => {
        let isSelected = false;
        if (plan.key === "Diet") {
          isSelected = has_diet_plan;
        } else if (plan.key === "Regular") {
          isSelected = has_regular_plan;
        }
        const screenWidth = Dimensions.get("window").width;
        const width = Math.min(Math.max(screenWidth * 0.45, 200), 110);
        const height = width * 1;

        const borderColor = animationValues[plan.key].interpolate({
          inputRange: [0, 1],
          outputRange: ["transparent", "#FF6F00"],
        });

        const scale = animationValues[plan.key].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        });

        return (
          <Animated.View
            key={plan.key}
            style={{
              borderColor,
              borderWidth: 2,
              transform: [{ scale }],
              borderRadius: 16,
              marginTop: 20,
              overflow: "hidden",
            }}
          >
            <Pressable onPress={() => handlePress(plan)}>
              <View className="font-poppins overflow bg-[#F0F1EB] pr-10 flex-row">
                <Image
                  style={{ height, width }}
                  source={{ uri: plan.image_url }}
                  className="font-poppins max-w-28 max-h-32 web:max-w-24 web:max-h-24"
                />
                <View className="font-poppins flex-row pt-6 gap-1 ml-2 w-[75%]">
                  <View className="font-poppins flex-col web:w-[40%] w-1/2">
                    <Text className="text-[14px] font-poppins-semibold web:text-[12px]">
                      {plan.name}
                    </Text>
                    <Text className="font-poppins text-base_color text-[12px] text-regular web:text-[9px] flex-1">
                      {plan.description}
                    </Text>
                  </View>
                  <View className="font-poppins flex-row text-center items-baseline gap-1 absolute right-1 top-5">
                    <Image
                      className="font-poppins w-[10px] h-[10px] max-w-[10px] max-h-[10px] fill-primary"
                      source={require("@assets/Shared/dirham.svg")}
                    />
                    <Text className="text-primary font-poppins-semibold web:text-[10px]">
                      {plan.price} /mo
                    </Text>
                  </View>
                </View>
                <View
                  className={`rounded-full absolute bottom-4 right-3 w-5 h-5 ${
                    isSelected ? "bg-primary" : "bg-base_color/10"
                  }`}
                />
              </View>
            </Pressable>
          </Animated.View>
        );
      })}

      {/* Kids Plan */}
      {kidsPlan &&
        (() => {
          const plan = kidsPlan;
          const isSelected = has_kids_plan;

          const screenWidth = Dimensions.get("window").width;
          const width = Math.min(Math.max(screenWidth * 0.45, 200), 110);
          const height = width * 1;

          const borderColor = animationValues["Kids"].interpolate({
            inputRange: [0, 1],
            outputRange: ["transparent", "#FF6F00"],
          });

          const scale = animationValues["Kids"].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.05],
          });

          return (
            <Animated.View
              key="Kids"
              style={{
                borderColor,
                borderWidth: 2,
                transform: [{ scale }],
                borderRadius: 16,
                marginTop: 20,
                overflow: "hidden",
              }}
            >
              <Pressable onPress={handleKidsPress}>
                <View className="font-poppins overflow bg-[#F0F1EB] pr-10 flex-row">
                  <Image
                    style={{ height, width }}
                    source={{ uri: plan.image_url }}
                    className="font-poppins max-w-28 max-h-32 web:max-w-24 web:max-h-24"
                  />
                  <View className="font-poppins flex-row pt-6 gap-1 ml-2 w-[75%]">
                    <View className="font-poppins flex-col web:w-[40%] w-1/2">
                      <Text className="text-[14px] font-poppins-semibold web:text-[12px]">
                        {plan.name}
                      </Text>
                      <Text className="font-poppins text-base_color text-[12px] text-regular web:text-[9px] flex-1">
                        {plan.description}
                      </Text>
                    </View>
                    <View className="font-poppins flex-row text-center items-baseline gap-1 absolute right-1 top-5">
                      <Image
                        className="font-poppins w-[10px] h-[10px] max-w-[10px] max-h-[10px] fill-primary"
                        source={require("@assets/Shared/dirham.svg")}
                      />
                      <Text className="text-primary font-poppins-semibold web:text-[10px]">
                        {plan.price_per_month || plan.price} /mo
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`rounded-full absolute bottom-4 right-3 w-5 h-5 ${
                      isSelected ? "bg-primary" : "bg-base_color/10"
                    }`}
                  />
                </View>
              </Pressable>
            </Animated.View>
          );
        })()}
    </View>
  );
};

export default MonthlyPlan;
