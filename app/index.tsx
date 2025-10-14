import { useGlobalContext } from "@/context/GlobalContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
import { authAPI } from "@/services/auth.api";

const Index = () => {
  const { setMobile, mobile } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const handleNumberChange = (text: string) => {
    let formattedText = text;
    if (!text.startsWith("+91")) {
      formattedText = "+91" + text.replace(/^\+91/, "");
    }
    setMobile(formattedText);
  };

  const handleContinue = async () => {
    if (mobile.length < 13) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number with +91 prefix");
      return;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.sendOtp(mobile);
      
      // Check if test mode is enabled
      if (response.test_mode && response.test_otp) {
        Alert.alert(
          "OTP Sent (Test Mode)", 
          `Your test OTP is: ${response.test_otp}\n\nExpires in ${response.expires_in_minutes} minutes`
        );
      } else {
        Alert.alert(
          "OTP Sent", 
          `OTP has been sent to ${mobile}\n\nExpires in ${response.expires_in_minutes} minutes`
        );
      }
      
      router.push("/(login)/Otp");
    } catch (error: any) {
      console.error("Send OTP Error:", error);
      
      const errorDetail = error.response?.data?.detail;
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      } else if (errorDetail?.message) {
        errorMessage = errorDetail.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          <View className="mt-20 mx-10 border border-[#bababa27] rounded-2xl p-5">
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
                maxLength={13}
                value={mobile}
                onChangeText={handleNumberChange}
                editable={!loading}
              />
              <TouchableOpacity
                disabled={mobile.length < 13 || loading}
                onPress={handleContinue}
                className={`${
                  mobile.length < 13 || loading ? "bg-base_color/50" : "bg-primary"
                } mt-5 p-5 rounded-2xl`}
              >
                <Text className="text-center text-white font-semibold">
                  {loading ? "Sending OTP..." : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Index;
