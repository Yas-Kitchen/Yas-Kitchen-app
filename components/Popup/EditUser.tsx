import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useUserAPI } from "@/hooks/useUserAPI";
import { useMealsAPI } from "@/hooks/useMealsAPI";

interface EditUserProps {
  open: boolean;
  onClose: () => void;
  userData?: {
    name: string;
    mobile: string;
    meal_plan_id?: string;
  };
}

const EditUser: React.FC<EditUserProps> = ({ open, onClose, userData }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);

  const [name, setName] = useState(userData?.name || "");
  const [number, setNumber] = useState(userData?.mobile || "");
  const [selectedPlans, setSelectedPlans] = useState<string[]>(
    userData?.meal_plan_id ? [userData.meal_plan_id] : []
  );
  const [uploading, setUploading] = useState(false);
  const { getCategories, monthlyPlan } = useMealsAPI();
  const { updateCategories } = useUserAPI();

  const animationValues = useRef<{ [key: string]: Animated.Value }>({}).current;

  monthlyPlan.forEach((plan) => {
    if (!animationValues[plan.key]) {
      animationValues[plan.key] = new Animated.Value(0);
    }
  });

  useEffect(() => {
    // getCategories();
    if (open) {
      setVisible(true);
      setName(userData?.name || "");
      setNumber(userData?.mobile || "");
      setSelectedPlans(
        Array.isArray(userData?.meal_plan_id)
          ? userData.meal_plan_id
          : userData?.meal_plan_id
          ? [userData.meal_plan_id]
          : []
      );

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
    //eslint-disable-next-line
  }, [open, onClose, opacity, translateY, userData]);

  useEffect(() => {
    monthlyPlan.forEach((plan) => {
      const isSelected = selectedPlans.includes(plan.id);
      Animated.timing(animationValues[plan.key], {
        toValue: isSelected ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
    //eslint-disable-next-line
  }, [selectedPlans]);

  const handlePlanPress = (plan: (typeof monthlyPlan)[0]) => {
    const isKidsPlan = plan.special;
    const isSelected = selectedPlans.includes(plan.id);

    if (isKidsPlan) {
      if (isSelected) {
        setSelectedPlans(selectedPlans.filter((p) => p !== plan.id));
      } else {
        setSelectedPlans([...selectedPlans, plan.id]);
      }
    } else {
      const kidsPlans = selectedPlans.filter((p) => {
        const planObj = monthlyPlan.find((mp) => mp.id === p);
        return planObj?.special;
      });
      setSelectedPlans([plan.id, ...kidsPlans]);
    }
  };

  const handleSubmit = async () => {
    if (selectedPlans.length === 0) {
      alert("Please select one meal plan");
      return;
    }

    setUploading(true);

    try {
      const payload = {
        name,
        mobile: number,
        meal_plan_id: selectedPlans,
      };

      await updateCategories(userId);
      alert("User meal plan updated successfully!");

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
    } catch (error: any) {
      console.error("Error:", error);
      alert("Something went wrong: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!visible) return null;

  const content = (
    <>
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-bold">
          Edit User Plan
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      <Text className="text-base_color text-[12px] mb-3">
        Choose Monthly Plan
      </Text>

      {Array.isArray(monthlyPlan) && monthlyPlan.length > 0 ? (
        monthlyPlan.map((plan) => (
          <Animated.View
            key={plan.id}
            style={{
              borderColor: animationValues[plan.key].interpolate({
                inputRange: [0, 1],
                outputRange: ["transparent", "#FF6F00"],
              }),
              transform: [
                {
                  scale: animationValues[plan.key].interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }),
                },
              ],
              borderWidth: 2,
              borderRadius: 16,
              marginTop: 20,
              overflow: "hidden",
            }}
          >
            <Pressable onPress={() => handlePlanPress(plan)}>
              {plan.special ? (
                <View className="flex-row items-center bg-[#F0F1EB] rounded-xl p-4">
                  <Image
                    style={{ height: 90, width: 90 }}
                    source={{ uri: plan.image_url }}
                  />
                  <View className="ml-4 flex-1">
                    <Text className="text-[16px] font-semibold">
                      {plan.name}
                    </Text>
                    <Text className="text-base_color text-[12px] mt-1">
                      {plan.description}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Image
                        className="w-[10px] h-[10px]"
                        source={require("@assets/Shared/dirham.svg")}
                      />
                      <Text className="text-primary font-semibold ml-1">
                        {plan.price} /mo
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`rounded-[5px] w-5 h-5 ${
                      selectedPlans.includes(plan.id)
                        ? "bg-primary"
                        : "bg-base_color/10"
                    }`}
                  />
                </View>
              ) : (
                <View className={`bg-[#F0F1EB] pr-10 flex-row`}>
                  <Image
                    style={{ height: 110, width: 110 }}
                    source={{ uri: plan.image_url }}
                  />
                  <View className="flex-row pt-6 gap-1 ml-2 flex-1">
                    <View className="flex-col w-1/2">
                      <Text className="text-[14px] font-semibold">
                        {plan.name}
                      </Text>
                      <Text className="text-base_color text-[12px] text-regular flex-1">
                        {plan.description}
                      </Text>
                    </View>
                    <View className="flex-row text-center items-baseline gap-1 w-1/2">
                      <Image
                        className="w-[10px] h-[10px]"
                        source={require("@assets/Shared/dirham.svg")}
                      />
                      <Text className="text-primary font-semibold">
                        {plan.price} /mo
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`rounded-full absolute bottom-4 right-3 w-5 h-5 ${
                      selectedPlans.includes(plan.id)
                        ? "bg-primary"
                        : "bg-base_color/10"
                    }`}
                  />
                </View>
              )}
            </Pressable>
          </Animated.View>
        ))
      ) : (
        <Text className="text-base_color mt-2">No plans available</Text>
      )}

      <View className="flex-row gap-3 mb-4 mt-6">
        <Pressable
          onPress={onClose}
          className="flex-1 p-4 bg-[#F5F5F5] rounded-xl"
          disabled={uploading}
        >
          <Text className="text-faded_black text-center font-medium">
            Cancel
          </Text>
        </Pressable>
        <TouchableOpacity
          onPress={handleSubmit}
          className="flex-1 p-4 bg-[#FF7629] rounded-xl"
          disabled={uploading}
          style={{ opacity: uploading ? 0.5 : 1 }}
        >
          <Text className="text-white text-center font-medium">
            {uploading ? "Updating..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (Platform.OS === "web") {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-6 w-[90%] max-w-[500px] max-h-[90%]">
            {content}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable onPress={onClose} className="flex-1 bg-black/50 justify-end">
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={{
              transform: [{ translateY }],
              opacity,
            }}
            className="bg-white rounded-t-3xl p-6"
          >
            {content}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditUser;
