import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { authAPI } from "@/services/api/auth.api";
import { useGlobalContext } from "@/context/GlobalContext";

export const usePhoneAuth = () => {
  const { mobile, setMobile } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (text: string): string => {
    const cleaned = text.replace(/[^\d+]/g, "");

    if (!cleaned.startsWith("+91")) {
      const digitsOnly = cleaned.replace(/^\+?91?/, "");
      return "+91" + digitsOnly;
    }
    return cleaned;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+91\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setMobile(formatted);
  };

  const sendOtp = async () => {
    if (!validatePhoneNumber(mobile)) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid 10-digit mobile number\n\nFormat: +91XXXXXXXXXX"
      );
      return false;
    }

    setLoading(true);
    try {
      const response = await authAPI.sendOtp(mobile);
      Alert.alert(
        "OTP Sent",
        `OTP has been sent to ${mobile}\n\nExpires in ${response.expires_in_minutes} minutes`
      );
      router.push("/(login)/Otp");
      return true;
    } catch (error: any) {
      console.error("Send OTP Error:", error);

      const errorDetail = error.response?.data?.detail;
      let errorMessage = "Failed to send OTP. Please try again.";

      if (typeof errorDetail === "string") {
        errorMessage = errorDetail;
      } else if (errorDetail?.message) {
        errorMessage = errorDetail.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    mobile,
    loading,
    handleNumberChange,
    validatePhoneNumber,
    sendOtp,
    isPhoneValid: validatePhoneNumber(mobile),
  };
};
