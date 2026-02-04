import React from "react";
import { Dimensions, View } from "react-native";
import Skeleton from "@/components/common/Skeleton";

const MealSkeleton = () => {
  const screenWidth = Dimensions.get("window").width;
  const width = Math.min(Math.max(screenWidth * 0.45, 300), 400); // Matching TodaysMeal logic
  const height = width * 0.72;

  return (
    <View className="font-poppins border-2 bg-[#F1EFE8] border-gray-200 rounded-2xl overflow-hidden items-center">
      <Skeleton width={width} height={height} borderRadius={0} />
      <View className="font-poppins bg-white p-3 gap-2 w-full">
        <View className="font-poppins flex-row justify-between">
          <Skeleton width={100} height={20} />
          <Skeleton width={40} height={20} borderRadius={8} />
        </View>
        <View className="font-poppins flex-row justify-between items-center">
          <View className="font-poppins gap-1">
            <Skeleton width={160} height={12} />
            <Skeleton width={100} height={12} />
          </View>
          <Skeleton width={56} height={40} borderRadius={20} />
        </View>
      </View>
    </View>
  );
};

export default MealSkeleton;
