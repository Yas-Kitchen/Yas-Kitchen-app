import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type EditProfileType ={
    header : string
    subheader : string
    icon : "user" | "map-pin"
}

const EditProfile = ({header,subheader,icon} : EditProfileType) => {
  const {setPopupNames} = useGlobalContext()
  return (
      <View className="font-poppins flex-row items-center p-5 gap-3">
        <Feather name={icon} size={20} color={"#FF7629"} />
        <View className="font-poppins flex-1 gap-1">
          <Text className="font-poppins text-[12px] text-base_color">{header}</Text>
          <Text className="font-poppins-medium text-[14px]">{subheader}</Text>
        </View>
        <TouchableOpacity onPress={() => setPopupNames(header)} style={{display : 'contents'}}>
        <Text className="font-poppins text-primary text-[12px]">Edit</Text>
        </TouchableOpacity>
      </View>
  );
};

export default EditProfile;
