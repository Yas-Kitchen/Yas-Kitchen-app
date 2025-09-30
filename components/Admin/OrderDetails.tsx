import React from "react";
import { Text, View } from "react-native";

type UserTypes = {
  name: string;
  addons: string[];
  number: number;
  style: string;
  plan: string;
};

const OrderDetails = ({ name, addons, number, style, plan }: UserTypes) => {
  return (
    <>
      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="text-faded_black font-medium text-[14px]">
            {name}
          </Text>
          <Text className="text-base_color text-[12px]">+91 {number}</Text>
        </View>
        <Text className="text-base_color text-[12px]">
          Plan : {style} Indian
        </Text>
        <Text className="text-base_color text-[12px]">{plan}</Text>
        <Text className="text-primary text-[12px]">Add-ons :</Text>
        <View className="flex-row gap-2">
          {addons.map((item: string, i: number) => (
            <Text
              key={i}
              className="text-primary rounded-2xl bg-primary/10 p-2"
            >
              {item}
            </Text>
          ))}
        </View>
      </View>
      <View className="h-[1px] bg-faded_black/10" />
    </>
  );
};

export default OrderDetails;
