import Details from "@/components/Register/Details";
import Plan from "@/components/Register/Plan";
import Review from "@/components/Register/Review";
import Stepper from "@/components/Register/Stepper";
import AlreadyAccount from "@/components/shared/AlreadyAccount";
import { useGlobalContext } from "@/context/GlobalContext";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";


const Index = () => {
  const { activeStep } = useGlobalContext();
  const progress = useSharedValue(activeStep);

  useEffect(() => {
    progress.value = withTiming(activeStep, { duration: 300 });
  }, [activeStep,progress]);

  const detailsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1, 2], [0, 1, 0]),
    transform: [
      { translateX: interpolate(progress.value, [0, 1, 2], [50, 0, -50]) },
    ],
  }));
  
  const planStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [1, 2], [0, 1]),
    transform: [{ translateX: interpolate(progress.value, [1, 2], [50, 0]) }],
  }));
  
const reviewStyle = useAnimatedStyle(() => ({
  opacity: interpolate(progress.value, [2, 3], [0, 1]),
  transform: [
    { translateX: interpolate(progress.value, [2, 3], [50, 0]) },
  ],
}));
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
      <Animated.View style={detailsStyle}>
        {activeStep === 1 && <Details />}
      </Animated.View>
      <Animated.View style={planStyle}>
        {activeStep === 2 && <Plan />}
      </Animated.View>
      <Animated.View style={reviewStyle}>
        {activeStep === 3 && <Review />}
      </Animated.View>

      <AlreadyAccount
        main="Already have an account ?"
        sub="Login" 
        route="/"
      />
    </View>
    </ScrollView>
  );
};

export default Index;
