import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  Animated,
  Modal,
  Platform,
  Image,
} from "react-native";
import { useAlert } from "@/context/AlertContext";
import { mealsAPI } from "@/services/api/meals.api";
import { useGlobalContext } from "@/context/GlobalContext";
import { AddMealProps } from "@/types/meals.types";
import { useDietPlanAPI } from "@/hooks/useDietPlanAPI";

const AddDietMeals: React.FC<AddMealProps> = ({
  open,
  onClose,
  categoryId,
  onSuccess,
  cuisineId,
}) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { createDietPlan, updateDietPlan, getUserDietPlan } = useDietPlanAPI();
  const { currentWeeklyMenu, setMealRefreshKey } = useGlobalContext();
  const { selectedDietUser } = useGlobalContext();
  const { showAlert } = useAlert();

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
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDay || !selectedTime || !title) {
      showAlert("Error", "Please fill all required fields");
      return;
    }

    if (!image) {
      showAlert(
        "Image required",
        "Please upload an image for the meal before saving.",
      );
      return;
    }

    const dayKey = selectedDay.toLowerCase();
    const timeKey = selectedTime.toLowerCase();

    setUploading(true);
    try {
      let uploadedImageUrl: string | null = image;

      if (image && !image.startsWith("http")) {
        uploadedImageUrl = await mealsAPI.uploadMealImage(image, "diet");
      }

      let existingPlan = null;
      try {
        existingPlan = await getUserDietPlan(selectedDietUser.id);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          throw error;
        }
      }

      if (existingPlan && existingPlan.weekly_menu?.[dayKey]?.[timeKey]) {
        showAlert(
          "Meal already exists",
          `A meal is already scheduled for ${selectedDay} ${selectedTime}. Please edit or delete it before adding another.`,
        );
        setUploading(false);
        return;
      }

      const newMeal = {
        meal_id: null,
        name: title,
        description: description,
        availability: "available",
        rating: 0,
        image: uploadedImageUrl,
        price: parseFloat(price) || 0,
      };

      if (existingPlan) {
        const updatedWeeklyMenu = {
          ...existingPlan.weekly_menu,
          [dayKey]: {
            ...existingPlan.weekly_menu?.[dayKey],
            [timeKey]: newMeal,
          },
        };

        await updateDietPlan(selectedDietUser.id, {
          weekly_menu: updatedWeeklyMenu,
        });
      } else {
        const mealPayload = {
          plan_details: {
            name: `${selectedDay} ${selectedTime} Meal`,
            description: `Meal for ${selectedDay} ${selectedTime}`,
          },
          is_active: true,
          weekly_menu: {
            [dayKey]: {
              [timeKey]: newMeal,
            },
          },
        };

        await createDietPlan(selectedDietUser.id, mealPayload);
      }

      setMealRefreshKey(Date.now());

      setSelectedDay("");
      setSelectedTime("");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);

      onClose();
    } catch (err: any) {
      console.error(" Error:", err);
      showAlert("Error", err.message || "Failed to add meal");
    } finally {
      setUploading(false);
    }
  };

  if (!visible) return null;

  const content = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="font-poppins flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-poppins-bold">
          Add New Item
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      <Text className="font-poppins text-base_color text-[12px] mb-2">Day</Text>
      <Pressable
        onPress={() => setShowDayPicker(!showDayPicker)}
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        <Text className={selectedDay ? "text-black" : "text-base_color"}>
          {selectedDay || "Select Day"}
        </Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </Pressable>

      {showDayPicker && (
        <View className="font-poppins mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {days.map((day) => (
            <Pressable
              key={day}
              onPress={() => {
                setSelectedDay(day);
                setShowDayPicker(false);
              }}
              className="font-poppins p-4 border-b border-gray-100"
            >
              <Text
                className={
                  selectedDay === day
                    ? "text-primary font-poppins-semibold"
                    : "text-black"
                }
              >
                {day}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Time
      </Text>
      <Pressable
        onPress={() => setShowTimePicker(!showTimePicker)}
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        <Text className={selectedTime ? "text-black" : "text-base_color"}>
          {selectedTime || "Select Time"}
        </Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </Pressable>

      {showTimePicker && (
        <View className="font-poppins mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {times.map((time) => (
            <Pressable
              key={time}
              onPress={() => {
                setSelectedTime(time);
                setShowTimePicker(false);
              }}
              className="font-poppins p-4 border-b border-gray-100"
            >
              <Text
                className={
                  selectedTime === time
                    ? "text-primary font-poppins-semibold"
                    : "text-black"
                }
              >
                {time}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Title
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter meal title"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
        style={{ fontSize: 16 }}
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Description
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter meal description"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl min-h-[120px]"
        placeholderTextColor="#999"
        style={{ fontSize: 16 }}
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Price (AED)
      </Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
        style={{ fontSize: 16 }}
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Image
      </Text>
      <Pressable
        onPress={pickImage}
        className="font-poppins mb-6 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        {image ? (
          <Image
            source={{ uri: image }}
            className="font-poppins w-12 h-12 rounded-lg"
          />
        ) : (
          <Text className="font-poppins text-base_color">Upload Image</Text>
        )}
        <Feather name="upload" size={20} color="#666" />
      </Pressable>

      <View className="font-poppins flex-row gap-3 mb-4">
        <Pressable
          onPress={onClose}
          className="font-poppins flex-1 p-4 bg-[#F5F5F5] rounded-xl"
          disabled={uploading}
        >
          <Text className="text-faded_black text-center font-poppins-medium">
            Cancel
          </Text>
        </Pressable>
        <TouchableOpacity
          onPress={handleSubmit}
          className="font-poppins flex-1 p-4 bg-[#FF7629] rounded-xl"
          disabled={uploading}
          style={{ opacity: uploading ? 0.5 : 1 }}
        >
          <Text className="text-white text-center font-poppins-medium">
            {uploading ? "Adding..." : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (Platform.OS === "web") {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View className="font-poppins flex-1 justify-center items-center bg-black/50">
          <View className="font-poppins bg-white rounded-3xl p-6 w-[90%] max-w-[400px] max-h-[90%]">
            {content}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="none">
      <Pressable
        onPress={onClose}
        className="font-poppins flex-1 bg-black/50 justify-end"
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={{
              transform: [{ translateY }],
              opacity,
            }}
            className="font-poppins bg-white rounded-t-3xl p-6"
          >
            {content}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddDietMeals;
