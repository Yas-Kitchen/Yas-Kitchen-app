import { useState, useRef, useEffect } from "react";
import { usePhoneAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useGlobalContext } from "@/context/GlobalContext";
import authAPI from "@/services/api/auth.api";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/context/AlertContext";
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
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeInLeft,
  FadeOutRight,
  SlideInRight,
  SlideOutLeft,
  SlideInLeft,
  SlideOutRight,
} from "react-native-reanimated";

const Index = () => {
  const {
    mobile,
    password,
    loading,
    handleNumberChange,
    handlePasswordChange,
    signInWithPassword,
    handleForgotPassword,
    validatePhoneNumber,
    sendOtp,
  } = usePhoneAuth();
  const { isAuthLoading, userId, setUserId } = useGlobalContext();
  const { showAlert } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Mobile, 2: Password input(s)
  const [mode, setMode] = useState<"LOGIN" | "REGISTER" | "SET_PASSWORD">(
    "LOGIN",
  );
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const checkUser = async () => {
      // If we are done loading auth and have a user, fetch profile and redirect
      if (!isAuthLoading && userId) {
        // Skip profile fetch for temp users (onboarding)
        if (userId.startsWith("temp_")) {
          // We are in registration flow, do nothing
          return;
        }

        try {
          const userData = await authAPI.getProfile();
          if (userData.status === "initiated") {
            router.replace("/(register)/register");
          } else if (userData.status === "pending") {
            showAlert(
              "Account Pending",
              "Your account is pending admin approval.",
            );
            await supabase.auth.signOut();
          } else if (userData.role === "admin") {
            router.replace("/(admin)/admin");
          } else {
            router.replace("/(user)/user");
          }
        } catch (error: any) {
          console.log("Error fetching profile for redirect:", error);
          if (
            error.message === "Network Error" ||
            error?.code === "ERR_NETWORK"
          ) {
            // Don't sign out on network error, just warn or ignore
            // showAlert("Connection Error", "Could not connect to server. Please check your internet or server IP.");
            return;
          }
          // If profile fetch fails (e.g. 404), force logout so user can try again/isn't stuck
          showAlert("Error", "Failed to load profile. Please login again.");
          await supabase.auth.signOut();
        }
      }
    };
    checkUser();
  }, [isAuthLoading, userId]);

  const handleContinue = async () => {
    if (step === 1) {
      if (!validatePhoneNumber(mobile)) {
        showAlert(
          "Invalid Number",
          "Please enter a valid mobile number (min 7 digits)",
        );
        return;
      }

      setIsLoading(true);
      // Check if user exists
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
          // New user: Proceed to password screen
          setMode("REGISTER");
          setStep(2);
        }
      } catch (error) {
        console.log("Check user error:", error);
        showAlert("Error", "Failed to check user. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // Step 2: Handle password submission based on mode
      setIsLoading(true);
      try {
        if (mode === "LOGIN") {
          await handleLogin();
        } else {
          // REGISTER or SET_PASSWORD
          if (mode === "REGISTER") {
            await handleRegister();
          } else {
            await handleSetPassword();
          }
        }
      } finally {
        setIsLoading(false);
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
      if (response.user?.status === "initiated") {
        router.replace("/(register)/register");
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
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
      // Keep password filled so user can just click login
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Failed to set password. Please try again.";
      showAlert("Error", errorMessage);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await authAPI.loginWithPassword(mobile, password);
      if (response.user?.role === "admin") {
        router.replace("/(admin)/admin");
      } else {
        router.replace("/(user)/user");
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        "Invalid password. Please try again.";
      showAlert("Error", errorMessage);
    }
  };

  const handleBack = () => {
    setStep(1);
    handlePasswordChange("");
  };

  useEffect(() => {
    // optional focus logic
    if (step === 2) {
      setTimeout(() => inputRef.current?.focus(), 400); // delay for animation
    }
  }, [step]);
  // Show loading if auth is loading OR if we have a user (waiting for redirect)
  if (isAuthLoading || userId) {
    return (
      <View className="font-poppins flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF7629" />
        <Text className="mt-4 text-gray-500 font-poppins-medium">
          {isAuthLoading ? "Checking session..." : "Redirecting..."}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {Platform.OS === "web" ? (
        <View className="font-poppins h-screen justify-center">
          <Image
            className="font-poppins w-36 h-36 mx-auto max-w-36 max-h-36"
            source={require("@assets/Login/logo.png")}
          />
          <Text className="text-2xl font-poppins-semibold mx-auto text-faded_black">
            Yas Kitchen
          </Text>
          <Text className="text-xs font-poppins mx-auto text-faded_black">
            Delicious meals delivered daily
          </Text>
          <View className="font-poppins mt-20 mx-10 border border-[#bababa27] rounded-2xl p-5 overflow-hidden">
            <View className="font-poppins flex-row items-center justify-between mb-2">
              {step === 2 && (
                <TouchableOpacity
                  onPress={handleBack}
                  className="font-poppins p-1"
                >
                  <Feather name="arrow-left" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
              <Text className="text-lg font-poppins-semibold text-faded_black mx-auto">
                {step === 1
                  ? "Login or Create Account"
                  : mode === "LOGIN"
                    ? "Enter Password"
                    : "Create Password"}
              </Text>
              {step === 2 && <View className="font-poppins w-6" />}
            </View>

            <View className="font-poppins mt-5 mx-2 min-h-[150px]">
              {step === 1 ? (
                <Animated.View
                  entering={SlideInLeft.duration(300)}
                  exiting={SlideOutLeft.duration(300)}
                  key="step1"
                >
                  <Text className="font-poppins text-xs text-faded_black">
                    Mobile Number
                  </Text>

                  <TextInput
                    className="font-poppins p-4 bg-white rounded-xl mt-2 border border-gray-100"
                    placeholder="Enter Mobile Number"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={handleNumberChange}
                    editable={!loading}
                    style={{ fontSize: 15 }}
                  />
                </Animated.View>
              ) : (
                <Animated.View
                  entering={SlideInRight.duration(300)}
                  exiting={SlideOutRight.duration(300)}
                  key="step2"
                >
                  <Text className="font-poppins text-xs text-faded_black">
                    Password
                  </Text>
                  <View className="font-poppins relative">
                    <TextInput
                      ref={inputRef}
                      className="p-4 bg-white font-poppins rounded-xl mt-2 border border-gray-100 pr-12"
                      placeholder={
                        mode === "LOGIN" ? "Enter Password" : "Create Password"
                      }
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={handlePasswordChange}
                      editable={!loading}
                      style={{ fontSize: 16 }}
                    />
                    <TouchableOpacity
                      className="font-poppins absolute right-4 top-6"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Feather
                        name={showPassword ? "eye" : "eye-off"}
                        size={20}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>

                  {mode === "LOGIN" && (
                    <View className="font-poppins flex-row items-center justify-center mt-4">
                      <TouchableOpacity onPress={handleForgotPassword}>
                        <Text className="text-xs text-primary font-poppins-medium">
                          Forgot Password?
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Animated.View>
              )}

              <TouchableOpacity
                disabled={
                  (step === 1 && mobile.length < 10) ||
                  (step === 2 && password.length < 1) ||
                  loading ||
                  isLoading
                }
                onPress={handleContinue}
                className={`${
                  (step === 1 && mobile.length < 10) ||
                  (step === 2 && password.length < 1) ||
                  loading ||
                  isLoading
                    ? "bg-base_color/50"
                    : "bg-primary"
                } mt-6 p-4 rounded-2xl`}
              >
                {loading || isLoading ? (
                  <View className="font-poppins flex-row items-center justify-center space-x-2">
                    <ActivityIndicator size="small" color="#ffffff" />
                    <Text className="text-center text-white font-poppins-semibold ml-2">
                      Please wait...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-center text-white font-poppins-semibold">
                    {step === 1
                      ? "Continue"
                      : mode === "REGISTER"
                        ? "Create Account"
                        : mode === "SET_PASSWORD"
                          ? "Set Password"
                          : "Login"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="font-poppins h-screen justify-center">
            <Image
              className="font-poppins w-36 h-36 mx-auto max-w-36 max-h-36"
              source={require("@assets/Login/logo.png")}
            />
            <Text className="text-[26px] font-poppins-bold mx-auto text-faded_black">
              Yas Kitchen
            </Text>
            <Text className="font-poppins text-[13px] text-base mx-auto text-faded_black">
              Delicious meals delivered daily
            </Text>
            <View className="font-poppins mt-20 mx-10 border border-[#bababa27] rounded-2xl p-5 overflow-hidden">
              <View className="font-poppins flex-row items-center justify-between mb-2">
                {step === 2 && (
                  <TouchableOpacity
                    onPress={handleBack}
                    className="font-poppins p-1"
                  >
                    <Feather name="arrow-left" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
                <Text className="text-[17px] font-poppins-semibold text-faded_black mx-auto">
                  {step === 1
                    ? "Login or Create Account"
                    : mode === "LOGIN"
                      ? "Enter Password"
                      : "Create Password"}
                </Text>
                {step === 2 && <View className="font-poppins w-6" />}
              </View>

              <View className="font-poppins mt-5 mx-2 min-h-[150px]">
                {step === 1 ? (
                  <Animated.View
                    entering={SlideInLeft.duration(300)}
                    exiting={SlideOutLeft.duration(300)}
                    key="step1"
                  >
                    <Text className="text-base font-poppins-medium text-[12px] text-faded_black">
                      Mobile Number
                    </Text>
                    <TextInput
                      className="font-poppins p-4 bg-white rounded-xl mt-2 border border-gray-100"
                      placeholder="Enter Mobile Number"
                      keyboardType="phone-pad"
                      value={mobile}
                      onChangeText={handleNumberChange}
                      editable={!loading}
                      style={{ fontSize: 16 }}
                    />
                  </Animated.View>
                ) : (
                  <Animated.View
                    entering={SlideInRight.duration(300)}
                    exiting={SlideOutRight.duration(300)}
                    key="step2"
                  >
                    <Text className="text-base font-poppins-medium text-[12px] text-faded_black">
                      Password
                    </Text>
                    <View className="font-poppins relative">
                      <TextInput
                        ref={inputRef}
                        className="font-poppins p-4 bg-white rounded-xl mt-2 border border-gray-100 pr-12"
                        placeholder={
                          mode === "LOGIN"
                            ? "Enter Password"
                            : "Create Password"
                        }
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={handlePasswordChange}
                        editable={!loading}
                        style={{ fontSize: 16 }}
                      />
                      <TouchableOpacity
                        className="font-poppins absolute right-4 top-6"
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Feather
                          name={showPassword ? "eye" : "eye-off"}
                          size={20}
                          color="gray"
                        />
                      </TouchableOpacity>
                    </View>

                    <View className="font-poppins flex-row items-center justify-center mt-4">
                      <TouchableOpacity onPress={handleForgotPassword}>
                        <Text className="text-xs text-primary font-poppins-medium">
                          Forgot Password?
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                )}

                <TouchableOpacity
                  disabled={
                    (step === 1 && mobile.length < 10) ||
                    (step === 2 && password.length < 1) ||
                    loading ||
                    isLoading
                  }
                  onPress={handleContinue}
                  className={`${
                    (step === 1 && mobile.length < 10) ||
                    (step === 2 && password.length < 1) ||
                    loading ||
                    isLoading
                      ? "bg-base_color/50"
                      : "bg-primary"
                  } mt-6 p-4 rounded-2xl`}
                >
                  {loading || isLoading ? (
                    <View className="font-poppins flex-row items-center justify-center space-x-2">
                      <ActivityIndicator size="small" color="#ffffff" />
                      <Text className="text-center text-white font-poppins-semibold ml-2">
                        Please wait...
                      </Text>
                    </View>
                  ) : (
                    <Text className="text-center text-white font-poppins-semibold">
                      {step === 1
                        ? "Continue"
                        : mode === "REGISTER"
                          ? "Create Account"
                          : mode === "SET_PASSWORD"
                            ? "Set Password"
                            : "Login"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};

export default Index;
