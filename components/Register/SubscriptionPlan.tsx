import { useGlobalContext } from "@/context/GlobalContext";
import { Text, TouchableOpacity, View } from "react-native";

const SubscriptionPlan = ({ plans, price }: { plans: string; price: string }) => {
  const { setActiveStep, setIsEditing } = useGlobalContext();

  return (
    <View className="font-poppins bg-base_color/10 rounded-2xl p-5">
      <View className="font-poppins flex-row justify-between">
        <Text className="font-poppins-semibold text-faded_black text-[14px]">
          Subscription Plan
        </Text>
        <TouchableOpacity
          onPress={() => {
            setActiveStep(2);
            setIsEditing(true);
          }}
        >
          <Text className="text-primary font-poppins-medium">Edit</Text>
        </TouchableOpacity>
      </View>
      <View className="font-poppins flex-col">
        <View className="font-poppins flex-row mt-5">
          <Text className="font-poppins text-base_color text-[12px] web:text-[10px]">
            Selected Plan :
          </Text>
          <Text className="font-poppins ml-2 web:text-[10px]">
            {plans || "Loading..."}
          </Text>
        </View>
        <View className="font-poppins flex-row mt-5">
          <Text className="font-poppins text-base_color text-[12px] web:text-[10px]">
            Monthly Price :
          </Text>
          <Text className="font-poppins mx-2 text-primary web:text-[10px]">
            {price || "Loading..."}
          </Text>
        </View>
        <View className="font-poppins flex-row mt-5">
          <Text className="font-poppins text-base_color text-[12px] web:text-[10px]">
            Billing Cycle :
          </Text>
          <Text className="font-poppins mx-5 web:text-[10px]">Monthly</Text>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionPlan;
