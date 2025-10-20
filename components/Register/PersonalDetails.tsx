import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const PersonalDetails = () => {
  const { name, mobile, adress, foodStyle, setActiveStep } = useGlobalContext();

  return (
    <View className="bg-base_color/10 rounded-2xl p-5">
      <View className="flex-row justify-between">
        <Text className="font-semibold text-faded_black text-[14px]">
          Personal Details
        </Text>
        <TouchableOpacity onPress={() => setActiveStep(1)}>
          <Text className="text-primary font-medium">Edit</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-col">
        <View className="flex-row w-fit/2 gap-5 mt-5">
          <Text className="text-base_color text-[12px]">Name :</Text>
          <Text className="mx-8 web:mx-0">{name}</Text>
        </View>
        <View className="flex-row w-fit gap-5 mt-5">
          <Text className="text-base_color text-[12px]">Mobile :</Text>
          <Text className="mx-7 web:mx-0">{mobile}</Text>
        </View>
        <View className="flex-row gap-5 mt-5 w-[250px]">
          <Text className="text-base_color text-[12px]">Address :</Text>
          <Text className="mx-5 web:mx-0">{adress}</Text>
        </View>
        <View className="flex-row gap-5 mt-5">
          <Text className="text-base_color text-[12px]">Food Style :</Text>
          <Text className="mx-1 web:mx-0">{foodStyle} Indian</Text>
        </View>
      </View>
    </View>
  );
};

export default PersonalDetails;
