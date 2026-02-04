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
import { useGlobalContext } from "@/context/GlobalContext";
import { useMealsAPI } from "@/hooks/useMealsAPI";

interface EditMealProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditMeal: React.FC<EditMealProps> = ({ open, onClose, onSuccess }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);
  const { showAlert } = useAlert();
  const { selectedMeal } = useGlobalContext();
  const { updateMeal } = useMealsAPI();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedMeal && open) {
      setTitle(selectedMeal.name ?? "");
      setDescription(selectedMeal.description ?? "");
      setPrice(selectedMeal.price?.toString() ?? "");
      setImage(selectedMeal.image ?? null);
    }
  }, [selectedMeal, open]);

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
    if (!title.trim()) {
      showAlert("Validation Error", "Please enter a meal title");
      return;
    }

    if (!selectedMeal) {
      showAlert("Missing Data", "Meal data not found");
      return;
    }

    setUploading(true);

    try {
      await updateMeal(selectedMeal.mealId, {
        name: title.trim(),
        description,
        price: parseFloat(price) || 0,
        image: image || null,
      });

      showAlert("Success", "Meal updated successfully!");

      onSuccess?.();

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
        setTitle("");
        setDescription("");
        setPrice("");
        setImage(null);
      });
    } catch (error: any) {
      console.error("Error:", error);
      showAlert("Error", error?.message || "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  if (!visible) return null;

  const content = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="font-poppins flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-poppins-bold">
          Edit Meal
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      {selectedMeal && (
        <View className="font-poppins mb-4 p-4 bg-blue-50 rounded-xl">
          <Text className="font-poppins text-xs text-gray-600">
            {selectedMeal.day.charAt(0).toUpperCase() +
              selectedMeal.day.slice(1)}{" "}
            •{" "}
            {selectedMeal.timeSlot.charAt(0).toUpperCase() +
              selectedMeal.timeSlot.slice(1)}
          </Text>
        </View>
      )}

      <Text className="font-poppins text-base_color text-[12px] mb-2">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter meal title"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
        style={{ fontSize: 16 }}
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">Description</Text>
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

      <Text className="font-poppins text-base_color text-[12px] mb-2">Price (AED)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
        style={{ fontSize: 16 }}
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">Image</Text>
      <Pressable
        onPress={pickImage}
        className="font-poppins mb-6 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        {image ? (
          <Image source={{ uri: image }} className="font-poppins w-12 h-12 rounded-lg" />
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
            {uploading ? "Updating..." : "Update"}
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
      <Pressable onPress={onClose} className="font-poppins flex-1 bg-black/50 justify-end">
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={{ transform: [{ translateY }], opacity }}
            className="font-poppins bg-white rounded-t-3xl p-6"
          >
            {content}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditMeal;
