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
    <View className="bg-white rounded-2xl font-semibold mx-5 p-5">
      <Text className="text-faded_black text-[16px]">Popular Orders Today</Text>
      <View className="gap-3 flex-col mt-3">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <View key={index} className="flex-row justify-between">
              <Text className="text-base_color text-[14px]">
                {item.product_name}
              </Text>
              <Text className="text-primary text-[14px]">
                {item.orders} orders
              </Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-500 text-center text-[14px]">
            No orders yet
          </Text>
        )}
      </View>
    </View>
  );
};

export default MostOrders;
