import Details from "@/components/Register/Details";
import Plan from "@/components/Register/Plan";
import Review from "@/components/Register/Review";
import Stepper from "@/components/Register/Stepper";
import { useGlobalContext } from "@/context/GlobalContext";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Index = () => {
  const { activeStep } = useGlobalContext();
  const progress = useSharedValue(activeStep);
  const [direction, setDirection] = React.useState<"forward" | "backward">(
    "forward"
  );

  useEffect(() => {
    const isForward = activeStep > progress.value;
    setDirection(isForward ? "forward" : "backward");
    progress.value = withTiming(activeStep, { duration: 300 });
  }, [activeStep, progress]);

  const detailsStyle = useAnimatedStyle(() => {
    return {
      position: progress.value === 1 ? "relative" : "absolute",
      width: "100%",
      opacity: interpolate(
        progress.value,
        [0, 1, 2],
        [0, 1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1, 2],
            direction === "forward" ? [100, 0, -100] : [-100, 0, 100],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const planStyle = useAnimatedStyle(() => {
    return {
      position: progress.value === 2 ? "relative" : "absolute",
      width: "100%",
      opacity: interpolate(
        progress.value,
        [1, 2, 3],
        [0, 1, 0],
        Extrapolation.CLAMP
      ),
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [1, 2, 3],
            direction === "forward" ? [100, 0, -100] : [-100, 0, 100],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const reviewStyle = useAnimatedStyle(() => {
    return {
      position: progress.value === 3 ? "relative" : "absolute",
      width: "100%",
      opacity: interpolate(progress.value, [2, 3], [0, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [2, 3],
            direction === "forward" ? [100, 0] : [-100, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <ScrollView>
      <View className="mt-20 mx-5">
        <Text className="text-center text-[20px] font-bold text-faded_black">
          Complete Registration
        </Text>
        <Text className="text-center text-[13px] mt-2 text-base">
          Tell us a bit about yourself
        </Text>
        <Stepper activeStep={activeStep} />

        <View style={{ minHeight: 400, position: "relative" }}>
          {activeStep === 1 && (
            <Animated.View style={detailsStyle}>
              <Details />
            </Animated.View>
          )}

          {activeStep === 2 && (
            <Animated.View style={planStyle}>
              <Plan />
            </Animated.View>
          )}

          {activeStep === 3 && (
            <Animated.View style={reviewStyle}>
              <Review />
            </Animated.View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Index;
