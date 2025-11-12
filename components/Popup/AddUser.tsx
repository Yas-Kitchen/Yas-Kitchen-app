import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { storage } from "@/services/storage";

interface AddUserProps {
  open: boolean;
  onClose: () => void;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

const AddUser: React.FC<AddUserProps> = ({ open, onClose }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  // useEffect(() => {
  //   // Fetch categories on mount
  //   const fetchCategories = async () => {
  //     try {
  //       const tokens = await storage.getTokens();
  //       const response = await fetch(
  //         `${process.env.EXPO_PUBLIC_API_URL}cuisine-types/`,
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${tokens.accessToken}`,
  //           },
  //         }
  //       );
  //       const data = await response.json();
  //       if (response.ok) {
  //         setCategories(data);
  //       } else {
  //         console.error("Failed to fetch categories:", data);
  //         alert("Failed to fetch categories");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching categories:", error);
  //       alert("Error fetching categories");
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  const handleSubmit = async () => {
    if (!name || !number || !selectedCategory) {
      alert("Please fill all required fields");
      return;
    }

    setUploading(true);

    try {
      const payload = {
        name,
        number,
        meal_type: selectedCategory,
      };

      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add user");
      }

      alert("User added successfully!");

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
        setName("");
        setNumber("");
        setSelectedCategory(null);
        setShowCategoryPicker(false);
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
          Add New User
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      <Text className="text-base_color text-[12px] mb-2">Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="text-base_color text-[12px] mb-2">Number</Text>
      <TextInput
        value={number}
        onChangeText={setNumber}
        placeholder="Enter number"
        keyboardType="phone-pad"
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="text-base_color text-[12px] mb-2">Meal Type</Text>
      <Pressable
        onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        <Text className={selectedCategory ? "text-black" : "text-base_color"}>
          {selectedCategory || "Select Meal Type"}
        </Text>
        <Feather name="chevron-down" size={20} color="#666" />
      </Pressable>

      {showCategoryPicker && (
        <View className="mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => {
                setSelectedCategory(category);
                setShowCategoryPicker(false);
              }}
              className="p-4 border-b border-gray-100"
            >
              <Text
                className={
                  selectedCategory === category
                    ? "text-primary font-semibold"
                    : "text-black"
                }
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

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

export default AddUser;
