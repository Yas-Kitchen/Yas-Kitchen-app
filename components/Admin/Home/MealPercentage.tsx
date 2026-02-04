import React from "react";
import { Text, View } from "react-native";

interface MealPercentageProps {
  data?: {
    Regular: { total_users: number; percentage: number };
    Diet: { total_users: number; percentage: number };
    Kids: { total_users: number; percentage: number };
    regular?: { total_users: number; percentage: number };
    diet?: { total_users: number; percentage: number };
    kids?: { total_users: number; percentage: number };
  };
}

const MealPercentage = ({ data }: MealPercentageProps) => {
  const regularCount =
    data?.Regular?.total_users || data?.regular?.total_users || 0;
  const dietCount = data?.Diet?.total_users || data?.diet?.total_users || 0;
  const kidsCount = data?.Kids?.total_users || data?.kids?.total_users || 0;

  const totalCount = regularCount + dietCount + kidsCount;

  const regularWidth = totalCount > 0 ? (regularCount / totalCount) * 100 : 0;
  const dietWidth = totalCount > 0 ? (dietCount / totalCount) * 100 : 0;
  const kidsWidth = totalCount > 0 ? (kidsCount / totalCount) * 100 : 0;

  return (
    <View className="font-poppins flex-col gap-5 mx-5 bg-white p-5 rounded-2xl">
      <Text className="text-[16px] font-poppins-semibold text-faded_black">
        Today&apos;s Meal Distribution
      </Text>
      <View className="font-poppins w-full flex-row relative h-5 rounded-full overflow-hidden bg-base_color/10">
        <View
          className="font-poppins bg-primary rounded-full h-full"
          style={{ width: `${regularWidth}%` }}
        ></View>
        <View
          className="font-poppins bg-yellow rounded-full h-full"
          style={{ width: `${dietWidth}%` }}
        ></View>
        <View
          className="font-poppins bg-green-500 rounded-full h-full"
          style={{ width: `${kidsWidth}%` }}
        ></View>
      </View>
      <View className="font-poppins flex-row mt-3 justify-evenly flex-wrap">
        <View className="font-poppins flex-row items-center gap-2">
          <View className="font-poppins w-3 h-3 rounded-full bg-primary" />
          <Text className="font-poppins text-[12px] text-base_color">
            Regular :{" "}
            {data?.Regular?.total_users || data?.regular?.total_users || 0}
          </Text>
        </View>
        <View className="font-poppins flex-row items-center gap-2">
          <View className="font-poppins w-3 h-3 rounded-full bg-yellow" />
          <Text className="font-poppins text-[12px] text-base_color">
            Diet : {data?.Diet?.total_users || data?.diet?.total_users || 0}
          </Text>
        </View>
        <View className="font-poppins flex-row items-center gap-2">
          <View className="font-poppins w-3 h-3 rounded-full bg-green-500" />
          <Text className="font-poppins text-[12px] text-base_color">
            Kids : {data?.Kids?.total_users || data?.kids?.total_users || 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MealPercentage;
