import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import FoodStyle from "./FoodStyle";

const Details = () => {
  const { setMobile, setName, setAdress, setActiveStep, name, adress, mobile } =
    useGlobalContext();

  const handleContinue = () => {
    if (!name?.trim() || !adress?.trim() || !mobile?.trim()) {
      Alert.alert("Please fill all fields", "All fields are required to continue.");
      return;
    }
    setActiveStep(2);
  };

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
          value={name}
        />

        <Text className="font-medium text-[11px] text-base_color">Delivery Address</Text>
        <TextInput
          onChangeText={setAdress}
          placeholder="Enter delivery address"
          className="p-14 px-5 border border-base_color/30 rounded-2xl"
          value={adress}
        />

        <Text className="font-medium text-[11px] text-base_color">Mobile Number</Text>
        <TextInput
          onChangeText={setMobile}
          placeholder="Enter your mobile number"
          className="p-5 border border-base_color/30 rounded-2xl"
          value={mobile}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        className={`mt-5 p-5 rounded-2xl ${
          !name || !adress || !mobile ? "bg-primary/10" : "bg-primary"
        }`}
        disabled={!name || !adress || !mobile}
      >
        <Text className={`text-center ${
          !name || !adress || !mobile ? "text-black/20" : "text-white"
        }`}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;