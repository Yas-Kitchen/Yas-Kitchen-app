import { useGlobalContext } from "@/context/GlobalContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const AdminPass = () => {
  const { mobile } = useGlobalContext();
  const [password, setPassword] = useState("");
  const adminPass = process.env.EXPO_PUBLIC_ADMIN_PASS;

  const handleVerify = () => {
    if (password === adminPass) {
      router.push("/(admin)/admin");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <>
      <Pressable className="font-poppins mt-20 absolute mx-5" onPress={() => router.back()}>
        <Feather name="chevron-left" size={30} />
      </Pressable>
      <View className="font-poppins mx-5 justify-center h-screen">
        <Text className="text-[20px] font-poppins-bold text-center text-faded_black">
          Admin Login
        </Text>
        <Text className="font-poppins text-center mt-3">{mobile}</Text>
        <View className="font-poppins mx-20">
          <TextInput
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
            className="font-poppins mt-6 p-4 bg-white rounded-xl text-center"
            placeholder="Enter 4-digit password"
            onChangeText={setPassword}
            style={{ fontSize: 16 }}
          />
          <TouchableOpacity
            onPress={handleVerify}
            className="font-poppins bg-primary mt-6 p-4 rounded-xl"
          >
            <Text className="font-poppins text-center text-white">Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default AdminPass;
