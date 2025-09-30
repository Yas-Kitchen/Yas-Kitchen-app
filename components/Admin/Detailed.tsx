import React from "react";
import { Text, View } from "react-native";
import Feedback from "./Feedback";
import OrderDetails from "./OrderDetails";

const Detailed = () => {
  return (
    <>
      <View className="bg-white rounded-2xl p-5 gap-2">
        <Text className="text-[16px] font-semibold text-faded_black mb-2">
          Today&apos;s Orders by User&apos;s
        </Text>
        <View className="gap-5">
          <OrderDetails
            name="Mohanlal"
            number={854763648}
            style="South"
            plan="Regular"
            addons={["pappadam", "curd", "moru"]}
          />
        </View>
      </View>
      <Feedback
        name="Basil Joseph"
        review={4.5}
        meal="Rice and sambar"
        comment="Excellent taste and perfect spice level!"
      />
    </>
  );
};

export default Detailed;
