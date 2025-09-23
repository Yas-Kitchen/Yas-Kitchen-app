import AlreadyAccount from "@/components/shared/AlreadyAccount";
import { useGlobalContext } from "@/context/GlobalContext";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const Index = () => {
  const {setMobile} = useGlobalContext()
  return (
    <View className="h-screen justify-center">
      <Image
        className="w-36 h-36 mx-auto"
        source={require("../../assets/Login/unfixed_logo.png")}
      />
      <Text className="text-[26px] font-bold mx-auto">Yas Kitchen</Text>
      <Text className="text-[13px] text-base mx-auto">
        Delicious meals delivered daily
      </Text>
      <View className="mt-20 mx-10 border border-[#bababa27] rounded-2xl p-5 ">
        <Text className="text-[17px] font-semibold mx-auto">Login Via Phone</Text>
        <View className="mt-10 mx-5">
          <Text className="text-base font-medium text-[12px]">
            Mobile Number
          </Text>
          <TextInput 
            className="p-5 bg-white rounded-2xl mt-2"
            placeholder="+91 9182736450"
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={setMobile}
          />
          <TouchableOpacity onPress={() => router.push("/(login)/Otp")} className="bg-primary mt-5 p-5 rounded-2xl">
            <Text className="text-center text-white">Continue</Text>
          </TouchableOpacity>
        </View>
      </View> 
          <AlreadyAccount main={"New to yas kitchen ? "} sub={"Register Now"} route={"/(register)"}/>
    </View>
  );
};

export default Index;
