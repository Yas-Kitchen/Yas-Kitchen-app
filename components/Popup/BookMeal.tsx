import { useGlobalContext } from "@/context/GlobalContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LeaveReqProps {
  open: boolean;
  onClose: () => void;
}

const Bo: React.FC<LeaveReqProps> = ({ open, onClose }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);
  const { kidsPlanSelected } = useGlobalContext();

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);

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

  if (!visible) return null;

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formattedDate = date.toISOString().split("T")[0];

  const content = (
    <>
      <Text className="text-faded_black text-[16px] font-poppins-bold">
        Book Extra Meal
      </Text>
      <Text className="font-poppins text-base_color text-[12px] mt-5">Add Date</Text>
      <View className="font-poppins my-2">
        {Platform.OS === "web" ? (
          <input
            type="date"
            value={formattedDate}
            onChange={(e) => {
              const selected = new Date(e.target.value);
              if (!isNaN(selected.getTime())) {
                setDate(selected);
              }
            }}
            className="font-poppins p-6 bg-button_bg rounded-2xl"
          />
        ) : Platform.OS === "ios" ? (
          <>
            <Pressable
              onPress={() => setShowPicker(true)}
              className="font-poppins p-6 bg-button_bg rounded-2xl"
            >
              <Text>{formattedDate}</Text>
            </Pressable>
            {showPicker && (
              <Modal transparent animationType="slide">
                <View className="font-poppins flex-1 justify-end bg-black/30">
                  <View className="font-poppins bg-white p-5">
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setDate(selectedDate);
                        setShowPicker(false);
                      }}
                    />
                    <Pressable
                      onPress={() => setShowPicker(false)}
                      className="font-poppins mt-2 p-3 bg-primary rounded"
                    >
                      <Text className="font-poppins text-white text-center">Done</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>
            )}
          </>
        ) : (
          <>
            <Pressable
              onPress={() => setShowPicker(true)}
              className="font-poppins p-6 bg-button_bg rounded-2xl"
            >
              <Text>{formattedDate}</Text>
            </Pressable>
            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </>
        )}
      </View>
      <Text className="font-poppins text-base_color text-[12px]">No of People</Text>
      <View className="font-poppins mb-5 mt-2 flex-row items-center justify-center gap-4 bg-button_bg rounded-2xl p-4">
        <Pressable
          onPress={() => setPeopleCount((count) => Math.max(1, count - 1))}
          className="font-poppins p-3 bg-white rounded-full"
        >
          <Text className="text-faded_black text-[12px] font-poppins-bold">-</Text>
        </Pressable>
        <Text className="text-faded_black text-[12px] font-poppins-semibold">
          {peopleCount}
        </Text>
        <Pressable
          onPress={() => setPeopleCount((count) => count + 1)}
          className="font-poppins p-3 bg-white rounded-full"
        >
          <Text className="text-faded_black text-[12px] font-poppins-bold">+</Text>
        </Pressable>
      </View>
      <View className="font-poppins flex-row my-5 gap-2">
        <Pressable
          onPress={() => onClose()}
          className="font-poppins p-6 w-1/2 bg-button_bg rounded-2xl"
        >
          <Text className="font-poppins text-faded_black text-center">Cancel</Text>
        </Pressable>
        <TouchableOpacity
          className="font-poppins p-6 w-1/2 bg-primary rounded-2xl"
          onPress={() => {
            const formatted = date.toISOString().split("T")[0];
            let message = `Hi! I want to order food for ${peopleCount} people on ${formatted}`;
            if (kidsPlanSelected) {
              message += " with kids plan";
            }
            const phoneNumber = "918547266801";
            let url = "";
            if (Platform.OS === "web") {
              url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                message
              )}`;
            } else {
              url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
                message
              )}`;
            }
            Linking.openURL(url).catch(() => alert("WhatsApp not installed"));
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
            });
          }}
        >
          <Text className="font-poppins text-white text-center">Book Meal</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (Platform.OS === "web") {
    return (
      <View className="font-poppins shadow-sm p-5 mx-5 absolute w-[90%] rounded-3xl bg-white z-[50] bottom-0">
        {content}
      </View>
    );
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
        zIndex: 50,
        width: "100%",
        alignSelf: "center",
      }}
      className="font-poppins shadow-sm absolute p-5 rounded-3xl bg-white bottom-0"
    >
      {content}
    </Animated.View>
  );
};

export default Bo;
