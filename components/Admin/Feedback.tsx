import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Text, View } from "react-native";

type FeedbackType = {
  name: string;
  meal: string;
  comment: string;
  review: number;
};

const Feedback = ({ name, meal, comment, review }: FeedbackType) => {
  return (
    <View className="bg-white rounded-2xl p-5">
      <Text className="font-semibold text-[16px] mb-5">Recent Feedback</Text>
      <View className="flex-col gap-1">
        <View className="flex-row justify-between items-center">
          <Text className="text-[14px] font-medium">{name}</Text>
          <View className="bg-yellow/10 flex-row items-center gap-1 rounded-xl p-2">
            <FontAwesome name="star" color={"#FFC107"} size={14} />
            <Text className="text-yellow text-[12px] font-medium">
              {review}
            </Text>
          </View>
        </View>
        <Text className="text-base_color text-[12px]">Meal : {meal}</Text>
        <Text className="text-base_color text-[12px]">
          &quot;{comment}&quot;
        </Text>
      </View>
    </View>
  );
};

export default Feedback;
