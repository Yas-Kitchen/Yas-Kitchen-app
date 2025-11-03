import { useGlobalContext } from "@/context/GlobalContext";
import { useMealsAPI } from "@/hooks/useMealsAPI";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

const MonthlyPlan = () => {
  const {
    monthlyPlan: selectedPlan,
    setMonthlyPlan,
    kidsPlanSelected,
    setKidsPlanSelected,
  } = useGlobalContext();
  const { monthlyPlan, fetchPlanDetails, loading } = useMealsAPI();

  useEffect(() => {
    fetchPlanDetails();
    // eslint-disable-next-line
  }, []);

  const foodPlans = useMemo(() => {
    if (!monthlyPlan || !Array.isArray(monthlyPlan)) return [];
    return monthlyPlan.filter((plan: any) => !plan.special);
  }, [monthlyPlan]);

  const kidsPlan = useMemo(() => {
    if (!monthlyPlan || !Array.isArray(monthlyPlan)) return null;
    return monthlyPlan.find((plan: any) => plan.special);
  }, [monthlyPlan]);
  const handlePress = (plan: any) => {
    let newSelected: string[] = [];
    if (plan.key === "Diet" || plan.key === "Regular") {
      let basePlan = plan.key;
      if (Array.isArray(selectedPlan) && selectedPlan.includes(plan.key)) {
        if (kidsPlanSelected) {
          return;
        } else {
          setMonthlyPlan([""]);
          return;
        }
      } else {
        if (kidsPlanSelected) {
          newSelected = [basePlan, "Kids"];
        } else {
          newSelected = [basePlan];
        }
      }
      setMonthlyPlan(newSelected);
      return;
    }
  };

  const handleKidsPress = () => {
    let basePlan = null;
    if (Array.isArray(selectedPlan)) {
      basePlan = selectedPlan.find((k) => k === "Diet" || k === "Regular");
    } else if (selectedPlan === "Diet" || selectedPlan === "Regular") {
      basePlan = selectedPlan;
    }
    if (!kidsPlanSelected) {
      if (!basePlan) {
        return;
      }
      setKidsPlanSelected(true);
      setMonthlyPlan([basePlan, "Kids"]);
    } else {
      setKidsPlanSelected(false);
      if (basePlan) {
        setMonthlyPlan([basePlan]);
      } else {
        setMonthlyPlan([""]);
      }
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text className="text-base_color mt-2">Loading plans...</Text>
      </View>
    );
  }

  if (!foodPlans || foodPlans.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <Text className="text-base_color">No plans available</Text>
      </View>
    );
  }

  return (
    <View className="flex-col">
      {foodPlans.map((plan: any) => {
        const isSelected = selectedPlan === plan.key;
        const screenWidth = Dimensions.get("window").width;
        const width = Math.min(Math.max(screenWidth * 0.45, 200), 110);
        const height = width * 1;

        return (
          <Pressable key={plan.key} onPress={() => handlePress(plan)}>
            <View
              className="overflow bg-[#F0F1EB] mt-5 pr-10 overflow-hidden rounded-2xl flex-row border-2"
              style={{
                borderColor: isSelected ? "#FF6F00" : "transparent",
              }}
            >
              <Image
                style={{ height, width }}
                source={{ uri: plan.image }}
                className="max-w-28 max-h-32 web:max-w-24 web:max-h-24"
              />
              <View className="flex-row pt-6 gap-1 ml-2 w-[75%]">
                <View className="flex-col web:w-[40%] w-1/2">
                  <Text className="text-[14px] font-semibold web:text-[12px]">
                    {plan.name}
                  </Text>
                  <Text className="text-base_color text-[12px] text-regular web:text-[9px] flex-1">
                    {plan.description}
                  </Text>
                </View>
                <View className="flex-row text-center items-baseline gap-1 absolute right-1 top-5">
                  <Image
                    className="w-[10px] h-[10px] max-w-[10px] max-h-[10px] fill-primary"
                    source={require("@assets/Shared/dirham.svg")}
                  />
                  <Text className="text-primary font-semibold web:text-[10px]">
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
        );
      })}

      {/* Kids Plan */}
      {kidsPlan && (
        <Pressable onPress={handleKidsPress}>
          <View
            className="overflow bg-[#F0F1EB] mt-5 pr-10 overflow-hidden rounded-2xl flex-row border-2"
            style={{
              borderColor: kidsPlanSelected ? "#FF6F00" : "transparent",
            }}
          >
            <Image
              style={{
                height: Dimensions.get("window").width * 0.25,
                width: Dimensions.get("window").width * 0.25,
              }}
              source={{ uri: kidsPlan.image }}
            />
            <View className="flex-row gap-1 pt-4">
              <View className="flex-col w-1/2">
                <Text className="text-[14px] font-semibold web:text-[12px]">
                  {kidsPlan.name}
                </Text>
                <Text className="text-base_color text-[12px] web:text-[9px] text-regular">
                  {kidsPlan.description}
                </Text>
              </View>
              <View className="flex-row text-center items-baseline gap-1 justify-items-end w-1/2">
                <Image
                  className="w-[10px] h-[10px] fill-primary"
                  source={require("@assets/Shared/dirham.svg")}
                />
                <Text className="text-primary font-semibold web:text-[10px]">
                  {kidsPlan.price_per_month || kidsPlan.price} /mo
                </Text>
              </View>
            </View>
            {kidsPlanSelected ? (
              <View className="rounded-full absolute bottom-4 right-3 bg-primary w-5 h-5" />
            ) : (
              <View className="rounded-full absolute bottom-4 right-3 bg-base_color/10 w-5 h-5" />
            )}
          </View>
        </Pressable>
      )}
    </View>
  );
};

export default MonthlyPlan;
