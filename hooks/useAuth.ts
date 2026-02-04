import { useState } from "react";
import { authAPI } from "@/services/api/auth.api";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import { useAlert } from "@/context/AlertContext";

export const usePhoneAuth = () => {
  const { mobile, setMobile, setUserId } = useGlobalContext();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phone);
  };

  const handleNumberChange = (text: string) => {
    setMobile(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const signInWithPassword = async () => {
    if (!validatePhoneNumber(mobile)) {
      showAlert("Invalid Number", "Please enter a valid mobile number");
      return;
    }
    if (password.length < 1) {
      showAlert("Error", "Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const data = await authAPI.loginWithPassword(mobile, password);
      setUserId(data.user.id);

      if (data.user.role === "admin") {
        router.replace("/(admin)/admin");
      } else {
        router.replace("/(user)/user");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error.message || "Login failed";
      showAlert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!validatePhoneNumber(mobile)) {
      showAlert("Error", "Invalid phone number");
      return;
    }
    setLoading(true);
    try {
      await authAPI.sendOtp(mobile);
      showAlert("Success", "OTP sent to your mobile number");
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    showAlert("Start Recovery", "Please contact admin to reset password.");
  };

  return {
    mobile,
    password,
    loading,
    handleNumberChange,
    handlePasswordChange,
    signInWithPassword,
    handleForgotPassword,
    validatePhoneNumber,
    sendOtp,
  };
};
