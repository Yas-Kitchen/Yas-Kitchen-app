import AddonsItems from "@/components/User/Add-on/Addons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const Addons = () => {
  return (
    <ScrollView>
      <View className="mt-16 mx-5 gap-3">
          <Text className="text-[#212529] font-semibold text-[16px]">
            Add-on item&apos;s
          </Text>
        <AddonsItems/>
      </View>
    </ScrollView>
  );
};

export default Addons;
