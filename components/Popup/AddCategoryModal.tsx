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
  Image,
} from "react-native";
import { useAlert } from "@/context/AlertContext";
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { setPopupNames, setCuisineRefreshKey, setSelectedCategory } =
    useGlobalContext();
  const { createCuisine, error, fetchCuisineDetails } = useMealsAPI();
  const { showAlert } = useAlert();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      showAlert("Error", "Please enter a category name");
      return;
    }
    if (!description.trim()) {
      showAlert("Error", "Please enter a description");
      return;
    }

    setIsLoading(true);
    let uploadedImageUrl = "";

    try {
      if (imageUri) {
        setLoadingMessage("Uploading...");
        uploadedImageUrl = await mealsAPI.uploadMealImage(
          imageUri,
          "categories",
        );
      }

      setLoadingMessage("Adding...");
      const payload = {
        name: categoryName.trim(),
        description: description.trim(),
        image_url: uploadedImageUrl,
        is_active: true,
      };

      const newCategory = await createCuisine(payload);

      if (!error) {
        showAlert(
          "Success",
          "Category created successfully! You can now start adding meals via the 'Add Meal' button.",
        );
      }
      setCategoryName("");
      setDescription("");
      setImageUri(null);
      setPopupNames("");
      await fetchCuisineDetails();
      setCuisineRefreshKey(Date.now());
      // Auto-select the newly created category
      if (newCategory?.id) {
        setSelectedCategory(newCategory.id);
      }
      onClose();
    } catch (err: any) {
      showAlert(
        "Error",
        err.message || "Failed to create category. Please try again.",
      );
      console.error("Creation error:", err);
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade">
      <Pressable
        className="font-poppins flex-1 justify-center items-center bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="font-poppins bg-white rounded-3xl p-6 w-[90%] max-w-[400px]"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="font-poppins flex-row items-center justify-between mb-6">
            <Text className="text-faded_black text-[20px] font-poppins-bold">
              Add New Category
            </Text>
            <Pressable onPress={onClose} disabled={isLoading}>
              <Feather name="x" size={24} color="#666" />
            </Pressable>
          </View>

          <Text className="font-poppins text-base_color text-[12px] mb-2">
            Category Name
          </Text>
          <TextInput
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder="e.g., South Indian, Continental"
            className="font-poppins mb-6 p-4 bg-[#F5F5F5] rounded-xl"
            placeholderTextColor="#999"
            editable={!isLoading}
          />

          <Text className="font-poppins text-base_color text-[12px] mb-2">
            Description
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            className="font-poppins mb-6 p-4 bg-[#F5F5F5] rounded-xl"
            placeholderTextColor="#999"
            editable={!isLoading}
            multiline
            numberOfLines={3}
          />

          <Text className="font-poppins text-base_color text-[12px] mb-2">
            Upload Image
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl items-center justify-center"
            disabled={isLoading}
          >
            <Text className="text-faded_black font-poppins-medium">
              Choose Image
            </Text>
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

          <View className="font-poppins flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="font-poppins flex-1 p-4 bg-[#F5F5F5] rounded-xl"
              disabled={isLoading}
            >
              <Text className="text-faded_black text-center font-poppins-medium">
                Cancel
              </Text>
            </Pressable>
            <TouchableOpacity
              onPress={handleAddCategory}
              className="font-poppins flex-1 p-4 bg-[#FF7629] rounded-xl"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            >
              <Text className="text-white text-center font-poppins-medium">
                {loadingMessage || "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddCategoryModal;
