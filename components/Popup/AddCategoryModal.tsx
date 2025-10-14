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
} from "react-native";
import { useGlobalContext } from "@/context/GlobalContext";

interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  open,
  onClose,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const { addCategory } = useGlobalContext();

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    setLoading(true);

    try {
      await addCategory(categoryName.trim());

      alert("Category added successfully!");
      setCategoryName("");
      onClose();
    } catch (error: any) {
      alert(error.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
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
