import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Otp = () => {
  const { mobile } = useGlobalContext();
  return (
    <>
      <Pressable className="mt-20 absolute mx-5" onPress={() => router.back()}>
        <Feather name="chevron-left" size={30} />
      </Pressable>
      <View className="mx-5 justify-center h-screen">
        <View className="items-center ">
          <Text className="text-[20px] mt-7 font-bold text-faded_black">
            Verify Phone
          </Text>
          <Text className="text-base text-[14px] mt-4">
            We&apos;ve sent a verification code to
          </Text>
          <Text className="text-base text-[14px] font-medium">{mobile}</Text>
          <View className="mt-10">
            <Text className="text-base text-[14px] text-center font-medium">
              Enter 4-digit OTP
            </Text>
            <View className="flex-row gap-3">
              <TextInput
                maxLength={1}
                keyboardType="phone-pad"
                className="h-16 w-16 bg-transparent text-center text-[30px] border mt-4 border-[#E5E7EB] rounded-xl"
              />
              <TextInput
                maxLength={1}
                keyboardType="phone-pad"
                className="h-16 w-16 bg-transparent text-center text-[30px] border mt-4 border-[#E5E7EB] rounded-xl"
              />
              <TextInput
                maxLength={1}
                keyboardType="phone-pad"
                className="h-16 w-16 bg-transparent text-center text-[30px] border mt-4 border-[#E5E7EB] rounded-xl"
              />
              <TextInput
                maxLength={1}
                keyboardType="phone-pad"
                className="h-16 w-16 bg-transparent text-center text-[30px] border mt-4 border-[#E5E7EB] rounded-xl"
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(user)")}
          className="bg-primary mt-10 mx-8 p-5 rounded-2xl"
        >
          <Text className="text-center text-white text-[14px]">Verfiy</Text>
        </TouchableOpacity>

        <Text className="text-base text-center mt-5">
          Resend OTP in 30 secconds
        </Text>
      </View>
    </>
  );
};

export default Otp;
