import React, { useState, useRef, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import { authAPI } from "@/services/auth.api";

const Otp = () => {
  const { mobile } = useGlobalContext();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  // Redirect if no phone number

  useEffect(() => {
    if (!mobile) {
      Alert.alert("Error", "Please enter your phone number first");
      router.replace("/");
    }
  }, [mobile]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, canResend]);

  // Auto-verify when all digits are entered
  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 6 && !loading) {
      handleVerifyOTP(otpString);
    }
  }, [otp]);

  const handlePaste = (text: string) => {
    // If user pasted entire OTP
    if (text.length === 6 && /^\d+$/.test(text)) {
      const digits = text.split("");
      setOtp(digits);
      Keyboard.dismiss();
    }
  };

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) {
      handlePaste(text);
      return;
    }

    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    if (otpCode.length < 6) {
      Alert.alert("Error", "Please enter complete OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOtp(mobile, otpCode);

      if (response.user?.role === "admin") {
        Alert.alert("Success", "Welcome Admin!");
        router.replace("/(admin)/admin");
      } else if (response.profile_exists) {
        Alert.alert("Success", "Login Successful");
        router.replace("/(user)/user");
      } else {
        Alert.alert(
          "Welcome",
          "User not registered, please complete you'r profile"
        );
        router.push("/register");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "invalid OTP, please try agian"
      );
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const response = await authAPI.sendOtp(mobile);
      Alert.alert(
        "OTP Sent",
        response.test_mode && response.test_otp
          ? `Test OTP: ${response.test_otp}`
          : "A new OTP has been sent to your phone"
      );
      setCanResend(false);
      setCountdown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = () => {
    const otpString = otp.join("");
    handleVerifyOTP(otpString);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="h-screen justify-center px-5">
          <Image
            className="w-36 h-36 mx-auto max-w-36 max-h-36"
            source={require("@assets/Login/logo.png")}
          />
          <Text className="text-[26px] font-bold mx-auto text-faded_black mt-5">
            Verify OTP
          </Text>
          <Text className="text-[13px] text-center mx-auto text-faded_black mt-2">
            Enter the 6-digit code sent to{"\n"}
            {mobile}
          </Text>

          <View className="mt-10 mx-5 border border-[#bababa27] rounded-2xl p-5">
            <Text className="text-[17px] font-semibold mx-auto text-faded_black mb-5">
              Enter OTP
            </Text>

            {/* OTP Input Fields */}
            <View className="flex-row justify-between mb-5">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  className={`w-12 h-14 bg-white rounded-xl text-center text-xl font-semibold ${
                    digit ? "border-2 border-primary" : "border border-gray-300"
                  }`}
                  maxLength={6}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  editable={!loading}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              ))}
            </View>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={!canResend || loading}
              className="mb-3"
            >
              <Text
                className={`text-center ${
                  canResend ? "text-primary" : "text-gray-400"
                }`}
              >
                {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleManualVerify}
              disabled={otp.join("").length < 6 || loading}
              className={`${
                otp.join("").length < 6 || loading
                  ? "bg-base_color/50"
                  : "bg-primary"
              } p-5 rounded-2xl`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-white font-semibold">
                  Verify OTP
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-5"
            disabled={loading}
          >
            <Text className="text-center text-primary">
              Change Phone Number
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Otp;
