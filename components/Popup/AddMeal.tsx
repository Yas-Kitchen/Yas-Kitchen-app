import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { storage } from "@/services/storage";

interface AddMealProps {
  open: boolean;
  onClose: () => void;
  categoryId: string | null;
  onSuccess?: () => void | undefined;
}

const AddMeal: React.FC<AddMealProps> = ({
  open,
  onClose,
  categoryId,
  onSuccess,
}) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const times = ["Lunch", "Dinner"];

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
  if (!selectedDay || !selectedTime || !title || !categoryId) {
    Alert.alert("Error", "Please fill all required fields");
    return;
  }

  setUploading(true);

  try {
    const tokens = await storage.getTokens();

    console.log("🎯 Selected category ID:", categoryId);

    // Step 1: Get meal plan
    const planResponse = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}meal-plans/category/${categoryId}`,
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      }
    );

    if (!planResponse.ok) throw new Error("Failed to get meal plan");

    const plans = await planResponse.json();
    console.log("📋 All plans returned:", plans);

    // Filter manually since backend isn't filtering
    const matchingPlans = plans.filter((p: any) => p.cuisine_type_id === categoryId);
    console.log("✅ Matching plans:", matchingPlans);

    if (!matchingPlans || matchingPlans.length === 0) {
      Alert.alert(
        "No Meal Plan Found",
        `Please create a meal plan for this category in the database first.\n\nCategory ID: ${categoryId}`
      );
      return;
    }

    const mealPlan = matchingPlans[0];
    const mealPlanId = mealPlan.id;
    console.log("✅ Using meal plan:", mealPlan);

    // Step 2: Get meal time ID
    const mealTimesResponse = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}meal-times/`,
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      }
    );

    const mealTimes = await mealTimesResponse.json();
    const mealTime = mealTimes.find(
      (mt: any) => mt.name.toLowerCase() === selectedTime.toLowerCase()
    );

    if (!mealTime) throw new Error("Meal time not found");

    // Step 3: Upload image (if any)
    let imageUrl = null;
    if (image) {
      const fileName = `meal-${Date.now()}.jpg`;
      const formData = new FormData();
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append("file", blob, fileName);

      const uploadResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}upload/image`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
    }

    // Step 4: Create meal
    console.log("🍽️ Creating meal with cuisine_type_id:", categoryId);

    const mealResponse = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}admin/meal-plans/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokens.accessToken}`,
        },
        body: JSON.stringify({
          name: title,
          description: description,
          cuisine_type_id: categoryId,
          image_url: imageUrl,
          is_available: true,
        }),
      }
    );

    if (!mealResponse.ok) throw new Error("Failed to create meal");

    const meal = await mealResponse.json();
    console.log("✅ Created meal:", meal);

    // Step 5: Add to meal plan
    const itemResponse = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/admin/meal-plans/${mealPlanId}/items`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    if (!itemResponse.ok) {
      const errorText = await itemResponse.text();
      throw new Error(`Failed to add to plan: ${errorText}`);
    }

    Alert.alert("Success", "Meal added successfully!");

    // Reset form
    setSelectedDay("");
    setSelectedTime("");
    setTitle("");
    setDescription("");
    setImage(null);
    if (onSuccess) onSuccess();
    onClose();
  } catch (error: any) {
    console.error("❌ Error:", error);
    Alert.alert("Error", error.message);
  } finally {
    setUploading(false);
  }
};



  if (!visible) return null;

  const content = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-bold">
          Add New Item
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      <Text className="text-base_color text-[12px] mb-2">Day</Text>
      <Pressable
        onPress={() => setShowDayPicker(!showDayPicker)}
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        <Text className={selectedDay ? "text-black" : "text-base_color"}>
          {selectedDay || "Select Day"}
        </Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </Pressable>

      {showDayPicker && (
        <View className="mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {days.map((day) => (
            <Pressable
              key={day}
              onPress={() => {
                setSelectedDay(day);
                setShowDayPicker(false);
              }}
              className="p-4 border-b border-gray-100"
            >
              <Text
                className={
                  selectedDay === day
                    ? "text-primary font-semibold"
                    : "text-black"
                }
              >
                {day}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text className="text-base_color text-[12px] mb-2">Time</Text>
      <Pressable
        onPress={() => setShowTimePicker(!showTimePicker)}
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        <Text className={selectedTime ? "text-black" : "text-base_color"}>
          {selectedTime || "Select Time"}
        </Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </Pressable>

      {showTimePicker && (
        <View className="mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {times.map((time) => (
            <Pressable
              key={time}
              onPress={() => {
                setSelectedTime(time);
                setShowTimePicker(false);
              }}
              className="p-4 border-b border-gray-100"
            >
              <Text
                className={
                  selectedTime === time
                    ? "text-primary font-semibold"
                    : "text-black"
                }
              >
                {time}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text className="text-base_color text-[12px] mb-2">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter meal title"
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="text-base_color text-[12px] mb-2">Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter meal description"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl min-h-[120px]"
        placeholderTextColor="#999"
      />

      <Text className="text-base_color text-[12px] mb-2">Image</Text>
      <Pressable
        onPress={pickImage}
        className="mb-6 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        {image ? (
          <Image source={{ uri: image }} className="w-12 h-12 rounded-lg" />
        ) : (
          <Text className="text-base_color">Upload Image</Text>
        )}
        <Feather name="upload" size={20} color="#666" />
      </Pressable>

      <View className="flex-row gap-3 mb-4">
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
            {uploading ? "Adding..." : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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

export default AddMeal;
