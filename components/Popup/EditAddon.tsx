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
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Feather } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalContext";
import { useExtrasApi } from "@/hooks/useExtrasApi";
import { EditAddonProps } from "@/types/extras.types";

const EditAddon: React.FC<EditAddonProps> = ({ open, onClose, onSuccess }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);
  const { selectedAddon } = useGlobalContext();
  const { updateAddons } = useExtrasApi();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [cutoffTime, setCutoffTime] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (selectedAddon) {
      setName(selectedAddon.name || "");
      setDescription(selectedAddon.description || "");
      setPrice(selectedAddon.price ? String(selectedAddon.price) : "");
      setCutoffTime(selectedAddon.cutoff_time || "");
      setImage(selectedAddon.image_url ?? null);
    }
  }, [selectedAddon]);

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

  const handleTimePicked = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const h = selectedTime.getHours().toString().padStart(2, "0");
      const m = selectedTime.getMinutes().toString().padStart(2, "0");
      setCutoffTime(`${h}:${m}`);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      alert("Please enter add-on name");
      return;
    }
    if (!price) {
      alert("Please enter price");
      return;
    }
    if (!selectedAddon?.id) {
      alert("Addon data not found");
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
      await updateAddons(selectedAddon.id, {
        name,
        description,
        price: parseFloat(price),
        cutoff_time: cutoffTime,
        image_url: imageBase64 || image || undefined,
      });
      alert("Add-on updated successfully!");
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
        setName("");
        setDescription("");
        setPrice("");
        setCutoffTime("");
        setImage(null);
      });
    } catch (error: any) {
      console.error("Error:", error);
      alert("Something went wrong: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Import DateTimePicker only for native (to avoid web errors)
  let DateTimePicker: any = null;
  if (Platform.OS !== ("web" as any)) {
    //eslint-disable-next-line
    DateTimePicker = require("@react-native-community/datetimepicker").default;
  }

  if (!visible) return null;

  const content = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="font-poppins flex-row items-center justify-between mb-6">
        <Text className="text-faded_black text-[20px] font-poppins-bold">
          Change name
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
        placeholder="Enter add-on name"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Description
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
        multiline
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Price
      </Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl"
        placeholderTextColor="#999"
      />

      <Text className="font-poppins text-base_color text-[12px] mb-2">
        Cutoff Time
      </Text>
      <Pressable
        onPress={() => setShowTimePicker(true)}
        className="font-poppins mb-4 p-4 bg-[#F5F5F5] rounded-xl flex-row items-center justify-between"
      >
        <Text className="font-poppins text-base_color">
          {cutoffTime
            ? (() => {
                try {
                  return new Date(
                    `1970-01-01T${cutoffTime}Z`,
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                } catch {
                  return cutoffTime;
                }
              })()
            : "Pick cutoff time"}
        </Text>
        <Feather name="clock" size={20} color="#666" />
      </Pressable>
      {/* Time Picker */}
      {showTimePicker && Platform.OS !== "web" && (
        <View>
          <DateTimePicker
            mode="time"
            value={
              cutoffTime ? new Date(`1970-01-01T${cutoffTime}:00`) : new Date()
            }
            is24Hour={true}
            display="default"
            onChange={handleTimePicked}
          />
        </View>
      )}

      {showTimePicker && Platform.OS === "web" && (
        <input
          type="time"
          value={cutoffTime}
          onChange={(e) => {
            setCutoffTime(e.target.value);
            setShowTimePicker(false);
          }}
          style={{
            marginBottom: 16,
            padding: 16,
            borderRadius: 12,
            border: "1px solid #F5F5F5",
            fontSize: 16,
          }}
        />
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
      <Pressable
        onPress={onClose}
        className="font-poppins flex-1 bg-black/50 justify-end"
      >
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

export default EditAddon;
