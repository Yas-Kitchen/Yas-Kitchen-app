import { useGlobalContext } from "@/context/GlobalContext";
import React, { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAlert } from "@/context/AlertContext";
import { router } from "expo-router";
import FoodStyle from "./FoodStyle";
import { useRegisterAPI } from "@/hooks/useRegisterAPI";

const Details = () => {
  const {
    setMobile,
    setName,
    setAddress,
    setActiveStep,
    name,
    address,
    mobile,
    foodStyle,
    categories,
    setFoodStyle,
    isEditing,
    setIsEditing,
    activeStep,
    userData
  } = useGlobalContext();
  const { showAlert } = useAlert();
  const [nameLength, setNameLength] = useState(name?.length || 0);
  const [addressLength, setAddressLength] = useState(address?.length || 0);
  const {
    startOnboarding,
    selectCuisine,
    profileCompletion,
    updateProfile,
    getOnboardingSession,
    getOnboardingUserData,
    loading,
  } = useRegisterAPI();

  React.useEffect(() => {
    if (!mobile && userData?.phone_number) {
      setMobile(userData.phone_number);
    }
  }, [userData, mobile]);

  React.useEffect(() => {
    (async () => {
      try {
        if (activeStep === 3) return;
        if (isEditing) return;

        let session = null;

        try {
          session = await getOnboardingSession();
        } catch (err: any) {
          const code =
            err?.response?.data?.detail?.error_code ||
            err?.response?.data?.error_code;
          const status = err?.response?.status;

          if (code === "ONBOARDING_004" || status === 403 || status === 401) {
            console.log("No active session or auth error, starting a new one...");
            await startOnboarding();
            session = await getOnboardingSession();
          } else {
            throw err;
          }
        }

        const allowUserLoad =
          session?.current_step === "cuisine_selection" ||
          session?.current_step === "profile_completion" ||
          session?.current_step === "plan_selection" ||
          session?.current_step === "pricing_confirmation" ||
          session?.current_step === "completed";

        if (allowUserLoad) {
          const onboarding = await getOnboardingUserData();

          if (onboarding?.user) {
            // Only set name if it's not the phone number (which is default sometimes)
            if (onboarding.user.name && onboarding.user.name !== onboarding.user.phone_number) {
              setName(onboarding.user.name);
            }
            if (onboarding.user.address && onboarding.user.address !== "Pending") {
              setAddress(onboarding.user.address);
            }
            if (onboarding.user.phone_number)
              setMobile(onboarding.user.phone_number);
            if (onboarding.user.cuisine_type_id)
              setFoodStyle(onboarding.user.cuisine_type_id);
          }
        }

        switch (session?.current_step) {
          case "cuisine_selection":
            setActiveStep(1);
            break;
          case "profile_completion":
          case "plan_selection":
            if (activeStep < 3) setActiveStep(2);
            break;

          case "pricing_confirmation":
            setActiveStep(3);
            break;
          default:
            break;
        }
      } catch (error) {
        console.log("Failed to fetch session or user:", error);
      }
    })();
    //eslint-disable-next-line
  }, [isEditing]);

  const handleNameChange = (text: string) => {
    setName(text);
    setNameLength(text.length);
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    setAddressLength(text.length);
  };

  const handleMobileChange = (text: string) => {
    setMobile(text);
  };

  const handleContinue = async () => {
    const trimmedName = name?.trim() || "";
    const trimmedAddress = address?.trim() || "";
    const trimmedMobile = mobile?.trim() || "";

    if (!trimmedName || !trimmedAddress || !trimmedMobile) {
      showAlert(
        "Missing Information",
        "Please fill in all fields to continue."
      );
      return;
    }

    if (trimmedName.length < 2) {
      showAlert(
        "Invalid Name",
        "Please enter your full name (at least 2 characters)."
      );
      return;
    }

    if (/^User\s*\d+$/i.test(trimmedName)) {
      showAlert(
        "Invalid Name",
        "Please enter your real name, not a placeholder."
      );
      return;
    }

    if (trimmedAddress.length < 10) {
      showAlert(
        "Incomplete Address",
        "Please enter your complete delivery address (at least 10 characters).\n\nExample: House No, Street Name, City"
      );
      return;
    }

    if (/address\s*not\s*provided/i.test(trimmedAddress)) {
      showAlert(
        "Invalid Address",
        "Please enter your real delivery address."
      );
      return;
    }

    // Relaxed mobile validation
    if (trimmedMobile.length < 7) {
      showAlert(
        "Invalid Mobile Number",
        "Please enter a valid mobile number."
      );
      return;
    }

    if (!foodStyle) {
      showAlert(
        "Missing Selection",
        "Please select a food style to continue."
      );
      return;
    }
    try {
      // Don't restart onboarding on every click. Just check session.
      let session;
      try {
        session = await getOnboardingSession();
      } catch (e: any) {
        if (e?.response?.data?.detail?.error_code === "ONBOARDING_004") {
          await startOnboarding();
          session = await getOnboardingSession();
        } else {
          throw e;
        }
      }

      if (isEditing) {
        const selectedCuisine = categories.find(
          (c) => c.id === foodStyle || c.label === foodStyle
        );

        await updateProfile(
          name,
          address,
          selectedCuisine ? selectedCuisine.id : undefined
        );

        setIsEditing(false);
        setActiveStep(3);
        return;
      }

      if (session.current_step === "cuisine_selection") {
        const selectedCuisine = categories.find(
          (c) => c.id === foodStyle || c.label === foodStyle
        );

        if (!selectedCuisine) {
          showAlert("Error", "Selected cuisine not found.");
          return;
        }

        console.log("Selecting cuisine:", selectedCuisine);
        await selectCuisine(selectedCuisine.id);

        // After successful cuisine selection, we can proceed to profile completion
        // But we should verify we are ready
        await profileCompletion(trimmedName, trimmedAddress);

        setActiveStep(2);
        return;
      }
      if (session.current_step === "profile_completion") {
        await profileCompletion(trimmedName, trimmedAddress);
        setActiveStep(2);
        return;
      }

      if (session.current_step === "plan_selection") {
        setActiveStep(2);
        return;
      }

      if (session.current_step === "pricing_confirmation") {
        setActiveStep(3);
        return;
      }
    } catch (err: any) {
      console.log("Error during onboarding : ", err);
      // Show alert for other errors too
      if (err?.response?.status === 400) {
        showAlert("Error", err?.response?.data?.message || "Invalid request. Please check your inputs.");
      } else if (err?.response?.status === 403 || err?.response?.status === 401) {
        showAlert("Session Expired", "Please login again to continue.", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/");
            },
          },
        ]);
        return;
      } else {
        showAlert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };


  const isFormValid =
    name?.trim().length >= 2 &&
    address?.trim().length >= 10 &&
    mobile?.length >= 7;

  const content = (
    <View className="font-poppins bg-white rounded-2xl mt-10 p-5 pt-8">
      <Text className="font-poppins text-base_color text-[12px]">Select Food Style</Text>
      <FoodStyle />

      <View className="font-poppins mt-3 gap-1">
        <Text className="font-poppins-medium text-[11px] text-base_color">
          Full Name *
        </Text>
        <TextInput
          onChangeText={handleNameChange}
          placeholder="Enter your full name"
          className="font-poppins p-5 border border-base_color/30 rounded-2xl"
          value={name}
          autoCapitalize="words"
          maxLength={50}
          style={{ fontSize: 16 }}
        />
        <Text
          className={`text-[10px] mb-2 ${nameLength < 2 ? "text-red-500" : "text-green-600"
            }`}
        >
          {nameLength}/50 characters {nameLength < 2 && "(minimum 2 required)"}
        </Text>
        <Text className="font-poppins-medium text-[11px] text-base_color">
          Delivery Address *
        </Text>
        <TextInput
          onChangeText={handleAddressChange}
          placeholder="House No, Street, Landmark, City"
          className="font-poppins p-5 border border-base_color/30 rounded-2xl"
          value={address}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          maxLength={200}
          style={{ fontSize: 16 }}
        />
        <Text
          className={`text-[10px] mb-2 ${addressLength < 10 ? "text-red-500" : "text-green-600"
            }`}
        >
          {addressLength}/200 characters{" "}
          {addressLength < 10 && "(minimum 10 required)"}
        </Text>

        <Text className="font-poppins-medium text-[11px] text-base_color">
          Mobile Number *
        </Text>
        <TextInput
          editable={false}
          selectTextOnFocus={false}
          placeholder="Enter mobile number"
          className="font-poppins p-5 border border-base_color/30 rounded-2xl bg-gray-100 text-gray-500"
          value={mobile}
          keyboardType="phone-pad"
          style={{ fontSize: 16 }}
        />
        <Text
          className={`text-[10px] mb-2 ${!mobile || mobile.length < 7 ? "text-red-500" : "text-green-600"}`}
        >
          {mobile ? mobile.length : 0} digits (min 7)
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        className={`mt-5 p-5 rounded-2xl ${!isFormValid ? "bg-primary/10" : "bg-primary"
          }`}
        disabled={!isFormValid}
      >
        <Text
          className={`text-center font-poppins-semibold ${!isFormValid ? "text-black/20" : "text-white"
            }`}
        >
          {loading ? "Loading..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {Platform.OS === "web" ? (
        content
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {content}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
};

export default Details;
