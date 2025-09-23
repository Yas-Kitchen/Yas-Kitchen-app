import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import FoodStyle from "./FoodStyle";

const Details = () => {
  const { setMobile, setName, setAdress, setActiveStep } = useGlobalContext();
  return (
    <View className="bg-white rounded-2xl mt-10 p-5 pt-8">
      <Text className="text-base_color text-[12px]">Select Food Style</Text>
      <FoodStyle />
      <View className="mt-3 gap-1">
        <Text className="font-medium text-[11px] text-base_color">Full name</Text>
        <TextInput
          onChangeText={setName}
          placeholder="Enter your name"
          className="p-5 border border-base_color/30 rounded-2xl"
        />
        <Text className="font-medium text-[11px] text-base_color">
          Delivery Adress
        </Text>
        <TextInput
          onChangeText={setAdress}
          placeholder="Enter delivery adress"
          className="p-14 px-5 border border-base_color/30 rounded-2xl"
        />
        <Text className="font-medium text-[11px] text-base_color">Mobile Number</Text>
        <TextInput
          onChangeText={setMobile}
          placeholder="enter your mobile number"
          className="p-5 border border-base_color/30 rounded-2xl"
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          setActiveStep(2);
        }}
        className="bg-primary mt-5 p-5 rounded-2xl"
      >
        <Text className="text-center text-white">Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
