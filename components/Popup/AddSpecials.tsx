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
import { useExtrasApi } from "@/hooks/useExtrasApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AddSpecialsProps } from "@/types/extras.types";

const AddSpecials: React.FC<AddSpecialsProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [cutoffTime, setCutoffTime] = useState(new Date());
  const [availableDate, setAvailableDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { loading, createSpecial,fetchTodaySpecials } = useExtrasApi();

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
    if (!title || !price) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const specialData = {
        name: title,
        description,
        price: parseFloat(price),
        available_date: availableDate.toISOString().split("T")[0],
        cutoff_time: cutoffTime.toTimeString().split(" ")[0],
      };

      const success = await createSpecial(specialData, image ?? "");

      if (success) {
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
          setPrice("");
          setCutoffTime(new Date());
          setAvailableDate(new Date());
          fetchTodaySpecials();
          onSuccess?.();
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      Alert.alert("Something went wrong: " + error.message);
    }
  };

  if (!visible) return null;

  const content = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-bold">
          Add New Special
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      <Text className="text-base_color text-[12px] mb-2">Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter special title"
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="text-base_color text-[12px] mb-2">Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter special description"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl min-h-[120px]"
        placeholderTextColor="#999"
      />

      <Text className="text-base_color text-[12px] mb-2">Price (AED)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter Price"
        keyboardType="decimal-pad"
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="text-base_color text-[12px] mb-2">Available Date</Text>
      <Pressable
        onPress={() => setShowDatePicker(true)}
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl"
      >
        <Text className="text-base_color">
          {availableDate.toISOString().split("T")[0]}
        </Text>
      </Pressable>
      {showDatePicker && (
        <DateTimePicker
          value={availableDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setAvailableDate(selectedDate);
          }}
        />
      )}

      <Text className="text-base_color text-[12px] mb-2">Order Before Time</Text>
      <Pressable
        onPress={() => setShowTimePicker(true)}
        className="mb-4 p-4 bg-[#F5F5F5] rounded-xl"
      >
        <Text className="text-base_color">
          {cutoffTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Pressable>
      {showTimePicker && (
        <DateTimePicker
          value={cutoffTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setCutoffTime(selectedTime);
          }}
        />
      )}

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
          disabled={loading}
        >
          <Text className="text-faded_black text-center font-medium">
            Cancel
          </Text>
        </Pressable>
        <TouchableOpacity
          onPress={handleSubmit}
          className="flex-1 p-4 bg-[#FF7629] rounded-xl"
          disabled={loading}
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          <Text className="text-white text-center font-medium">
            {loading ? "Adding..." : "Add"}
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

export default AddSpecials;
