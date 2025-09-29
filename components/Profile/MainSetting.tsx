import { useGlobalContext } from "@/context/GlobalContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type IonIconName = "pizza-outline" | "add-circle-outline" | "share-outline" | "fast-food-outline";

type MainSettingType = {
  icon: IonIconName;
  header: string;
  subheader: string;
};

const MainSetting = ({ icon, header, subheader }: MainSettingType) => {
  const { setPopupNames } = useGlobalContext();
  return (
    <TouchableOpacity onPress={() => setPopupNames(header)}>
      <View className="flex-row p-5 gap-3 items-center">
        <View className="rounded-full bg-primary/10 p-2">
          <Ionicons name={icon} size={22} color={"#FF7629"} />
        </View>
        <View className="flex-col flex-1 gap-1">
          <Text className="text-faded_black font-medium text-[14px]">
            {header}
          </Text>
          <Text className="text-base_color text-[12px]">{subheader}</Text>
        </View>
        <Feather name="chevron-right" size={20} color={"#FF7629"} />
      </View>
    </TouchableOpacity>
  );
};

export default MainSetting;
