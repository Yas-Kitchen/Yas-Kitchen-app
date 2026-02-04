import React from "react";
import { Text, View } from "react-native";

type AddonTypes = {
    productName : string
    orders : number
}

const TopAddons = ({productName, orders} : AddonTypes) => {
  return (
      <View className="font-poppins flex-row justify-between">
        <Text className="font-poppins text-base_color text-[12px]">{productName}</Text>
        <Text className="font-poppins text-primary text-[12px]">{orders} orders</Text>
      </View>
  );
};

export default TopAddons;
