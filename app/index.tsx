import AlreadyAccount from "@/components/shared/AlreadyAccount";
import { useGlobalContext } from "@/context/GlobalContext";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Index = () => {
  const { setMobile, mobile } = useGlobalContext();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="h-screen justify-center">
          <Image
            className="w-36 h-36 mx-auto max-w-36 max-h-36"
            source={require("@assets/Login/logo.png")}
          />
          <Text className="text-[26px] font-bold mx-auto text-faded_black">
            Yas Kitchen
          </Text>
          <Text className="text-[13px] text-base mx-auto text-faded_black">
            Delicious meals delivered daily
          </Text>
          <View className="mt-20 mx-10 border border-[#bababa27] rounded-2xl p-5 ">
            <Text className="text-[17px] font-semibold mx-auto text-faded_black">
              Login Via Phone
            </Text>
            <View className="mt-10 mx-5">
              <Text className="text-base font-medium text-[12px] text-faded_black">
                Mobile Number
              </Text>
              <TextInput
                className="p-5 bg-white rounded-2xl mt-2"
                placeholder="+91 9182736450"
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={setMobile}
              />
              <TouchableOpacity
                disabled={mobile.length < 9}
                onPress={() => router.push("/(login)/Otp")}
                className={`${
                  mobile.length < 9 ? "bg-base_color/50" : "bg-primary"
                } mt-5 p-5 rounded-2xl`}
              >
                <Text className="text-center text-white">Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/(admin)/admin')} >
            <Text className="text-center text-primary">Admin</Text>
          </TouchableOpacity>
          <AlreadyAccount
            main={"New to yas kitchen ? "}
            sub={"Register Now"}
            route={"/register"}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Index;
