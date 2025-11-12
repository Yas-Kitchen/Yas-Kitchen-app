import { useGlobalContext } from "@/context/GlobalContext";
import { useUserAPI } from "@/hooks/useUserAPI";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LeaveReqProps {
  open: boolean;
  onClose: () => void;
}

const EditAdress: React.FC<LeaveReqProps> = ({ open, onClose }) => {
  const translateY = useRef(new Animated.Value(300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(open);
  const { address, setAddress } = useGlobalContext();
  const [updatedAddress, setUpdatedAddress] = useState(address);
  const { updateUser } = useUserAPI();

  useEffect(() => {
    if (open) {
      setUpdatedAddress(address);
    }
  }, [open, address]);

  const handleEditAddress = async () => {
    await updateUser({ address: updatedAddress });
    setAddress(updatedAddress);
    onClose();
  };

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

  const content = (
    <>
      <Text className="text-faded_black text-[16px] my-5 font-bold">
        Edit Your Address
      </Text>
      <View>
        <TextInput
          onChangeText={(text) => setUpdatedAddress(text)}
          className="p-5 py-10 h-auto bg-button_bg rounded-2xl"
          placeholder="Enter your address"
          value={updatedAddress}
        />
      </View>
      <View className="flex-row my-5 gap-2">
        <TouchableOpacity
          onPress={() => onClose()}
          className="p-6 web:p-4 w-1/2 bg-button_bg rounded-2xl"
        >
          <Text className="text-faded_black text-center">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleEditAddress()}
          className="p-6 web:p-4 w-1/2 bg-primary rounded-2xl"
        >
          <Text className="text-white text-center">Continue</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (Platform.OS === "web") {
    return (
      <View className="shadow-sm p-5 mx-5 absolute w-[90%] rounded-3xl bg-white z-[50] bottom-0">
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
      className="shadow-sm absolute p-5 rounded-3xl bg-white bottom-0"
    >
      {content}
    </Animated.View>
  );
};

export default EditAdress;
