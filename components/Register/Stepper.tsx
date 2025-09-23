import React from "react";
import { Text, View } from "react-native";

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Plan" },
  { id: 3, label: "Review" },
];
const Stepper = ({ activeStep }: any) => {
  return (
    <View className="flex-row justify-center mt-6">
      {steps.map((step, index) => (
        <View key={step.id} className="flex-row items-center">
          <View className="items-center">
            <View
              className={`rounded-full w-[32px] h-[32px] justify-center items-center ${
                activeStep === step.id
                  ? `bg-primary`
                  : activeStep > step.id
                  ? "bg-primary/30"
                  : "bg-faded_black/10"
              }`}
            >
              <Text
                className={`text-[12px] text-center ${
                  activeStep >= step.id ? "text-white" : "text-faded_black"
                }`}
              >
                {step.id}
              </Text>
            </View>
            <Text
              className={` top-[28px] text-[9px] absolute mt-2 ${
                activeStep === step.id
                  ? `text-primary`
                  : activeStep > step.id
                  ? "text-primary/30"
                  : "text-faded_black"
              }`}
            >
              {step.label}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              className={`h-[3px] w-[110px] ${
                activeStep > step.id ? "bg-primary/30" : "bg-faded_black/10"
              }`}
            ></View>
          )}
        </View>
      ))}
    </View>
  );
};

export default Stepper;
