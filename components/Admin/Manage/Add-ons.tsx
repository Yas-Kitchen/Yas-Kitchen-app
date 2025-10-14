import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  available: boolean;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

const Addons = () => {
  const { setPopupNames } = useGlobalContext();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/addons`);
      const result = await response.json();

      if (result.success) {
        setAddons(result.data);
      }
    } catch (error) {
      console.error("Error fetching addons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addonId: string, addonName: string) => {
    Alert.alert(
      "Delete Addon",
      `Are you sure you want to delete "${addonName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/addons/${addonId}`, {
                method: "DELETE",
              });

              if (!response.ok) {
                throw new Error("Failed to delete addon");
              }

              await fetchAddons();
              Alert.alert("Success", "Addon deleted successfully");
            } catch (error) {
              console.error("Error:", error);
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="items-center justify-center mt-10">
        <ActivityIndicator size="large" color="#FF7629" />
      </View>
    );
  }

  return (
    <View className="gap-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-[17px] font-semibold">Add-ons</Text>
        <TouchableOpacity
          onPress={() => setPopupNames("addaddon")}
          className="flex-row gap-2 p-2 items-center bg-primary rounded-lg"
        >
          <Feather name="plus" color={"#ffffff"} size={18} />
          <Text className="text-sm text-white">Add Add-on</Text>
        </TouchableOpacity>
      </View>

      {addons.length === 0 ? (
        <View className="items-center justify-center mt-10">
          <Text className="text-gray-400 text-center text-base">
            No add-ons yet
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-2">
            Click Add Add-on to add your first add-on
          </Text>
        </View>
      ) : (
        <View className="gap-2">
          {addons.map((item) => (
            <View
              key={item.id}
              className="bg-[#ECE9E3] rounded-2xl p-5 flex-row"
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  className="w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3 bg-gray-200 items-center justify-center">
                  <Feather name="image" size={40} color="#999" />
                </View>
              )}
              <View className="flex-col w-1/2 gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-xs font-semibold">{item.name}</Text>
                  <Text className="text-xs font-medium text-primary">
                    AED {item.price.toFixed(2)}
                  </Text>
                </View>
                <Text className="text-xs text-base_color ">
                  {item.description}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      alert("Edit functionality coming soon");
                    }}
                    className="gap-1 items-center p-2 rounded-lg bg-white/50 flex-row"
                  >
                    <Feather name="edit" />
                    <Text className="text-black text-xs">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id, item.name)}
                    className="gap-1 items-center flex-row p-2 bg-red/10 rounded-lg"
                  >
                    <Feather name="trash" color={"#EF4444"} />
                    <Text className="text-red text-xs">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default Addons;
