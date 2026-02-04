import { useGlobalContext } from "@/context/GlobalContext";
import { useExtrasApi } from "@/hooks/useExtrasApi";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAlert } from "@/context/AlertContext";

const Specials = () => {
  const { setPopupNames } = useGlobalContext();
  const { showAlert } = useAlert();
  const { loading, specials, fetchSpecialsByDate, deleteSpecials } =
    useExtrasApi();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchSpecialsByDate(selectedDate.toISOString().split("T")[0]);
    //eslint-disable-next-line
  }, [selectedDate]);

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
    showAlert(
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
            await fetchSpecialsByDate(selectedDate.toISOString().split("T")[0]);
          },
        },
      ]
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
      <View className="font-poppins flex-row justify-between items-center mb-2">
        <View className="font-poppins flex-col">
          <Text className="text-[17px] font-poppins-semibold">Specials</Text>
          <Text className="font-poppins text-xs text-gray-500 mt-1">
            {selectedDate.toDateString()}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setPopupNames("addspecial")}
          className="font-poppins flex-row gap-2 p-2 items-center bg-primary rounded-lg"
        >
          <Feather name="plus" color={"#ffffff"} size={18} />
          <Text className="font-poppins text-sm text-white">Add Special</Text>
        </TouchableOpacity>
      </View>

      <View className="font-poppins mb-4">
        <Text className="text-xs text-gray-500 mb-2 font-poppins-medium uppercase tracking-wider">
          Filter by Date
        </Text>
        {Platform.OS === "web" ? (
          <View className="font-poppins bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {React.createElement("input", {
              type: "date",
              value: selectedDate.toISOString().split("T")[0],
              onChange: (e: any) => setSelectedDate(new Date(e.target.value)),
              style: {
                padding: 12,
                fontSize: 14,
                border: "none",
                backgroundColor: "transparent",
                outline: "none",
                width: "100%",
                color: "#333",
                cursor: "pointer",
              },
            })}
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="font-poppins bg-white border border-gray-200 p-3 rounded-xl flex-row items-center justify-between shadow-sm"
            >
              <Text className="text-gray-700 font-poppins-medium">
                {selectedDate.toDateString()}
              </Text>
              <Feather name="calendar" size={18} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setSelectedDate(date);
                }}
              />
            )}
          </>
        )}
      </View>

      {specials.length === 0 ? (
        <View className="font-poppins items-center justify-center mt-10 p-8 bg-gray-50 rounded-2xl border-dashed border-2 border-gray-200">
          <Feather name="inbox" size={40} color="#CBD5E1" className="font-poppins mb-3" />
          <Text className="text-gray-500 text-center text-base font-poppins-medium">
            No specials found
          </Text>
          <Text className="font-poppins text-gray-400 text-center text-sm mt-1">
            No specials available for {selectedDate.toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <View className="font-poppins gap-2">
          {specials.map((item) => (
            <View
              key={item.id}
              className="font-poppins bg-[#ECE9E3] rounded-2xl p-5 flex-row"
            >
              <Image
                source={{ uri: item.image_url }}
                className="font-poppins w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3"
                resizeMode="cover"
              />

              <Text className="text-xs font-poppins-medium absolute right-5 top-5 text-primary">
                AED {Number(item.price).toFixed(2)}
              </Text>
              <View className="font-poppins flex-col w-1/2 gap-2 my-auto">
                <Text className="text-sm font-poppins-semibold">{item.name}</Text>
                <Text className="font-poppins text-xs text-base_color ">
                  {item.description}
                </Text>
                <View className="font-poppins flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id, item.name)}
                    className="font-poppins gap-1 items-center flex-row p-2 bg-red/10 rounded-lg"
                  >
                    <Feather name="trash" color={"#EF4444"} />
                    <Text className="font-poppins text-red text-xs">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text className="right-5 bottom-5 absolute text-xs font-poppins-medium text-red">Cutoff time : {formatTime(item.cutoff_time ?? "")}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default Specials;
