import { useGlobalContext } from "@/context/GlobalContext";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Linking,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MonthlyPlan from "../Register/MonthlyPlan";

interface LeaveReqProps {
  open: boolean;
  onClose: () => void;
}

const ChangeFoodPlan: React.FC<LeaveReqProps> = ({ open, onClose }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);
  const { monthlyPlan, kidsPlanSelected } = useGlobalContext();

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 300,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
        onClose();
      });
    }
  }, [open, onClose, opacity, translateY]);

  if (!visible) return null;

  const content = (
    <>
      <Text className="text-faded_black text-[16px] font-bold">
        Change your monthly plan
      </Text>
      <View>
        <MonthlyPlan />
      </View>
      <View className="flex-row my-5 gap-2">
        <Pressable
          onPress={() => onClose()}
          className="p-6 w-1/2 bg-button_bg rounded-2xl"
        >
          <Text className="text-faded_black text-center">Back</Text>
        </Pressable>
        <TouchableOpacity
          className="p-6 w-1/2 bg-primary rounded-2xl"
          onPress={() => {
            const message = kidsPlanSelected
              ? `Hi! I want to choose ${monthlyPlan} plan with kids plan`
              : `Hi! I want to choose the following plan: ${monthlyPlan}`;

            const phoneNumber = "918547266801";
            const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
              message
            )}`;

            Linking.openURL(url).catch(() => alert("WhatsApp not installed"));
            Animated.parallel([
              Animated.timing(translateY, {
                toValue: 300,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setVisible(false);
              onClose();
            });
          }}
        >
          <Text className="text-white text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (Platform.OS === "web") {
    return (
      <View className="shadow-sm p-5 mx-5 absolute w-[90%] rounded-3xl bg-white z-[50] bottom-0">
        {content}
      </View>
    );
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        zIndex: 50,
        width: "100%",
        alignSelf: "center",
      }}
      className="shadow-sm absolute p-5 rounded-3xl bg-white bottom-0"
    >
      {content}
    </Animated.View>
  );
};

export default ChangeFoodPlan;
