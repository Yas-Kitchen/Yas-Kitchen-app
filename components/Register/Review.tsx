import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import PersonalDetails from "./PersonalDetails";
import SubscriptionPlan from "./SubscriptionPlan";

const Review = () => {
  const { monthlyPlan, name, mobile, adress, foodStyle, kidsPlanSelected } =
    useGlobalContext();

  return (
    <View className="bg-white rounded-2xl mt-10 p-5 pt-8 gap-2">
      <Text className="text-faded_black text-[16px] font-semibold">
        Review your information
      </Text>
      <PersonalDetails />
      <SubscriptionPlan />
      <TouchableOpacity
        onPress={() => {
          const phoneNumber = 918547266801;

          const message = `Hello, my name is ${name}. I would like to subscribe to the ${monthlyPlan} plan ${
            kidsPlanSelected && "with Kids plan and"
          } with ${foodStyle} Indian style. My address is ${adress}, and my mobile number is ${mobile}. Please let me know the next steps to book the plan.`;
          const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
            message
          )}`;

          Linking.openURL(url).catch(() => {
            alert("Make sure WhatsApp is installed on your device");
          });
        }}
        className="bg-primary mt-5 p-5 rounded-2xl w-full"
      >
        <Text className="text-center text-white">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Review;
