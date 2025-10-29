import { useGlobalContext } from "@/context/GlobalContext";
import React, { useState } from "react";
import { Linking, Text, TouchableOpacity, View, Alert } from "react-native";
import PersonalDetails from "./PersonalDetails";
import SubscriptionPlan from "./SubscriptionPlan";
import { router } from "expo-router";
import { useRegisterAPI } from "@/hooks/useRegisterAPI";

const Review = () => {
  const [loading, setLoading] = useState(false);
  const { monthlyPlan, name, mobile, address, foodStyle, kidsPlanSelected } =
    useGlobalContext();
  const { confirmPrice } = useRegisterAPI();

  const handleContinue = async () => {
    const phoneNumber = process.env.EXPO_PUBLIC_NUMBER;
    try {
      await confirmPrice();
      const message = `Hello, my name is ${name}. I would like to subscribe to the ${monthlyPlan} plan ${
        kidsPlanSelected ? "with Kids plan and" : ""
      } with ${foodStyle} Indian style. My address is ${address}, and my mobile number is ${mobile}. Please let me know the next steps to book the plan.`;
      const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
      )}`;

      await Linking.openURL(url).catch(() => {
        Alert.alert(
          "WhatsApp Not Found",
          "Make sure WhatsApp is installed on your device"
        );
      });

      Alert.alert(
        "Success!",
        "Your profile has been completed. Our team will contact you shortly.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);

      const errorData = error.response?.data;

      if (error.response?.status === 400) {
        const validationErrors = errorData?.details?.validation_errors;
        let errorMessage = "Please check your information:\n\n";

        if (validationErrors) {
          Object.entries(validationErrors).forEach(
            ([field, errors]: [string, any]) => {
              errorMessage += `• ${field}: ${errors.join(", ")}\n`;
            }
          );
        } else {
          errorMessage = errorData?.message || "Validation failed";
        }

        Alert.alert("Validation Error", errorMessage);
      } else if (error.response?.status === 409) {
        console.log("Profile already complete, sending WhatsApp...");

        const phoneNumber = process.env.EXPO_PUBLIC_NUMBER;
        const message = `Hello, my name is ${name}. I would like to subscribe to the ${monthlyPlan} plan ${
          kidsPlanSelected ? "with Kids plan and" : ""
        } with ${foodStyle} Indian style. My address is ${address}, and my mobile number is ${mobile}. Please let me know the next steps to book the plan.`;

        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
          message
        )}`;

        try {
          await Linking.openURL(url);
          Alert.alert("Success", "Redirecting to WhatsApp...", [
            {
              text: "OK",
              onPress: () => {
                router.replace("/");
              },
            },
          ]);
        } catch (err: any) {
          Alert.alert(
            "WhatsApp Not Found",
            "Make sure WhatsApp is installed on your device"
          );
          console.log(err?.message);
        }
      } else if (error.response?.status === 422) {
        Alert.alert(
          "Error",
          "Some required fields are missing. Please check your information."
        );
      } else {
        Alert.alert(
          "Error",
          errorData?.message || "Failed to complete profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white rounded-2xl mt-10 p-5 pt-8 gap-2">
      <Text className="text-faded_black text-[16px] font-semibold">
        Review your information
      </Text>
      <PersonalDetails />
      <SubscriptionPlan />
      <TouchableOpacity
        onPress={handleContinue}
        disabled={loading}
        className={`bg-primary mt-5 p-5 rounded-2xl w-full ${
          loading && "opacity-50"
        }`}
      >
        {loading ? (
          <Text className="text-center text-white">Loading...</Text>
        ) : (
          <Text className="text-center text-white">Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Review;
