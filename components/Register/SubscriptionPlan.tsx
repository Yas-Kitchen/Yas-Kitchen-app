import { useGlobalContext } from "@/context/GlobalContext";
import { Text, TouchableOpacity, View } from "react-native";

const SubscriptionPlan = () => {
  const { monthlyPlan, setActiveStep, kidsPlanSelected } = useGlobalContext();
  const getPrice = () => {
    let price = 0;

    if (monthlyPlan === "Diet") {
      price = 100;
    } else if (monthlyPlan === "Regular") {
      price = 85;
    } else {
      price = 70;
    }

    if (kidsPlanSelected) {
      price += 70;
    }

    return price;
  };
  return (
    <View className="bg-base_color/10 rounded-2xl p-5">
      <View className="flex-row justify-between">
        <Text className="font-semibold text-faded_black text-[14px]">
          Subscription Plan
        </Text>
        <TouchableOpacity onPress={() => setActiveStep(2)}>
          <Text className="text-primary font-medium">Edit</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-col">
        <View className="flex-row gap-5 mt-5">
          <Text className="text-base_color text-[12px]">Selected Plan :</Text>
          <Text className="ml-2">
            {monthlyPlan} Plan {kidsPlanSelected && "with Kids Plan"}
          </Text>
        </View>
        <View className="flex-row w-1/2 gap-5 mt-5">
          <Text className="text-base_color text-[12px]">Monthly Price :</Text>
          <Text className="mx-2 text-primary">{getPrice()}/month</Text>
        </View>
        <View className="flex-row gap-5 mt-5 w-[250px]">
          <Text className="text-base_color text-[12px]">Billing Cycle :</Text>
          <Text className="mx-5">Monthly</Text>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionPlan;
