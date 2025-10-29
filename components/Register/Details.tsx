import { useGlobalContext } from "@/context/GlobalContext";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FoodStyle from "./FoodStyle";
import { useRegisterAPI } from "@/hooks/Register/useRegisterAPI";

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
  } = useGlobalContext();
  const [nameLength, setNameLength] = useState(name?.length || 0);
  const [addressLength, setAddressLength] = useState(address?.length || 0);
  const { startOnboarding, selectCuisine, profileCompletion } =
    useRegisterAPI();

  const handleNameChange = (text: string) => {
    setName(text);
    setNameLength(text.length);
  };

  const handleAddressChange = (text: string) => {
    setAddress(text);
    setAddressLength(text.length);
  };

  const handleMobileChange = (text: string) => {
    const cleaned = text.replace(/[^\d+]/g, "");
    setMobile(cleaned);
  };

  const handleContinue = async () => {
    const trimmedName = name?.trim() || "";
    const trimmedAddress = address?.trim() || "";
    const trimmedMobile = mobile?.trim() || "";
    if (!trimmedName || !trimmedAddress || !trimmedMobile) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields to continue."
      );
      return;
    }
    if (trimmedName.length < 2) {
      Alert.alert(
        "Invalid Name",
        "Please enter your full name (at least 2 characters)."
      );
      return;
    }
    if (/^User\s*\d+$/i.test(trimmedName)) {
      Alert.alert(
        "Invalid Name",
        "Please enter your real name, not a placeholder."
      );
      return;
    }

    if (trimmedAddress.length < 10) {
      Alert.alert(
        "Incomplete Address",
        "Please enter your complete delivery address (at least 10 characters).\n\nExample: House No, Street Name, City"
      );
      return;
    }

    if (/address\s*not\s*provided/i.test(trimmedAddress)) {
      Alert.alert(
        "Invalid Address",
        "Please enter your real delivery address."
      );
      return;
    }

    let validMobile = trimmedMobile;
    if (validMobile.startsWith("+91")) {
      const digitsAfterCode = validMobile.substring(3);
      if (digitsAfterCode.length !== 10) {
        Alert.alert(
          "Invalid Mobile Number",
          "Please enter a valid mobile number: +91 followed by 10 digits."
        );
        return;
      }
    } else if (validMobile.startsWith("91") && validMobile.length === 12) {
      validMobile = "+" + validMobile;
    } else if (/^\d{10}$/.test(validMobile)) {
      validMobile = "+91" + validMobile;
    } else {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!foodStyle) {
      Alert.alert(
        "Missing Selection",
        "Please select a food style to continue."
      );
      return;
    }

    try {
      await startOnboarding();
      const selectedCuisine = categories.find((c) => c.id === foodStyle);

      if (!selectedCuisine) {
        Alert.alert("Error", "Please select a valid cuisine type");
        return;
      }

      await selectCuisine(selectedCuisine.id);
      await profileCompletion(name, address);
      setActiveStep(2);
    } catch (err: any) {
      console.log("Error during onboarding : ", err);
      Alert.alert("Error", "Something went wrong. Please try again");
    }
  };

  const getMobileDigitsCount = () => {
    if (!mobile) return 0;
    if (mobile.startsWith("+91")) {
      return mobile.substring(3).length;
    }
    if (mobile.startsWith("91")) {
      return mobile.substring(2).length;
    }
    return mobile.length;
  };

  const mobileDigits = getMobileDigitsCount();
  const isFormValid =
    name?.trim().length >= 2 &&
    address?.trim().length >= 10 &&
    mobileDigits === 10;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="bg-white rounded-2xl mt-10 p-5 pt-8">
          <Text className="text-base_color text-[12px]">Select Food Style</Text>
          <FoodStyle />

          <View className="mt-3 gap-1">
            <Text className="font-medium text-[11px] text-base_color">
              Full Name *
            </Text>
            <TextInput
              onChangeText={handleNameChange}
              placeholder="Enter your full name"
              className="p-5 border border-base_color/30 rounded-2xl"
              value={name}
              autoCapitalize="words"
              maxLength={50}
            />
            <Text
              className={`text-[10px] mb-2 ${
                nameLength < 2 ? "text-red-500" : "text-green-600"
              }`}
            >
              {nameLength}/50 characters{" "}
              {nameLength < 2 && "(minimum 2 required)"}
            </Text>
            <Text className="font-medium text-[11px] text-base_color">
              Delivery Address *
            </Text>
            <TextInput
              onChangeText={handleAddressChange}
              placeholder="House No, Street, Landmark, City"
              className="p-5 border border-base_color/30 rounded-2xl"
              value={address}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={200}
            />
            <Text
              className={`text-[10px] mb-2 ${
                addressLength < 10 ? "text-red-500" : "text-green-600"
              }`}
            >
              {addressLength}/200 characters{" "}
              {addressLength < 10 && "(minimum 10 required)"}
            </Text>

            <Text className="font-medium text-[11px] text-base_color">
              Mobile Number *
            </Text>
            <View className="flex-row items-center border border-base_color/30 rounded-2xl">
              <Text className="pl-5 text-base_color/60">+91</Text>
              <TextInput
                onChangeText={handleMobileChange}
                placeholder="10-digit mobile number"
                className="flex-1 p-5"
                value={
                  mobile?.startsWith("+91")
                    ? mobile.substring(3)
                    : mobile?.startsWith("91")
                    ? mobile.substring(2)
                    : mobile
                }
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            <Text
              className={`text-[10px] mb-2 ${
                mobileDigits !== 10 ? "text-red-500" : "text-green-600"
              }`}
            >
              {mobileDigits}/10 digits {mobileDigits !== 10 && "(10 required)"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleContinue}
            className={`mt-5 p-5 rounded-2xl ${
              !isFormValid ? "bg-primary/10" : "bg-primary"
            }`}
            disabled={!isFormValid}
          >
            <Text
              className={`text-center font-semibold ${
                !isFormValid ? "text-black/20" : "text-white"
              }`}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Details;
