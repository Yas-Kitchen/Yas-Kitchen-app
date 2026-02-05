import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Animated,
  Easing,
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

interface AddAddonProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddAddon: React.FC<AddAddonProps> = ({ open, onClose, onSuccess }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [price, setPrice] = useState("");
  const [cutoffTime, setCutoffTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [category, setCategory] = useState<"addon" | "kids_meal" | "diet">(
    "addon",
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const { createAddons, fetchAddons, error, loading } = useExtrasApi();
  const textAnim = useRef(new Animated.Value(0)).current;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, opacity, translateY]);

  const handleCategoryPress = (
    option: "addon" | "kids_meal" | "diet",
    index: number,
  ) => {
    if (containerWidth === 0) return;
    const tileWidth = containerWidth / 3;
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: index * tileWidth,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: index,
        duration: 250,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => setCategory(option));
  };

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
    if (!title || !price) {
      alert("Please fill all required fields");
      return;
    }
    try {
      const addonData = {
        name: title,
        description,
        price: parseFloat(price),
        cutoff_time: cutoffTime.toTimeString().split(" ")[0],
        category: category,
      };

      const success = await createAddons(addonData, image ?? "");
      if (success) {
        onClose();
        setTitle("");
        setDescription("");
        setImage(null);
        setPrice("");
        setCutoffTime(new Date());
        onSuccess?.();
      }
      if (error) {
        console.error("Error:", error);
        alert("Something went wrong: " + error);
      }
    } catch (err: any) {
      console.error(err?.message || "Failed to add addons");
    }
    if (!error) alert("Add-on added successfully!");
  };

  if (!visible) return null;

  const content = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="font-poppins flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-poppins-bold">
          Add New Add-on
        </Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={24} color="#666" />
        </Pressable>
      </View>

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Title
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter add-on title"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Description
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter add-on description"
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl min-h-[120px]"
        placeholderTextColor="#999"
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Price (AED)
      </Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter Price"
        keyboardType="decimal-pad"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Category
      </Text>
      <View
        className="font-poppins relative mb-4"
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={{
            position: "absolute",
            height: 40,
            width: containerWidth / 3,
            backgroundColor: "#FF7629",
            borderRadius: 12,
            transform: [{ translateX: slideAnim }],
            zIndex: 0,
          }}
        />
        <View className="font-poppins flex-row justify-between">
          {[
            { label: "Regular", value: "addon" },
            { label: "Kids", value: "kids_meal" },
            { label: "Diet", value: "diet" },
          ].map((option, index) => {
            const animatedTextColor = textAnim.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: ["#222", "#fff", "#222"],
              extrapolate: "clamp",
            });

            return (
              <Pressable
                key={option.value}
                onPress={() =>
                  handleCategoryPress(
                    option.value as "addon" | "kids_meal" | "diet",
                    index,
                  )
                }
                className="font-poppins flex-1 mx-1 p-3 rounded-xl items-center"
                style={{ zIndex: 1 }}
              >
                <Animated.Text
                  style={{
                    fontWeight: "500",
                    color: animatedTextColor,
                  }}
                >
                  {option.label}
                </Animated.Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Order Before Time
      </Text>
      {Platform.OS === "web" ? (
        <View className="font-poppins mb-4 bg-[#F5F5F5] rounded-xl overflow-hidden">
          {React.createElement("input", {
            type: "time",
            value: cutoffTime.toTimeString().split(" ")[0].substring(0, 5),
            onChange: (e: any) => {
              const [hours, minutes] = e.target.value.split(":");
              const newDate = new Date(cutoffTime);
              newDate.setHours(parseInt(hours), parseInt(minutes));
              setCutoffTime(newDate);
            },
            style: {
              padding: 16,
              fontSize: 16,
              border: "none",
              backgroundColor: "transparent",
              outline: "none",
              width: "100%",
            },
          })}
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => setShowTimePicker(true)}
            className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
          >
            <Text className="font-poppins text-base_color">
              {cutoffTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
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
        </>
      )}

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
          disabled={loading}
        >
          <Text className="text-faded_black text-center font-poppins-medium">
            Cancel
          </Text>
        </Pressable>
        <TouchableOpacity
          onPress={handleSubmit}
          className="font-poppins flex-1 p-4 bg-[#FF7629] rounded-xl"
          disabled={loading}
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          <Text className="text-white text-center font-poppins-medium">
            {loading ? "Adding..." : "Add"}
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

export default AddAddon;
