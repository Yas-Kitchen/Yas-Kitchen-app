import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
export default function Login() {
  return (
    <View className="w-full flex-1 relative items-center justify-center">
      <View className="mt-10 absolute top-[25%] items-center"></View>
      <View className="mt-32 gap-3">
        <TouchableOpacity
          onPress={() => router.replace("/(login)")}
          className="bg-primary h-14 w-60 rounded-full flex justify-center items-center"
        >
          <Text className="text-white">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace("/(user)")}
          className="bg-primary h-14 w-60 rounded-full flex justify-center items-center"
        >
          <Text className="text-white">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
