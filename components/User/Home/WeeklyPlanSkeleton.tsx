import React from "react";
import { View } from "react-native";
import Skeleton from "@/components/common/Skeleton";

const WeeklyPlanSkeleton = () => {
  return (
    <View className="font-poppins bg-white p-5 rounded-2xl gap-5">
      <View className="font-poppins flex-row gap-2 items-center">
        <Skeleton width={20} height={20} borderRadius={10} />
        <Skeleton width={140} height={20} />
      </View>
      <View className="font-poppins gap-3">
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            className="font-poppins p-5 flex-col justify-between border border-gray-100 rounded-xl gap-3"
          >
            <View className="font-poppins flex-row justify-between">
              <Skeleton width={80} height={14} />
              <Skeleton width={60} height={12} />
            </View>
            <View className="font-poppins gap-2">
              <Skeleton width="80%" height={12} />
              <Skeleton width="70%" height={12} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeeklyPlanSkeleton;
