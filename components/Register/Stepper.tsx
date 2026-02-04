import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const steps = [
  { id: 1, label: "Details" },
  { id: 2, label: "Plan" },
  { id: 3, label: "Review" },
];

const LINE_WIDTH = 110; 

function useStepStyles(
  progress: SharedValue<number>,
  activeStep: number,
  stepId: number
) {
  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor:
      activeStep === stepId
        ? "#FF6F00"
        : activeStep > stepId
        ? "#FF6F00"
        : "#A0A0A01A",
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: activeStep >= stepId ? "#FF6F00" : "#A0A0A0",
  }));

  const lineBackgroundStyle = useAnimatedStyle(() => ({
    width: LINE_WIDTH,
    height: 3,
    backgroundColor: "#A0A0A02A",
    borderRadius: 2,
  }));

  const lineForegroundStyle = useAnimatedStyle(() => {
    const filledWidth = (LINE_WIDTH * Math.min(progress.value - stepId, 1)) || 0;
    return {
      width: filledWidth,
      height: 3,
      backgroundColor: "#FF6F00",
      position: "absolute",
      left: 0,
      borderRadius: 2,
    };
  });

  return { circleStyle, labelStyle, lineBackgroundStyle, lineForegroundStyle };
}

const Stepper = ({ activeStep }: any) => {
  const progress = useSharedValue(activeStep);

  useEffect(() => {
    progress.value = withTiming(activeStep, { duration: 300 });
  }, [activeStep, progress]);

  return (
    <View className="font-poppins flex-row justify-center mt-6">
      {steps.map((step, index) => {
        const { circleStyle, labelStyle, lineBackgroundStyle, lineForegroundStyle } =
          useStepStyles(progress, activeStep, step.id);

        return (
          <View key={step.id} className="font-poppins flex-row items-center">
            <View className="font-poppins items-center">
              <Animated.View
                style={[
                  {
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  circleStyle,
                ]}
              >
                <Text
                  className={`text-[12px] text-center ${
                    activeStep >= step.id ? "text-white" : "text-faded_black"
                  }`}
                >
                  {step.id}
                </Text>
              </Animated.View>

              <Animated.Text
                style={[{ position: "absolute", top: 33, fontSize: 9 }, labelStyle]}
              >
                {step.label}
              </Animated.Text>
            </View>

            {index < steps.length - 1 && (
              <View style={{ width: LINE_WIDTH, height: 3, marginHorizontal: 4 }}>
                <Animated.View style={lineBackgroundStyle} />
                <Animated.View style={lineForegroundStyle} />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default Stepper;