import { useGlobalContext } from "@/context/GlobalContext";
import { ReviewTypes } from "@/types/register.types";
import { Text, TouchableOpacity, View } from "react-native";

const PersonalDetails = ({ name, mobile, address, foodStyle }: ReviewTypes) => {
  const { setActiveStep, setIsEditing } = useGlobalContext();
  return (
    <View className="font-poppins bg-base_color/10 rounded-2xl p-5">
      <View className="font-poppins flex-row justify-between">
        <Text className="font-poppins-semibold text-faded_black text-[14px]">
          Personal Details
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsEditing(true);
            setActiveStep(1);
          }}
        >
          <Text className="text-primary font-poppins-medium">Edit</Text>
        </TouchableOpacity>
      </View>
      <View className="font-poppins flex-col">
        <View className="font-poppins flex-row w-fit/2 gap-5 mt-5">
          <Text className="font-poppins text-base_color text-[12px]">Name :</Text>
          <Text className="font-poppins mx-8 web:mx-0">{name || "Loading..."}</Text>
        </View>
        <View className="font-poppins flex-row w-fit gap-5 mt-5">
          <Text className="font-poppins text-base_color text-[12px]">Mobile :</Text>
          <Text className="font-poppins mx-7 web:mx-0">{mobile || "Loading..."}</Text>
        </View>
        <View className="font-poppins flex-row gap-5 mt-5 w-[250px]">
          <Text className="font-poppins text-base_color text-[12px]">Address :</Text>
          <Text className="font-poppins mx-5 web:mx-0">{address || "Loading..."}</Text>
        </View>
        <View className="font-poppins flex-row gap-5 mt-5">
          <Text className="font-poppins text-base_color text-[12px]">Food Style :</Text>
          <Text className="font-poppins mx-1 web:mx-0">{foodStyle || "Loading..."}</Text>
        </View>
      </View>
    </View>
  );
};

export default PersonalDetails;
