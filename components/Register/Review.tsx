import { useGlobalContext } from "@/context/GlobalContext";
import React, { useEffect, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useAlert } from "@/context/AlertContext";
import PersonalDetails from "./PersonalDetails";
import SubscriptionPlan from "./SubscriptionPlan";
import { router } from "expo-router";
import { useRegisterAPI } from "@/hooks/useRegisterAPI";
import { getCuisineNameByID } from "@/utils/cuisine.util";
import { ReviewData } from "@/types/register.types";

const Review = () => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState<string>("loading...");
  const [data, setData] = useState<ReviewData | null>(null);
  const { userId, activeStep, setUserData } = useGlobalContext();
  const { confirmPrice, getReviewData } = useRegisterAPI();

  const PLAN_NAME_MAP: Record<string, string> = {
    regular: "Regular Plan",
    diet: "Diet Plan",
    kids: "Kids Plan",
  };

  const user = data?.user;

  useEffect(() => {
    const load = async () => {
      try {
        if (activeStep === 3) {
          const reviewData = await getReviewData();
          setData(reviewData);
        }
      } catch (err) {
        console.log("Error loading review:", err);
      }
    };

    load();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchCuisineName = async () => {
      if (data?.cuisine.id) {
        const name = await getCuisineNameByID(data?.cuisine.id);
        setPlanName(name);
      }
    };
    fetchCuisineName();
  }, [data]);

  const formattedPlanName = (data?.plans.selected_plans || [])
    .map((key) => PLAN_NAME_MAP[key] || key)
    .join(" with ");

  const formattedPrice = data?.plans.pricing_breakdown?.total_cost
    ? `${data.plans.pricing_breakdown.total_cost} AED/month`
    : "0 AED";

  const sendWhatsAppMessage = async () => {
    const phoneNumber = process.env.EXPO_PUBLIC_NUMBER;
    const message = `Hello, my name is ${data?.user.name}. I would like to subscribe to the ${formattedPlanName} plan under ${planName} cuisine. My address is ${data?.user.address}, and my mobile number is ${data?.user.phone_number}`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    try {
      await Linking.openURL(url);
    } catch {
      showAlert(
        "WhatsApp Not Found",
        "Make sure WhatsApp is installed on your device."
      );
    }
  };

  const handleContinue = async () => {
    try {
      await confirmPrice(userId);
      await sendWhatsAppMessage();

      setUserData((prev: any) => ({ ...prev, status: "pending" }));
      showAlert(
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="font-poppins bg-white rounded-2xl mt-10 p-5 pt-8 gap-2">
      <Text className="text-faded_black text-[16px] font-poppins-semibold">
        Review your information
      </Text>
      <PersonalDetails
        name={user?.name}
        mobile={user?.phone_number}
        address={user?.address}
        foodStyle={planName}
      />
      <SubscriptionPlan plans={formattedPlanName} price={formattedPrice} />
      <TouchableOpacity
        onPress={handleContinue}
        disabled={loading}
        className={`bg-primary mt-5 p-5 rounded-2xl w-full ${loading && "opacity-50"
          }`}
      >
        {loading ? (
          <Text className="font-poppins text-center text-white">Loading...</Text>
        ) : (
          <Text className="font-poppins text-center text-white">Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Review;
