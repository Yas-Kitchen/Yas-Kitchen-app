import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface UserTypes {
  name: string;
  number: number;
  category: string;
  status: string;
  joindate: string;
}

const IndividualUsers = ({
  name,
  number,
  category,
  status,
  joindate,
}: UserTypes) => {
  return (
    <View className="bg-white relative rounded-2xl p-4 gap-2">
      <Text className="text-sm font-semibold">{name}</Text>
      <Text className="text-base_color text-xs">+91 {number}</Text>
      <View className="flex-row items-center gap-4">
        <Text className="p-2 rounded-full bg-primary/10 text-primary text-[10px]">
          {category}
        </Text>
        <Text
          className={` p-2 rounded-full text-[10px] w-fit ${
            status === "Active"
              ? "text-[#16A34A] bg-[#DCFCE7]"
              : status === "Paused"
              ? "text-[#CA8A04] bg-[#FEF9C3]"
              : "text-[#DC2626] bg-[#FEE2E2]"
          }`}
        >
          {status}
        </Text>
      </View>
      <Text className="text-base_color text-[10px]">Joined : {joindate}</Text>
      <View className="flex-row absolute top-5 right-5 gap-2">
        <View className="flex-row bg-[#F3F4F6] p-1 text-center items-center rounded-lg gap-2">
          <Feather color={"#212529"} size={15} name="edit" />
          <Text className="text-xs"> Edit</Text>
        </View>
        <View className="flex-row bg-primary/10 p-1 rounded-lg items-center gap-2">
          <Feather color={"#FF7629"} size={15} name="delete" />
          <Text className="text-primary text-xs">Delete</Text>
        </View>
      </View>
    </View>
  );
};

export default IndividualUsers;
