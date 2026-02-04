import { useState, useRef } from "react";
import { authAPI } from "@/services/api/auth.api";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import { useAlert } from "@/context/AlertContext";
import { supabase } from "@/lib/supabase";

export const usePhoneAuth = () => {
  const { mobile, setMobile, setUserId } = useGlobalContext();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const [mode, setMode] = useState<"LOGIN" | "REGISTER" | "SET_PASSWORD">(
    "LOGIN",
  );
  const [step, setStep] = useState(1);

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

  const handleContinue = async () => {
    if (step === 1) {
      if (!validatePhoneNumber(mobile)) {
        showAlert(
          "Invalid Number",
          "Please enter a valid mobile number (min 7 digits)",
        );
        return;
      }

      setLoading(true);
      try {
        const result = await authAPI.checkUserExists(mobile);

        if (result.exists) {
          if (result.status === "pending") {
            showAlert(
              "Pending Approval",
              "Your account is currently pending approval. Please contact support.",
            );
            return;
          }
          if (result.status === "inactive") {
            showAlert(
              "Account Inactive",
              "Your account is inactive. Please contact support.",
            );
            return;
          }

          if (result.has_password) {
            setMode("LOGIN");
          } else {
            setMode("SET_PASSWORD");
          }
          setStep(2);
        } else {
          // New user
          const authResult = await authAPI.initiateRegistration(mobile);
          setUserId(authResult.user.id);
          router.replace("/register");
          return;
        }
      } catch (error) {
        console.log("Check user error:", error);
        showAlert("Error", "Failed to check user. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2
      setLoading(true);
      try {
        if (mode === "LOGIN") {
          await handleLogin();
        } else if (mode === "REGISTER") {
          await handleRegister();
        } else {
          await handleSetPassword();
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegister = async () => {
    if (password.length < 6) {
      showAlert("Invalid Password", "Password must be at least 6 characters");
      return;
    }

    try {
      const response = await authAPI.register(mobile, password);
      // If success
      if (response.user?.status === "initiated") {
        router.replace("/(register)/register");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      showAlert("Error", errorMessage);
    }
  };

  const handleSetPassword = async () => {
    try {
      await authAPI.setPassword(mobile, password);
      showAlert("Success", "Password set successfully. Please login.");
      setMode("LOGIN");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to set password. Please try again.";
      showAlert("Error", errorMessage);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await authAPI.loginWithPassword(mobile, password);
      setUserId(response.user.id);
      if (response.user?.role === "admin") {
        router.replace("/(admin)/admin");
      } else {
        router.replace("/(user)/user");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Invalid password. Please try again.";
      showAlert("Error", errorMessage);
    }
  };

  const handleBack = () => {
    setStep(1);
    setPassword("");
  };

  const handleForgotPassword = async () => {
    showAlert("Start Recovery", "Please contact admin to reset password.");
  };

  return {
    mobile,
    password,
    loading,
    step,
    mode,
    // Actions
    handleNumberChange,
    handlePasswordChange,
    handleContinue,
    handleBack,
    handleForgotPassword,
    // Expose helpers if needed individually
    validatePhoneNumber,
  };
};
