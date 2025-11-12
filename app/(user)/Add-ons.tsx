import Cart from "@/components/Popup/Cart";
import AddonsItems from "@/components/User/Add-on/Addons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const Addons = () => {
  return (
    <View className="flex-1 relative">
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View className="ios:mt-16 mt-5 mx-5 gap-3">
          <Text className="text-[#212529] font-semibold text-[16px]">
            Add-on item&apos;s
          </Text>
          <AddonsItems />
        </View>
      </ScrollView>
      <Cart />
    </View>
  );
};

export default Addons;
