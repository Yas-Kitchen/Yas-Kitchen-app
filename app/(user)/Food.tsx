import FoodSectionWeeklyPlan from "@/components/User/Food/FoodSectionWeeklyPlan";
import Specials from "@/components/User/Food/Specials";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Food = () => {
  const [tab, setTab] = useState("weekly");

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const weeklyTabScale = useRef(new Animated.Value(1)).current;
  const specialTabScale = useRef(new Animated.Value(1)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;

  const switchTab = (newTab: string) => {
    if (newTab === tab) return;

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: newTab === "weekly" ? -20 : 20,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTab(newTab);

      contentTranslateX.setValue(newTab === "weekly" ? 20 : -20);

      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateX, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const animateTabPress = (tabType: "weekly" | "special") => {
    const scaleValue = tabType === "weekly" ? weeklyTabScale : specialTabScale;

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateBackPress = () => {
    Animated.sequence([
      Animated.timing(backButtonScale, {
        toValue: 0.9,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(backButtonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ScrollView>
      <View className="mt-16 mx-5 gap-3">
        <View className="flex-row gap-2 items-center">
          <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
            <TouchableOpacity
              onPress={() => {
                animateBackPress();
                router.push("/(user)");
              }}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={20} color={"#212529"} />
            </TouchableOpacity>
          </Animated.View>
          <Text className="text-[#212529] font-semibold text-[16px]">
            Food Section
          </Text>
        </View>
        <View className="flex-row gap-5 items-center justify-center w-full">
          <Animated.View style={{ transform: [{ scale: weeklyTabScale }] }}>
            <TouchableOpacity
              onPress={() => {
                animateTabPress("weekly");
                switchTab("weekly");
              }}
              className={`${
                tab === "weekly" ? "bg-primary/10" : " bg-base_color/10"
              } p-4 rounded-xl`}
              activeOpacity={0.8}
            >
              <Animated.Text
                style={{
                  opacity: tab === "weekly" ? 1 : 0.7,
                }}
                className={`text-center ${
                  tab === "weekly"
                    ? "text-primary font-semibold"
                    : "text-base_color"
                } `}
              >
                Weekly Plan
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: specialTabScale }] }}>
            <TouchableOpacity
              onPress={() => {
                animateTabPress("special");
                switchTab("special");
              }}
              className={` ${
                tab === "special" ? "bg-primary/10" : "bg-base_color/10"
              }  p-4 rounded-xl`}
              activeOpacity={0.8}
            >
              <Animated.Text
                style={{
                  opacity: tab === "special" ? 1 : 0.7,
                }}
                className={`${
                  tab === "special"
                    ? "text-primary font-semibold"
                    : "text-base_color"
                } text-center`}
              >
                Today&apos;s Specials
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateX: contentTranslateX }],
          }}
        >
          {tab === "weekly" ? <FoodSectionWeeklyPlan /> : <Specials />}
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default Food;
