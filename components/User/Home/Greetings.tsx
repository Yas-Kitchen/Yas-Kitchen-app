import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Text, View } from "react-native";
import Skeleton from "@/components/common/Skeleton";

interface GreetingProps {
  loading: boolean;
}

const Greetings = ({ loading }: GreetingProps) => {
  const { name, foodStyle } = useGlobalContext();

  if (loading || !name || !foodStyle) {
    return (
      <View className="font-poppins flex-col gap-2 mt-2">
        <Skeleton width={140} height={20} borderRadius={6} />
        <Skeleton width={100} height={14} borderRadius={6} />
      </View>
    );
  }
  return (
    <View className="font-poppins flex-col gap-1">
      <Text className="font-poppins-semibold text-faded_black text-[16px]">
        Hello, {name}
      </Text>
      <Text className="font-poppins text-base_color text-[12px]">{foodStyle} food plan</Text>
    </View>
  );
};

export default Greetings;
