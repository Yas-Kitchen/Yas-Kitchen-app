import { useGlobalContext } from "@/context/GlobalContext";
import { useExtrasApi } from "@/hooks/useExtrasApi";
import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAlert } from "@/context/AlertContext";

const Addons = () => {
  const { setPopupNames, setSelectedAddon, addonRefreshKey } =
    useGlobalContext();
  const { loading, addons, deleteAddon, fetchAddons } = useExtrasApi();
  const { showAlert } = useAlert();
  useEffect(() => {
    fetchAddons();
    //eslint-disable-next-line
  }, [addonRefreshKey]);

  const formatCutoffTime = (time: string) => {
    if (!time) return "No cutoff time";
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const handleDelete = async (addonId: string, addonName: string) => {
    showAlert(
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
            deleteAddon(addonId);
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View className="font-poppins items-center justify-center mt-10">
        <ActivityIndicator size="large" color="#FF7629" />
      </View>
    );
  }

  return (
    <View className="font-poppins gap-3">
      <View className="font-poppins flex-row justify-between items-center">
        <Text className="text-[17px] font-poppins-semibold">Add-ons</Text>
        <TouchableOpacity
          onPress={() => setPopupNames("addaddon")}
          className="font-poppins flex-row gap-2 p-2 items-center bg-primary rounded-lg"
        >
          <Feather name="plus" color={"#ffffff"} size={18} />
          <Text className="font-poppins text-sm text-white">Add Add-on</Text>
        </TouchableOpacity>
      </View>

      {addons.length === 0 ? (
        <View className="font-poppins items-center justify-center mt-10">
          <Text className="font-poppins text-gray-400 text-center text-base">
            No add-ons yet
          </Text>
          <Text className="font-poppins text-gray-400 text-center text-sm mt-2">
            Click Add Add-on to add your first add-on
          </Text>
        </View>
      ) : (
        <View className="font-poppins gap-2">
          {addons.map((item) => (
            <View
              key={item.id}
              className="font-poppins bg-[#ECE9E3] rounded-2xl p-5 flex-row"
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  className="font-poppins w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3"
                  resizeMode="cover"
                />
              ) : (
                <View className="font-poppins w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3 bg-gray-200 items-center justify-center">
                  <Feather name="image" size={40} color="#999" />
                </View>
              )}
              <Text className="text-xs font-poppins-medium absolute right-5 top-5 text-primary">
                AED {Number(item.price)}
              </Text>
              <View className="font-poppins flex-col w-1/2 gap-2">
                <Text className="text-sm font-poppins-semibold mt-4">
                  {item.name}
                </Text>
                <Text className="font-poppins text-xs text-base_color ">
                  {item.description}
                </Text>
                <View className="font-poppins flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setPopupNames("editaddon");
                      setSelectedAddon(item);
                    }}
                    className="font-poppins gap-1 items-center p-2 rounded-lg bg-white/50 flex-row"
                  >
                    <Feather name="edit" />
                    <Text className="font-poppins text-black text-xs">
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id, item.name)}
                    className="font-poppins gap-1 items-center flex-row p-2 bg-red/10 rounded-lg"
                  >
                    <Feather name="trash" color={"#EF4444"} />
                    <Text className="font-poppins text-red text-xs">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text className="font-poppins text-xs text-red mt-1 absolute bottom-0 right-0">
                  Cutoff Time :{" "}
                  {item.cutoff_time
                    ? formatCutoffTime(item.cutoff_time)
                    : "No cutoff time"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default Addons;
