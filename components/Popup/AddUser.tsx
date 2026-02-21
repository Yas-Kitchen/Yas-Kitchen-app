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
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/context/AlertContext";

interface AddUserProps {
  open: boolean;
  onClose: () => void;
  isDietUser?: boolean;
}

const AddUser: React.FC<AddUserProps> = ({
  open,
  onClose,
  isDietUser = false,
}) => {
  const { showAlert } = useAlert();
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await supabase
          .from("categories")
          .select("id, name")
          .eq("is_active", true)
          .order("name");
        if (data) setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    if (open) loadCategories();
  }, [open]);

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

  const handleSubmit = async () => {
    if (!name || !number || !address || (!isDietUser && !selectedCategory)) {
      showAlert("Missing Fields", "Please fill all required fields");
      return;
    }

    setUploading(true);

    try {
      const insertData: any = {
        name: name.trim(),
        phone_number: number.replace(/\D/g, ""),
        address: address.trim(),
        status: "active",
        role: "user",
      };

      if (isDietUser) {
        insertData.has_diet_plan = true;
      } else {
        insertData.selected_main_category_id = selectedCategory;
      }

      // Insert user directly into Supabase
      const { data, error } = await supabase
        .from("users")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      showAlert("Success", "User added successfully!");

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
        setAddress("");
        setSelectedCategory(null);
        setShowCategoryPicker(false);
      });
    } catch (error: any) {
      console.error("Error:", error);
      showAlert("Error", "Something went wrong: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!visible) return null;

  const content = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="font-poppins flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-poppins-bold">
          Add New User
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Number
      </Text>
      <TextInput
        value={number}
        onChangeText={setNumber}
        placeholder="Enter number"
        keyboardType="phone-pad"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Address
      </Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
        multiline
        numberOfLines={2}
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Meal Type
      </Text>
      {isDietUser ? (
        <View className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl">
          <Text className="text-black font-poppins-medium">Diet Plan</Text>
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
          >
            <Text
              className={selectedCategory ? "text-black" : "text-base_color"}
            >
              {categories.find((c) => c.id === selectedCategory)?.name ||
                "Select Meal Type"}
            </Text>
            <Feather name="chevron-down" size={20} color="#666" />
          </Pressable>

          {showCategoryPicker && (
            <View
              className="font-poppins mb-4 bg-white border border-gray-200 rounded-xl overflow-hidden"
              style={{ zIndex: 100 }}
            >
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setShowCategoryPicker(false);
                  }}
                  className="font-poppins p-4 border-b border-gray-100"
                >
                  <Text
                    className={
                      selectedCategory === category.id
                        ? "text-primary font-poppins-semibold"
                        : "text-black"
                    }
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </>
      )}

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

export default AddUser;
