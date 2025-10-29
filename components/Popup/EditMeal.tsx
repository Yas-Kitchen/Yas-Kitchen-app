import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useRef, useState } from "react";
import {
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
import { useGlobalContext } from "@/context/GlobalContext";
import { useMeals } from "@/hooks/Admin/Meals/useMealsAPI";

interface EditMealProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditMeal: React.FC<EditMealProps> = ({ open, onClose, onSuccess }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);
  const { selectedMeal, selectedUser } = useGlobalContext();
  const { updateMeal } = useMeals();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (selectedMeal && open) {
      setTitle(selectedMeal.name);
      setDescription(selectedMeal.description);
      setImage(selectedMeal.image_url ?? null);
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
    if (!title) {
      alert("Please enter meal title");
      return;
    }

    if (!selectedMeal?.id) {
      alert("Meal data not found");
      return;
    }

    setUploading(true);

    try {
      let imageBase64 = null;

      if (image && !image.startsWith("http")) {
        imageBase64 = await FileSystem.readAsStringAsync(image, {
          encoding: "base64",
        });
      }

      await updateMeal(selectedMeal.mealPlanId, selectedMeal.id, {
        name: title,
        description,
        image: imageBase64 || image || null,
        userId: selectedUser?.id,
      });

      alert("Meal updated successfully!");

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
        setImage(null);
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
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-bold">
          Edit Meal
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      {selectedMeal && (
        <View className="mb-4 p-4 bg-blue-50 rounded-xl">
          <Text className="text-xs text-gray-600">
            {selectedMeal.day.charAt(0).toUpperCase() +
              selectedMeal.day.slice(1)}{" "}
            •{" "}
            {selectedMeal.time.charAt(0).toUpperCase() +
              selectedMeal.time.slice(1)}
          </Text>
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
            {uploading ? "Updating..." : "Update"}
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
            style={{ transform: [{ translateY }], opacity }}
            className="bg-white rounded-t-3xl p-6"
          >
            {content}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditMeal;
