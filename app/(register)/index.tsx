import Details from "@/components/Register/Details";
import Plan from "@/components/Register/Plan";
import Stepper from "@/components/Register/Stepper";
import AlreadyAccount from "@/components/shared/AlreadyAccount";
import { useGlobalContext } from "@/context/GlobalContext";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  const { activeStep } = useGlobalContext();
  return (
    <View className="mt-20 mx-5">
      <Text className="text-center text-[20px] font-bold text-faded_black">
        Complete Registration
      </Text>
      <Text className="text-center text-[13px] mt-2 text-base">
        Tell us a bit about yourself
      </Text>
      <Stepper activeStep={activeStep} />
      {activeStep === 1 ? <Details /> : activeStep === 2 ? <Plan/> : ""}
      <AlreadyAccount
        main="Already have an account ?"
        sub="Login"
        route="/(login)"
      />
    </View>
  );
};

export default Index;
