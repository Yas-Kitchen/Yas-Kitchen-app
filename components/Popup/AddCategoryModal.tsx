import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useGlobalContext } from "@/context/GlobalContext";
import { useMealsAPI } from "@/hooks/useMealsAPI";
import { mealsAPI } from "@/services/api/meals.api";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onClose,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { setPopupNames } = useGlobalContext();
  const { createCuisine, error, loading, fetchCuisineDetails } = useMealsAPI();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Permission to access media library is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert("Error", "Please enter a category name");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    let uploadedImageUrl = "";

    if (imageUri) {
      try {
        uploadedImageUrl = await mealsAPI.uploadMealImage(imageUri);
      } catch (err) {
        Alert.alert(
          "Image Upload Failed",
          "Please try again or choose another image."
        );
        console.error("Upload error:", err);
        return;
      }
    }

    const payload = {
      name: categoryName.trim(),
      description: description.trim(),
      image_url: uploadedImageUrl,
      is_active: true,
    };

    await createCuisine(payload);

    if (!error) {
      Alert.alert(
        "Success",
        "Category created! Please create a meal plan for this cuisine in your database before adding meals."
      );
    }
    setCategoryName("");
    setDescription("");
    setImageUri(null);
    setPopupNames("");
    await fetchCuisineDetails();
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-3xl p-6 w-[90%] max-w-[400px]">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-faded_black text-[20px] font-bold">
              Add New Category
            </Text>
            <Pressable onPress={onClose} disabled={loading}>
              <Feather name="x" size={24} color="#666" />
            </Pressable>
          </View>

          <Text className="text-base_color text-[12px] mb-2">
            Category Name
          </Text>
          <TextInput
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder="e.g., South Indian, Continental"
            className="mb-6 p-4 bg-[#F5F5F5] rounded-xl"
            placeholderTextColor="#999"
            editable={!loading}
          />

          <Text className="text-base_color text-[12px] mb-2">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            className="mb-6 p-4 bg-[#F5F5F5] rounded-xl"
            placeholderTextColor="#999"
            editable={!loading}
            multiline
            numberOfLines={3}
          />

          <Text className="text-base_color text-[12px] mb-2">Upload Image</Text>
          <TouchableOpacity
            onPress={pickImage}
            className="mb-4 p-4 bg-[#F5F5F5] rounded-xl items-center justify-center"
            disabled={loading}
          >
            <Text className="text-faded_black font-medium">Choose Image</Text>
          </TouchableOpacity>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 12,
                marginBottom: 16,
              }}
            />
          ) : null}

          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 p-4 bg-[#F5F5F5] rounded-xl"
              disabled={loading}
            >
              <Text className="text-faded_black text-center font-medium">
                Cancel
              </Text>
            </Pressable>
            <TouchableOpacity
              onPress={handleAddCategory}
              className="flex-1 p-4 bg-[#FF7629] rounded-xl"
              disabled={loading}
              style={{ opacity: loading ? 0.5 : 1 }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-medium">Add</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddCategoryModal;
