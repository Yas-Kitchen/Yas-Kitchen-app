import { usePhoneAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Index = () => {
  const { sendOtp, mobile, loading, handleNumberChange } = usePhoneAuth();

  const handleContinue = async () => {
    const success = await sendOtp();
    if (success) {
      router.push("/(login)/Otp");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="h-screen justify-center">
          <Image
            className="w-36 h-36 mx-auto max-w-36 max-h-36"
            source={require("@assets/Login/logo.png")}
          />
          <Text className="text-[26px] font-bold mx-auto text-faded_black">
            Yas Kitchen
          </Text>
          <Text className="text-[13px] text-base mx-auto text-faded_black">
            Delicious meals delivered daily
          </Text>
          <View className="mt-20 mx-10 border border-[#bababa27] rounded-2xl p-5">
            <Text className="text-[17px] font-semibold mx-auto text-faded_black">
              Login Via Phone
            </Text>
            <View className="mt-10 mx-5">
              <Text className="text-base font-medium text-[12px] text-faded_black">
                Mobile Number
              </Text>
              <TextInput
                className="p-5 bg-white rounded-2xl mt-2"
                placeholder="+91 9182736450"
                keyboardType="phone-pad"
                maxLength={13}
                value={mobile}
                onChangeText={handleNumberChange}
                editable={!loading}
              />
              <TouchableOpacity
                disabled={mobile.length < 13 || loading}
                onPress={handleContinue}
                className={`${
                  mobile.length < 13 || loading
                    ? "bg-base_color/50"
                    : "bg-primary"
                } mt-5 p-5 rounded-2xl`}
              >
                <Text className="text-center text-white font-semibold">
                  {loading ? "Sending OTP..." : "Continue"}
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center justify-between px-5 py-1">
                <TouchableOpacity
                  onPress={() => router.replace("/(admin)/admin")}
                >
                  <Text>Admin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.replace("/(user)/user")}
                >
                  <Text>User</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.replace("/(register)/register")}
                >
                  <Text>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Index;
