import React from "react";
import { Text, View } from "react-native";

interface MostOrdersProps {
  items?: Array<{
    product_name: string;
    orders: number;
  }>;
}

const MostOrders = ({ items }: MostOrdersProps) => {
  return (
    <View className="bg-white rounded-2xl font-poppins-semibold mx-5 p-5">
      <Text className="text-[16px] font-poppins-semibold text-faded_black">
        Popular Orders Today
      </Text>
      <View className="font-poppins gap-3 flex-col mt-3">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <View key={index} className="font-poppins flex-row justify-between">
              <Text className="font-poppins text-base_color text-[14px]">
                {item.product_name}
              </Text>
              <Text className="font-poppins text-primary text-[14px]">
                {item.orders} orders
              </Text>
            </View>
          ))
        ) : (
          <Text className="font-poppins text-gray-500 text-center text-[14px]">
            No orders yet
          </Text>
        )}
      </View>
    </View>
  );
};

export default MostOrders;
