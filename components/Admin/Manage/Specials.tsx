import { useGlobalContext } from "@/context/GlobalContext";
import { useExtrasApi } from "@/hooks/useExtrasApi";
import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Specials = () => {
  const { setPopupNames } = useGlobalContext();
  const { loading, specials, fetchTodaySpecials, deleteSpecials } =
    useExtrasApi();

  useEffect(() => {
    fetchTodaySpecials();
    //eslint-disable-next-line
  }, []);

  const convertToNumber = (value: string): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(convertToNumber(hours), convertToNumber(minutes));
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  

  const handleDelete = async (specialId: string, specialName: string) => {
    Alert.alert(
      "Delete Special",
      `Are you sure you want to delete "${specialName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteSpecials(specialId);
            await fetchTodaySpecials();
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
        <Text className="text-[17px] font-semibold">Today&apos;s Specials</Text>
        <TouchableOpacity
          onPress={() => setPopupNames("addspecial")}
          className="flex-row gap-2 p-2 items-center bg-primary rounded-lg"
        >
          <Feather name="plus" color={"#ffffff"} size={18} />
          <Text className="text-sm text-white">Add Special</Text>
        </TouchableOpacity>
      </View>

      {specials.length === 0 ? (
        <View className="items-center justify-center mt-10">
          <Text className="text-gray-400 text-center text-base">
            No specials yet
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-2">
            Click Add Special to add your first special
          </Text>
        </View>
      ) : (
        <View className="gap-2">
          {specials.map((item) => (
            <View
              key={item.id}
              className="bg-[#ECE9E3] rounded-2xl p-5 flex-row"
            >
              <Image
                source={{ uri: item.image_url }}
                className="w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3"
                resizeMode="cover"
              />

              <Text className="text-xs font-medium absolute right-5 top-5 text-primary">
                AED {Number(item.price).toFixed(2)}
              </Text>
              <View className="flex-col w-1/2 gap-2 my-auto">
                <Text className="text-sm font-semibold">{item.name}</Text>
                <Text className="text-xs text-base_color ">
                  {item.description}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id, item.name)}
                    className="gap-1 items-center flex-row p-2 bg-red/10 rounded-lg"
                  >
                    <Feather name="trash" color={"#EF4444"} />
                    <Text className="text-red text-xs">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text className="right-5 bottom-5 absolute text-xs font-medium text-red">Cutoff time : {formatTime(item.cutoff_time ?? "")}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default Specials;
